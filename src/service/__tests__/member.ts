import MockAxios from 'jest-mock-axios';
import * as MemberApi from 'service/member';

import { API_GATEWAY_ADDRESS } from 'config/service.config';
const MEMBERSHIP_API_ROOT = API_GATEWAY_ADDRESS + '/api/v5/membership/';

const REG_MAIL = 'test@test.com';
const REG_PASS = 'testuser';
const MOCK_MAIL = 'hello@test.com';
const MOCK_PASS = 'testuser128';
const MOCK_NAME = 'testuser';

const MOCK_COUNTRY_CODE = '82';
const MOCK_PHONE = '1022394923';
const MOCK_SCOPE = 'USER';

const PUBLIC_TOKEN = 'public_token';
const PRIVATE_TOKEN = 'private_token';
const SEC_TOKEN = 'security_token';
const MOCK_AGREES = [{ articlesId: 1, agreed: true }, { articlesId: 2, agreed: true }];
const MOCK_ROLES = 'User';
const MOCK_CODE = '123456';

// jest.mock('axios');
jest.mock('service/base');

describe('service/member', () => {
    afterEach(() => {
        MockAxios.reset();
    })

    const fnSuc = jest.fn();
    const fnFail = jest.fn();

    test('checkEmail', () => {

        MemberApi.checkEmail(MOCK_MAIL).then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/usernameavailable', {
            headers: {
                Authorization: `Bearer ${PUBLIC_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: { username: MOCK_MAIL }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('register', () => {
        MemberApi.register(MOCK_MAIL, MOCK_PASS, MOCK_NAME).then(fnSuc).catch(fnFail);

        expect(MockAxios.post).toHaveBeenCalled();
        expect(MockAxios.post).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register', {
            username: MOCK_MAIL,
            name: MOCK_NAME,
            password: MOCK_PASS
        }, {
            headers: {
                Authorization: `Bearer ${PUBLIC_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {}
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('verifyPhone', () => {
        MemberApi.verifyPhone(MOCK_COUNTRY_CODE, MOCK_PHONE).then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/requestmobileverificationcode', {
            headers: {
                Authorization: `Bearer ${PUBLIC_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                cellphonecountrycode: MOCK_COUNTRY_CODE,
                cellphone: MOCK_PHONE,
                isunittest: 'true'
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('login error', () => {
        return MemberApi.login(MOCK_MAIL, MOCK_PASS).then(data => {
        }).catch(error => {
            expect(error).toEqual('wrong user or password')
        })
    });

    test('login success', () => {
        return MemberApi.login(REG_MAIL, REG_PASS).then(data => {
            expect(data).toEqual(PRIVATE_TOKEN);
        }).catch(error => {
        })
    });

    test('refresh token', () => {
        return MemberApi.refresh().then(data => {
            expect(data).toEqual(PRIVATE_TOKEN);
        })
    });

    test('logout', () => {
        MemberApi.logout();
    });

    test('refresh token after logout', () => {
        return MemberApi.refresh().then(data => {
            expect(data).toBeFalsy();
        })
    });

    test('getTAC', () => {
        MemberApi.getTAC(MOCK_SCOPE).then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/gettermsandconditions', {
            headers: {
                Authorization: `Bearer ${PUBLIC_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                articlescope: MOCK_SCOPE,
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('agreeTAC', () => {
        MemberApi.agreeTAC(PRIVATE_TOKEN, MOCK_AGREES).then(fnSuc).catch(fnFail);

        expect(MockAxios.post).toHaveBeenCalled();
        expect(MockAxios.post).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/savetermsandconditionagreements', {
            originDeviceId: 'web',
            termsAndConditionAgreementResponseList: MOCK_AGREES
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {}
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('getUser', () => {
        MemberApi.getUser(PRIVATE_TOKEN).then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/getuser', {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('getUser with id', () => {
        MemberApi.getUser(PRIVATE_TOKEN, 100).then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/getuser', {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                manid: 100,
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('updateUser', () => {
        MemberApi.updateUser(PRIVATE_TOKEN, MOCK_MAIL, MOCK_PASS, MOCK_NAME).then(fnSuc).catch(fnFail);

        expect(MockAxios.put).toHaveBeenCalled();
        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/updateuser', {
            username: MOCK_MAIL,
            password: MOCK_PASS,
            name: MOCK_NAME,
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {}
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('updateUser with manid', () => {
        MemberApi.updateUser(PRIVATE_TOKEN, MOCK_MAIL, MOCK_PASS, MOCK_NAME, 100).then(fnSuc).catch(fnFail);

        expect(MockAxios.put).toHaveBeenCalled();
        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/updateuser', {
            username: MOCK_MAIL,
            password: MOCK_PASS,
            name: MOCK_NAME,
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                manid: 100
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('requestVerificationEmail', () => {
        MemberApi.requestVerificationEmail(PRIVATE_TOKEN).then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/requestverificationemail', {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {}
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('verifyEmail', () => {
        MemberApi.verifyEmail(PRIVATE_TOKEN, SEC_TOKEN).then(fnSuc).catch(fnFail);

        expect(MockAxios.put).toHaveBeenCalled();
        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/verifyemail', {
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                token: SEC_TOKEN
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('verifyEmail with id', () => {
        MemberApi.verifyEmail(PRIVATE_TOKEN, SEC_TOKEN, 100).then(fnSuc).catch(fnFail);

        expect(MockAxios.put).toHaveBeenCalled();
        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/verifyemail', {
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                token: SEC_TOKEN,
                manid: 100
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });


    test('requestResetPassword', () => {
        MemberApi.requestResetPassword('user@test.com').then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/requestresetpasswordemail', {
            headers: {
                Authorization: `Bearer ${PUBLIC_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                username: 'user@test.com',
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('resetPassword', () => {
        MemberApi.resetPassword(MOCK_CODE, MOCK_MAIL, MOCK_PASS).then(fnSuc).catch(fnFail);

        expect(MockAxios.put).toHaveBeenCalled();
        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/resetpassword', {
            username: MOCK_MAIL,
            password: MOCK_PASS,
        }, {
            headers: {
                Authorization: `Bearer ${PUBLIC_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: { token: MOCK_CODE }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('deleteUser', () => {
        MemberApi.deleteUser(PRIVATE_TOKEN).then(fnSuc).catch(fnFail);

        expect(MockAxios.delete).toHaveBeenCalled();
        expect(MockAxios.delete).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/deleteuser', {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {}
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('deleteUser with id', () => {
        MemberApi.deleteUser(PRIVATE_TOKEN, 100).then(fnSuc).catch(fnFail);

        expect(MockAxios.delete).toHaveBeenCalled();
        expect(MockAxios.delete).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/deleteuser', {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                manid: 100,
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('getProfile', () => {
        MemberApi.getProfile(PRIVATE_TOKEN).then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/getprofile', {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {}
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('getProfile with id', () => {
        MemberApi.getProfile(PRIVATE_TOKEN, 100).then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/getprofile', {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                manid: 100,
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('findUserByPhone', () => {
        MemberApi.findUserByPhone(MOCK_COUNTRY_CODE, MOCK_PHONE).then(fnSuc).catch(fnFail);

        expect(MockAxios.get).toHaveBeenCalled();
        expect(MockAxios.get).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'register/finduseridbycellphone', {
            headers: {
                Authorization: `Bearer ${PUBLIC_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                cellphonecountrycode: MOCK_COUNTRY_CODE,
                cellphone: MOCK_PHONE,
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });
});

const MOCK_ID = 320;
const MOCK_BIRTH = '1970-06-17';
const MOCK_URL = 'https://google.com/000.png';
const MOCK_GENDER = 'FEMALE';

describe('member api - updateProfile', () => {

    const fnSuc = jest.fn();
    const fnFail = jest.fn();

    test('updateProfile with countryCode, phoneNo', () => {
        MemberApi.updateProfile(PRIVATE_TOKEN, MOCK_COUNTRY_CODE, MOCK_PHONE, true).then(fnSuc).catch(fnFail);
        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/updateprofile', {
            cellphoneCountryCode: MOCK_COUNTRY_CODE,
            cellphone: MOCK_PHONE,
            cellphoneVerified: true
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {}
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('updateProfile with countryCode, phoneNo, manid', () => {
        MemberApi.updateProfile(PRIVATE_TOKEN, MOCK_COUNTRY_CODE, MOCK_PHONE, true, MOCK_ID).then(fnSuc).catch(fnFail);

        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/updateprofile', {
            cellphoneCountryCode: MOCK_COUNTRY_CODE,
            cellphone: MOCK_PHONE,
            cellphoneVerified: true
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                manid: MOCK_ID
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('updateProfile with countryCode, phoneNo, manid, birthday', () => {
        MemberApi.updateProfile(PRIVATE_TOKEN, MOCK_COUNTRY_CODE, MOCK_PHONE, true, MOCK_ID, MOCK_BIRTH).then(fnSuc).catch(fnFail);

        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/updateprofile', {
            cellphoneCountryCode: MOCK_COUNTRY_CODE,
            cellphone: MOCK_PHONE,
            cellphoneVerified: true,
            datebirth: MOCK_BIRTH
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                manid: MOCK_ID,
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('updateProfile with countryCode, phoneNo, manid, birthday and photo', () => {
        MemberApi.updateProfile(PRIVATE_TOKEN, MOCK_COUNTRY_CODE, MOCK_PHONE, true, MOCK_ID, MOCK_BIRTH, undefined, MOCK_URL).then(fnSuc).catch(fnFail);

        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/updateprofile', {
            cellphoneCountryCode: MOCK_COUNTRY_CODE,
            cellphone: MOCK_PHONE,
            cellphoneVerified: true,
            datebirth: MOCK_BIRTH,
            photoUrl: MOCK_URL
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                manid: MOCK_ID,
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('updateProfile with countryCode, phoneNo, manid, birthday and gender', () => {
        MemberApi.updateProfile(PRIVATE_TOKEN, MOCK_COUNTRY_CODE, MOCK_PHONE, true, MOCK_ID, MOCK_BIRTH, MOCK_GENDER).then(fnSuc).catch(fnFail);

        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/updateprofile', {
            cellphoneCountryCode: MOCK_COUNTRY_CODE,
            cellphone: MOCK_PHONE,
            cellphoneVerified: true,
            datebirth: MOCK_BIRTH,
            gender: MOCK_GENDER
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                manid: MOCK_ID,
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });

    test('updateProfile with all data', () => {
        MemberApi.updateProfile(PRIVATE_TOKEN, MOCK_COUNTRY_CODE, MOCK_PHONE, true, MOCK_ID, MOCK_BIRTH, MOCK_GENDER, MOCK_URL).then(fnSuc).catch(fnFail);

        expect(MockAxios.put).toHaveBeenCalledWith(
            MEMBERSHIP_API_ROOT + 'profile/updateprofile', {
            cellphoneCountryCode: MOCK_COUNTRY_CODE,
            cellphone: MOCK_PHONE,
            cellphoneVerified: true,
            datebirth: MOCK_BIRTH,
            photoUrl: MOCK_URL,
            gender: MOCK_GENDER
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_TOKEN}`,
                DEVICETYPE: 'web',
                DEVICEUUID: '0011223344',
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: 'en'
            },
            params: {
                manid: MOCK_ID,
            }
        }
        );

        MockAxios.mockResponse({
            data: {},
            status: 200
        });

        expect(fnSuc).toHaveBeenCalledWith({});
        expect(fnFail).not.toHaveBeenCalled();
    });
})