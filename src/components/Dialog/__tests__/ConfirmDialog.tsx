import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';
import { act } from 'react-dom/test-utils';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';

import { createShallow } from '@material-ui/core/test-utils';
configure({ adapter: new Adapter() });

import ConfirmDialog from '../ConfirmDialog';


const TEST_MESSAGE = 'test message';
const TEST_YES = 'yeah';
const TEST_CANCEL = 'nope';
const TEST_OK = 'ok';

describe('components/Dialog/ConfirmDialog', () => {
    const handleCancel = jest.fn();
    const handleYes = jest.fn();
    let shallow = createShallow();

    describe('Confirm Dialog with yes and cancel', () => {
        const wrapper = shallow(
            <ConfirmDialog
                open={true}
                onCancel={handleCancel}
                onYes={handleYes}
                message={TEST_MESSAGE}
            />
        );

        test('UI components', () => {
            expect.assertions(7);
            expect(wrapper.find(DialogTitle)).toHaveLength(1);
            expect(wrapper.find(DialogTitle).props().children).toEqual('Confirm');
            expect(wrapper.find(Button)).toHaveLength(2);
            expect(wrapper.find(Button).at(0).props().children).toEqual('Cancel');
            expect(wrapper.find(Button).at(1).props().children).toEqual('Yes');
            expect(wrapper.find(DialogContentText)).toHaveLength(1);
            expect(wrapper.find(DialogTitle).props().children).toEqual('Confirm');
        });

        test('yes and cancel event handler', () => {
            act(() => {
                wrapper.find(Button).at(0).simulate('click');
            });
            expect(handleCancel.mock.calls.length).toBe(1);

            act(() => {
                wrapper.find(Button).at(1).simulate('click');
            });
            expect(handleYes.mock.calls.length).toBe(1);
        });
    });

    describe('Confirm Dialog with custom yes and cancel', () => {
        const wrapper = shallow(
            <ConfirmDialog
                open={true}
                onCancel={handleCancel}
                onYes={handleYes}
                message={TEST_MESSAGE}
                yes={TEST_YES}
                cancel={TEST_CANCEL}
            />
        );

        test('UI components', () => {
            expect.assertions(2);
            expect(wrapper.find(Button).at(0).props().children).toBe(TEST_CANCEL);
            expect(wrapper.find(Button).at(1).props().children).toBe(TEST_YES);
        });
    });

    describe('Confirm Dialog with only ok', () => {
        const wrapper = shallow(
            <ConfirmDialog
                open={true}
                onYes={handleYes}
                message={TEST_MESSAGE}
                ok={TEST_OK}
            />
        );

        test('UI components', () => {
            expect.assertions(2);
            expect(wrapper.find(Button)).toHaveLength(1);
            expect(wrapper.find(Button).props().children).toBe(TEST_OK);
        });

        test('ok event handler', () => {
            act(() => {
                wrapper.find(Button).simulate('click');
            });
            expect(handleYes.mock.calls.length).toBe(2);
        });
    });
})