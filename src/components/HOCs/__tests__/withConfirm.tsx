import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import Box from '@material-ui/core/Box';
import { createShallow } from '@material-ui/core/test-utils';

import withConfirm from '../withConfirm';
import ConfirmDialog from '../../Dialog/ConfirmDialog';

configure({ adapter: new Adapter() });

const TestComponent: React.FC = () => <Box></Box>;
const ConfirmComponent = withConfirm(TestComponent);

const TEST_MESSAGE = 'test message';
const TEST_TITLE = 'hello';

describe('withConfirm HOC', () => {
    let shallow;
    const handleYes = jest.fn();

    shallow = createShallow();
    const wrapper = shallow(<ConfirmComponent />);

    test('UI components', () => {
        expect.assertions(5);
        const dialog = wrapper.find(ConfirmDialog);
        expect(wrapper.find(TestComponent)).toHaveLength(1);
        expect(dialog).toHaveLength(1);
        expect(dialog.props().open).toBe(false);
        expect(dialog.props().title).toEqual('Confirm');
        expect(dialog.props().onYes).toEqual(undefined);
    });

    test('User interaction', () => {
        const instance = wrapper.instance();
        instance.showConfirm(TEST_TITLE, TEST_MESSAGE, handleYes, true);

        let dialog = wrapper.find(ConfirmDialog);
        expect(dialog.props().open).toBe(true);
        expect(dialog.props().title).toEqual(TEST_TITLE);
        expect(dialog.props().message).toEqual(TEST_MESSAGE);
        expect(dialog.props().onYes).toEqual(handleYes);
        expect(dialog.props().onCancel).toEqual(instance.hideConfirm);

        instance.hideConfirm();
        dialog = wrapper.find(ConfirmDialog);
        expect(dialog.props().open).toBe(false);

        instance.showConfirm(TEST_TITLE, TEST_MESSAGE, handleYes, false);
        dialog = wrapper.find(ConfirmDialog);
        expect(dialog.props().onCancel).toBe(undefined);
    });

})
