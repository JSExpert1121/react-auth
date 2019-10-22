// @material ui components
import TextField from '@material-ui/core/TextField';

// i18n
import authMsgs from 'translations/messages/page.auth';

// custom components
import withValidators from 'components/HOCs/withValidators';
import {
    isValidEmail,
    isRequired,
    isValidChar,
    isValidLengthMin,
    isValidLengthMax,
    isPasswordMatched
} from 'helper/validators';

export const EmailInput = withValidators([
    { validator: isRequired, message: authMsgs.emailRequired },
    { validator: isValidEmail, message: authMsgs.emailInvalid }
])(TextField);

export const NameInput = withValidators([
    { validator: isRequired, message: authMsgs.nameRequired }
])(TextField);

export const PassInput = withValidators([
    { validator: isRequired, message: authMsgs.passRequired },
    { validator: isValidChar, message: authMsgs.passInvalid },
])(TextField);

export const PassConfirmInput = withValidators([
    { validator: isRequired, message: authMsgs.passRequired },
    { validator: isValidChar, message: authMsgs.passInvalid },
    { validator: isValidLengthMin(8), message: authMsgs.passShort },
    { validator: isValidLengthMax(24), message: authMsgs.passLong },
    { validator: isPasswordMatched, message: authMsgs.passMismatch },
])(TextField);