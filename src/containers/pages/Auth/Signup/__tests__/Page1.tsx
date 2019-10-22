/* disable tslint */
import React from 'react';
import { MemoryRouter, withRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createMount } from '@material-ui/core/test-utils';
import { ThemeProvider } from '@material-ui/styles';
import { IntlProvider } from "react-intl";
import { act } from 'react-dom/test-utils';

import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import MuiPhoneInput from 'material-ui-phone-number';

import Page1, { SignupPage1 } from '../Page1';
import { EmailInput, NameInput, PassConfirmInput } from 'components/TextInput';

import { translationMessages } from 'config/i18n.config';
import theme from 'config/theme.config';
import messages from 'translations/messages/page.auth';

configure({ adapter: new Adapter() });
jest.mock('service/member');

describe('containers/pages/auth/signup/page1 UI components', () => {

    const goNext = jest.fn();
    const mount = createMount();

    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='en' messages={translationMessages.en}>
                <ThemeProvider theme={theme}>
                    <Page1 goNext={goNext} />
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );

    test('Snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('UI components', async (done) => {
        setImmediate(() => {
            const page = wrapper.find(SignupPage1);
            expect(page).toHaveLength(1);

            expect(page.find(Typography).at(0).props().children).toEqual('Create your Hit! T Account');
            expect(page.find(Avatar).at(0).props().children.type).toEqual(AccountCircleOutlined);

            expect(page.find(EmailInput)).toHaveLength(1);
            expect(page.find(EmailInput).at(0).props().value).toEqual('');
            expect(page.find(EmailInput).at(0).props().autoFocus).toEqual(true);
            expect(page.find(EmailInput).at(0).props().label).toEqual('Email Address');
            expect(page.find(EmailInput).at(0).props().helperText).toEqual('This email address will be used as your Hit! T account');
            expect(page.find(EmailInput).at(0).props().message).toEqual(undefined);

            expect(page.find(NameInput)).toHaveLength(1);
            expect(page.find(NameInput).at(0).props().value).toEqual('');
            expect(page.find(NameInput).at(0).props().label).toEqual('Name');
            expect(page.find(NameInput).at(0).props().message).toEqual(undefined);

            expect(page.find(PassConfirmInput)).toHaveLength(2);
            expect(page.find(PassConfirmInput).at(0).props().value).toEqual('');
            expect(page.find(PassConfirmInput).at(1).props().value).toEqual('');
            expect(page.find(PassConfirmInput).at(0).props().label).toEqual('Password');
            expect(page.find(PassConfirmInput).at(1).props().label).toEqual('Confirm password');
            expect(page.find(PassConfirmInput).at(0).props().type).toEqual('password');
            expect(page.find(PassConfirmInput).at(1).props().type).toEqual('password');
            expect(page.find(PassConfirmInput).at(0).props().compare).toEqual('');
            expect(page.find(PassConfirmInput).at(1).props().compare).toEqual('');
            expect(page.find(PassConfirmInput).at(0).props().message).toEqual(undefined);
            expect(page.find(PassConfirmInput).at(1).props().message).toEqual(undefined);

            expect(page.find(IconButton).at(0).props().children.type).toEqual(VisibilityOff);

            expect(page.find(MuiPhoneInput)).toHaveLength(1);
            const props = page.find(MuiPhoneInput).props() as any;
            expect(props.defaultCountry).toEqual('ko');
            expect(props.fullWidth).toEqual(true);
            expect(props.label).toEqual('Mobile Number');
            expect(props.disabled).toEqual(false);

            expect(page.find('#send-code-btn').first()).toHaveLength(1);
            expect(page.find('#send-code-btn').first().props().children).toEqual('Get Code');

            expect(page.find('#next-button').first()).toHaveLength(1);
            expect(page.find('#next-button').first().props().children).toEqual('NEXT');
            expect(page.find('#next-button').first().props().disabled).toEqual(true);

            done();
        });
    });
});

describe('containers/pages/auth/signup/page1 email interaction', () => {

    const goNext = jest.fn();
    const mount = createMount();

    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='en' messages={translationMessages.en}>
                <ThemeProvider theme={theme}>
                    < Page1 goNext={goNext} />
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );

    test('Email change event(invalid address)', done => {
        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: '123@cc.a' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(EmailInput).first().props().message).toEqual(messages.emailInvalid);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Email change event(empty string)', done => {
        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: '' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(EmailInput).first().props().message).toEqual(messages.emailRequired);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Email blur event(existing address)', done => {
        act(() => {
            wrapper.find('#email').last().simulate('blur');
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(EmailInput).first().props().message).toEqual(messages.emailRequired);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Email change event(valid address)', done => {
        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: '123@cc.au' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(EmailInput).first().props().message).toEqual(undefined);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Email blur event(existing address)', done => {
        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: 'user1@test.com' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(EmailInput).first().props().value).toEqual('user1@test.com');
            expect(page.find(EmailInput).first().props().message).toEqual(undefined);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Email blur event(existing address)', done => {
        act(() => {
            wrapper.find('#email').last().simulate('blur');
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(EmailInput).first().props().value).toEqual('user1@test.com');
            expect(page.find(EmailInput).first().props().message).toEqual(messages.emailUsed);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Email blur event(valid address)', done => {
        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: 'user4@test.com' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(EmailInput).first().props().value).toEqual('user4@test.com');
            expect(page.find(EmailInput).first().props().message).toEqual(undefined);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Email blur event(valid address)', done => {
        act(() => {
            wrapper.find('#email').last().simulate('blur');
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(EmailInput).first().props().value).toEqual('user4@test.com');
            expect(page.find(EmailInput).first().props().message).toEqual(undefined);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });
});

describe('containers/pages/auth/signup/page1 name interaction', () => {
    const goNext = jest.fn();
    const mount = createMount();

    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='en' messages={translationMessages.en}>
                <ThemeProvider theme={theme}>
                    < Page1 goNext={goNext} />
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );


    test('Name change event(empty string)', done => {
        act(() => {
            wrapper.find('#name').last().simulate('change', { target: { value: '' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(NameInput).first().props().value).toEqual('');
            expect(page.find(NameInput).first().props().message).toEqual(messages.nameRequired);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Name change event(valid name)', done => {
        act(() => {
            wrapper.find('#name').last().simulate('change', { target: { value: 'user' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(NameInput).first().props().value).toEqual('user');
            expect(page.find(NameInput).first().props().message).toEqual(undefined);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });
});

describe('containers/pages/auth/signup/page1 password interaction', () => {
    const goNext = jest.fn();
    const mount = createMount();

    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='en' messages={translationMessages.en}>
                <ThemeProvider theme={theme}>
                    < Page1 goNext={goNext} />
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );


    test('Password and confirm change event(empty string)', done => {
        act(() => {
            wrapper.find('#password').last().simulate('change', { target: { value: '' } });
            wrapper.find('#confirm-password').last().simulate('change', { target: { value: '' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(PassConfirmInput).first().props().value).toEqual('');
            expect(page.find(PassConfirmInput).first().props().message).toEqual(messages.passRequired);
            expect(page.find(PassConfirmInput).last().props().value).toEqual('');
            expect(page.find(PassConfirmInput).last().props().message).toEqual(messages.passRequired);
            done();
        });
    });

    test('Password and confirm change event(less than 8 chars)', done => {
        act(() => {
            wrapper.find('#password').last().simulate('change', { target: { value: '1232345' } });
            wrapper.find('#confirm-password').last().simulate('change', { target: { value: '2232345' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(PassConfirmInput).first().props().value).toEqual('1232345');
            expect(page.find(PassConfirmInput).first().props().message).toEqual(messages.passShort);
            expect(page.find(PassConfirmInput).last().props().value).toEqual('2232345');
            expect(page.find(PassConfirmInput).last().props().message).toEqual(messages.passShort);
            done();
        });
    });

    test('Password change event(more than 24 chars)', done => {
        act(() => {
            wrapper.find('#password').last().simulate('change', { target: { value: '1223232323232323323233233232345' } });
            wrapper.find('#confirm-password').last().simulate('change', { target: { value: '2223232323232323323233233232345' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(PassConfirmInput).first().props().value).toEqual('1223232323232323323233233232345');
            expect(page.find(PassConfirmInput).first().props().message).toEqual(messages.passLong);
            expect(page.find(PassConfirmInput).last().props().value).toEqual('2223232323232323323233233232345');
            expect(page.find(PassConfirmInput).last().props().message).toEqual(messages.passLong);
            done();
        });
    });

    test('Password change event(invalid chars)', done => {
        act(() => {
            wrapper.find('#password').last().simulate('change', { target: { value: '32332323°3233232345' } });
            wrapper.find('#confirm-password').last().simulate('change', { target: { value: '42332323°3233232345' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(PassConfirmInput).first().props().value).toEqual('32332323°3233232345');
            expect(page.find(PassConfirmInput).first().props().message).toEqual(messages.passInvalid);
            expect(page.find(PassConfirmInput).last().props().value).toEqual('42332323°3233232345');
            expect(page.find(PassConfirmInput).last().props().message).toEqual(messages.passInvalid);
            done();
        });
    });

    test('Password change event(invalid chars)', done => {
        act(() => {
            wrapper.find('#password').last().simulate('change', { target: { value: '323323233233232345' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(PassConfirmInput).first().props().value).toEqual('323323233233232345');
            expect(page.find(PassConfirmInput).first().props().message).toEqual(messages.passMismatch);
            done();
        });
    });

    test('Password change event(valid passwords)', done => {
        act(() => {
            wrapper.find('#confirm-password').last().simulate('change', { target: { value: '323323233233232345' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(PassConfirmInput).last().props().value).toEqual('323323233233232345');
            expect(page.find(PassConfirmInput).first().props().message).toEqual(undefined);
            expect(page.find(PassConfirmInput).last().props().message).toEqual(undefined);
            done();
        });
    });

    test('toggle password show', done => {
        act(() => {
            wrapper.find('#passwordVisibility').last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(PassConfirmInput).last().props().type).toEqual('text');
            expect(page.find(PassConfirmInput).first().props().type).toEqual('text');
            done();
        });
    });

    test('toggle password hide', done => {
        act(() => {
            wrapper.find('#passwordVisibility').last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(PassConfirmInput).last().props().type).toEqual('password');
            expect(page.find(PassConfirmInput).first().props().type).toEqual('password');
            done();
        });
    });
});

describe('containers/pages/auth/signup/page1 signup action', () => {

    const goNext = jest.fn();
    const mount = createMount();

    const wrapper = mount(
        <MemoryRouter>
            <IntlProvider locale='en' messages={translationMessages.en}>
                <ThemeProvider theme={theme}>
                    < Page1 goNext={goNext} />
                </ThemeProvider>
            </IntlProvider>
        </MemoryRouter>
    );


    test('UI components', done => {

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find('#next-button').first().props().disabled).toBe(true);
            done();
        });
    });

    test('Email change event(valid address)', done => {
        act(() => {
            wrapper.find('#email').last().simulate('change', { target: { value: 'user4@test.com' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(EmailInput).first().props().value).toEqual('user4@test.com');
            expect(page.find(EmailInput).first().props().message).toEqual(undefined);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Email blur event(valid address)', done => {
        act(() => {
            wrapper.find('#email').last().simulate('blur');
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(EmailInput).first().props().value).toEqual('user4@test.com');
            expect(page.find(EmailInput).first().props().message).toEqual(undefined);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Name change event(valid name)', done => {
        act(() => {
            wrapper.find('#name').last().simulate('change', { target: { value: 'testuser4' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(NameInput).first().props().value).toEqual('testuser4');
            expect(page.find(NameInput).first().props().message).toEqual(undefined);
            expect(page.find('#send-code-btn').first().props().disabled).toEqual(true);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('Password change event(valid passwords)', done => {
        act(() => {
            wrapper.find('#password').last().simulate('change', { target: { value: '323323233233232345' } });
            wrapper.find('#confirm-password').last().simulate('change', { target: { value: '323323233233232345' } });
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find(PassConfirmInput).first().props().value).toEqual('323323233233232345');
            expect(page.find(PassConfirmInput).last().props().value).toEqual('323323233233232345');
            expect(page.find(PassConfirmInput).first().props().message).toEqual(undefined);
            expect(page.find(PassConfirmInput).last().props().message).toEqual(undefined);
            expect(page.find('#next-button').first().props().disabled).toEqual(true);
            done();
        });
    });

    test('phone change:', done => {
        act(() => {
            const page = wrapper.find(SignupPage1);
            page.instance().handlePhone('82', '1022938283', true);
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(page.find('#next-button').first().props().disabled).toEqual(false);
            done();
        });
    });

    test('next button handler', done => {
        act(() => {
            wrapper.find('#next-button').last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            const page = wrapper.find(SignupPage1);
            expect(goNext).toHaveBeenCalledWith(
                'user4@test.com',
                'testuser4',
                '323323233233232345',
                '323323233233232345',
                '82', '1022938283',
                true
            );
            done();
        });
    });

    test('setBusy function', done => {
        act(() => {
            wrapper.find(SignupPage1).instance().setBusy(false);
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(SignupPage1).state().isBusy).toBe(false);
            done();
        })
    })
});