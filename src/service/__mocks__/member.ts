
const REG_USERS = [
    { id: 0, username: 'admin@test.com', name: 'adminuser', phone: '1023842230', country: '82', password: 'rootroot', role: 'admin', status: 'active' },
    { id: 1, username: 'user1@test.com', name: 'testuser1', phone: '1023842234', country: '82', password: 'testuser1', role: 'user', status: 'active' },
    { id: 2, username: 'user2@test.com', name: 'testuser2', phone: '17139329843', country: '86', password: 'testuser2', role: 'user', status: 'pending' },
];

const ALL_TAC = [
    {
        id: 0,
        name: 'TAC 1',
        lang: 'en',
        articleScope: 'UNITTEST',
        articles: [{ id: 100, content: 'Terms and conditions 1', datePublished: '2910', state: '' }],
        enabled: true,
        mandatory: true,
        agreed: false
    },
    {
        id: 1,
        name: 'TAC 2',
        lang: 'en',
        articleScope: 'UNITTEST',
        articles: [{ id: 101, content: 'Terms and conditions 2', datePublished: '2911', state: '' }],
        enabled: true,
        mandatory: true,
        agreed: false
    },
    {
        id: 1000,
        name: 'Test TAC 1',
        lang: 'en',
        articleScope: 'UNITTEST',
        articles: [{ id: 2000, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.', datePublished: '2922', state: '' }],
        mandatory: false,
        enabled: true,
        agreed: false
    },
    {
        id: 1001,
        name: 'Test TAC 2',
        lang: 'en',
        articleScope: 'UNITTEST',
        articles: [{ id: 2001, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.', datePublished: '2922', state: '' }],
        mandatory: false,
        enabled: true,
        agreed: false
    },
    {
        id: 1002,
        name: 'Test TAC 3',
        lang: 'en',
        articleScope: 'UNITTEST',
        articles: [{ id: 2002, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.', datePublished: '2922', state: '' }],
        mandatory: false,
        enabled: true,
        agreed: false
    }
];

const PRIVATE_TOKEN = 'private_token';
const RESET_SEC_CODE = 'security_code_for_reset';

import { Gender } from 'types/global';

let private_token: string = undefined;

export const checkEmail = (email: string) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (!REG_USERS.some(user => user.username === email)) {
            resolve(true);
        } else {
            reject('This user already exists');
        }
    }, 10);
});

export const register = (email: string, password: string, name: string) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (!REG_USERS.some(user => user.username === email)) {
            REG_USERS.push({
                id: REG_USERS.length,
                username: email,
                name,
                phone: '',
                country: '',
                password: password,
                role: 'user',
                status: 'pending'
            });
            resolve(true);
        } else {
            reject('This user already exists');
        }
    }, 10);
});

export const verifyPhone = (countryCode: string, phone: string) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (countryCode === '82' || countryCode === '86') {
            resolve({ response: '102030' });
        } else {
            reject('This country is not supported');
        }
    }, 10);
});

export const getTAC = (scope: string) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (scope === 'USER') {
            resolve(ALL_TAC);
        } else if (scope === 'UNITTEST') {
            resolve(ALL_TAC.filter(item => item.mandatory));
        } else {
            reject('Invalid scope');
        }
    }, 10);
});

export const login = (email: string, pass: string) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (REG_USERS.some(user => user.username === email && user.password === pass)) {
            private_token = `${email}__${PRIVATE_TOKEN}`;
            resolve(private_token);
        } else {
            reject('Username or password is incorrect');
        }
    }, 10);
});

export const refresh = () => new Promise(resolve => {
    setTimeout(() => {
        resolve(private_token);
    }, 10);
});

export const logout = () => new Promise(resolve => {
    setTimeout(() => {
        private_token = undefined;
        resolve(true);
    }, 10);
});

export const agreeTAC = (token: string, agrees: Array<any>) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (token.endsWith(PRIVATE_TOKEN)) {
            resolve(true);
        } else {
            reject('Token is invalid');
        }
    }, 10);
});

export const getUser = (token: string, id?: number) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (token.endsWith(PRIVATE_TOKEN)) {
            if (!id) {
                const mail = token.slice(0, token.indexOf('__'));
                const matches = REG_USERS.filter(user => user.username === mail);
                if (!matches || matches.length === 0) {
                    reject('Invalid token');
                    return;
                }

                resolve({
                    id: matches[0].id,
                    username: matches[0].username,
                    name: matches[0].name,
                });
            } else {
                const matches = REG_USERS.filter(user => user.id === id);
                if (!matches || matches.length === 0) {
                    reject('Invalid user');
                    return;
                }

                const { password, ...info } = matches[0];
                resolve(info);
            }
        } else {
            reject('Token is invalid');
        }
    }, 10);
});

export const updateUser = (token: string, newMail: string, password: string, name: string, id?: number) => new Promise((resolve, reject) => {
    setTimeout(() => {
        const mail = token.slice(0, token.indexOf('__'));
        const count = REG_USERS.length;
        let user = undefined;
        for (let i = 0; i < count; i++) {
            if (REG_USERS[i].username === mail) {
                REG_USERS[i].username = newMail;
                REG_USERS[i].password = password;
                REG_USERS[i].name = name;
                user = REG_USERS[i];
                break;
            }
        }

        if (user) {
            const { password, ...info } = user;
            resolve(info);
        } else {
            reject('Token is invalid');
        }
    }, 10);
});

export const requestVerificationEmail = (token: string) => new Promise((resolve, reject) => {
    setTimeout(() => {
        const mail = token.slice(0, token.indexOf('__'));
        const matches = REG_USERS.filter(user => user.username === mail);
        if (!matches || matches.length === 0) {
            reject('Invalid token');
        } else {
            resolve(true);
        }
    }, 10);
});

export const requestResetPassword = (email: string) => new Promise((resolve, reject) => {
    setTimeout(() => {
        const matches = REG_USERS.filter(user => user.username === email);
        if (!matches || matches.length === 0) {
            reject('Invalid email');
        } else {
            if (matches[0].status === 'pending') {
                resolve({ response: 'Email is not verified. Cannot request reset password mail' });
            } else {
                resolve({ response: 'Password reset email sent' });
            }
        }
    }, 10);
});

export const resetPassword = (code: string, email: string, password: string) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (code === RESET_SEC_CODE) {
            const count = REG_USERS.length;
            let user = undefined;
            for (let i = 0; i < count; i++) {
                if (REG_USERS[i].username === email) {
                    REG_USERS[i].password = password;
                    user = REG_USERS[i];
                    break;
                }
            }
            if (user) {
                resolve({ response: 'Password reset successfully' });
            } else {
                reject('Invalid user');
            }
        } else {
            reject('Unknown response');
        }
    }, 10);
});

export const deleteUser = (token: string, id?: string, email?: string) => new Promise((resolve, reject) => {
    setTimeout(() => {
        const count = REG_USERS.length;
        const mail = token.slice(0, token.indexOf('__'));
        let user = undefined;
        for (let i = 0; i < count; i++) {
            if (REG_USERS[i].username === mail) {
                REG_USERS[i].status = 'deleted';
                user = REG_USERS[i];
                break;
            }
        }

        if (user) {
            resolve(true);
        } else {
            reject('Invalid token');
        }
    }, 10);
});

export const getProfile = (token: string, id?: number) => new Promise((resolve, reject) => {
    setTimeout(() => {
        const count = REG_USERS.length;
        const mail = token.slice(0, token.indexOf('__'));
        let user = undefined;
        for (let i = 0; i < count; i++) {
            if (REG_USERS[i].username === mail) {
                user = REG_USERS[i];
                break;
            }
        }

        if (user) {
            const { password, ...info } = user;
            resolve(info);
        } else {
            reject('Invalid token');
        }
    }, 10);
});

export const updateProfile = (
    token: string,
    country: string,
    phone: string,
    phoneVerified: boolean,
    id?: number,
    birth?: string,
    gender?: Gender,
    photo?: string
) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (REG_USERS.some(user => user.country === country && user.phone === phone)) {
            reject('This phone was already taken');
        }

        const count = REG_USERS.length;
        const mail = token.slice(0, token.indexOf('__'));
        let user = undefined;
        for (let i = 0; i < count; i++) {
            if (REG_USERS[i].username === mail) {
                REG_USERS[i].country = country;
                REG_USERS[i].phone = phone;
                user = REG_USERS[i];
                break;
            }
        }

        if (user) {
            const { password, ...rest } = user;
            resolve(rest);
        } else {
            reject('Invalid token');
        }
    }, 10);
});

export const findUserByPhone = (countryCode: string, phoneNo: string) => new Promise((resolve, reject) => {
    setTimeout(() => {
        const matches = REG_USERS.filter(user => user.country === countryCode && user.phone === phoneNo);
        if (!matches || matches.length === 0) {
            reject('User not exists');
        }

        const { password, ...info } = matches[0];
        resolve(info);
    }, 10);
});

export const verifyEmail = (token: string, secToken: string, id?: number) => new Promise((resolve, reject) => {
    setTimeout(() => {
        const mail = token.slice(0, token.indexOf('__'));
        const count = REG_USERS.length;
        let user = undefined;
        for (let i = 0; i < count; i++) {
            if (REG_USERS[i].username === mail) {
                user = REG_USERS[i];
                break;
            }
        }

        if (user) {
            resolve(true);
        } else {
            reject(false);
        }
    }, 10);
});