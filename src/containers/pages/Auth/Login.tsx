/**
 * @name LoginPage
 * @description Page for user login by email/password
 * @version 1.0
 * @todo API integration
 * @todo Remember Me
 * @author Darko
 */
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom';

// material ui components & icons
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

// i18n
import { MessageDescriptor, injectIntl, IntlShape } from 'react-intl';
import messages from 'translations/messages/page.auth';

// custom components
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import { EmailInput, PassInput } from 'components/TextInput';

// actions & apis & types
import * as GlobalActions from 'store/actions/global';
import * as UserActions from 'store/actions/user';


// export const EmailInput = withValidators([
//     { validator: isRequired, message: messages.emailRequired },
//     { validator: isValidEmail, message: messages.emailInvalid }
// ])(TextField);

// export const PassInput = withValidators([
//     { validator: isRequired, message: messages.passRequired },
//     { validator: isValidChar, message: messages.passInvalid },
// ])(TextField);


// component styles
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 512,
        minWidth: 480,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.dark,
    },
    row: {
        paddingTop: theme.spacing(2)
    },
    content: {
        width: '100%',
        textAlign: 'left',
        padding: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    busy: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
}));

interface ILoginPageProps extends RouteComponentProps {
    setTitle: (title: string) => void;
    login: (mail: string, pass: string) => Promise<void>;
    refreshToken: () => Promise<void>;
    intl: IntlShape;
}

export const LoginPage: React.FC<ILoginPageProps & withSnackbarProps> = props => {

    const classes = useStyles({});
    const [email, setEmail] = React.useState('');
    const [emailMsg, setEmailMsg] = React.useState(undefined as (MessageDescriptor | undefined));
    const [password, setPassword] = React.useState('');
    const [passMsg, setPassMsg] = React.useState(undefined as (MessageDescriptor | undefined));
    const [busy, setBusy] = React.useState(false);

    const { setTitle, intl, showMessage } = props;
    const passRef = React.createRef<any>();
    React.useEffect(() => {
        setTitle(intl.formatMessage(messages.loginTitle));
    });

    const emailChange = (value: string, message: MessageDescriptor) => {
        setEmail(value);
        setEmailMsg(message);
    }

    const passChange = (value: string, message: MessageDescriptor) => {
        setPassword(value);
        setPassMsg(message);
    }

    const handleLogin = async () => {
        const { login, history, refreshToken } = props;
        setBusy(true);
        try {
            await login(email, password);
            refreshToken();
            history.push('/user/dashboard');
        } catch (error) {
            console.log('LoginPage.Login: ', error);
            showMessage(false, 'Email or Password is incorrect.');
            setBusy(false);
        }
    }

    const mailKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            passRef.current.focus();
        }
    }

    const passKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin();
        }
    }

    const disabled = !!emailMsg || !!passMsg;

    return (
        <Paper id='container-login' square>
            <CssBaseline />
            <Box className={classes.root}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography id='caption' component="h1" variant="h5">
                    {intl.formatMessage(messages.loginCaption)}
                </Typography>
                <Box className={classes.content}>
                    <LinearProgress id='busy-indicator' className={classes.busy} style={{ visibility: busy ? 'visible' : 'hidden' }} />
                    <Box className={classes.row}>
                        <EmailInput
                            id='email'
                            name='email'
                            value={email}
                            type='email'
                            autoFocus
                            label={intl.formatMessage(messages.emailLabel)}
                            handleChange={emailChange}
                            message={emailMsg}
                            onKeyPress={mailKeyPress}
                        />
                    </Box>
                    <Box className={classes && classes.row}>
                        <PassInput
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            label={intl.formatMessage(messages.passLabel)}
                            handleChange={passChange}
                            message={passMsg}
                            onKeyPress={passKeyPress}
                            inputRef={passRef}
                        />
                    </Box>
                    <Box className={classes.row}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleLogin}
                            disabled={disabled}
                        >
                            {intl.formatMessage(messages.signin)}
                        </Button>
                    </Box>
                    <Grid container className={classes.row}>
                        <Grid item xs>
                            <Link to="/reset" component={RouterLink}>
                                {intl.formatMessage(messages.forgetPass)}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/signup" component={RouterLink}>
                                {intl.formatMessage(messages.pleaseSignup)}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Paper>
    );
}

const mapDispatchToProps = (dispatch: any) => ({
    setTitle: (title: string) => dispatch(GlobalActions.setTitle(title)),
    login: (mail: string, pass: string) => dispatch(UserActions.login(mail, pass)),
    refreshToken: () => dispatch(UserActions.refreshToken())
});

export default withSnackbar(injectIntl(connect(undefined, mapDispatchToProps)(LoginPage)));