import React from 'react';
import { MemoryRouter, withRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createMount } from '@material-ui/core/test-utils';
import { ThemeProvider } from '@material-ui/styles';
import { IntlProvider, injectIntl } from "react-intl";
import { act } from 'react-dom/test-utils';

import DefSignupPage, { SignupPage } from '../index';
import SignupPage1 from '../Page1';
import SignupPage2 from '../Page2';

import { translationMessages } from 'config/i18n.config';
import theme from 'config/theme.config';

// store mock
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import {
    GLOBAL_SET_TITLE,
} from 'store/constants';
jest.mock('service/member');

configure({ adapter: new Adapter() });
const InjectedSignupPage = withRouter(injectIntl(SignupPage));
const ConnectedSignupPage = withRouter(DefSignupPage);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('containers/pages/auth/signup', () => {

    const setTitle = jest.fn();
    const signup = jest.fn();
    const refresh = jest.fn();
    const store = mockStore({
        user: undefined,
        token: undefined
    });
    signup.mockResolvedValueOnce(undefined).mockRejectedValueOnce('Wrong credentials');

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
        <Provider store={store}>
            <MemoryRouter>
                <IntlProvider locale='en' messages={translationMessages.en}>
                    <ThemeProvider theme={theme}>
                        {<InjectedSignupPage setTitle={setTitle} signup={signup} refreshToken={refresh} />}
                    </ThemeProvider>
                </IntlProvider>
            </MemoryRouter>
        </Provider>
    );

    test('Snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('UI components', () => {
        expect(wrapper.find(SignupPage).state().page).toBe(0);
        expect(wrapper.find(SignupPage1)).toHaveLength(1);
        expect(wrapper.find(SignupPage2)).toHaveLength(0);
        expect(wrapper.find(SignupPage1).props().goNext).toBeInstanceOf(Function);
    });

    test('componentDidMount', async done => {

        expect(setTitle).toHaveBeenCalledWith('Sign up');

        await delay(20);
        setImmediate(async () => {
            await wrapper.update();
            expect(wrapper.find(SignupPage).state().TAC).toHaveLength(5);
            done();
        });
    });

    test('downloadTAC', async done => {

        await wrapper.find(SignupPage).instance().downloadTAC('UNITTEST');

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(SignupPage).state().TAC).toHaveLength(2);
            done();
        });
    });

    test('downloadTAC', async done => {

        await wrapper.find(SignupPage).instance().downloadTAC('UNITTEST1');

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(SignupPage).state().TAC).toHaveLength(0);
            done();
        });
    });

    test('next page', done => {
        act(() => {
            wrapper.find(SignupPage).instance().handleNext('1', '2', '3', '3', '4', '5', true);
        });

        setImmediate(() => {
            wrapper.update();
            const Page = wrapper.find(SignupPage);
            expect(wrapper.find(SignupPage1)).toHaveLength(0);
            expect(wrapper.find(SignupPage2)).toHaveLength(1);
            expect(Page.state().page).toBe(1);
            done();
        });
    });

    test('back page', done => {
        act(() => {
            wrapper.find(SignupPage).instance().handleBack();
        });

        setImmediate(() => {
            wrapper.update();
            const Page = wrapper.find(SignupPage);
            expect(wrapper.find(SignupPage1)).toHaveLength(1);
            expect(wrapper.find(SignupPage2)).toHaveLength(0);
            expect(Page.state().page).toBe(0);
            done();
        });
    });

    test('signup', async done => {
        const result = await wrapper.find(SignupPage).instance().handleSignup([true]);

        setImmediate(() => {
            expect(signup).toHaveBeenCalledWith('1', '3', '2', '4', '5', [true]);
            expect(refresh).toHaveBeenCalledTimes(1);
            expect(result).toBe(true);
            done();
        });
    });

    test('signup failed', async done => {
        const result = await wrapper.find(SignupPage).instance().handleSignup([true]);

        setImmediate(() => {
            expect(signup).toHaveBeenCalledWith('1', '3', '2', '4', '5', [true]);
            expect(result).toBe(false);
            done();
        });
    });
});

describe('Connected Signup page', () => {
    const mount = createMount();

    const store = mockStore({
        user: undefined,
        token: undefined
    });

    const wrapper = mount(
        <Provider store={store}>
            <MemoryRouter>
                <IntlProvider locale='en' messages={translationMessages.en}>
                    <ThemeProvider theme={theme}>
                        {<ConnectedSignupPage />}
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
            payload: 'Sign up'
        });
        done();
    });

    test('signup action', async done => {

        act(() => {
            wrapper.find(SignupPage).instance().handleNext('1', '2', '3', '3', '4', '5', true);
        });

        const result = await wrapper.find(SignupPage).instance().handleSignup([true]);
        setImmediate(() => {
            expect(result).toBe(true);
            done();
        });
    })
});