/**
 * @name SettingPage
 * @description Page for update user information(username, name, password)
 * @version 1.0
 * @todo Design
 * @author Darko
 */
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

// material ui components
import Paper from '@material-ui/core/Paper';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// 3rd party libraries
import { injectIntl, IntlShape, MessageDescriptor } from 'react-intl';
import globalMsgs from 'translations/messages/global';
import authMsgs from 'translations/messages/page.auth';
import messages from 'translations/messages/page.account';

// custom components
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import { EmailInput, NameInput, PassInput } from 'components/TextInput';
import ConfirmDialog from 'components/Dialog/ConfirmDialog';

// actions & apis
import * as GlobalActions from 'store/actions/global';
import * as UserActions from 'store/actions/user';
import { User } from 'types/user';


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
    title: {
        fontSize: '1.5rem',
        fontWeight: 600,
        textAlign: 'center'
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
        margin: theme.spacing(2, 0),
    },
    busy: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
}));

interface ISettingPageProps extends RouteComponentProps, withSnackbarProps {
    intl: IntlShape;
    token: string;
    user: User;
    setTitle: (title: string) => void;
    updateUser: (token: string, newMail: string, password: string, name: string, id?: number) => Promise<User>;
    getUser: (token: string, id?: number) => Promise<User>;
    deleteUser: (token: string, id?: number) => Promise<void>;
}

export const SettingPage: React.FC<ISettingPageProps> = (props) => {

    const { setTitle, intl, user } = props;
    const classes = useStyles({});

    const [email, setEmail] = React.useState(user.username);
    const [emailMsg, setEmailMsg] = React.useState<MessageDescriptor | undefined>(undefined);
    const [name, setName] = React.useState(user.name);
    const [nameMsg, setNameMsg] = React.useState<MessageDescriptor | undefined>(undefined);
    const [password, setPassword] = React.useState('');
    const [passMsg, setPassMsg] = React.useState<MessageDescriptor | undefined>(undefined);
    const [busy, setBusy] = React.useState(false);
    const [confirm, setConfirm] = React.useState(false);

    React.useEffect(() => {
        setTitle(intl.formatMessage(messages.settingTitle));
    });

    const emailChange = (value: string, message: MessageDescriptor) => {
        console.log('mail change event');
        setEmail(value);
        setEmailMsg(message);
    }

    const passChange = (value: string, message: MessageDescriptor) => {
        setPassword(value);
        setPassMsg(message);
    }

    const nameChange = (value: string, message: MessageDescriptor) => {
        setName(value);
        setNameMsg(message);
    }

    const handleUpdate = async () => {
        const { token, updateUser, showMessage, getUser } = props;
        try {
            setBusy(true);
            await updateUser(token, email, password, name);
            await getUser(token);
            showMessage(true, intl.formatMessage(messages.updateSuccess));
            setBusy(false);
        } catch (error) {
            console.log('SettingPage.handleUpdate: ', error);
            showMessage(false, intl.formatMessage(messages.updateFailed));
            setBusy(false);
        }
    }

    const handleDelete = async () => {
        const { token, deleteUser, showMessage, history } = props;
        try {
            setConfirm(false);
            setBusy(true);
            await deleteUser(token);
            history.replace('/login');
        } catch (error) {
            console.log('Setting.handleDelete: ', error);
            showMessage(false, intl.formatMessage(messages.deleteFailed));
            setBusy(false);
        }
    }

    const confirmDelete = () => setConfirm(true);
    const closeConfirm = () => setConfirm(false);

    const disabled = !!emailMsg || !!passMsg || !!nameMsg;
    return (
        <Paper square>
            <CssBaseline />
            <Box className={classes.root}>
                <Box className={classes.content}>
                    <Box className={classes.row}>
                        <Typography className={classes.title}>
                            {intl.formatMessage(messages.settingTitle)}
                        </Typography>
                    </Box>
                    <LinearProgress id='busy-indicator' className={classes.busy} style={{ visibility: busy ? 'visible' : 'hidden' }} />
                    <Box className={classes.row}>
                        <EmailInput
                            id='setting-email'
                            name='email'
                            value={email}
                            type='email'
                            autoFocus
                            label={intl.formatMessage(authMsgs.emailLabel)}
                            helperText={intl.formatMessage(authMsgs.emailHelper)}
                            handleChange={emailChange}
                            message={emailMsg}
                        />
                    </Box>
                    <Box className={classes.row}>
                        <NameInput
                            id='setting-name'
                            name='email'
                            value={name}
                            autoFocus
                            label={intl.formatMessage(authMsgs.nameLabel)}
                            helperText={intl.formatMessage(authMsgs.nameHelper)}
                            handleChange={nameChange}
                            message={nameMsg}
                        />
                    </Box>
                    <Box className={classes && classes.row}>
                        <PassInput
                            id="setting-password"
                            name="password"
                            type="password"
                            value={password}
                            label={intl.formatMessage(authMsgs.passLabel)}
                            helperText={intl.formatMessage(authMsgs.passHelper)}
                            handleChange={passChange}
                            message={passMsg}
                        />
                    </Box>
                    <Box className={classes.row}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleUpdate}
                            disabled={disabled}
                        >
                            {intl.formatMessage(globalMsgs.update)}
                        </Button>
                    </Box>
                    <Box className={classes.row} style={{ textAlign: 'right' }}>
                        <Button
                            color="primary"
                            onClick={confirmDelete}
                        >
                            {intl.formatMessage(messages.deleteAccount)}
                        </Button>
                    </Box>
                </Box>
                <ConfirmDialog
                    open={confirm}
                    title={intl.formatMessage(messages.deleteTitle)}
                    message={intl.formatMessage(messages.deletePrompt)}
                    onYes={handleDelete}
                    onCancel={closeConfirm}
                    yes={intl.formatMessage(globalMsgs.yes)}
                    cancel={intl.formatMessage(globalMsgs.cancel)}

                />
            </Box>
        </Paper>
    );
};

const mapStateToProps = state => ({
    token: state.user.token,
    user: state.user.user
})

const mapDispatchToProps = {
    setTitle: GlobalActions.setTitle,
    updateUser: UserActions.updateUser,
    getUser: UserActions.getUser,
    deleteUser: UserActions.deleteUser
}

export default withSnackbar(injectIntl(connect(mapStateToProps, mapDispatchToProps)(SettingPage)));
