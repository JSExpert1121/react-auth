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
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LanguageIcon from '@material-ui/icons/Language';

import ConnectedPublicHeader, { PublicHeader } from '../PublicHeader';
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

describe('containers/layout/PrivateHeader', () => {

    const mount = createMount();

    const store = mockStore({
        user: undefined,
        global: { locale: 'en' }
    });

    const wrapper = mount(
        <Provider store={store}>
            <MemoryRouter>
                <IntlProvider locale='en' messages={translationMessages.en}>
                    <ThemeProvider theme={theme}>
                        {<ConnectedPublicHeader />}
                    </ThemeProvider>
                </IntlProvider>
            </MemoryRouter>
        </Provider>
    );

    test('snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('go home', done => {
        act(() => {
            wrapper.find(PublicHeader).find(Toolbar).find('img').first().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            done();
        });
    });

    test('go to map', done => {
        act(() => {
            wrapper.find(PublicHeader).find(Toolbar).find(Box).first().find(Button).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find('#language-menu').find(Menu).props().anchorEl).toBeFalsy();
            done();
        });
    });

    test('go to login', done => {
        act(() => {
            wrapper.find(PublicHeader).find(Toolbar).find(Box).at(1).find(Button).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find('#language-menu').find(Menu).props().anchorEl).toBeFalsy();
            done();
        });
    });

    test('locale menu - 1', done => {
        act(() => {
            wrapper.find(PublicHeader).find(Toolbar).find(Box).at(1).find(IconButton).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find('#language-menu').find(Menu).props().anchorEl).toBeTruthy();
            done();
        })
    });

    test('locale menu - select', done => {
        act(() => {
            wrapper.find('#language-menu').first().find(MenuItem).at(1).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find('#language-menu').find(Menu).props().anchorEl).toBeFalsy();
            expect(store.getActions()).toContainEqual({
                type: GLOBAL_CHANGE_LOCALE,
                payload: 'ko'
            });
            done();
        })
    });

    test('locale menu - 2', done => {
        act(() => {
            wrapper.find(PublicHeader).find(Toolbar).find(Box).at(1).find(IconButton).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find('#language-menu').find(Menu).props().anchorEl).toBeTruthy();
            done();
        })
    });

    test('locale menu - close by escape', done => {
        act(() => {
            wrapper.find('#language-menu').find(Menu).first().props().onClose({}, 'escapeKeyDown');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find('#language-menu').find(Menu).props().anchorEl).toBeFalsy();
            done();
        })
    });
});