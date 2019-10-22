import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import Box from '@material-ui/core/Box';
import { createShallow } from '@material-ui/core/test-utils';

import withSnackbar from '../withSnackbar';
import CustomSnackbar from '../../Snackbar/CustomSnackbar';

configure({ adapter: new Adapter() });

const TestComponent: React.FC = () => <Box></Box>;
const ComponentWithSnackbar = withSnackbar(TestComponent);

const TEST_MESSAGE = 'hello, snackbar';

describe('components/HOCs/withSnackbar', () => {
    const shallow = createShallow();
    let wrapper = undefined;
    beforeAll(() => {
        wrapper = shallow(<ComponentWithSnackbar />);
    })

    test('UI components', () => {
        expect.assertions(6);

        const orgComponent = wrapper.find(TestComponent);
        expect(wrapper.state('handleClose')).toBeInstanceOf(Function);
        expect(orgComponent).toHaveLength(1);
        expect(orgComponent.props().showMessage).toEqual(wrapper.instance().showMessage);
        expect(orgComponent.props().hideMessage).toEqual(wrapper.instance().hideMessage);

        let snackbar = wrapper.find(CustomSnackbar);
        expect(snackbar).toHaveLength(1);
        expect(snackbar.props().open).toBe(false);
    });

    test('Component(Client) interaction - showMessage', done => {
        expect.assertions(4);
        const instance = wrapper.instance();
        instance.showMessage(true, TEST_MESSAGE);
        setImmediate(() => {
            wrapper.update();
            let snackbar = wrapper.find(CustomSnackbar);
            expect(snackbar.props().open).toBe(true);
            expect(snackbar.props().variant).toEqual('success');
            expect(snackbar.props().message).toEqual(TEST_MESSAGE);
            expect(snackbar.props().handleClose).toEqual(wrapper.state('handleClose'));
            done();
        })
    });

    test('Component(Client) interaction - showMessage', done => {
        expect.assertions(4);
        const instance = wrapper.instance();
        instance.showMessage(false, TEST_MESSAGE);
        setImmediate(() => {
            wrapper.update();
            let snackbar = wrapper.find(CustomSnackbar);
            expect(snackbar.props().open).toBe(true);
            expect(snackbar.props().variant).toEqual('error');
            expect(snackbar.props().message).toEqual(TEST_MESSAGE);
            expect(snackbar.props().handleClose).toEqual(wrapper.state('handleClose'));
            done();
        })
    });

    test('Component(Client) interaction - hideMessage', done => {
        expect.assertions(1);
        const instance = wrapper.instance();
        instance.hideMessage();
        setImmediate(() => {
            wrapper.update();
            let snackbar = wrapper.find(CustomSnackbar);
            expect(snackbar.props().open).toBe(false);
            done();
        })
    });
});
