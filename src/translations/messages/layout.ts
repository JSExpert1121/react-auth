import { defineMessages } from 'react-intl';

const scope = 'hitit.containers.layout';
export default defineMessages({
    profile: {
        id: `${scope}.header.profile`,
        defaultMessage: 'Profile'
    },
    notify: {
        id: `${scope}.header.notification`,
        defaultMessage: 'Notifications'
    },
    myaccount: {
        id: `${scope}.header.myaccount`,
        defaultMessage: 'Setting'
    },
    login: {
        id: `${scope}.header.login`,
        defaultMessage: 'LOGIN'
    },
    logout: {
        id: `${scope}.header.logout`,
        defaultMessage: 'LOG OUT'
    },
    map: {
        id: `${scope}.header.map`,
        defaultMessage: 'GOTO MAP'
    }
});