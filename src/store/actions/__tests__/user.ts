import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {
    USER_LOGIN_SUCCESS,
    USER_GET_USER_SUCCESS,
    USER_GET_PROFILE_SUCCESS,
    USER_UPDATE_USER_SUCCESS
} from '../../constants';

import * as UserActions from '../user';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const PRIVATE_TOKEN = 'private_token';
const MOCK_REGUSER = 'test@test.com';
const MOCK_NAME = 'testuser';

jest.mock('service/member');

describe('User Actions', () => {

    test('Login success', () => {
        const expectedAction = {
            type: USER_LOGIN_SUCCESS,
            payload: PRIVATE_TOKEN
        };

        expect(UserActions.loginSuccess(PRIVATE_TOKEN)).toEqual(expectedAction);
    });

    test('Getuser success', () => {
        const mockUser = { id: 1, name: MOCK_NAME, username: MOCK_REGUSER, enabled: true };
        const expectedAction = {
            type: USER_GET_USER_SUCCESS,
            payload: mockUser
        };

        expect(UserActions.getuserSuccess(mockUser)).toEqual(expectedAction);
    });

    test('GetProfile success', () => {

        const mockProfile = {
            cellphoneCountryCode: '82',
            cellphone: '1000000000',
            emailVerified: false,
            cellphoneVerified: true
        };
        const expectedAction = {
            type: USER_GET_PROFILE_SUCCESS,
            payload: mockProfile
        };

        expect(UserActions.getprofileSuccess(mockProfile)).toEqual(expectedAction);
    });

    test('UpdateUser success', () => {
        const mockUser = { id: 1, name: MOCK_NAME, username: MOCK_REGUSER, enabled: true };
        const expectedAction = {
            type: USER_UPDATE_USER_SUCCESS,
            payload: mockUser
        };

        expect(UserActions.updateUserSuccess(mockUser)).toEqual(expectedAction);
    })
});

describe('Signup action', () => {

    let store = undefined;
    beforeEach(() => {
        store = mockStore({
            user: undefined,
            token: undefined
        });
        jest.useRealTimers();
    });

    test('existing user', async () => {
        try {
            await store.dispatch(UserActions.signup('user2@test.com', '123456789', 'testuser', '82', '1084723942', []));
        } catch (error) {
            expect(store.getActions()).toHaveLength(0);
            expect(error).toEqual('This user already exists');
        }
    });

    test('existing phone', async () => {
        const email = 'user3@test.com';
        try {
            await store.dispatch(UserActions.signup(email, '123456789', 'testuser', '82', '1023842234', []));
        } catch (error) {
            expect(store.getActions()).toHaveLength(1);
            expect(store.getActions()).toContainEqual({
                type: USER_LOGIN_SUCCESS,
                payload: `${email}__${PRIVATE_TOKEN}`
            });
            expect(error).toEqual('This phone was already taken');
        }
    });

    test('new user', async () => {
        const email = 'user4@test.com';
        await store.dispatch(UserActions.signup(email, '123456789', 'testuser3', '82', '1084723942', []));
        expect(store.getActions()).toHaveLength(3);
        expect(store.getActions()).toContainEqual({
            type: USER_LOGIN_SUCCESS,
            payload: `${email}__${PRIVATE_TOKEN}`
        });
        expect(store.getActions()).toContainEqual({
            type: USER_GET_USER_SUCCESS,
            payload: {
                id: 4,
                username: email,
                name: 'testuser3',
            }
        });
        expect(store.getActions()).toContainEqual({
            type: USER_GET_PROFILE_SUCCESS,
            payload: {
                id: 4,
                username: email,
                name: 'testuser3',
                phone: '1084723942',
                country: '82',
                role: 'user',
                status: 'pending'
            }
        });
    });
});

describe('log in action', () => {
    const email1 = 'user4@test.com';
    const email2 = 'user2@test.com';
    const pass1 = '1234';
    const pass2 = 'testuser2';

    let store = undefined;
    beforeEach(() => {
        store = mockStore({
            user: undefined,
            token: undefined
        });
        jest.useRealTimers();
    });

    test('wrong username and password', async () => {
        try {
            await store.dispatch(UserActions.login(email1, pass1));
        } catch (error) {
            expect(store.getActions()).toHaveLength(0);
            expect(error).toEqual('Username or password is incorrect');
        }
    });

    test('correct username and password', async () => {
        await store.dispatch(UserActions.login(email2, pass2));
        expect(store.getActions()).toHaveLength(3);
        expect(store.getActions()).toContainEqual({
            type: USER_LOGIN_SUCCESS,
            payload: `${email2}__${PRIVATE_TOKEN}`
        });
        expect(store.getActions()).toContainEqual({
            type: USER_GET_USER_SUCCESS,
            payload: {
                id: 2,
                username: email2,
                name: 'testuser2',
            }
        });
        expect(store.getActions()).toContainEqual({
            type: USER_GET_PROFILE_SUCCESS,
            payload: {
                id: 2,
                username: email2,
                name: 'testuser2',
                phone: '17139329843',
                country: '86',
                role: 'user',
                status: 'pending'
            }
        });
    })
});

describe('refresh action - login status', () => {
    test('action call test', async () => {
        jest.useFakeTimers();
        let store = mockStore({
            user: {},
        });

        const task = store.dispatch(UserActions.refreshToken());
        jest.runOnlyPendingTimers();
        await task;
        expect(store.getActions()).toContainEqual({
            type: USER_LOGIN_SUCCESS,
            payload: 'user2@test.com__private_token'
        });
        expect(setTimeout).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3500000);
        jest.runOnlyPendingTimers();
        expect(setTimeout).toHaveBeenCalledTimes(3);
        jest.clearAllTimers();
    });
});

describe('logout action', () => {
    let store = undefined;
    beforeEach(() => {
        store = mockStore({
            user: undefined,
            token: undefined
        });
        jest.useRealTimers();
    });

    test('action call test', async () => {
        await store.dispatch(UserActions.logout());
        expect(store.getActions()).toHaveLength(3);
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
    })
});

describe('refresh action - logout status', () => {
    test('action call test', async () => {
        let store = mockStore({
            user: {},
        });
        jest.useFakeTimers();
        const task = store.dispatch(UserActions.refreshToken());
        jest.runOnlyPendingTimers();
        await task;
        expect(store.getActions()).toContainEqual({
            type: USER_LOGIN_SUCCESS,
            payload: undefined
        });
        expect(setTimeout).toHaveBeenCalledTimes(1);
    });
});

describe('getuser action', () => {
    let store = undefined;
    beforeEach(() => {
        store = mockStore({
            user: undefined,
            token: undefined
        });
        jest.useRealTimers();
    });

    test('action call test', async () => {
        const mockMail = 'user1@test.com';
        await store.dispatch(UserActions.getUser(`${mockMail}__${PRIVATE_TOKEN}`));
        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0]).toEqual({
            type: USER_GET_USER_SUCCESS,
            payload: {
                id: 1,
                username: mockMail,
                name: 'testuser1',
            }
        });
    });

    test('action call test', async () => {
        const mockMail = 'user@test.com';
        try {
            await store.dispatch(UserActions.getUser(`${mockMail}__${PRIVATE_TOKEN}`));
        } catch (error) {
            expect(store.getActions()).toHaveLength(0);
            expect(error).toEqual('Invalid token');
        }
    });
});

describe('updateuser action', () => {
    let store = undefined;
    beforeEach(() => {
        store = mockStore({
            user: undefined,
            token: undefined
        });
        jest.useRealTimers();
    });

    test('update user - existing user', async () => {
        const mockMail = 'user1@test.com';
        const newMail = 'user4@test.com';
        const passwd = '12345678';
        const name = 'user4';
        await store.dispatch(UserActions.updateUser(
            `${mockMail}__${PRIVATE_TOKEN}`,
            newMail, passwd, name
        ));

        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()).toContainEqual({
            type: USER_UPDATE_USER_SUCCESS,
            payload: {
                id: 1,
                username: newMail,
                country: '82',
                name: name,
                phone: '1023842234',
                role: 'user',
                status: 'active'
            }
        });
    });

    test('update user - invalid user', async () => {
        const mockMail = 'user@test.com';
        const newMail = 'user4@test.com';
        const passwd = '12345678';
        const name = 'user4';
        try {
            await store.dispatch(UserActions.updateUser(
                `${mockMail}__${PRIVATE_TOKEN}`,
                newMail, passwd, name
            ));
        } catch (error) {
            expect(store.getActions()).toHaveLength(0);
            expect(error).toEqual('Token is invalid');
        }
    });
});


describe('getprofile action', () => {
    let store = undefined;
    beforeEach(() => {
        store = mockStore({
            user: undefined,
            token: undefined
        });
        jest.useRealTimers();
    });

    test('action call  - valid user', async () => {
        const mockMail = 'user4@test.com';
        await store.dispatch(UserActions.getProfile(`${mockMail}__${PRIVATE_TOKEN}`));
        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0]).toEqual({
            type: USER_GET_PROFILE_SUCCESS,
            payload: {
                id: 1,
                username: 'user4@test.com',
                name: 'user4',
                phone: '1023842234',
                country: '82',
                role: 'user',
                status: 'active'
            }
        });
    });

    test('action call test with invalid user', async () => {
        const mockMail = 'user@test.com';
        try {
            await store.dispatch(UserActions.getProfile(`${mockMail}__${PRIVATE_TOKEN}`));
        } catch (error) {
            expect(store.getActions()).toHaveLength(0);
            expect(error).toEqual('Invalid token');
        }
    });
});

describe('updateprofile action', () => {
    let store = undefined;
    beforeEach(() => {
        store = mockStore({
            user: undefined,
            token: undefined
        });
        jest.useRealTimers();
    });

    test('updateprofile call test - valid mail', async () => {
        const mockMail = 'user4@test.com';
        await store.dispatch(UserActions.updateProfile(`${mockMail}__${PRIVATE_TOKEN}`, '86', '17152928280', true));
        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()[0]).toEqual({
            type: USER_GET_PROFILE_SUCCESS,
            payload: {
                id: 1,
                username: 'user4@test.com',
                name: 'user4',
                phone: '17152928280',
                country: '86',
                role: 'user',
                status: 'active'
            }
        });
    });
});

describe('deleteuser action', () => {
    let store = undefined;
    beforeEach(() => {
        store = mockStore({
            user: undefined,
            token: undefined
        });
        jest.useRealTimers();
    });

    test('deleteuser call test - valid mail', async () => {
        const mockMail = 'user4@test.com';
        await store.dispatch(UserActions.deleteUser(`${mockMail}__${PRIVATE_TOKEN}`));
        expect(store.getActions()).toHaveLength(3);
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
    });

    test('deleteuser call test - invalid mail', async () => {
        const mockMail = 'user1@test.com';
        try {
            await store.dispatch(UserActions.deleteUser(`${mockMail}__${PRIVATE_TOKEN}`));
        } catch (error) {
            expect(error).toEqual('Invalid token');
        }
    });
});
