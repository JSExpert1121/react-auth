import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';
import { act } from 'react-dom/test-utils';

import TextField from '@material-ui/core/TextField';
import { createShallow } from '@material-ui/core/test-utils';

import withValidators, { ValidatorParam } from '../withValidators';
import * as Validators from 'helper/validators';

configure({ adapter: new Adapter() });

const TEST_MESSAGE1 = 'Error Message1';
const TEST_MESSAGE2 = 'Error Message2';
const TEST_VALUE = 'abc';
const COMP_VALUE = '1234';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('components/HOCs/withValidators with one validator', () => {
    const handleChange = jest.fn();
    const validator = jest.fn();
    validator.mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

    const shallow = createShallow();
    const Component = withValidators([
        { validator, message: TEST_MESSAGE1 }
    ])(TextField);

    const wrapper = shallow(<Component handleChange={handleChange} />);

    test('UI Component', () => {
        expect.assertions(3);

        expect(wrapper.find(TextField).length).toBe(1);
        expect(wrapper.find(TextField).props().error).toBe(false);
        expect(wrapper.find(TextField).props().helperText).toEqual(undefined);
    });

    test('User interactions', (done) => {
        act(() => {
            wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
            wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
            wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
            wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
            wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
        });

        process.nextTick(() => {
            expect(handleChange.mock.calls.length).toBe(5);
            expect(validator.mock.calls.length).toBe(5);
            expect(handleChange.mock.calls[0][0]).toEqual(TEST_VALUE);
            expect(handleChange.mock.calls[0][1]).toEqual(TEST_MESSAGE1);
            expect(handleChange.mock.calls[1][0]).toEqual(TEST_VALUE);
            expect(handleChange.mock.calls[1][1]).toEqual(TEST_MESSAGE1);
            expect(handleChange.mock.calls[2][0]).toEqual(TEST_VALUE);
            expect(handleChange.mock.calls[2][1]).toEqual(undefined);
            expect(handleChange.mock.calls[3][0]).toEqual(TEST_VALUE);
            expect(handleChange.mock.calls[3][1]).toEqual(undefined);
            expect(handleChange.mock.calls[4][0]).toEqual(TEST_VALUE);
            expect(handleChange.mock.calls[4][1]).toEqual(TEST_MESSAGE1);
            done();
        })
    });
});

describe('components/HOCs/withValidators with several validators', () => {
    const handleChange = jest.fn();
    const validator1 = jest.fn();
    validator1.mockResolvedValueOnce(false)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(true)
        .mockResolvedValue(false);
    const validator2 = jest.fn();
    validator2.mockResolvedValueOnce(true)
        .mockResolvedValue(false);

    const shallow = createShallow();
    const Component = withValidators([
        { validator: validator1, message: TEST_MESSAGE1 },
        { validator: validator2, message: TEST_MESSAGE2 },
    ])(TextField);

    const wrapper = shallow(<Component handleChange={handleChange} />);

    test('UI Component', () => {
        expect.assertions(3);

        expect(wrapper.find(TextField).length).toBe(1);
        expect(wrapper.find(TextField).props().error).toBe(false);
        expect(wrapper.find(TextField).props().helperText).toEqual(undefined);
    });

    test('User interactions', async () => {
        wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
        await delay(10);
        wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
        await delay(10);
        wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
        await delay(10);
        wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
        await delay(10);
        wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
        await delay(10);

        expect(handleChange.mock.calls.length).toBe(5);
        expect(validator1.mock.calls.length).toBe(5);
        expect(validator2.mock.calls.length).toBe(2);
        expect(handleChange.mock.calls[0][0]).toEqual(TEST_VALUE);
        expect(handleChange.mock.calls[0][1]).toEqual(TEST_MESSAGE1);
        expect(handleChange.mock.calls[1][0]).toEqual(TEST_VALUE);
        expect(handleChange.mock.calls[1][1]).toEqual(TEST_MESSAGE1);
        expect(handleChange.mock.calls[2][0]).toEqual(TEST_VALUE);
        expect(handleChange.mock.calls[2][1]).toEqual(undefined);
        expect(handleChange.mock.calls[3][0]).toEqual(TEST_VALUE);
        expect(handleChange.mock.calls[3][1]).toEqual(TEST_MESSAGE2);
        expect(handleChange.mock.calls[4][0]).toEqual(TEST_VALUE);
        expect(handleChange.mock.calls[4][1]).toEqual(TEST_MESSAGE1);
    });
});

describe('validator with compare', () => {
    const handleChange = jest.fn();
    const comparer = jest.fn();
    comparer.mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);
    const validator = jest.fn(x => comparer);

    const shallow = createShallow();
    const Component = withValidators([
        { validator: validator, message: TEST_MESSAGE1 },
    ])(TextField);

    const wrapper = shallow(<Component handleChange={handleChange} compare={COMP_VALUE} />);

    test('UI Component', () => {
        expect.assertions(3);

        expect(wrapper.find(TextField).length).toBe(1);
        expect(wrapper.find(TextField).props().error).toBe(false);
        expect(wrapper.find(TextField).props().helperText).toEqual(undefined);
    });

    test('User interactions', async () => {
        wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
        await delay(10);

        wrapper.find(TextField).simulate('change', { target: { value: TEST_VALUE } });
        await delay(10);

        expect(validator.mock.calls[0][0]).toEqual(COMP_VALUE);
        expect(comparer.mock.calls[0][0]).toEqual(TEST_VALUE);
        expect(validator.mock.calls[1][0]).toEqual(COMP_VALUE);
        expect(comparer.mock.calls[1][0]).toEqual(TEST_VALUE);

        expect(handleChange.mock.calls[0][0]).toEqual(TEST_VALUE);
        expect(handleChange.mock.calls[0][1]).toEqual(TEST_MESSAGE1);
        expect(handleChange.mock.calls[1][0]).toEqual(TEST_VALUE);
        expect(handleChange.mock.calls[1][1]).toEqual(undefined);
    });
})