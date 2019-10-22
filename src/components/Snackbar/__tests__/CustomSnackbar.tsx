import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { createShallow, createMount } from '@material-ui/core/test-utils';

import CustomSnackbar from '../CustomSnackbar';

configure({ adapter: new Adapter() });

const TEST_MESSAGE = 'Hello world';

describe('components/Snackbar/CustomSnackbar', () => {
    const mount = createMount();
    const handleClose = jest.fn();

    test('error message', () => {
        const wrapper = mount(
            <MuiThemeProvider theme={createMuiTheme({})}>
                <CustomSnackbar
                    open={true}
                    message={TEST_MESSAGE}
                    variant='error'
                    handleClose={handleClose}
                />
            </MuiThemeProvider>
        );

        expect(wrapper.find(Snackbar).length).toBe(1);
        expect(wrapper.find(Snackbar).props().onClose).toEqual(handleClose);
        expect(wrapper.find(SnackbarContent).length).toBe(1);

        const msg = wrapper.find(SnackbarContent).props().message;
        expect(msg).toBeInstanceOf(Object);
        expect(msg.props.children.length).toBe(2);
        expect(msg.props.children[1]).toEqual(TEST_MESSAGE);
    });
});