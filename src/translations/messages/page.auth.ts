import { defineMessages } from 'react-intl';

const scope = 'hitit.containers.pages.auth';

export default defineMessages({
    signupTitle: {
        id: `${scope}.signup.title`,
        defaultMessage: 'Signup'
    },
    emailLabel: {
        id: `${scope}.signup.email.label`,
        defaultMessage: 'Email Address'
    },
    emailHelper: {
        id: `${scope}.signup.email.helper`,
        defaultMessage: 'This email address will be used as your Hit! T account'
    },
    emailRequired: {
        id: `${scope}.signup.email.required`,
        defaultMessage: 'Email is required'
    },
    emailInvalid: {
        id: `${scope}.signup.email.invalid`,
        defaultMessage: 'Invalid email address'
    },
    emailUsed: {
        id: `${scope}.signup.email.used`,
        defaultMessage: 'This email address is already used'
    },
    nameLabel: {
        id: `${scope}.signup.name.label`,
        defaultMessage: 'Name'
    },
    nameHelper: {
        id: `${scope}.signup.name.helper`,
        defaultMessage: 'This will be used as your display name'
    },
    nameRequired: {
        id: `${scope}.signup.name.required`,
        defaultMessage: 'Name is required'
    },
    phoneLabel: {
        id: `${scope}.signup.phone.label`,
        defaultMessage: 'Mobile Number'
    },
    phoneRequired: {
        id: `${scope}.signup.phone.required`,
        defaultMessage: 'Phone number is required'
    },
    phoneInvalid: {
        id: `${scope}.signup.phone.invalid`,
        defaultMessage: 'Only numbers are allowed'
    },
    phoneCode: {
        id: `${scope}.signup.phone.code.label`,
        defaultMessage: 'Verification Code'
    },
    getcode: {
        id: `${scope}.signup.phone.getcode`,
        defaultMessage: 'Get Code'
    },
    gotCode: {
        id: `${scope}.signup.phone.code.notrecv.alert`,
        defaultMessage: "Didn't you get a verification code?"
    },
    phoneResend: {
        id: `${scope}.signup.phone.resend`,
        defaultMessage: '[Resend code]'
    },
    phoneTryOther: {
        id: `${scope}.signup.phone.useother`,
        defaultMessage: '[Authenticate with different number]'
    },
    phoneVerify: {
        id: `${scope}.signup.phone.code.verify`,
        defaultMessage: 'Verify Code'
    },
    phoneVerified: {
        id: `${scope}.signup.phone.verified`,
        defaultMessage: 'Phone was verified'
    },
    phoneMismatch: {
        id: `${scope}.signup.phone.code.mismatch`,
        defaultMessage: 'Verification Code mismatch'
    },
    passLabel: {
        id: `${scope}.signup.pass.label`,
        defaultMessage: 'Password'
    },
    passHelper: {
        id: `${scope}.signup.pass.helper`,
        defaultMessage: 'This will be used as your sign-in password'
    },
    passRequired: {
        id: `${scope}.signup.pass.required`,
        defaultMessage: 'Thie field is required'
    },
    passInvalid: {
        id: `${scope}.signup.pass.invalid`,
        defaultMessage: 'Invalid password format'
    },
    passShort: {
        id: `${scope}.signup.pass.short`,
        defaultMessage: 'Password must be at least 8 characters long'
    },
    passLong: {
        id: `${scope}.signup.pass.long`,
        defaultMessage: 'Password can contain 24 characters at the most'
    },
    confirmLabel: {
        id: `${scope}.signup.confirm.label`,
        defaultMessage: 'Confirm password'
    },
    passMismatch: {
        id: `${scope}.signup.pass.mismatch`,
        defaultMessage: 'Passwords mismatch'
    },
    signup: {
        id: `${scope}.signup.submit`,
        defaultMessage: "Sign Up"
    },
    tac: {
        id: `${scope}.signup.tac`,
        defaultMessage: "Terms and Conditions"
    },
    optTacTitle: {
        id: `${scope}.signup.optTitle`,
        defaultMessage: "Show More"
    },
    agreement: {
        id: `${scope}.signup.agreement`,
        defaultMessage: "and I agree to the terms and conditions described in "
    },
    manDesc: {
        id: `${scope}.signup.mandesc`,
        defaultMessage: "Please read Hit It’s Terms and Conditions carefully before you create a Hit It Account. "
    },
    optDesc: {
        id: `${scope}.signup.optdesc`,
        defaultMessage: "Please read the following options carefully before you create a Hit It Account. "
    },
    agreeMandatory: {
        id: `${scope}.signup.agree.mandatory`,
        defaultMessage: "[ Mandatory ] I am 14 years old or older"
    },
    agreeOptional: {
        id: `${scope}.signup.agree.optional`,
        defaultMessage: "[ Optional ]"
    },
    signupCaption: {
        id: `${scope}.signup.caption`,
        defaultMessage: 'Create your Hit! T Account'
    },
    resetTitle: {
        id: `${scope}.reset.title`,
        defaultMessage: 'Reset password'
    },
    resetCaption: {
        id: `${scope}.reset.caption`,
        defaultMessage: 'Reset your password'
    },
    resetButton: {
        id: `${scope}.reset.submit`,
        defaultMessage: 'Reset'
    },
    loginTitle: {
        id: `${scope}.login.title`,
        defaultMessage: 'Login'
    },
    forgetPass: {
        id: `${scope}.login.forgot.password`,
        defaultMessage: 'Forgot password?'
    },
    pleaseSignup: {
        id: `${scope}.login.signup`,
        defaultMessage: "Don't have an account? Sign Up"
    },
    signin: {
        id: `${scope}.login.signin`,
        defaultMessage: "Sign in"
    },
    loginCaption: {
        id: `${scope}.login.caption`,
        defaultMessage: "Log in with your Hit! T account"
    }
});