/**
 * @name ResetPage
 * @description Reset Password by email
 * @version 1.0 
 * @todo API integration
 * @author Darko
 */
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

// material ui components & icons
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles, Theme } from '@material-ui/core/styles';

// i18n
import { MessageDescriptor, injectIntl, IntlShape } from 'react-intl';
import messages from 'translations/messages/page.auth';

// custom components
import withValidators from 'components/HOCs/withValidators';
import { isValidEmail, isRequired } from 'helper/validators';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';

// actions
import * as GlobalActions from 'store/actions/global';
import * as MemberApi from 'service/member';


// input elements with custom validations
export const EmailInput = withValidators([
    { validator: isRequired, message: messages.emailRequired },
    { validator: isValidEmail, message: messages.emailInvalid }
])(TextField);

// component styles
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxWidth: 512,
        minWidth: 360,
    },
    title: {
        textAlign: 'center'
    },
    busy: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
    row: {
        paddingTop: theme.spacing(2)
    },
}));

export interface IResetPageProps extends RouteComponentProps, withSnackbarProps {
    setTitle: (title: string) => void;
    intl: IntlShape;
}

export const ResetPage: React.FC<IResetPageProps> = props => {

    const classes = useStyles({});
    const [email, setEmail] = React.useState('');
    const [emailMsg, setEmailMsg] = React.useState(undefined as (MessageDescriptor | undefined));
    const [sent, setSent] = React.useState(false);
    const [busy, setBusy] = React.useState(false);

    const { setTitle, intl, showMessage } = props;
    React.useEffect(() => {
        setTitle(intl.formatMessage(messages.resetTitle));
    });

    const emailChange = (value: string, message: MessageDescriptor) => {
        setEmail(value);
        setEmailMsg(message);
    }

    const reset = async () => {
        try {
            setBusy(true);
            const data = await MemberApi.requestResetPassword(email);
            if (data.response === 'Email is not verified. Cannot request reset password mail') {
                setBusy(false);
                showMessage(false, 'Email is not verified. Cannot request reset password mail');
            } else {
                setBusy(false);
                setSent(true);
                showMessage(true, 'Password reset email sent');
            }
        } catch (error) {
            console.log('Reset.reset: ', error);
            setBusy(false);
            showMessage(false, 'Cannot find username');
        }
    }

    const resend = () => {
        reset();
    }

    const goHome = () => {
        const { history } = props;
        history.push('/');
    }

    return (
        <Paper component='div' square>
            <CssBaseline />
            <Box className={classes.root}>
                <Typography component="h1" variant='h5' className={classes.title}>
                    {intl.formatMessage(messages.resetCaption)}
                </Typography>
                <LinearProgress id='busy-indicator' className={classes && classes.busy} style={{ visibility: busy ? 'visible' : 'hidden' }} />
                <Box className={classes && classes.row}>
                    <EmailInput
                        id='email'
                        name='email'
                        value={email}
                        type='email'
                        autoFocus
                        label={intl.formatMessage(messages.emailLabel)}
                        handleChange={emailChange}
                        message={emailMsg}
                    />
                </Box>
                <Box className={classes && classes.row}>
                    {sent && (
                        <Box style={{ display: 'flex' }}>
                            <Link style={{ flex: 1 }} onClick={goHome}>Home</Link>
                            <Link onClick={resend}>Resend</Link>
                        </Box>
                    )}
                    {!sent && (
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={!!emailMsg || email.length === 0}
                            onClick={reset}
                        >
                            {intl.formatMessage(messages.resetButton)}
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}

const mapDispatchToProps = (dispatch: any) => ({
    setTitle: (title: string) => dispatch(GlobalActions.setTitle(title)),
});

export default withSnackbar(injectIntl(connect(undefined, mapDispatchToProps)(ResetPage)));