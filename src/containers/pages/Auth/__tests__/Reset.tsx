import React from 'react';
import { MemoryRouter, withRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createMount, createShallow } from '@material-ui/core/test-utils';
import { ThemeProvider } from '@material-ui/styles';
import { IntlProvider, injectIntl } from "react-intl";
import { act } from 'react-dom/test-utils';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';

import DefResetPage, { ResetPage, EmailInput } from '../Reset';

import { translationMessages } from '../../../../config/i18n.config';
import theme from '../../../../config/theme.config';
import messages from '../../../../translations/messages/page.auth';

// store mock
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import {
    GLOBAL_SET_TITLE,
} from '../../../../store/constants';

configure({ adapter: new Adapter() });
const InjectedResetPage = withRouter(injectIntl(ResetPage));
const ConnectedResetPage = withRouter(DefResetPage);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
jest.mock('service/member');

describe('containers/pages/auth/reset', () => {

    const setTitle = jest.fn();
    const showMsg = jest.fn();
    const hideMsg = jest.fn();

    // strange warning message ignore
    const mockConsoleMethod = (realConsoleMethod) => {
        const ignoredMessages = ['test was not wrapped in act(...)'];
        return (message, ...args) => {
            const containsMessage = ignoredMessages.some(ignoredMessage => message.includes(ignoredMessage))
            if (!containsMessage) {
                realConsoleMethod(message, ...args);
            }
        }
    }

    console.warn = jest.fn(mockConsoleMethod(console.warn));
    console.error = jest.fn(mockConsoleMethod(console.error));

    const mount = createMount();
    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='en' messages={translationMessages.en}>
                <ThemeProvider theme={theme}>
                    {<InjectedResetPage setTitle={setTitle} showMessage={showMsg} hideMessage={hideMsg} />}
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );

    test('Snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    })

    test('UI components for english', () => {
        expect(wrapper.find(CssBaseline).last()).toHaveLength(1);
        const texts = wrapper.find(Typography);
        expect(texts.at(0).props().children).toEqual('Reset your password');

        let control = wrapper.find(EmailInput);
        expect(control).toHaveLength(1);
        expect(control.props().label).toEqual('Email Address');
        expect(control.props().value).toEqual('');
        expect(control.props().message).toEqual(undefined);

        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(Button).at(0).props().children).toEqual('Reset');
        expect(wrapper.find(Button).at(0).props().variant).toEqual('contained');
        expect(wrapper.find(Button).at(0).props().color).toEqual('primary');
        expect(wrapper.find(Button).at(0).props().disabled).toBe(true);
        expect(wrapper.find(Button).at(0).props().fullWidth).toEqual(true);
    });

    test('Email change event(invalid address)', done => {

        expect(setTitle).toHaveBeenCalledWith('Reset password');
        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: 'dad' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(EmailInput).props().message).toEqual(messages.emailInvalid);
            expect(wrapper.find(EmailInput).props().value).toEqual('dad');
            expect(wrapper.find(Button).at(0).props().disabled).toBe(true);
            done();
        });
    });

    test('Email change event(empty string)', done => {

        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: '' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(EmailInput).props().message).toEqual(messages.emailRequired);
            expect(wrapper.find(EmailInput).props().value).toEqual('');
            expect(wrapper.find(Button).at(0).props().disabled).toBe(true);
            done();
        });
    });

    test('Email change event(valid address)', done => {

        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: 'test@test.com' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(EmailInput).props().message).toEqual(undefined);
            expect(wrapper.find(EmailInput).props().value).toEqual('test@test.com');
            expect(wrapper.find(Button).at(0).props().disabled).toBe(false);
            done();
        });
    });

    test('Reset password - 1', async done => {

        act(() => {
            wrapper.find(Button).simulate('click');
        });

        await delay(50);
        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(EmailInput).props().message).toEqual(undefined);
            expect(wrapper.find(Button).at(0).props().disabled).toBe(false);
            expect(showMsg).lastCalledWith(false, 'Cannot find username');
            done();
        });
    });

    test('Email change event(not verified address)', done => {

        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: 'user2@test.com' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(EmailInput).props().message).toEqual(undefined);
            expect(wrapper.find(EmailInput).props().value).toEqual('user2@test.com');
            expect(wrapper.find(Button).at(0).props().disabled).toBe(false);
            done();
        });
    });

    test('Reset password - 2', async done => {

        act(() => {
            wrapper.find(Button).simulate('click');
        });

        await delay(50);
        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Button).at(0).props().disabled).toBe(false);
            expect(showMsg).lastCalledWith(false, 'Email is not verified. Cannot request reset password mail');
            done();
        });
    });

    test('Email change event(active address)', done => {

        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: 'user1@test.com' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(EmailInput).props().value).toEqual('user1@test.com');
            expect(wrapper.find(Button).at(0).props().disabled).toBe(false);
            done();
        });
    });

    test('Reset password - 3', async done => {

        act(() => {
            wrapper.find(Button).simulate('click');
        });

        await delay(50);
        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Button)).toHaveLength(0);
            expect(wrapper.find(Link)).toHaveLength(2);
            expect(showMsg).lastCalledWith(true, 'Password reset email sent');
            done();
        });
    });

    test('Resend request', async done => {

        act(() => {
            wrapper.find(Link).last().simulate('click');
        });

        await delay(50);
        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Button)).toHaveLength(0);
            expect(wrapper.find(Link)).toHaveLength(2);
            expect(showMsg).toHaveBeenCalledTimes(4);
            expect(showMsg).lastCalledWith(true, 'Password reset email sent');
            done();
        });
    });

    test('Go Home', async done => {

        act(() => {
            wrapper.find(Link).first().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Button)).toHaveLength(0);
            expect(wrapper.find(Link)).toHaveLength(2);
            done();
        });
    });
});

describe('connected component', () => {
    const mount = createMount();

    const username = 'user1@test.com';
    const password = 'testuser1';

    const store = mockStore({
        user: undefined,
        token: undefined
    });

    const wrapper = mount(
        <Provider store={store}>
            <MemoryRouter>
                <IntlProvider locale='en' messages={translationMessages.en}>
                    <ThemeProvider theme={theme}>
                        {<ConnectedResetPage />}
                    </ThemeProvider>
                </IntlProvider>
            </MemoryRouter>
        </Provider>
    );

    test('setTitle', done => {
        wrapper.update();
        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()).toContainEqual({
            type: GLOBAL_SET_TITLE,
            payload: 'Reset password'
        });
        done();
    });
})