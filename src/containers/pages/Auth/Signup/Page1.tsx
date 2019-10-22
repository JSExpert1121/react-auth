/**
 * @name SignupPage
 * @description Page for user registration. email/name/password/phone
 * @version 1.2
 * @todo API integration
 * @todo Terms and Conditions
 * @author Darko
 */
import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material ui components & icons
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import AccountCircleOutlined from '@material-ui/icons/AccountCircleOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// 3rd party libraries
import { MessageDescriptor, injectIntl, IntlShape } from 'react-intl';
import messages from 'translations/messages/page.auth';
import globalMsgs from 'translations/messages/global';

// custom components
import PhoneInput from 'containers/others/PhoneInput';

// actions & apis & types
import * as MemberApi from 'service/member';

// input elements with custom validations
import { EmailInput, NameInput, PassConfirmInput } from 'components/TextInput';


// component styles
const styles = (theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(4, 2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 512
    },
    form: {
        display: 'flex',
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 548
    },
    busy: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.dark,
    },
    content: {
        width: '100%',
        textAlign: 'left',
        padding: theme.spacing(1),
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
    },
    row: {
        paddingTop: theme.spacing(2),
    },
    countryCode: {
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(1, 0),
        minWidth: 120,
        height: 'calc(100% - 12px)'
    },
    getcode: {
        height: '100%'
    },
    link: {
        cursor: 'pointer'
    },
    modal: {
        width: '50%',
        height: '80%'
    }
});

// component props and states
export interface ISignupPage1Props extends StyledComponentProps {
    goNext: (email: string, name: string, password: string, confirm: string, countryCode: string, phoneNo: string, phoneVerified: boolean) => void;
    intl: IntlShape;
}

interface ISignupPage1State {
    isBusy: boolean;
    valid: boolean;
    email: string;
    emailMsg?: MessageDescriptor;
    name: string;
    nameMsg?: MessageDescriptor;
    password: string;
    passMsg?: MessageDescriptor;
    confirm: string;
    confirmMsg?: MessageDescriptor;
    countryCode: string;
    phoneNo: string;
    phoneVerified: boolean;
    emailAvailable: boolean;
    showPassword: boolean;
}

export class SignupPage1 extends React.Component<ISignupPage1Props, ISignupPage1State> {
    constructor(props: Readonly<ISignupPage1Props>) {
        super(props);

        this.state = {
            isBusy: false,
            valid: true,
            email: '',
            emailMsg: undefined,
            name: '',
            nameMsg: undefined,
            password: '',
            passMsg: undefined,
            confirm: '',
            confirmMsg: undefined,
            countryCode: '82',
            phoneNo: '',
            phoneVerified: false,
            emailAvailable: false,
            showPassword: false
        }
    }

    // email input event handler
    emailChange = (value: string, message: MessageDescriptor) => {
        this.setState({
            email: value,
            emailMsg: message
        });
    }

    emailBlur = async () => {
        if (this.state.emailMsg || this.state.email.length === 0) return;
        this.setState({ isBusy: true });
        try {
            await MemberApi.checkEmail(this.state.email);
            this.setState({
                isBusy: false,
                emailAvailable: true
            });
        } catch (error) {
            this.setState({
                emailMsg: messages.emailUsed,
                emailAvailable: false,
                isBusy: false
            });
        }
    }

    // name input event handler
    nameChange = (value: string, message: MessageDescriptor) => {
        this.setState({
            name: value,
            nameMsg: message
        });
    }

    // password input event handlers
    passChange = (value: string, message: MessageDescriptor) => {
        if (message) {
            this.setState({
                password: value,
                passMsg: message
            });
        } else {
            this.setState({
                password: value,
                passMsg: undefined,
                confirmMsg: undefined
            });
        }
    }

    confirmChange = (value: string, message: MessageDescriptor) => {
        if (message) {
            this.setState({
                confirm: value,
                confirmMsg: message
            });
        } else {
            this.setState({
                confirm: value,
                passMsg: undefined,
                confirmMsg: undefined
            });
        }
    }

    togglePasswordVisibility = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    // phone verified event handler(from child component)
    handlePhone = (country: string, phone: string, verified: boolean) => {
        this.setState({
            phoneNo: phone,
            phoneVerified: verified,
            countryCode: country
        });
    }

    // next page(TAC)
    next = () => {
        const { email, name, password, confirm, countryCode, phoneNo, phoneVerified } = this.state;
        this.props.goNext(email, name, password, confirm, countryCode, phoneNo, phoneVerified);
    }

    setBusy = (busy: boolean) => {
        this.setState({ isBusy: busy });
    }

    render() {
        const { classes, intl } = this.props;
        const { isBusy, emailMsg, email, name, nameMsg,
            password, passMsg, confirm, confirmMsg, countryCode,
            phoneNo, phoneVerified, emailAvailable, showPassword
        } = this.state;

        // enable signup button
        const joinable = emailAvailable && !nameMsg && !passMsg && !confirmMsg && phoneVerified && password.length > 0 && confirm.length > 0;

        return (
            <Paper square className={classes && classes.root}>
                <CssBaseline />
                <FormControl className={classes && classes.form}>
                    <Avatar className={classes && classes.avatar}>
                        <AccountCircleOutlined />
                    </Avatar>
                    <Typography component="h1" variant='h5'>
                        {intl.formatMessage(messages.signupCaption)}
                    </Typography>
                    <Box className={classes && classes.content}>
                        <LinearProgress id='busy-indicator' className={classes && classes.busy} style={{ visibility: isBusy ? 'visible' : 'hidden' }} />
                        <Box>
                            <EmailInput
                                id='email'
                                name='email'
                                value={email}
                                type='email'
                                autoFocus
                                label={intl.formatMessage(messages.emailLabel)}
                                helperText={intl.formatMessage(messages.emailHelper)}
                                handleChange={this.emailChange}
                                message={emailMsg}
                                onBlur={this.emailBlur}
                            />
                        </Box>
                        <Box className={classes && classes.row}>
                            <NameInput
                                id='name'
                                name='name'
                                value={name}
                                label={intl.formatMessage(messages.nameLabel)}
                                helperText={intl.formatMessage(messages.nameHelper)}
                                handleChange={this.nameChange}
                                message={nameMsg}
                            />
                        </Box>
                        <Box className={classes && classes.row} style={{ flex: 1 }}>
                            <Box style={{ display: 'flex' }}>
                                <Grid container spacing={1} style={{ flex: 1 }}>
                                    <Grid item xs={6}>
                                        <PassConfirmInput
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            label={intl.formatMessage(messages.passLabel)}
                                            helperText={intl.formatMessage(messages.passHelper)}
                                            compare={confirm}
                                            handleChange={this.passChange}
                                            message={passMsg}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <PassConfirmInput
                                            id="confirm-password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={confirm}
                                            label={intl.formatMessage(messages.confirmLabel)}
                                            handleChange={this.confirmChange}
                                            compare={password}
                                            message={confirmMsg}
                                        />
                                    </Grid>
                                </Grid>
                                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                                    <IconButton
                                        edge="end"
                                        aria-label="password-visibility"
                                        name="passwordVisibility"
                                        id="passwordVisibility"
                                        style={{ paddingTop: 16 }}
                                        onClick={this.togglePasswordVisibility}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                        <PhoneInput
                            setBusy={this.setBusy}
                            verify={this.handlePhone}
                            phoneNo={phoneNo}
                            countryCode={countryCode}
                        />
                        <Grid container className={classes.row}>
                            <Grid item xs={12}>
                                <Button
                                    id='next-button'
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes && classes.submit}
                                    disabled={!joinable}
                                    onClick={this.next}
                                >
                                    {intl.formatMessage(globalMsgs.next)}
                                </Button>
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: 'center', paddingTop: 8 }}>
                                <Link to="/login" component={RouterLink}>
                                    {intl.formatMessage(messages.loginCaption)}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </FormControl>
            </Paper >
        );
    }
}

export default injectIntl(withStyles(styles)(SignupPage1));