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
import LinearProgress from '@material-ui/core/LinearProgress';

import { EmailInput, PassInput, NameInput } from 'components/TextInput';

import { translationMessages } from 'config/i18n.config';
import theme from 'config/theme.config';
import messages from 'translations/messages/page.account';
import { User, UserProfile } from 'types/user';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';

import DefVerifyEmailPage, { VerifyEmailPage } from '../VerifyEmail';

// store mock
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import { GLOBAL_SET_TITLE } from 'store/constants';
jest.mock('service/member');

configure({ adapter: new Adapter() });

const ConnectedVerifyEmailPage = withRouter(DefVerifyEmailPage);

describe('containers/pages/Account/VerifyEmail - invalid mail', () => {
    const mockMail = 'test@test.com';
    const mockToken = 'aaabbbcccdddeeefffggg';
    const user: User = { id: 100, name: 'testuser', username: mockMail, enabled: true };
    const priv_token = `${mockMail}__private_token`;
    const fnIntl = { formatMessage: jest.fn() };
    const setTitle = jest.fn();
    const getProfile = jest.fn();
    const history = { replace: jest.fn() };
    const location = { search: `localhost://verifyuser?secureToken=${mockToken}` };

    const shallow = createShallow();
    const wrapper = shallow(
        <VerifyEmailPage
            user={user}
            token={priv_token}
            intl={fnIntl}
            history={history}
            setTitle={setTitle}
            getProfile={getProfile}
            classes={{}}
            location={location}
        />
    );

    test('UI components', () => {
    });

    test('cdm async', async done => {
        await wrapper.instance().componentDidMount();

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.state().error).toEqual(messages.emailVerifyFailed);
            expect(wrapper.find(Link)).toHaveLength(1);
            done();
        });
    })
});

describe('containers/pages/Account/VerifyEmail - valid mail', () => {
    const mockMail = 'user2@test.com';
    const mockToken = 'aaabbbcccdddeeefffggg';
    const user: User = { id: 100, name: 'testuser', username: mockMail, enabled: true };
    const priv_token = `${mockMail}__private_token`;
    const fnIntl = { formatMessage: jest.fn() };
    const setTitle = jest.fn();
    const getProfile = jest.fn();
    const history = { replace: jest.fn() };
    const location = { search: `localhost://verifyuser?secureToken=${mockToken}` };

    const shallow = createShallow();
    const wrapper = shallow(
        <VerifyEmailPage
            user={user}
            token={priv_token}
            intl={fnIntl}
            history={history}
            setTitle={setTitle}
            getProfile={getProfile}
            classes={{}}
            location={location}
        />
    );

    test('cdm async', async done => {
        await wrapper.instance().componentDidMount();

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.state().error).toBe(undefined);
            expect(getProfile).lastCalledWith(priv_token);
            expect(wrapper.find(Link)).toHaveLength(1);
            done();
        });
    });

    test('cdm async', done => {
        act(() => {
            wrapper.find(Link).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(history.replace).toHaveBeenCalledTimes(1);
            expect(history.replace).lastCalledWith('/user');
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
                        {<ConnectedVerifyEmailPage />}
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