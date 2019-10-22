import React from 'react';
import { MemoryRouter, withRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';
import { createMount } from '@material-ui/core/test-utils';
import { ThemeProvider } from '@material-ui/styles';
import { IntlProvider, injectIntl } from "react-intl";
import { act } from 'react-dom/test-utils';

import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LanguageIcon from '@material-ui/icons/Language';

import DefPrivateHeader, { PrivateHeader } from '../PrivateHeader';
import { translationMessages } from 'config/i18n.config';
import theme from 'config/theme.config';
import { appLocales } from 'config/i18n.config';

// store mock
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import {
    GLOBAL_CHANGE_LOCALE,
    USER_LOGIN_SUCCESS,
    USER_GET_USER_SUCCESS,
    USER_GET_PROFILE_SUCCESS
} from 'store/constants';
jest.mock('service/member');

configure({ adapter: new Adapter() });

const InjectedPrivateHeader = withRouter(injectIntl(PrivateHeader));

const MOCK_PHOTO = 'https://google.com/image000.png';
const MOCK_PHONE = '1000000000';
const MOCK_COUNTRY = '82';
const MOCK_ID = 100;
const MOCK_NAME = 'testuser';
const MOCK_MAIL = 'test4@test.com';


describe('containers/layout/PrivateHeader', () => {
    const mount = createMount();
    const fnLogout = jest.fn();
    const fnLocale = jest.fn();

    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='en' messages={translationMessages.en}>
                <InjectedPrivateHeader
                    profile={{ photoUrl: MOCK_PHOTO, emailVerified: true, cellphoneVerified: true, cellphone: MOCK_PHONE, cellphoneCountryCode: MOCK_COUNTRY }}
                    user={{ id: MOCK_ID, name: MOCK_NAME, username: MOCK_MAIL, enabled: true }}
                    logout={fnLogout}
                    changeLocale={fnLocale}
                    locale='en'
                />
            </IntlProvider>
        </MemoryRouter>
    );

    test('Snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('UI components', () => {
        expect(wrapper.find(AppBar)).toHaveLength(1);
        expect(wrapper.find(AppBar).find(Toolbar)).toHaveLength(1);
        expect(wrapper.find(AppBar).find(Toolbar).find(Box)).toHaveLength(4); // including profile button
        expect(wrapper.find(AppBar).find(Toolbar).find(Box).first().find(IconButton)).toHaveLength(1);
        expect(wrapper.find(AppBar).find(Toolbar).find(Box).first().find(IconButton).find(MenuIcon)).toHaveLength(1);

        expect(wrapper.find(AppBar).find(Toolbar).find(Box).at(1).find(Typography)).toHaveLength(1);
        expect(wrapper.find(AppBar).find(Toolbar).find(Box).at(1).find(Typography).props().children).toEqual('Hit! T');
        expect(wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton)).toHaveLength(3);
        expect(wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton).at(0).find(LanguageIcon)).toHaveLength(1);
        expect(wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton).at(1).find(Badge)).toHaveLength(1);
        expect(wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton).at(1).find(Badge).first().find(NotificationsIcon)).toHaveLength(1);
        expect(wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(Badge).props().badgeContent).toBe(17);
        expect(wrapper.find(AppBar).find(Toolbar).find(Box).at(3).find(IconButton)).toHaveLength(1);
        expect(wrapper.find(AppBar).find(Toolbar).find(Box).at(3).find(IconButton).find(MoreIcon)).toHaveLength(1);

        expect(wrapper.find(Menu)).toHaveLength(3);
        expect(wrapper.find('#hitit-account-menu').find(Menu)).toHaveLength(1);
        expect(wrapper.find('#hitit-account-menu-mobile').find(Menu)).toHaveLength(1);
        expect(wrapper.find('#hitit-language-menu').find(Menu)).toHaveLength(1);

        expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBe(undefined);
        expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBe(undefined);
        expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBe(undefined);

        expect(wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem)).toHaveLength(3);
        expect(wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem).first().props().children).toHaveLength(2);
        expect(wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem).first().props().children[1]).toEqual('Profile');
        expect(wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem).at(1).props().children).toHaveLength(2);
        expect(wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem).at(1).props().children[1]).toEqual('Setting');
        expect(wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem).at(2).props().children).toHaveLength(2);
        expect(wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem).at(2).props().children[1]).toEqual('Log Out');

        expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).find(MenuItem)).toHaveLength(2);
        expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).find(MenuItem).first().props().children).toHaveLength(2);
        expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).find(MenuItem).first().find(Badge).find(NotificationsIcon)).toHaveLength(1);
        expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).find(MenuItem).first().find(Typography).props().children).toEqual('Notifications');
        expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).find(MenuItem).last().props().children).toHaveLength(2);
        expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).find(MenuItem).last().find(IconButton).find(AccountCircle)).toHaveLength(1);
        expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).find(MenuItem).last().find(Typography).props().children).toEqual('Profile');

        expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBe(undefined);

        const count = appLocales.length;
        expect(wrapper.find('#hitit-language-menu').find(MenuItem)).toHaveLength(count);
        for (let i = 0; i < count; i++) {
            expect(wrapper.find('#hitit-language-menu').find(MenuItem).at(i).props().children).toEqual(appLocales[i].name);
        }
    });

    test('User interaction: language menu - 1', done => {
        act(() => {
            wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton).at(0).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeTruthy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeFalsy();
            done();
        });
    });

    test('User interaction: language menu - select submenu', done => {
        act(() => {
            wrapper.find('#hitit-language-menu').find(Menu).find(MenuItem).at(1).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeFalsy();

            expect(fnLocale).toHaveBeenCalledWith(appLocales[1].code);
            done();
        });
    });

    test('User interaction: language menu - 2', done => {
        act(() => {
            wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton).at(0).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeTruthy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeFalsy();
            done();
        });
    });

    test('User interaction: language menu - close menu', done => {
        act(() => {
            wrapper.find('#hitit-language-menu').find(Menu).props().onClose({}, 'escapeKeyDown');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeFalsy();

            expect(fnLocale).toHaveBeenCalledWith(appLocales[1].code);
            done();
        });
    });

    test('User interaction: mobile menu', done => {
        act(() => {
            wrapper.find(AppBar).find(Toolbar).find(Box).at(3).find(IconButton).at(0).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeTruthy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeFalsy();
            done();
        });
    });

    test('User interaction: close mobile-menu', done => {
        act(() => {
            wrapper.find('#hitit-account-menu-mobile').find(Menu).props().onClose({}, 'escapeKeyDown');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeFalsy();
            done();
        });
    });

    test('User interaction: profile menu - 1', done => {
        act(() => {
            wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton).at(2).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeTruthy();
            done();
        });
    });

    test('User interaction: profile menu - my profile', done => {
        act(() => {
            wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem).at(0).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeFalsy();
            done();
        });
    });

    test('User interaction: profile menu - 2', done => {
        act(() => {
            wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton).at(2).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeTruthy();
            done();
        });
    });

    test('User interaction: profile menu - setting', done => {
        act(() => {
            wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem).at(1).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeFalsy();
            done();
        });
    });

    test('User interaction: profile menu - 3', done => {
        act(() => {
            wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton).at(2).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeTruthy();
            done();
        });
    });

    test('User interaction: profile menu - logout', done => {
        act(() => {
            wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem).at(2).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu-mobile').find(Menu).props().anchorEl).toBeFalsy();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeTruthy();
            done();
        });
    });
});

describe('connected component', () => {

    const mount = createMount();

    const store = mockStore({
        user: { profile: { cellphoneVerified: false }, user: { name: 'Darko' } },
        global: { locale: 'en' }
    });

    const wrapper = mount(
        <Provider store={store}>
            <MemoryRouter>
                <IntlProvider locale='en' messages={translationMessages.en}>
                    <ThemeProvider theme={theme}>
                        {<DefPrivateHeader />}
                    </ThemeProvider>
                </IntlProvider>
            </MemoryRouter>
        </Provider>
    );

    test('User interaction: language menu', done => {
        act(() => {
            wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton).at(0).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find('#hitit-language-menu').find(Menu).props().anchorEl).toBeTruthy();
            done();
        });
    });

    test('User interaction: language menu - select submenu', done => {
        act(() => {
            wrapper.find('#hitit-language-menu').find(Menu).find(MenuItem).at(1).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(store.getActions()).toContainEqual({
                type: GLOBAL_CHANGE_LOCALE,
                payload: appLocales[1].code
            });
            done();
        });
    });

    test('User interaction: profile menu', done => {
        act(() => {
            wrapper.find(AppBar).find(Toolbar).find(Box).at(2).find(IconButton).at(2).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find('#hitit-account-menu').find(Menu).props().anchorEl).toBeTruthy();
            done();
        });
    });

    test('User interaction: profile menu - logout', async done => {

        await wrapper.find('#hitit-account-menu').find(Menu).find(MenuItem).at(2).props().onClick(undefined);
        expect(store.getActions()).toContainEqual({
            type: USER_LOGIN_SUCCESS,
            payload: undefined
        });
        expect(store.getActions()).toContainEqual({
            type: USER_GET_USER_SUCCESS,
            payload: undefined
        });
        expect(store.getActions()).toContainEqual({
            type: USER_GET_PROFILE_SUCCESS,
            payload: undefined
        });
        done();
    });
});