import React from 'react';
import { MemoryRouter, withRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createMount } from '@material-ui/core/test-utils';
import { ThemeProvider } from '@material-ui/styles';
import { IntlProvider, injectIntl } from "react-intl";
import { act } from 'react-dom/test-utils';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import DefLoginPage, { LoginPage } from '../Login';
import { EmailInput, PassInput } from 'components/TextInput';

import { translationMessages } from 'config/i18n.config';
import theme from 'config/theme.config';
import messages from 'translations/messages/page.auth';

// store mock
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import {
    GLOBAL_SET_TITLE,
    USER_LOGIN_SUCCESS
} from 'store/constants';
jest.mock('service/member');

configure({ adapter: new Adapter() });
const InjectedLoginPage = withRouter(injectIntl(LoginPage));
const ConnectedLoginPage = withRouter(DefLoginPage);


describe('containers/pages/auth/login', () => {

    const setTitle = jest.fn();
    const login = jest.fn();
    const showMsg = jest.fn();
    const hideMsg = jest.fn();
    login.mockResolvedValueOnce(undefined).mockRejectedValueOnce('Wrong credentials');

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
                    {<InjectedLoginPage setTitle={setTitle} login={login} showMessage={showMsg} hideMessage={hideMsg} />}
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );

    test('Snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    })

    test('UI components for english', () => {

        const texts = wrapper.find(Typography);
        expect(texts.at(0).props().children).toEqual('Log in with your Hit! T account');

        let control = wrapper.find(EmailInput);
        expect(control).toHaveLength(1);
        expect(control.props().label).toEqual('Email Address');
        expect(control.props().value).toEqual('');
        expect(control.props().message).toEqual(undefined);

        control = wrapper.find(PassInput);
        expect(control).toHaveLength(1);
        expect(control).toHaveLength(1);
        expect(control.props().label).toEqual('Password');
        expect(control.props().value).toEqual('');
        expect(control.props().message).toEqual(undefined);

        expect(wrapper.find(Link)).toHaveLength(2);
        expect(wrapper.find(Link).at(0).props().to).toEqual('/reset');
        expect(wrapper.find(Link).at(0).props().children).toEqual('Forgot password?');
        expect(wrapper.find(Link).at(1).props().to).toEqual('/signup');
        expect(wrapper.find(Link).at(1).props().children).toEqual("Don't have an account? Sign Up");

        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(Button).at(0).props().children).toEqual('Sign in');
        expect(wrapper.find(Button).at(0).props().disabled).toEqual(false);
    });

    test('Email change event(invalid address)', done => {

        expect(setTitle).toHaveBeenCalledWith('Log in');
        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: 'dad' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(EmailInput).props().message).toEqual(messages.emailInvalid);
            expect(wrapper.find(Button).at(0).props().disabled).toEqual(true);
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
            expect(wrapper.find(Button).at(0).props().disabled).toEqual(true);
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
            expect(wrapper.find(Button).at(0).props().disabled).toEqual(false);
            done();
        });
    });

    test('Password change event(empty)', done => {

        act(() => {
            wrapper.find('#password').last().simulate('change', { target: { value: '' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(PassInput).props().message).toEqual(messages.passRequired);
            expect(wrapper.find(Button).at(0).props().disabled).toEqual(true);
            done();
        });
    });

    test('Password change event(valid)', done => {
        act(() => {
            wrapper.find('#password').last().simulate('change', { target: { value: '1234' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(PassInput).props().message).toEqual(undefined);
            expect(wrapper.find(Button).at(0).props().disabled).toEqual(false);
            done();
        });
    });

    test('sign in button click event', done => {
        act(() => {
            wrapper.find(Button).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(login.mock.calls).toHaveLength(1);
            expect(login).toHaveBeenCalledWith('test@test.com', '1234');
            done();
        });
    });

    test('other key press on email input', done => {
        act(() => {
            wrapper.find(EmailInput).last().simulate('keypress', { key: '' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(PassInput).first().props().inputRef.current).not.toBe(document.activeElement);
            // expect(wrapper.find(PassInput).first().props().inputRef.current).toEqual(document.activeElement);
            done();
        });
    });

    test('enter key press on email input', done => {
        act(() => {
            wrapper.find(EmailInput).last().simulate('keypress', { key: 'Enter' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(PassInput).first().props().inputRef.current).toEqual(document.activeElement);
            done();
        });
    });

    test('enter key press on password input', done => {
        act(() => {
            wrapper.find(PassInput).last().simulate('keypress', { key: 'Enter' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(login.mock.calls).toHaveLength(2);
            expect(login).lastCalledWith('test@test.com', '1234');
            done();
        });
    });

    test('other key press on password input', done => {
        act(() => {
            wrapper.find(PassInput).last().simulate('keypress', { key: '' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(login.mock.calls).toHaveLength(2);
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
                        {<ConnectedLoginPage />}
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
            payload: 'Log in'
        });
        done();
    });

    test('Email change event(valid address)', done => {

        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: username } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(EmailInput).props().message).toEqual(undefined);
            expect(wrapper.find(Button).at(0).props().disabled).toEqual(false);
            done();
        });
    });

    test('Password change event(valid)', done => {
        act(() => {
            wrapper.find('#password').last().simulate('change', { target: { value: password } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(PassInput).props().message).toEqual(undefined);
            expect(wrapper.find(Button).at(0).props().disabled).toEqual(false);
            done();
        });
    });

    test('login', async done => {
        await wrapper.find(Button).first().props().onClick(undefined);
        expect(store.getActions()).toContainEqual({
            type: USER_LOGIN_SUCCESS,
            payload: `${username}__private_token`
        });
        done();
    });
})