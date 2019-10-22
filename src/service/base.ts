import Axios from 'axios';
import ClientOAuth2, { Token } from 'client-oauth2';
import * as ServiceConf from 'config/service.config';
import { DeviceUUID } from 'device-uuid';

// // general rest client
// class RestClient {
//     get = (url: string, params: object = {}) => Axios.get(url, {
//         params: params
//     }).then(res => res.data);

//     post = (url: string, data: object, params: object = {}) => Axios.post(url, data, {
//         params: params
//     }).then(res => res.data);

//     authFetch = (url: string, token: string, params: object = {}) => Axios.get(url, {
//         params: params,
//         headers: { Authorization: 'Bearer ' + token }
//     }).then(res => res.data);

//     authPost = (url: string, token: string, data: object, params: object = {}) => Axios.post(url, data, {
//         params: params,
//         headers: { Authorization: 'Bearer ' + token }
//     }).then(res => res.data);
//     authUpload = (url: string, token: string, file: File) => {
//         const formData = new FormData();
//         formData.append('file', file);

//         return Axios.post(url, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 Authorization: 'Bearer ' + token
//             },
//         }).then(response => response.data);
//     };
// }

// export const restClient = new RestClient();

const AUTH_PATH = ServiceConf.API_GATEWAY_ADDRESS + '/api/oauth/token';

class OAuthClient {

    authClient: ClientOAuth2 = undefined;
    public_token: Token = undefined;
    private_token: Token = undefined;
    public_time: number = undefined;
    private_time: number = undefined;
    device_id: string = new DeviceUUID().get();
    language: string = 'en';

    // for singleton pattern
    static instance: OAuthClient = undefined;
    public static getInstance() {
        if (OAuthClient.instance) {
            return OAuthClient.instance;
        }

        OAuthClient.instance = new OAuthClient();
        return OAuthClient.instance;
    }

    // general class implementation
    private constructor() {
        this.authClient = new ClientOAuth2({
            clientId: ServiceConf.OAUTH_CLIENT_ID,
            clientSecret: ServiceConf.OAUTH_CLIENT_SECRET,
            accessTokenUri: AUTH_PATH,
            scopes: ['CLIENT']
        });
    }

    setLanguage(lang: string) {
        this.language = lang;
    }

    getPublicToken = async () => {
        this.public_token = undefined;
        this.public_token = await this.authClient.credentials.getToken();
        setTimeout(this.getPublicToken, 3500000);
        return this.public_token.accessToken;
    }

    getPrivateToken = async () => {
        if (this.private_token) {
            const newToken = await this.private_token.refresh();
            this.private_token = newToken;
            console.log('OAuthClient.PrivateToken: ', newToken);
            return newToken.accessToken;
        } else {
            return undefined;
        }
    }

    login = async (email: string, pass: string) => {
        this.private_token = undefined;
        this.private_token = await this.authClient.owner.getToken(email, pass);
        console.log('OAuthClient.PrivateToken: ', this.private_token);
        return this.private_token.accessToken;
    }

    logout = async () => {
        this.private_token = undefined;
    }

    checkToken = async () => {
        if (!this.public_token) {
            await this.getPublicToken();
        }
    }

    get = async (url: string, params: object = {}) => {
        await this.checkToken();
        const { data } = await Axios.get(url, {
            params: params,
            headers: {
                Authorization: 'Bearer ' + this.public_token.accessToken,
                DEVICETYPE: 'web',
                DEVICEUUID: this.device_id,
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: this.language
            }
        });

        console.log(this.language);
        return data;
    }

    post = async (url: string, post: object, params: object = {}) => {
        await this.checkToken();
        const { data } = await Axios.post(url, post, {
            params: params,
            headers: {
                Authorization: 'Bearer ' + this.public_token.accessToken,
                DEVICETYPE: 'web',
                DEVICEUUID: this.device_id,
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: this.language
            }
        });

        return data;
    }

    put = async (url: string, post: object, params: object = {}) => {
        await this.checkToken();
        const { data } = await Axios.put(url, post, {
            params: params,
            headers: {
                Authorization: 'Bearer ' + this.public_token.accessToken,
                DEVICETYPE: 'web',
                DEVICEUUID: this.device_id,
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: this.language
            }
        });

        return data;
    }

    delete = async (url: string, params: object = {}) => {
        await this.checkToken();
        const { data } = await Axios.delete(url, {
            params,
            headers: {
                Authorization: 'Bearer ' + this.public_token.accessToken,
                DEVICETYPE: 'web',
                DEVICEUUID: this.device_id,
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: this.language
            }
        });

        return data;
    }

    authGet = async (url: string, token: string, params: object = {}) => {
        const { data } = await Axios.get(url, {
            params: params,
            headers: {
                Authorization: 'Bearer ' + token,
                DEVICETYPE: 'web',
                DEVICEUUID: this.device_id,
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: this.language
            }
        });

        return data;
    }

    authPost = async (url: string, token: string, post: object, params: object = {}) => {
        const { data } = await Axios.post(url, post, {
            params: params,
            headers: {
                Authorization: 'Bearer ' + token,
                DEVICETYPE: 'web',
                DEVICEUUID: this.device_id,
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: this.language
            }
        });

        return data;
    }

    authPut = async (url: string, token: string, post: object, params: object = {}) => {
        const { data } = await Axios.put(url, post, {
            params: params,
            headers: {
                Authorization: 'Bearer ' + token,
                DEVICETYPE: 'web',
                DEVICEUUID: this.device_id,
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: this.language
            }
        });

        return data;
    }

    authDelete = async (url: string, token: string, params: object = {}) => {
        const { data } = await Axios.delete(url, {
            params: params,
            headers: {
                Authorization: 'Bearer ' + token,
                DEVICETYPE: 'web',
                DEVICEUUID: this.device_id,
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: this.language
            }
        });

        return data;
    }

    authUpload = async (url: string, token: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await Axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token,
                DEVICETYPE: 'web',
                DEVICEUUID: this.device_id,
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: this.language
            },
        });

        return data;
    }
}

export const oauthClient = OAuthClient.getInstance();