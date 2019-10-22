/**
 * @name VerifyEmailReq
 * @description Page for sending email verification request
 * @version 1.0
 * @todo Design
 * @author Darko
 */
import * as React from 'react';
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom';

// material ui components & icons
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

// i18n
import { injectIntl, IntlShape } from 'react-intl';
import messages from 'translations/messages/page.account';

// custom components
import Logo from 'assets/images/logo_text.png';

// actions & apis
import * as MemberApis from 'service/member';
import * as GlobalActions from 'store/actions/global';

// constants & types
import { UserProfile, User } from 'types/user';
import { styleFn } from './styles';


const useStyles = makeStyles(styleFn);

interface IVerifyEmailPageProps extends RouteComponentProps {
    intl: IntlShape;
    profile: UserProfile;
    token: string;
    user: User;
    setTitle: (title: string) => void;
}

export const VerifyEmailReqPage: React.FunctionComponent<IVerifyEmailPageProps> = (props) => {

    const [busy, setBusy] = React.useState(false);
    const [sent, setSent] = React.useState(false);

    const classes = useStyles({});
    const { user, intl, setTitle, token, history } = props;
    React.useEffect(() => {
        setTitle(intl.formatMessage(messages.emailTitle));
    })

    const handleRequest = async () => {
        try {
            setBusy(true);
            await MemberApis.requestVerificationEmail(token);
            setBusy(false);
            setSent(true);
        } catch (error) {
            console.log('VerifyEmailReqPage.handleRequest: ', error);
            setBusy(false);
        }
    }

    const goBack = () => {
        history.goBack();
    }

    return (
        <Paper component='div' className={classes.root}>
            <CssBaseline />
            <FormControl className={classes.form}>
                <Box className={classes.logo}>
                    <img src={Logo} alt={'Hit!T'} />
                </Box>
                <Typography className={classes.title}>
                    {intl.formatMessage(messages.emailTitle)}
                </Typography>
                <LinearProgress
                    id='busy-indicator'
                    className={classes.busy}
                    style={{ visibility: busy ? 'visible' : 'hidden' }} />
                <Typography className={classes.text}>
                    {`Hello ${user.name}, you're almost ready to start enjoying Hit! T service. Simply click the below button to verify your email address`}
                </Typography>
                {!sent && (
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleRequest}
                    >
                        {`Verify your mail`}
                    </Button>
                )}
                {sent && (
                    <Typography className={classes.success}>
                        Email was sent.
                    </Typography>
                )}
                {sent && (
                    <Box className={classes.bottomMenu}>
                        <Link style={{ cursor: 'pointer', fontSize: '1.1rem', flex: 1, textAlign: 'left' }} onClick={goBack}>
                            Back to Profile
                        </Link>
                        <Link style={{ cursor: 'pointer', fontSize: '1.1rem' }} onClick={handleRequest}>
                            Resend mail
                        </Link>
                    </Box>
                )}
            </FormControl>
        </Paper>
    );
};

const mapStateToProps = state => ({
    profile: state.user.profile,
    token: state.user.token,
    user: state.user.user
})

const mapDispatchToProps = {
    setTitle: GlobalActions.setTitle,
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(VerifyEmailReqPage));
