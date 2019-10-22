import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';
import { act } from 'react-dom/test-utils';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { createShallow, createMount } from '@material-ui/core/test-utils';

import ReactCrop from "react-image-crop";
import DefImageUploadDialog, { ImageUploadDialog, IIUDState } from '../ImageUploadDialog';

configure({ adapter: new Adapter() });

declare global {
    interface Window {
        FileReader: any;
    }
}


const MOCK_NAME = 'darko vasilev';
const MOCK_TITLE = 'upload a photo';
const MOCK_MSG = 'Please upload your photo';
const MOCK_FILE = './icon.png';

describe('components/Dialog/ImageUploadDialog without photo', () => {

    const shallow = createShallow();
    const onYes = jest.fn();
    const onCancel = jest.fn();

    const wrapper = shallow(
        <ImageUploadDialog
            classes={{}}
            title={MOCK_TITLE}
            open={true}
            name={MOCK_NAME}
            onYes={onYes}
            onCancel={onCancel}
        />
    );

    test('UI components for minimal props', () => {

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(DialogTitle)).toHaveLength(1);
        expect(wrapper.find(DialogTitle).first().props().children).toEqual(MOCK_TITLE);
        expect(wrapper.find(DialogContentText)).toHaveLength(0);
        expect(wrapper.find('#image-upload-dialog-preview-box')).toHaveLength(1);
        expect(wrapper.find('#image-upload-dialog-preview-box').find('span')).toHaveLength(1);
        expect(wrapper.find('#image-upload-dialog-preview-box').find('span').first().props().children).toEqual('D');

        expect(wrapper.find('#image-upload-dialog-upload')).toHaveLength(1);
        expect(wrapper.find('#image-upload-dialog-upload').find('input')).toHaveLength(1);
        expect(wrapper.find('#image-upload-dialog-upload').find('input').first().props().accept).toEqual('image/*');
        expect(wrapper.find('#image-upload-dialog-upload').find('input').first().props().disabled).toBe(false);
        expect(wrapper.find('#image-upload-dialog-upload').find('input').first().props().onChange).toBeInstanceOf(Function);
        expect(wrapper.find('#image-upload-dialog-upload').find('input').first().props().type).toEqual('file');

        expect(wrapper.find('#image-upload-dialog-upload').find('label')).toHaveLength(1);
        expect(wrapper.find('#image-upload-dialog-upload').find('label').find(Button)).toHaveLength(1);

        expect(wrapper.find(DialogActions)).toHaveLength(1);
        expect(wrapper.find(DialogActions).find(Button)).toHaveLength(2);
        expect(wrapper.find(DialogActions).find(Button).first().props().children).toEqual('Cancel');
        expect(wrapper.find(DialogActions).find(Button).last().props().children).toEqual('OK');
    });

    test('UI components with additonal props', () => {
        const wrapper = shallow(
            <ImageUploadDialog
                classes={{}}
                title={MOCK_TITLE}
                open={true}
                name={MOCK_NAME}
                onYes={onYes}
                onCancel={onCancel}
                message={MOCK_MSG}
            />
        );

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find(DialogContentText)).toHaveLength(1);
        expect(wrapper.find(DialogContentText).first().props().children).toEqual(MOCK_MSG);
    });

    test('User interaction: upload image', done => {

        const resultURL = 'res.png';
        const addEventListener = jest.fn((_, handler) => { handler() });
        const readAsDataURL = jest.fn();
        window.FileReader = jest.fn(() => ({ addEventListener, readAsDataURL, result: resultURL }));

        act(() => {
            wrapper.find('#image-upload-dialog-upload').find('input').first().simulate('change', { target: { files: [MOCK_FILE] } });
        });

        setImmediate(() => {
            wrapper.update();

            expect(addEventListener).toHaveBeenCalledTimes(1);
            expect(readAsDataURL).toHaveBeenCalledWith(MOCK_FILE);
            const state = wrapper.state() as IIUDState;
            expect(state.photoURL).toEqual(resultURL);
            expect(state.status).toEqual('loaded');

            expect(wrapper.find(ReactCrop)).toHaveLength(1);
            expect(wrapper.find(ReactCrop).first().props().src).toEqual(resultURL);
            expect(wrapper.find(ReactCrop).first().props().crop).toEqual({
                unit: "%",
                height: 100,
                aspect: 1 / 1
            });
            expect(wrapper.find(ReactCrop).first().props().onImageLoaded).toBeInstanceOf(Function);
            expect(wrapper.find(ReactCrop).first().props().onComplete).toBeInstanceOf(Function);
            expect(wrapper.find(ReactCrop).first().props().onChange).toBeInstanceOf(Function);
            done();
        })
    });

    test('User interaction: cancel button', done => {

        act(() => {
            wrapper.find(DialogActions).find(Button).first().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(onCancel).toHaveBeenCalledTimes(1);
            done();
        })
    });

    test('User interaction: yes button', done => {

        act(() => {
            wrapper.find(DialogActions).find(Button).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(onYes).toHaveBeenCalledTimes(1);
            done();
        })
    });

    test('User interaction: change crop', done => {

        act(() => {
            wrapper.find(ReactCrop).first().simulate('change', 'cropped');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.state().crop).toEqual('cropped');
            expect(onYes).toHaveBeenCalledTimes(1);
            done();
        })
    });

    test('makeClientCrop', async () => {
        const mount = createMount();
        const wrapper = mount(
            <ImageUploadDialog
                classes={{}}
                title={MOCK_TITLE}
                open={true}
                name={MOCK_NAME}
                onYes={onYes}
                onCancel={onCancel}
                message={MOCK_MSG}
            />
        )

        const image = new Image();
        await createImageBitmap(image, 0, 0, 180, 180);
        const revokeURL = jest.fn();
        const createURL = jest.fn();
        window.URL.revokeObjectURL = revokeURL;
        window.URL.createObjectURL = createURL;
        createURL.mockReturnValue(MOCK_FILE);

        const instance = wrapper.instance() as any;
        instance.onImageLoaded(image);
        expect(wrapper.state().busy).toBe(false);
        await instance.onCropComplete({ x: 0, y: 0, width: 180, height: 180 });
        expect(revokeURL).toHaveBeenCalledTimes(1);
        expect(createURL).toHaveBeenCalledTimes(1);
        // expect(url).toEqual(MOCK_FILE);
        expect(wrapper.state().busy).toBe(false);
        expect(instance.croppedURL).toEqual(MOCK_FILE);

        mount.cleanUp();
    });

    test('makeClientCrop wiith invalid image', async () => {
        const mount = createMount();
        const wrapper = mount(
            <ImageUploadDialog
                classes={{}}
                title={MOCK_TITLE}
                open={true}
                name={MOCK_NAME}
                onYes={onYes}
                onCancel={onCancel}
                message={MOCK_MSG}
            />
        )

        const image = new Image();
        await createImageBitmap(image, 0, 0, 180, 180);
        const revokeURL = jest.fn();
        const createURL = jest.fn();
        window.URL.revokeObjectURL = revokeURL;
        window.URL.createObjectURL = createURL;
        createURL.mockReturnValue(MOCK_FILE);

        const instance = wrapper.instance() as any;
        expect(wrapper.state().busy).toBe(false);
        await instance.onCropComplete({ x: 0, y: 0, width: 180, height: 180 });
        expect(revokeURL).toHaveBeenCalledTimes(0);
        expect(createURL).toHaveBeenCalledTimes(0);
        // expect(url).toEqual(MOCK_FILE);
        expect(wrapper.state().busy).toBe(false);

        mount.cleanUp();
    });
});

describe('components/Dialog/ImageUploadDialog without photo', () => {
    const shallow = createShallow();
    const onYes = jest.fn();
    const onCancel = jest.fn();

    const wrapper = shallow(
        <ImageUploadDialog
            classes={{}}
            title={MOCK_TITLE}
            open={true}
            name={MOCK_NAME}
            onYes={onYes}
            onCancel={onCancel}
            url={'https://google.com'}
        />
    );

    test('UI components for minimal props', () => {
        expect(wrapper.find('#image-upload-dialog-preview').find('img')).toHaveLength(1);
    });
});

describe('connected component', () => {
    const shallow = createShallow();
    const onYes = jest.fn();
    const onCancel = jest.fn();

    const wrapper = shallow(
        <DefImageUploadDialog
            title={MOCK_TITLE}
            open={true}
            name={MOCK_NAME}
            onYes={onYes}
            onCancel={onCancel}
        />
    );

    test('snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });
})
