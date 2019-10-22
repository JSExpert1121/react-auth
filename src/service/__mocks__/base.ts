import Axios from 'axios';

const USER = 'test@test.com';
const PASS = 'testuser';

class OAuthClient {

    publicToken = 'public_token';
    privateToken = undefined;
    device_id = '0011223344';
    language = 'en';

    getPrivateToken = () => new Promise(resolve => {
        if (this.privateToken) {
            setTimeout(() => {
                this.privateToken = 'private_token';
                resolve(this.privateToken);
            }, 10);
        } else {
            resolve(undefined);
        }
    });

    login = (email: string, pass: string) => new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email === USER && pass === PASS) {
                this.privateToken = 'private_token';
                resolve(this.privateToken);
            } else {
                reject('wrong user or password');
            }
        }, 100);
    });

    logout = () => {
        this.privateToken = undefined;
    }

    get = (url: string, params: object = {}) => Axios.get(url, {
        params: params,
        headers: {
            Authorization: 'Bearer ' + this.publicToken,
            DEVICETYPE: 'web',
            DEVICEUUID: this.device_id,
            CLIENTVERSION: '1.0',
            DEVICELANGUAGE: this.language
        }
    }).then(res => res.data);

    post = (url: string, post: object, params: object = {}) => Axios.post(url, post, {
        params: params,
        headers: {
            Authorization: 'Bearer ' + this.publicToken,
            DEVICETYPE: 'web',
            DEVICEUUID: this.device_id,
            CLIENTVERSION: '1.0',
            DEVICELANGUAGE: this.language
        }
    }).then(res => res.data);

    put = (url: string, post: object, params: object = {}) => Axios.put(url, post, {
        params: params,
        headers: {
            Authorization: 'Bearer ' + this.publicToken,
            DEVICETYPE: 'web',
            DEVICEUUID: this.device_id,
            CLIENTVERSION: '1.0',
            DEVICELANGUAGE: this.language
        }
    }).then(res => res.data);

    delete = (url: string, params: object = {}) => Axios.delete(url, {
        params,
        headers: {
            Authorization: 'Bearer ' + this.publicToken,
            DEVICETYPE: 'web',
            DEVICEUUID: this.device_id,
            CLIENTVERSION: '1.0',
            DEVICELANGUAGE: this.language
        }
    }).then(res => res.data);

    authGet = (url: string, token: string, params: object = {}) => Axios.get(url, {
        params: params,
        headers: {
            Authorization: 'Bearer ' + token,
            DEVICETYPE: 'web',
            DEVICEUUID: this.device_id,
            CLIENTVERSION: '1.0',
            DEVICELANGUAGE: this.language
        }
    }).then(res => res.data);

    authPost = (url: string, token: string, post: object, params: object = {}) => Axios.post(url, post, {
        params: params,
        headers: {
            Authorization: 'Bearer ' + token,
            DEVICETYPE: 'web',
            DEVICEUUID: this.device_id,
            CLIENTVERSION: '1.0',
            DEVICELANGUAGE: this.language
        }
    }).then(res => res.data);


    authPut = (url: string, token: string, post: object, params: object = {}) => Axios.put(url, post, {
        params: params,
        headers: {
            Authorization: 'Bearer ' + token,
            DEVICETYPE: 'web',
            DEVICEUUID: this.device_id,
            CLIENTVERSION: '1.0',
            DEVICELANGUAGE: this.language
        }
    }).then(res => res.data);

    authDelete = (url: string, token: string, params: object = {}) => Axios.delete(url, {
        params: params,
        headers: {
            Authorization: 'Bearer ' + token,
            DEVICETYPE: 'web',
            DEVICEUUID: this.device_id,
            CLIENTVERSION: '1.0',
            DEVICELANGUAGE: this.language
        }
    }).then(res => res.data);

    authUpload = (url: string, token: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        return Axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + token,
                DEVICETYPE: 'web',
                DEVICEUUID: this.device_id,
                CLIENTVERSION: '1.0',
                DEVICELANGUAGE: this.language
            },
        }).then(res => res.data);
    }
}

export const oauthClient = new OAuthClient();