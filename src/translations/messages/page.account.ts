import { defineMessages } from 'react-intl';

const scope = 'hitit.containers.pages.account';
export default defineMessages({
    profileTitle: {
        id: `${scope}.profile.title`,
        defaultMessage: 'Profile'
    },
    profileGender: {
        id: `${scope}.profile.gender`,
        defaultMessage: 'Gender'
    },
    profileBirth: {
        id: `${scope}.profile.birthday`,
        defaultMessage: 'Birthday'
    },
    profileSubmit: {
        id: `${scope}.profile.submit`,
        defaultMessage: 'Update'
    },
    profileSuccess: {
        id: `${scope}.profile.success`,
        defaultMessage: 'Profile Update success'
    },
    profileError: {
        id: `${scope}.profile.error`,
        defaultMessage: 'Profile Update failed'
    },
    emailVerify: {
        id: `${scope}.profile.verify.email.notverified`,
        defaultMessage: 'Your mail address was not verified yet'
    },
    emailVerified: {
        id: `${scope}.profile.verify.email.verified`,
        defaultMessage: 'Your mail address was successfully verified'
    },
    emailVerifyFailed: {
        id: `${scope}.profile.verify.email.verifyfailed`,
        defaultMessage: 'Email verification failed'
    },
    phoneVerify: {
        id: `${scope}.profile.verify.phone.notverified`,
        defaultMessage: 'Your phone number was not verified yet'
    },
    verifyNow: {
        id: `${scope}.profile.verify`,
        defaultMessage: 'Verify Now'
    },
    emailTitle: {
        id: `${scope}.profile.verify.email.title`,
        defaultMessage: 'Email Confirmation'
    },
    phoneTitle: {
        id: `${scope}.profile.verify.phone.title`,
        defaultMessage: 'Verify your Phone'
    },
    toDashboard: {
        id: `${scope}.todashboard`,
        defaultMessage: 'Go to Dashboard'
    },
    settingTitle: {
        id: `${scope}.setting.title`,
        defaultMessage: 'Setting'
    },
    deleteAccount: {
        id: `${scope}.setting.delete.account`,
        defaultMessage: 'Delete this account'
    },
    deleteTitle: {
        id: `${scope}.setting.delete.title`,
        defaultMessage: 'Delete Account'
    },
    deletePrompt: {
        id: `${scope}.setting.delete.confirm`,
        defaultMessage: 'There will be a grace period of 7 days and that the user data will be permanently deleted thereafter'
    },
    deleteFailed: {
        id: `${scope}.setting.delete.fail`,
        defaultMessage: 'Delete account failed'
    },
    updateSuccess: {
        id: `${scope}.setting.update.success`,
        defaultMessage: 'User information updated'
    },
    updateFailed: {
        id: `${scope}.setting.update.fail`,
        defaultMessage: 'Update failed'
    }
});