import React from 'react';
import { MemoryRouter, withRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createMount, createShallow } from '@material-ui/core/test-utils';
import { ThemeProvider } from '@material-ui/styles';
import { IntlProvider, injectIntl } from "react-intl";
import { act } from 'react-dom/test-utils';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

import { EmailInput, PassInput, NameInput } from 'components/TextInput';

import { translationMessages } from 'config/i18n.config';
import theme from 'config/theme.config';
import messages from 'translations/messages/page.account';
import { User, UserProfile } from 'types/user';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';

import DefSettingPage, { SettingPage } from '../Setting';

// store mock
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import { GLOBAL_SET_TITLE } from 'store/constants';
jest.mock('service/member');

configure({ adapter: new Adapter() });

const ConnectedSettingPage = withRouter(DefSettingPage);


describe('containers/pages/Account/Profile', () => {
    const mockMail = 'test@test.com';
    const user: User = { id: 100, name: 'testuser', username: mockMail, enabled: true };
    const priv_token = `${mockMail}__private_token`;
    const fnIntl = { formatMessage: jest.fn() };
    const setTitle = jest.fn();
    const updateUser = jest.fn();
    updateUser.mockResolvedValueOnce(true).mockRejectedValueOnce(false);
    const getUser = jest.fn();
    const deleteUser = jest.fn();
    deleteUser.mockRejectedValueOnce(false).mockResolvedValueOnce(true);
    const showMessage = jest.fn();
    const history = { replace: jest.fn() };

    const shallow = createShallow();
    const wrapper = shallow(
        <SettingPage
            user={user}
            token={priv_token}
            intl={fnIntl}
            history={history}
            setTitle={setTitle}
            updateUser={updateUser}
            getUser={getUser}
            deleteUser={deleteUser}
            showMessage={showMessage}
        />
    );

    test('Snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('UI components', () => {

        expect(wrapper.find(EmailInput).props().messages).toBeFalsy();
        expect(wrapper.find(EmailInput).props().value).toEqual(mockMail);
        expect(wrapper.find(ConfirmDialog).props().open).toBe(false);
    });

    test('User interaction - email change', done => {
        wrapper.find(EmailInput).props().handleChange('test@gmail.kr', undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(EmailInput).props().messages).toBeFalsy();
            expect(wrapper.find(EmailInput).props().value).toEqual('test@gmail.kr');
            done();
        });
    });

    test('User interaction - password change', done => {
        wrapper.find(PassInput).props().handleChange('123avcde', undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(PassInput).props().messages).toBeFalsy();
            expect(wrapper.find(PassInput).props().value).toEqual('123avcde');
            done();
        });
    });

    test('User interaction - name change', done => {
        wrapper.find(NameInput).props().handleChange('darko', undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(NameInput).props().messages).toBeFalsy();
            expect(wrapper.find(NameInput).props().value).toEqual('darko');
            done();
        });
    });

    test('User interaction - update - success', async done => {
        await wrapper.find(Button).first().props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(updateUser).toHaveBeenCalledWith(priv_token, 'test@gmail.kr', '123avcde', 'darko');
            expect(getUser).toHaveBeenCalledWith(priv_token);
            expect(fnIntl.formatMessage).toHaveBeenCalledWith(messages.updateSuccess);
            expect(showMessage).toHaveBeenCalledWith(true, undefined);
            done();
        });
    });

    test('User interaction - update - fail', async done => {
        await wrapper.find(Button).first().props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(updateUser).toHaveBeenCalledWith(priv_token, 'test@gmail.kr', '123avcde', 'darko');
            expect(getUser).toHaveBeenCalledWith(priv_token);
            expect(fnIntl.formatMessage).toHaveBeenCalledWith(messages.updateFailed);
            expect(showMessage).toHaveBeenCalledWith(true, undefined);
            done();
        });
    });

    test('User interaction - delete button click', done => {
        wrapper.find(Button).last().props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('User interaction - delete cancel', done => {
        wrapper.find(ConfirmDialog).props().onCancel();

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ConfirmDialog).props().open).toBe(false);
            done();
        });
    });

    test('User interaction - delete button re-click', done => {
        wrapper.find(Button).last().props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('User interaction - delete - fail', async done => {
        await wrapper.find(ConfirmDialog).props().onYes();

        setImmediate(() => {
            wrapper.update();

            expect(wrapper.find(ConfirmDialog).props().open).toBe(false);
            expect(deleteUser).lastCalledWith(priv_token);
            expect(fnIntl.formatMessage).toHaveBeenCalledWith(messages.deleteFailed);
            expect(showMessage).lastCalledWith(false, undefined);
            done();
        });
    });

    test('User interaction - delete button 3rd-click', done => {
        wrapper.find(Button).last().props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ConfirmDialog).props().open).toBe(true);
            done();
        });
    });

    test('User interaction - delete - success', async done => {
        await wrapper.find(ConfirmDialog).props().onYes();

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ConfirmDialog).props().open).toBe(false);
            expect(deleteUser).lastCalledWith(priv_token);
            expect(history.replace).lastCalledWith('/login');
            done();
        });
    });
});

describe('containers/pages/Account/Profile - real mount', () => {

    const user: User = { id: 100, name: 'testuser', username: 'test@test.com', enabled: true };
    const priv_token = 'test@test.com__private_token';
    const profile: UserProfile = {
        cellphoneCountryCode: '82',
        cellphone: '1000000000',
        emailVerified: false,
        cellphoneVerified: true
    }

    const store = mockStore({
        user: { user, profile, token: priv_token },
        token: undefined
    });

    const mount = createMount();
    const wrapper = mount(
        <Provider store={store}>
            <MemoryRouter>
                <IntlProvider locale='en' messages={translationMessages.en}>
                    <ThemeProvider theme={theme}>
                        {<ConnectedSettingPage />}
                    </ThemeProvider>
                </IntlProvider>
            </MemoryRouter>
        </Provider>
    );

    test('Snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('setTitle', () => {
        wrapper.update();
        expect(store.getActions()).toContainEqual({
            type: GLOBAL_SET_TITLE,
            payload: 'Setting'
        });
    });
});
