/**
 * @name VerifyEmail
 * @description Page for email verification
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
import Link from '@material-ui/core/Link';
import { StyledComponentProps, withStyles } from '@material-ui/core/styles';

// 3rd party libraries
import { injectIntl, IntlShape, MessageDescriptor } from 'react-intl';
import messages from 'translations/messages/page.account';
import queryString from 'querystring';

// custom components
import Logo from 'assets/images/logo_text.png';

// actions & apis
import * as MemberApis from 'service/member';
import * as GlobalActions from 'store/actions/global';
import * as UserActions from 'store/actions/user';

// constants & types
import { User } from 'types/user';
import { styleFn } from './styles';


const styles = styleFn;

interface IVerifyEmailPageProps extends RouteComponentProps, StyledComponentProps {
    intl: IntlShape;
    token: string;
    user: User;
    setTitle: (title: string) => void;
    getProfile: (token: string, id?: number) => Promise<void>;
}

interface IVerifyEmailPageState {
    isBusy: boolean;
    error?: MessageDescriptor;
}

export class VerifyEmailPage extends React.Component<IVerifyEmailPageProps, IVerifyEmailPageState> {

    constructor(props: Readonly<IVerifyEmailPageProps>) {
        super(props);

        this.state = {
            isBusy: true,
            error: undefined
        }
    }

    async componentDidMount() {
        const { location, token, getProfile, setTitle, intl } = this.props;
        const values = queryString.parse(location.search.slice(1));
        const secToken = values.secureToken as string;

        setTitle(intl.formatMessage(messages.emailTitle));
        try {
            await MemberApis.verifyEmail(token, secToken);
            await getProfile(token);
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('VerifyEmailPage.CDM: ', error);
            this.setState({
                isBusy: false,
                error: messages.emailVerifyFailed
            });
        }
    }

    goDashboard = () => {
        this.props.history.replace('/user');
    }

    public render() {
        const { classes, intl } = this.props;
        const { isBusy, error } = this.state;
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
                        style={{ visibility: isBusy ? 'visible' : 'hidden' }} />
                    {error && (
                        <Typography className={classes.error}>
                            {intl.formatMessage(error)}
                        </Typography>
                    )}
                    {!error && !isBusy && (
                        <Typography className={classes.text}>
                            {intl.formatMessage(messages.emailVerified)}
                        </Typography>
                    )}
                    {!isBusy && (
                        <Box className={classes.bottomMenu}>
                            <Link style={{ cursor: 'pointer', fontSize: '1.1rem', flex: 1, textAlign: 'left' }} onClick={this.goDashboard}>
                                {intl.formatMessage(messages.toDashboard)}
                            </Link>
                        </Box>
                    )}
                </FormControl>
            </Paper>
        );
    }
};

const mapStateToProps = state => ({
    token: state.user.token,
    user: state.user.user
})

const mapDispatchToProps = {
    setTitle: GlobalActions.setTitle,
    getProfile: UserActions.getProfile
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(VerifyEmailPage)));
