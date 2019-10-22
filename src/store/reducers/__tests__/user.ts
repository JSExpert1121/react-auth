import {
    USER_LOGIN_SUCCESS,
    USER_GET_USER_SUCCESS,
    USER_GET_PROFILE_SUCCESS
} from '../../constants';

import reducer from '../user';

const initState = {
    token: ''
};

const PRIVATE_TOKEN = 'private_token';
const MOCK_USER = {
    id: 1,
    username: 'test@test.com',
    password: 'test1234'
}

describe('user reducer', () => {

    let state = undefined;
    test('Initial state', () => {
        expect(reducer(undefined, { type: '' })).toEqual(initState);
    });

    test('Login success', () => {
        state = reducer(undefined, { type: USER_LOGIN_SUCCESS, payload: PRIVATE_TOKEN });
        expect(state).toEqual({
            user: undefined,
            token: PRIVATE_TOKEN
        });
    });

    test('Getuser success', () => {
        state = reducer(state, { type: USER_GET_USER_SUCCESS, payload: MOCK_USER });
        expect(state).toEqual({
            user: MOCK_USER,
            token: PRIVATE_TOKEN
        });
    });

    test('Getprofile success', () => {
        state = reducer(state, { type: USER_GET_PROFILE_SUCCESS, payload: MOCK_USER });
        expect(state).toEqual({
            user: MOCK_USER,
            profile: MOCK_USER,
            token: PRIVATE_TOKEN
        });
    });
});