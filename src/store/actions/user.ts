/**
 * @name GlobalAction
 * @description user management. sign up, sign in, reset password, ...
 * @version 0.1 (only skeleton)
 * @version 0.5 (signup)
 * @version 1.0 (signup/login/logout)
 * @todo according to spec
 * @author Darko
 */
import { User, UserProfile } from 'types/user';
import * as MemberApi from 'service/member';
import { Gender } from 'types/global';

import {
    USER_LOGIN_SUCCESS,
    USER_GET_USER_SUCCESS,
    USER_UPDATE_USER_SUCCESS,
    USER_GET_PROFILE_SUCCESS
} from '../constants';

export const loginSuccess = (token: string) => ({
    type: USER_LOGIN_SUCCESS,
    payload: token
});

export const getuserSuccess = (user: User) => ({
    type: USER_GET_USER_SUCCESS,
    payload: user
});

export const getprofileSuccess = (data: UserProfile) => ({
    type: USER_GET_PROFILE_SUCCESS,
    payload: data
});

export const updateUserSuccess = (user: User) => ({
    type: USER_UPDATE_USER_SUCCESS,
    payload: user
});

const clearLogin = dispatch => {
    dispatch(loginSuccess(undefined));
    dispatch(getuserSuccess(undefined));
    dispatch(getprofileSuccess(undefined));
}

let timeHandler = undefined;
export const refreshToken = () => async dispatch => {
    const newToken = await MemberApi.refresh();
    dispatch(loginSuccess(newToken));
    if (newToken) {
        timeHandler = setTimeout(() => dispatch(refreshToken()), 3500000);
    }
}

export const signup = (email: string, pass: string, name: string, code: string, phone: string, agrees: Array<any>) => async dispatch => {

    let data = undefined;
    data = await MemberApi.register(email, pass, name);
    // console.log(data);
    const token = await MemberApi.login(email, pass);
    dispatch(loginSuccess(token));

    data = await MemberApi.agreeTAC(token, agrees);
    data = await MemberApi.updateProfile(token, code, phone, true);

    // get user data
    data = await MemberApi.getUser(token);
    dispatch(getuserSuccess(data));

    // get user profile
    data = await MemberApi.getProfile(token);
    dispatch(getprofileSuccess(data));
}

export const login = (email: string, pass: string) => async dispatch => {
    const token = await MemberApi.login(email, pass);
    dispatch(loginSuccess(token));

    // get user data
    let data = await MemberApi.getUser(token);
    dispatch(getuserSuccess(data));

    // get user profile
    data = await MemberApi.getProfile(token);
    dispatch(getprofileSuccess(data));
}

export const logout = () => dispatch => MemberApi.logout().then(data => {
    clearLogin(dispatch);
    timeHandler && clearTimeout(timeHandler);
    timeHandler = undefined;
});

export const getUser = (token: string, id?: number) => dispatch => MemberApi.getUser(token, id).then(data => {
    dispatch(getuserSuccess(data));
    return data;
});

export const updateUser = (token: string, newMail: string, password: string, name: string, id?: number) => dispatch => MemberApi.updateUser(token, newMail, password, name, id).then(data => {
    dispatch(updateUserSuccess(data));
    return data;
});

export const deleteUser = (token: string, id?: number) => dispatch => MemberApi.deleteUser(token, id).then(data => {
    clearLogin(dispatch);
});

export const getProfile = (token: string, id?: number) => dispatch => MemberApi.getProfile(token, id).then(data => {
    dispatch(getprofileSuccess(data));
    return data;
});

export const updateProfile = (
    token: string,
    country: string,
    phone: string,
    phoneVerified: boolean,
    id?: number,
    birth?: string,
    gender?: Gender,
    photo?: string,
) => dispatch => MemberApi.updateProfile(token, country, phone, phoneVerified, id, birth, gender, photo).then(data => {
    dispatch(getprofileSuccess(data));
    return data;
});
