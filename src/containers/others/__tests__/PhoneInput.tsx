import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';
import { act } from 'react-dom/test-utils';

// material ui
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { createShallow } from '@material-ui/core/test-utils';

// custom
import MuiPhoneInput from 'material-ui-phone-number';
import { PhoneInput } from '../PhoneInput';
jest.mock('service/member');

configure({ adapter: new Adapter() });

describe('containers/others/PhoneInput', () => {

    const fnVerify = jest.fn();
    const fnBusy = jest.fn();
    const fnIntl = { formatMessage: jest.fn() };
    const phoneNo = '';
    fnIntl.formatMessage.mockReturnValue('Code mismatch')

    const shallow = createShallow();
    const wrapper = shallow(
        <PhoneInput
            verify={fnVerify}
            setBusy={fnBusy}
            intl={fnIntl}
            phoneNo={phoneNo}
            countryCode={'82'}
        />
    );

    test('snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('UI components', () => {
        expect(wrapper.find(MuiPhoneInput)).toHaveLength(1);
        const phoneCtrl = wrapper.find(MuiPhoneInput) as any;
        expect(phoneCtrl.props().value).toEqual(`+82 ${phoneNo}`);

        expect(wrapper.find(Button)).toHaveLength(1);
        expect(wrapper.find(TextField)).toHaveLength(0);
        expect(wrapper.find(Link)).toHaveLength(0);
    });

    test('interaction - phone no change - 1', done => {
        act(() => {
            wrapper.find(MuiPhoneInput).simulate('change', '+82 100', { dialCode: '82' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().value).toEqual('+82 0100');
            done();
        });
    });

    test('interaction - phone no change - 2', done => {
        act(() => {
            wrapper.find(MuiPhoneInput).simulate('change', '+82 ', { dialCode: '82' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().value).toEqual('+82 ');
            done();
        });
    });

    test('interaction - phone no change - 3', done => {
        act(() => {
            wrapper.find(MuiPhoneInput).simulate('change', '+82 01', { dialCode: '82' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().value).toEqual('+82 01');
            done();
        });
    });

    test('interaction - phone no change - 4', done => {
        act(() => {
            wrapper.find(MuiPhoneInput).simulate('change', '+86 171', { dialCode: '86' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().value).toEqual('+86 171');
            done();
        });
    });

    test('interaction - hit send button - 1', async done => {
        await wrapper.find(Button).props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().disabled).toEqual(true);
            expect(wrapper.find(Button)).toHaveLength(2);
            expect(wrapper.find(TextField)).toHaveLength(1);
            expect(wrapper.find(Link)).toHaveLength(2);
            done();
        });
    });

    test('interaction - resend code', async done => {
        await wrapper.find(Link).first().props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().disabled).toBe(true);
            expect(wrapper.find(Button)).toHaveLength(2);
            expect(wrapper.find(Button).first().props().disabled).toBe(true);
            expect(wrapper.find(Button).last().props().disabled).toBe(true);
            expect(wrapper.find(Link)).toHaveLength(2);
            expect(wrapper.find(TextField)).toHaveLength(1);
            done();
        });
    });

    test('interaction - try other phone', done => {
        act(() => {
            wrapper.find(Link).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().disabled).toBe(false);
            expect(wrapper.find(Button)).toHaveLength(1);
            expect(wrapper.find(Button).props().disabled).toBe(false);
            expect(wrapper.find(Link)).toHaveLength(0);
            expect(wrapper.find(TextField)).toHaveLength(0);
            done();
        });
    });

    test('interaction - phone no change - 5', done => {
        act(() => {
            wrapper.find(MuiPhoneInput).simulate('change', '+82 100', { dialCode: '82' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().value).toEqual('+82 0100');
            done();
        });
    });

    test('interaction - hit send button - 2', async done => {
        await wrapper.find(Button).props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().disabled).toEqual(true);
            expect(wrapper.find(Button)).toHaveLength(2);
            expect(wrapper.find(Button).first().props().disabled).toBe(true);
            expect(wrapper.find(Button).last().props().disabled).toBe(true);
            expect(wrapper.find(TextField)).toHaveLength(1);
            expect(wrapper.find(Link)).toHaveLength(2);
            done();
        });
    });

    test('interaction - code change - 1', done => {
        act(() => {
            wrapper.find(TextField).simulate('change', { target: { value: '1020' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Button).last().props().disabled).toBe(true);
            expect(wrapper.find(TextField).props().value).toEqual('1020');
            done();
        });
    });

    test('interaction - code change - length = 6', done => {
        act(() => {
            wrapper.find(TextField).simulate('change', { target: { value: '102040' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Button).last().props().disabled).toBe(false);
            expect(wrapper.find(TextField).props().value).toEqual('102040');
            done();
        });
    });

    test('interaction - hit verify button', done => {
        act(() => {
            wrapper.find(Button).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Button).last().props().disabled).toBe(false);
            expect(wrapper.find(TextField).props().value).toEqual('102040');
            expect(fnVerify).lastCalledWith('82', '100', false);
            expect(wrapper.find(TextField).props().helperText).toEqual('Code mismatch');
            expect(wrapper.find(TextField).props().error).toBe(true);
            done();
        });
    });

    test('interaction - code change - correct code', done => {
        act(() => {
            wrapper.find(TextField).simulate('change', { target: { value: '102030' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Button).last().props().disabled).toBe(false);
            expect(wrapper.find(TextField).props().value).toEqual('102030');
            done();
        });
    });

    test('interaction - hit verify button - correct code', done => {
        act(() => {
            wrapper.find(Button).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(fnVerify).lastCalledWith('82', '100', true);
            expect(wrapper.find(TextField)).toHaveLength(0);
            done();
        });
    });

    test('interaction - try other phone - 2', done => {
        act(() => {
            wrapper.find(Link).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().disabled).toBe(false);
            expect(wrapper.find(Button)).toHaveLength(1);
            expect(wrapper.find(Button).props().disabled).toBe(false);
            expect(wrapper.find(Link)).toHaveLength(0);
            expect(wrapper.find(TextField)).toHaveLength(0);
            done();
        });
    });

    test('interaction - phone no change - 6', done => {
        act(() => {
            wrapper.find(MuiPhoneInput).simulate('change', '+88 100', { dialCode: '88' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().value).toEqual('+88 100');
            done();
        });
    });

    test('interaction - hit send button - 3', async done => {
        await wrapper.find(Button).props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().disabled).toBe(false);
            expect(wrapper.find(Button)).toHaveLength(1);
            expect(wrapper.find(Button).props().disabled).toBe(false);
            expect(wrapper.find(Link)).toHaveLength(0);
            expect(wrapper.find(TextField)).toHaveLength(0);
            done();
        });
    });

    test('interaction - phone no change - 6', done => {
        act(() => {
            wrapper.find(MuiPhoneInput).simulate('change', '+86 171', { dialCode: '86' });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().value).toEqual('+86 171');
            done();
        });
    });

    test('interaction - hit send button - 4', async done => {
        await wrapper.find(Button).props().onClick(undefined);

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(MuiPhoneInput).props().disabled).toEqual(true);
            expect(wrapper.find(Button)).toHaveLength(2);
            expect(wrapper.find(Button).first().props().disabled).toBe(true);
            expect(wrapper.find(Button).last().props().disabled).toBe(true);
            expect(wrapper.find(TextField)).toHaveLength(1);
            expect(wrapper.find(Link)).toHaveLength(2);
            done();
        });
    });

    test('interaction - code change - correct code - 2', done => {
        act(() => {
            wrapper.find(TextField).simulate('change', { target: { value: '102030' } });
        });

        setImmediate(() => {
            wrapper.update();
            expect(wrapper.find(Button).last().props().disabled).toBe(false);
            expect(wrapper.find(TextField).props().value).toEqual('102030');
            done();
        });
    });

    test('interaction - hit verify button - correct code - 2', done => {
        act(() => {
            wrapper.find(Button).last().simulate('click');
        });

        setImmediate(() => {
            wrapper.update();
            expect(fnVerify).lastCalledWith('86', '171', true);
            expect(wrapper.find(TextField)).toHaveLength(0);
            done();
        });
    });
});
