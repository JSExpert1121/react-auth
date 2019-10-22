import React from 'react';
import { MemoryRouter, withRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createShallow, createMount } from '@material-ui/core/test-utils';
import { ThemeProvider } from '@material-ui/styles';
import { IntlProvider, injectIntl } from "react-intl";
import { act } from 'react-dom/test-utils';

import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';

import {
    DatePicker,
} from '@material-ui/pickers';

import PhoneInput from 'containers/others/PhoneInput';
import ImageUploadDialog from 'components/Dialog/ImageUploadDialog';

import { translationMessages } from 'config/i18n.config';
import messages from 'translations/messages/page.account';
import { User, UserProfile } from 'types/user';

// store mock
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import DefProfilePage, { ProfilePage, StyledWarning } from '../Profile';
import theme from 'config/theme.config';
jest.mock('service/member');

configure({ adapter: new Adapter() });
const ConnectedProfilePage = withRouter(DefProfilePage);


describe('containers/pages/Account/Profile', () => {

    const shallow = createShallow();
    const user: User = { id: 100, name: 'testuser', username: 'test@test.com', enabled: true };
    const priv_token = 'test@test.com__private_token';
    const profile: UserProfile = {
        cellphoneCountryCode: '82',
        cellphone: '1000000000',
        emailVerified: false,
        cellphoneVerified: true
    }
    const mock_photo = 'https://google.com/image.png';
    const fnIntl = { formatMessage: jest.fn() };
    fnIntl.formatMessage.mockReturnValue('My Profile');

    const setTitle = jest.fn();
    const updateProfile = jest.fn();
    updateProfile.mockResolvedValueOnce(true).mockRejectedValueOnce(false);
    const showMessage = jest.fn();

    const wrapper = shallow(
        <ProfilePage
            intl={fnIntl}
            profile={profile}
            token={priv_token}
            user={user}
            setTitle={setTitle}
            updateProfile={updateProfile}
            classes={{}}
            showMessage={showMessage}
        />
    );

    test('Snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('SetTitle', done => {
        wrapper.update();
        expect(fnIntl.formatMessage).toHaveBeenCalledWith(messages.profileTitle);
        expect(setTitle).toHaveBeenCalledWith('My Profile');
        done();
    });

    test('UI components', () => {
        expect(wrapper.find(Paper).find(FormControl).first().find(Avatar)).toHaveLength(1);
        expect(wrapper.find(Paper).find(FormControl).first().find(Avatar).find(IconButton)).toHaveLength(0);
        expect(wrapper.find(Paper).find(FormControl).find(Box).first().find(LinearProgress)).toHaveLength(1);
        expect(wrapper.find(Paper).find(FormControl).find(Box).first().find(PhoneInput)).toHaveLength(1);
        expect(wrapper.find(Paper).find(FormControl).find(Box).first().find(Grid).at(1).find(FormControl)).toHaveLength(1);
        expect(wrapper.find(Paper).find(FormControl).find(Box).first().find(Grid).at(1).find(FormControl).find(InputLabel)).toHaveLength(1);
        expect(wrapper.find(ImageUploadDialog).props().open).toBe(false);
        expect(wrapper.find(ImageUploadDialog).props().onYes).toBeInstanceOf(Function);
        expect(wrapper.find(ImageUploadDialog).props().onCancel).toBeInstanceOf(Function);
    });

    test('User interaction - enter avatar', done => {
        act(() => {
            wrapper.find(Avatar).simulate('mouseenter');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Paper).find(FormControl).first().find(Avatar).find(IconButton)).toHaveLength(1);
            done();
        })
    });

    test('User interaction - edit avatar', done => {
        act(() => {
            wrapper.find(Paper).find(FormControl).first().find(Avatar).find(IconButton).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ImageUploadDialog).props().open).toBe(true);
            expect(wrapper.find(ImageUploadDialog).props().name).toEqual(user.name);
            done();
        })
    });

    test('User interaction - close avatar edit', done => {
        wrapper.find(ImageUploadDialog).props().onCancel();

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ImageUploadDialog).props().open).toBe(false);
            done();
        })
    });

    test('User interaction - reopen edit avatar', done => {
        act(() => {
            wrapper.find(Paper).find(FormControl).first().find(Avatar).find(IconButton).simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ImageUploadDialog).props().open).toBe(true);
            done();
        })
    });

    test('User interaction - save avatar', done => {
        wrapper.find(ImageUploadDialog).props().onYes(mock_photo);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(ImageUploadDialog).props().open).toBe(false);
            done();
        })
    });

    test('User interaction - PhoneInput completion handler', done => {
        wrapper.find(PhoneInput).props().verify('82', '10000', true);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(PhoneInput).props().phoneNo).toEqual('10000');
            done();
        });
    });

    test('User interaction - birthday change - 1', done => {
        wrapper.find(DatePicker).props().onChange(new Date(1994, 10, 8));
        // dateBirth: '1994-11-08'

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(DatePicker).props().value).toEqual('1994-11-08');
            done();
        })
    });

    test('User interaction - birthday change - 2', done => {
        wrapper.find(DatePicker).props().onChange(new Date(1994, 0, 28));
        // dateBirth: '1994-01-28'

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(DatePicker).props().value).toEqual('1994-01-28');
            done();
        })
    });

    test('User interaction - gender change', done => {
        wrapper.find(Select).props().onChange({ target: { value: 'FEMALE' } });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Select).props().value).toEqual('FEMALE');
            done();
        })
    });

    test('User interaction - enter avatar', done => {
        act(() => {
            wrapper.find(Avatar).simulate('mouseenter');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Paper).find(FormControl).first().find(Avatar).find(IconButton)).toHaveLength(1);
            done();
        })
    });

    test('User interaction - leave avatar', done => {
        act(() => {
            wrapper.find(Avatar).simulate('mouseleave');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Paper).find(FormControl).first().find(Avatar).find(IconButton)).toHaveLength(0);
            done();
        })
    });

    test('User interaction - save - success', async done => {
        await wrapper.find(Button).props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(updateProfile).toHaveBeenCalledWith(
                priv_token, '82', '10000', true, undefined,
                '1994-01-28', 'FEMALE', mock_photo
            );
            expect(fnIntl.formatMessage).toHaveBeenCalledWith(messages.profileSuccess);
            expect(showMessage).toHaveBeenCalledWith(true, 'My Profile');
            done();
        })
    });

    test('User interaction - save - error', async done => {
        await wrapper.find(Button).props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(updateProfile).toHaveBeenCalledWith(
                priv_token, '82', '10000', true, undefined,
                '1994-01-28', 'FEMALE', mock_photo
            );
            expect(fnIntl.formatMessage).toHaveBeenCalledWith(messages.profileError);
            expect(showMessage).toHaveBeenCalledWith(false, 'My Profile');
            done();
        })
    });

    test('User interaction - phoneinput busy', done => {
        wrapper.find(PhoneInput).props().setBusy(true);
        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(LinearProgress).props().style).toEqual({
                visibility: 'visible'
            });
            done();
        })
    });

    test('User interaction - phoneinput not busy', done => {
        wrapper.find(PhoneInput).props().setBusy(false);
        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(LinearProgress).props().style).toEqual({
                visibility: 'hidden'
            });
            done();
        })
    });
});

describe('containers/pages/Account/Profile - variable props', () => {

    const shallow = createShallow();

    test('UI components without photo', () => {
        const user: User = { id: 100, name: 'testuser', username: 'test@test.com', enabled: true };
        const priv_token = 'test@test.com__private_token';
        const profile: UserProfile = {
            cellphoneCountryCode: '82',
            cellphone: '1000000000',
            emailVerified: false,
            cellphoneVerified: true
        }

        const fnIntl = { formatMessage: jest.fn() };
        const setTitle = jest.fn();
        const updateProfile = jest.fn();

        const wrapper = shallow(
            <ProfilePage
                intl={fnIntl}
                profile={profile}
                token={priv_token}
                user={user}
                setTitle={setTitle}
                updateProfile={updateProfile}
                classes={{}}
            />
        );

        expect(wrapper.find(Paper).find(FormControl).first().find(Avatar).props().src).toBe(undefined);
        expect(wrapper.find(Paper).find(FormControl).first().find(Avatar).find(IconButton)).toHaveLength(0);
    });

    test('UI components with photo', () => {
        const user: User = { id: 100, name: 'testuser', username: 'test@test.com', enabled: true };
        const priv_token = 'test@test.com__private_token';
        const mock_photo = 'https://google.com/image.png';
        const profile: UserProfile = {
            cellphoneCountryCode: '82',
            cellphone: '1000000000',
            emailVerified: false,
            cellphoneVerified: true,
            photoUrl: mock_photo
        }

        const fnIntl = { formatMessage: jest.fn() };
        const setTitle = jest.fn();
        const updateProfile = jest.fn();

        const wrapper = shallow(
            <ProfilePage
                intl={fnIntl}
                profile={profile}
                token={priv_token}
                user={user}
                setTitle={setTitle}
                updateProfile={updateProfile}
                classes={{}}
            />
        );

        expect(wrapper.find(Paper).find(FormControl).first().find(Avatar).props().src).toEqual(mock_photo);
    });

    test('UI components not verified email, phone', () => {
        const user: User = { id: 100, name: 'testuser', username: 'test@test.com', enabled: true };
        const priv_token = 'test@test.com__private_token';
        const mock_photo = 'https://google.com/image.png';
        const profile: UserProfile = {
            cellphoneCountryCode: '82',
            cellphone: '1000000000',
            emailVerified: false,
            cellphoneVerified: false,
            photoUrl: mock_photo
        }

        const fnIntl = { formatMessage: jest.fn() };
        const setTitle = jest.fn();
        const updateProfile = jest.fn();

        const wrapper = shallow(
            <ProfilePage
                intl={fnIntl}
                profile={profile}
                token={priv_token}
                user={user}
                setTitle={setTitle}
                updateProfile={updateProfile}
                classes={{}}
            />
        );

        expect(wrapper.find(Paper).find(StyledWarning)).toHaveLength(2);
    });

    test('UI components verified email, phone', () => {
        const user: User = { id: 100, name: 'testuser', username: 'test@test.com', enabled: true };
        const priv_token = 'test@test.com__private_token';
        const mock_photo = 'https://google.com/image.png';
        const profile: UserProfile = {
            cellphoneCountryCode: '82',
            cellphone: '1000000000',
            emailVerified: true,
            cellphoneVerified: true,
            photoUrl: mock_photo
        }

        const fnIntl = { formatMessage: jest.fn() };
        const setTitle = jest.fn();
        const updateProfile = jest.fn();

        const wrapper = shallow(
            <ProfilePage
                intl={fnIntl}
                profile={profile}
                token={priv_token}
                user={user}
                setTitle={setTitle}
                updateProfile={updateProfile}
                classes={{}}
            />
        );

        expect(wrapper.find(Paper).find(StyledWarning)).toHaveLength(0);
        expect(wrapper.find(PhoneInput).props().phoneNo).toEqual('1000000000');
        expect(wrapper.find(PhoneInput).props().countryCode).toEqual('82');
    });

    test('UI components without phone', () => {
        const user: User = { id: 100, name: 'testuser', username: 'test@test.com', enabled: true };
        const priv_token = 'test@test.com__private_token';
        const mock_photo = 'https://google.com/image.png';
        const profile: UserProfile = {
            cellphoneCountryCode: undefined,
            cellphone: undefined,
            emailVerified: true,
            cellphoneVerified: true,
            photoUrl: mock_photo
        }

        const fnIntl = { formatMessage: jest.fn() };
        const setTitle = jest.fn();
        const updateProfile = jest.fn();

        const wrapper = shallow(
            <ProfilePage
                intl={fnIntl}
                profile={profile}
                token={priv_token}
                user={user}
                setTitle={setTitle}
                updateProfile={updateProfile}
                classes={{}}
            />
        );

        expect(wrapper.find(Paper).find(StyledWarning)).toHaveLength(0);
        expect(wrapper.find(PhoneInput).props().phoneNo).toEqual('');
        expect(wrapper.find(PhoneInput).props().countryCode).toEqual('');
    });

    test('StyledWarning', () => {
        const shallow = createShallow();
        const wrapper = shallow(<StyledWarning />);
    })

    test('real mount', () => {
        const mount = createMount();

        const user: User = { id: 100, name: 'testuser', username: 'test@test.com', enabled: true };
        const profile: UserProfile = {
            cellphoneCountryCode: undefined,
            cellphone: undefined,
            emailVerified: true,
            cellphoneVerified: true,
            photoUrl: undefined
        }
        const store = mockStore({
            user: { user, profile, token: undefined },
        });

        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <IntlProvider locale='en' messages={translationMessages.en}>
                        <ThemeProvider theme={theme}>
                            {<ConnectedProfilePage />}
                        </ThemeProvider>
                    </IntlProvider>
                </MemoryRouter>
            </Provider>
        );
    });
});

