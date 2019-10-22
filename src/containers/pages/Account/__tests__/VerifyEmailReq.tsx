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
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import LinearProgress from '@material-ui/core/LinearProgress';

import { EmailInput, PassInput, NameInput } from 'components/TextInput';

import { translationMessages } from 'config/i18n.config';
import theme from 'config/theme.config';
import messages from 'translations/messages/page.account';
import { User, UserProfile } from 'types/user';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';

import DefVerifyEmailReqPage, { VerifyEmailReqPage } from '../VerifyEmailReq';
// store mock
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import { GLOBAL_SET_TITLE } from 'store/constants';
jest.mock('service/member');

configure({ adapter: new Adapter() });

const ConnectedVerifyEmailReqPage = withRouter(DefVerifyEmailReqPage);


describe('containers/pages/Account/VerifyEmailReq - request fail', () => {
    const mockMail = 'test@test.com';
    const user: User = { id: 100, name: 'testuser', username: mockMail, enabled: true };
    const priv_token = `${mockMail}__private_token`;
    const fnIntl = { formatMessage: jest.fn() };
    const setTitle = jest.fn();
    const history = { goBack: jest.fn() };

    const shallow = createShallow();
    const wrapper = shallow(
        <VerifyEmailReqPage
            user={user}
            token={priv_token}
            intl={fnIntl}
            history={history}
            setTitle={setTitle}
        />
    );

    test('UI components', () => {
        expect(wrapper.find(Typography)).toHaveLength(2);
        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(LinearProgress)).toHaveLength(1);
    });

    test('User interaction', async done => {
        await wrapper.find(Button).props().onClick(undefined);

        setImmediate(() => {
            expect(wrapper.find(Typography)).toHaveLength(2);
            expect(wrapper.find(Button)).toHaveLength(1);
            done();
        })
    });
});

describe('containers/pages/Account/VerifyEmailReq - request success', () => {
    const mockMail = 'user1@test.com';
    const user: User = { id: 100, name: 'testuser', username: mockMail, enabled: true };
    const priv_token = `${mockMail}__private_token`;
    const fnIntl = { formatMessage: jest.fn() };
    const setTitle = jest.fn();
    const history = { goBack: jest.fn() };

    const shallow = createShallow();
    const wrapper = shallow(
        <VerifyEmailReqPage
            user={user}
            token={priv_token}
            intl={fnIntl}
            history={history}
            setTitle={setTitle}
        />
    );

    test('UI components', () => {
        expect(wrapper.find(Typography)).toHaveLength(2);
        expect(wrapper.find(Button)).toHaveLength(1);
    });

    test('User interaction - send code', async done => {
        await wrapper.find(Button).props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Typography)).toHaveLength(3);
            expect(wrapper.find(Button)).toHaveLength(0);
            expect(wrapper.find(Link)).toHaveLength(2);
            done();
        });
    });

    test('User interaction - go back', done => {
        act(() => {
            wrapper.find(Link).first().simulate('click');
        })

        setImmediate(() => {
            wrapper.update();
            expect(history.goBack).toHaveBeenCalledTimes(1);
            done();
        });
    });

    test('User interaction - resend', async done => {
        await wrapper.find(Link).last().props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Typography)).toHaveLength(3);
            expect(wrapper.find(Button)).toHaveLength(0);
            expect(wrapper.find(Link)).toHaveLength(2);
            done();
        });
    });
});


describe('containers/pages/Account/VerifyEmail - real mount', () => {

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
    });

    const mount = createMount();
    const wrapper = mount(
        <Provider store={store}>
            <MemoryRouter>
                <IntlProvider locale='en' messages={translationMessages.en}>
                    <ThemeProvider theme={theme}>
                        {<ConnectedVerifyEmailReqPage />}
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
            payload: 'Email Confirmation'
        });
    });
});