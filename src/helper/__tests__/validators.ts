import {
    isValidEmail,
    isRequired,
    isNumber,
    isValidLengthMin,
    isValidLengthMax,
    isValidChar,
    isPasswordMatched,
} from '../validators';

describe('email validator', () => {
    test("email address can't include (,),[,],<,>,\\,", async () => {
        expect.assertions(10);
        expect(await isValidEmail('1(@test.com')).toBe(false);
        expect(await isValidEmail('1)@test.com')).toBe(false);
        expect(await isValidEmail('1[@test.com')).toBe(false);
        expect(await isValidEmail('1]@test.com')).toBe(false);
        expect(await isValidEmail('1<@test.com')).toBe(false);
        expect(await isValidEmail('1>@test.com')).toBe(false);
        expect(await isValidEmail('1\\@test.com')).toBe(false);
        expect(await isValidEmail('1,@test.com')).toBe(false);
        expect(await isValidEmail('1+@test.com')).toBe(true);
        expect(await isValidEmail('1-@test.com')).toBe(true);
    });

    test("email address can't include . at the start", async () => {
        expect.assertions(2);
        try {
            expect(await isValidEmail('.test@test.com')).toBe(false);
            expect(await isValidEmail('1.test@test.com')).toBe(true);
        } catch (error) {
            expect(error).toMatch('error');
        }
    });

    test('email address should include @ character', async () => {
        expect.assertions(2);
        try {
            let res = await isValidEmail('test.com');
            expect(res).toBe(false);
            expect(await isValidEmail('1@test.com')).toBe(true);
        } catch (error) {
            expect(error).toMatch('error');
        }
    });

    test('top domain name should have at least 2 characters of alphabets', async () => {
        expect.assertions(4);
        expect(await isValidEmail('test@123.ab')).toBe(true);
        expect(await isValidEmail('test@123.abc')).toBe(true);
        expect(await isValidEmail('test@123.a')).toBe(false);
        expect(await isValidEmail('test@123.123')).toBe(false);
    });

    test('domain name can include alphabets and digits', async () => {
        expect.assertions(6);
        expect(await isValidEmail('test@123.ab')).toBe(true);
        expect(await isValidEmail('test@kcG.ab')).toBe(true);
        expect(await isValidEmail('test@1t.ab')).toBe(true);
        expect(await isValidEmail('test@1.ab')).toBe(true);
        expect(await isValidEmail('test@z.ab')).toBe(true);
        expect(await isValidEmail('test@z.ab')).toBe(true);
    });

    test('domain name should have at least one character', async () => {
        expect.assertions(1);
        expect(await isValidEmail('test@.ab')).toBe(false);
    });
});

describe('required validator', () => {
    test('required field should be a non-empty string', async () => {
        expect.assertions(3);
        expect(await isRequired(undefined)).toBe(false);
        expect(await isRequired('')).toBe(false);
        expect(await isRequired('hello')).toBe(true);
    });
});

describe('isNumber validator', () => {
    test('number field cannot include non-digit characters', async () => {
        expect.assertions(3);
        expect(await isNumber('123')).toBe(true);
        expect(await isNumber('1.5')).toBe(false);
        expect(await isNumber('1a5')).toBe(false);
    });
});

describe('minimum length validator', () => {
    test('should return if the given string length is larger than the give value', async () => {
        expect.assertions(2);
        expect(await isValidLengthMin(6)('hello')).toBe(false);
        expect(await isValidLengthMin(5)('hello')).toBe(true);
    });
});

describe('maximum length validator', () => {
    test('should return if the given string length is smaller than the give value', async () => {
        expect.assertions(2);
        expect(await isValidLengthMax(5)('hello')).toBe(true);
        expect(await isValidLengthMax(4)('hello')).toBe(false);
    });
});

describe('valid characters validator', () => {
    test('should only include characters in the given charset', async () => {
        expect.assertions(1);
        expect(await isValidChar('~`!@#$%^&*()_+=[\]\\{}|;\':",./<>?abA')).toBe(true);
    });
});

describe('match validator', () => {
    test('should return if the give two strings are same', async () => {
        expect.assertions(2);
        expect(await isPasswordMatched('hello')('hello')).toBe(true);
        expect(await isPasswordMatched('hello')('world')).toBe(false);
    });
});