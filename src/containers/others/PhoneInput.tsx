/**
 * @name PhoneInput
 * @description verified phone input
 * @version 1.0 (basic)
 * @author Darko
 */
import * as React from 'react';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles, Theme } from '@material-ui/core/styles';

// 3rd party libraries
import MuiPhoneInput from 'material-ui-phone-number';
import { MessageDescriptor, injectIntl, IntlShape } from 'react-intl';
import authMsgs from 'translations/messages/page.auth';

// apis & constants
import * as MemberApi from 'service/member';
import { SUPPORTED_COUNTRIES } from 'config/app.config';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%'
    },
    row: {
        paddingTop: theme.spacing(2),
        width: '100%'
    },
    countryCode: {
        marginTop: theme.spacing(1)
    },
    getcode: {
        height: '100%'
    },
}));

interface IPhoneInputProps {
    verify: (country: string, phone: string, flag: boolean) => void;
    setBusy: (flag: boolean) => void;
    intl: IntlShape;
    phoneNo: string;
    countryCode: string;
}

type RecvData = {
    phone: string;
    code: string;
}

export const PhoneInput: React.FC<IPhoneInputProps> = props => {

    const { intl, setBusy, verify } = props;

    const [phone, setPhone] = React.useState(`+${props.countryCode} ${props.phoneNo}`);
    const [country, setCountry] = React.useState(props.countryCode);
    const [verified, setVerified] = React.useState(false);
    const [disabled, setDisabled] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [recvCode, setRecvCode] = React.useState<RecvData[]>([]);
    const [codeMsg, setCodeMsg] = React.useState<MessageDescriptor | undefined>(undefined);

    // phone input event handlers
    const phoneChange = (value: string, data: any) => {
        if (data.dialCode === '82') {
            if (value.length > (data.dialCode.length + 2)) {
                if (value[data.dialCode.length + 2] !== '0') {
                    setPhone(value.slice(0, data.dialCode.length + 2) + '0' + value.slice(data.dialCode.length + 2));
                    setCountry(data.dialCode);
                    return;
                }
            }
        }

        setPhone(value);
        setCountry(data.dialCode);
    }

    const sendCode = async () => {
        // let lang = 'en';
        // if (country === '86') lang = 'zh';
        // else if (country === '82') lang = 'ko';
        // else if (country === '852') lang = 'zh-hk';
        // else if (country === '886') lang = 'zh-tw';
        let realNo = phone.slice(country.length + 2).replace(/[^0-9]+/g, '');   // remove all non-digit characters
        if (country === '82') realNo = realNo.replace(/^0+/g, '');              // for korean phone, remove leading '0's

        setBusy(true);
        try {
            const { response } = await MemberApi.verifyPhone(country, realNo);
            console.log(response);
            if (recvCode.some(item => phone === item.phone)) {
                setRecvCode([...recvCode, { phone, code: response }]);
            } else {
                setRecvCode([{ phone, code: response }]);
            }

            setBusy(false);
            setDisabled(true);
            setCodeMsg(undefined);
        } catch (error) {
            console.log('Signup.SendCode: ', error);
            setBusy(false);
            setCodeMsg(undefined);
        }
    }

    const verifyCode = () => {
        let realNo = phone.slice(country.length + 2).replace(/[^0-9]+/g, '');   // remove all non-digit characters
        if (country === '82') realNo = realNo.replace(/^0+/g, '');              // for korean phone, remove leading '0's
        if (recvCode.some(item => (item.phone === phone && item.code === code))) {
            setVerified(true);
            verify(country, realNo, true);
            setCodeMsg(undefined);
        } else {
            setVerified(false);
            verify(country, realNo, false);
            setCodeMsg(authMsgs.phoneMismatch);
        }
    }

    const tryOtherPhone = () => {
        setVerified(false);
        setDisabled(false);
        setCode('');
    }

    const codeChange = e => {
        setCode(e.target.value);
        setCodeMsg(undefined);
    }

    // phone helper messages
    const notVerifiedCodeHelper = handler => (
        <Box id='notverified-code-helper' style={{ display: 'inline', paddingRight: 8 }}>
            {/* {intl.formatMessage(authMsgs.gotCode)}&nbsp; */}
            <Link onClick={handler} style={{ cursor: 'pointer' }}>
                {intl.formatMessage(authMsgs.phoneResend)}
            </Link>
        </Box>
    )

    // phone helper messages
    const codeHelper = verified ? undefined : notVerifiedCodeHelper(sendCode);
    const sendable = phone.length > (country.length + 2);
    const classes = useStyles({});

    return (
        <Box className={classes.root}>
            <Box className={classes && classes.row}>
                <Grid container spacing={1} className={classes && classes.countryCode}>
                    <Grid item xs={12} sm={8}>
                        <MuiPhoneInput
                            onChange={phoneChange}
                            value={phone}
                            defaultCountry='ko'
                            disableAreaCodes
                            variant='outlined'
                            id='phone-input'
                            fullWidth
                            required
                            label={intl.formatMessage(authMsgs.phoneLabel)}
                            inputProps={{ margin: 'dense', style: { padding: '12px 14px' } }}
                            margin='dense'
                            countryCodeEditable={false}
                            disabled={disabled}
                            onlyCountries={SUPPORTED_COUNTRIES}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            fullWidth
                            id='send-code-btn'
                            variant="contained"
                            color="primary"
                            className={classes && classes.getcode}
                            disabled={!sendable || disabled}
                            onClick={sendCode}
                        >
                            {intl.formatMessage(authMsgs.getcode)}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            {disabled && (
                <Box style={{ width: '100%', paddingTop: 4 }}>
                    {!verified && (
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    id='phone-code'
                                    name='phoneCode'
                                    variant='outlined'
                                    label={intl.formatMessage(authMsgs.phoneCode)}
                                    fullWidth
                                    margin='dense'
                                    error={!!codeMsg}
                                    helperText={!!codeMsg && intl.formatMessage(codeMsg)}
                                    value={code}
                                    onChange={codeChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} style={{ paddingTop: 12, paddingBottom: 8 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    id="verify-btn"
                                    className={classes && classes.getcode}
                                    disabled={code.length !== 6}
                                    onClick={verifyCode}
                                >
                                    {intl.formatMessage(authMsgs.phoneVerify)}
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                    {codeHelper}
                    <Link id='try-otherphone-link' onClick={tryOtherPhone} style={{ cursor: 'pointer' }}>
                        {intl.formatMessage(authMsgs.phoneTryOther)}
                    </Link>{''}
                </Box>
            )}
        </Box>
    )
}

export default injectIntl(PhoneInput);