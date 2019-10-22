import { API_GATEWAY_ADDRESS } from 'config/service.config';
import { oauthClient } from './base';
import { Gender } from 'types/global';

const MEMBERSHIP_API_ROOT = API_GATEWAY_ADDRESS + '/api/v5/membership/';

export const checkEmail = (email: string) => oauthClient.get(MEMBERSHIP_API_ROOT + 'register/usernameavailable', {
    username: email
});

export const register = (email: string, password: string, name: string) => oauthClient.post(MEMBERSHIP_API_ROOT + 'register', {
    username: email,
    name: name,
    password: password
});

export const verifyPhone = (countryCode: string, phoneNo: string) => oauthClient.get(MEMBERSHIP_API_ROOT + 'profile/requestmobileverificationcode', {
    cellphonecountrycode: countryCode,
    cellphone: phoneNo,
    isunittest: 'true'
});

export const getTAC = (scope: string) => oauthClient.get(MEMBERSHIP_API_ROOT + 'profile/gettermsandconditions', {
    articlescope: scope,
});

export const login = (email: string, pass: string) => oauthClient.login(email, pass);
export const refresh = () => oauthClient.getPrivateToken();
export const logout = () => oauthClient.logout();

export const agreeTAC = (token: string, agrees: Array<any>) => oauthClient.authPost(MEMBERSHIP_API_ROOT + 'profile/savetermsandconditionagreements', token, {
    originDeviceId: "web",
    termsAndConditionAgreementResponseList: agrees,
});

export const getUser = (token: string, id?: number) => {
    const param = (id) ? { manid: id } : {};
    return oauthClient.authGet(MEMBERSHIP_API_ROOT + 'register/getuser', token, param);
}

export const updateUser = (token: string, newMail: string, password: string, name: string, id?: number) => {
    const param = (id) ? { manid: id } : {};
    return oauthClient.authPut(MEMBERSHIP_API_ROOT + 'register/updateuser', token, {
        username: newMail,
        password,
        name,
    }, param);
}

export const requestVerificationEmail = (token: string) => oauthClient.authGet(MEMBERSHIP_API_ROOT + 'register/requestverificationemail', token);
export const verifyEmail = (token: string, secToken: string, id?: number) => {
    const param = { token: secToken };
    if (id) param['manid'] = id;
    return oauthClient.authPut(MEMBERSHIP_API_ROOT + 'register/verifyemail',
        token, {}, param);
}

export const requestResetPassword = (email: string) => oauthClient.get(MEMBERSHIP_API_ROOT + 'register/requestresetpasswordemail', {
    username: email
});

export const resetPassword = (code: string, email: string, password: string) => {
    return oauthClient.put(MEMBERSHIP_API_ROOT + 'register/resetpassword', {
        username: email,
        password: password,
    }, { token: code });
}

export const deleteUser = (token: string, id?: number) => {
    const param = (id) ? { manid: id } : {};
    return oauthClient.authDelete(MEMBERSHIP_API_ROOT + 'register/deleteuser', token, param);
}

export const getProfile = (token: string, id?: number) => {
    const param = (id) ? { manid: id } : {};
    return oauthClient.authGet(MEMBERSHIP_API_ROOT + 'profile/getprofile', token, param);
}

export const updateProfile = (
    token: string,
    country: string,
    phone: string,
    phoneVerified: boolean,
    id?: number,
    birth?: string,
    gender?: Gender,
    photo?: string
) => {
    const post: { [key in string]: string | boolean } = {
        cellphoneCountryCode: country,
        cellphone: phone,
        cellphoneVerified: phoneVerified
    };

    const param = (id) ? { manid: id } : {};

    if (birth) post['datebirth'] = birth;
    if (photo) post['photoUrl'] = photo;
    if (gender) post['gender'] = gender;

    return oauthClient.authPut(MEMBERSHIP_API_ROOT + 'profile/updateprofile', token, post, param);
}

export const findUserByPhone = (countryCode: string, phoneNo: string) => oauthClient.get(MEMBERSHIP_API_ROOT + 'register/finduseridbycellphone', {
    cellphonecountrycode: countryCode,
    cellphone: phoneNo,
});