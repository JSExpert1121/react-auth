/**
 * @name ProfilePage
 * @description profile view/update page
 * @version 1.0 (basic)
 * @todo upload image
 * @author Darko
 */
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Link as RouterLink } from 'react-router-dom';

// material ui components & icons
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { createStyles, Theme, withStyles, StyledComponentProps } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import WarningIcon from '@material-ui/icons/Warning';

// 3rd party libraries
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    DatePicker,
} from '@material-ui/pickers';
import { injectIntl, IntlShape } from 'react-intl';
// import globalMsgs from 'translations/messages/global';
import messages from 'translations/messages/page.account';

// custom components
import PhoneInput from 'containers/others/PhoneInput';
import withSnackbar, { withSnackbarProps } from 'components/HOCs/withSnackbar';
import ImageUploadDialog from 'components/Dialog/ImageUploadDialog';
import Colors from 'assets/colors';

// actions & apis
import * as UserAction from 'store/actions/user';
import * as GlobalActions from 'store/actions/global';

// constants & types
import { UserProfile, User } from 'types/user';
import { Gender } from 'types/global';

export const StyledWarning: React.FC<{}> = () => (
    <WarningIcon style={{ color: Colors.warning, marginRight: 16, fontSize: 20 }} />
);

const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        padding: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 512,
        minWidth: 480,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
    },
    busy: {
        width: '100%',
        marginTop: theme.spacing(2)
    },
    avatar: {
        position: 'relative',
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.dark,
        width: 120,
        height: 120
    },
    centerAvatar: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    content: {
        width: '100%'
    },
    submit: {
        margin: theme.spacing(2, 0),
        height: 'calc(100% - 12px)'
    },
});

export interface IProfilePageProps extends RouteComponentProps, StyledComponentProps {
    intl: IntlShape;
    profile: UserProfile;
    token: string;
    user: User;
    setTitle: (title: string) => void;
    updateProfile: (token: string, country: string, phone: string, phoneVerified: boolean, id?: number, birth?: string, gender?: Gender, photo?: string) => Promise<UserProfile>;
}

interface IProfilePageState {
    photoURL?: string;
    hoverPhoto: boolean;
    countryCode: string;
    dateBirth: string;
    gender: Gender;
    phoneNo: string;
    phoneVerified: boolean;
    isBusy: boolean;
    openUpload: boolean;
}

const GENDERS = ['MALE', 'FEMALE', 'OTHER'];

export class ProfilePage extends React.Component<IProfilePageProps & withSnackbarProps, IProfilePageState> {
    constructor(props: Readonly<IProfilePageProps & withSnackbarProps>) {
        super(props);

        this.state = {
            photoURL: props.profile.photoUrl || '',
            hoverPhoto: false,
            countryCode: props.profile.cellphoneCountryCode || '',
            phoneNo: props.profile.cellphone || '',
            phoneVerified: props.profile.cellphoneVerified,
            dateBirth: props.profile.datebirth,
            gender: props.profile.gender || 'MALE',
            isBusy: false,
            openUpload: false
        }
    }

    componentDidMount() {
        const { setTitle, intl } = this.props;
        setTitle(intl.formatMessage(messages.profileTitle));
    }

    enterPhoto = () => {
        this.setState({ hoverPhoto: true });
    }

    leavePhoto = () => {
        this.setState({ hoverPhoto: false });
    }

    openUploadDialog = () => {
        this.setState({ openUpload: true });
    }

    closeUploadDialog = () => {
        this.setState({ openUpload: false });
    }

    saveAvatar = (url: string) => {
        this.setState({ openUpload: false, photoURL: url });
        // call api
    }

    handlePhone = (country: string, phone: string, verified: boolean) => {
        this.setState({
            phoneNo: phone,
            phoneVerified: verified,
            countryCode: country
        });
    }

    handleDateChange = (date: Date) => {
        const yearstr = `${date.getFullYear()}`;
        let monthstr = `${date.getMonth() + 1}`;
        if (monthstr.length === 1) monthstr = '0' + monthstr;
        let daystr = `${date.getDate()}`;
        if (daystr.length === 1) daystr = '0' + daystr;

        this.setState({ dateBirth: `${yearstr}-${monthstr}-${daystr}` });
    }

    handleUpdate = async () => {
        const { updateProfile, token, showMessage, intl } = this.props;
        const { phoneNo, countryCode, dateBirth, gender, phoneVerified, photoURL } = this.state;

        this.setState({ isBusy: true });
        try {
            await updateProfile(token, countryCode, phoneNo, phoneVerified, undefined, dateBirth, gender, photoURL);
            showMessage(true, intl.formatMessage(messages.profileSuccess));
            this.setState({ isBusy: false });
        } catch (error) {
            console.log('Profile.handleUpdate: ', error);
            showMessage(false, intl.formatMessage(messages.profileError));
            this.setState({ isBusy: false });
        }
    }

    genderChange = e => {
        this.setState({ gender: e.target.value });
    }

    public render() {
        const { phoneNo, countryCode, dateBirth, gender, hoverPhoto, phoneVerified, isBusy, openUpload } = this.state;
        const { classes, profile, user, intl } = this.props;
        const disabled = !(phoneVerified && phoneNo && countryCode && dateBirth && gender);

        return (
            <Paper component='div' className={classes && classes.root}>
                <CssBaseline />
                <FormControl className={classes && classes.form}>
                    {profile.photoUrl && <Avatar className={classes.avatar} alt={user.name} src={profile.photoUrl}></Avatar>}
                    {!profile.photoUrl &&
                        <Avatar
                            className={classes.avatar}
                            onMouseEnter={this.enterPhoto}
                            onMouseLeave={this.leavePhoto}
                        >
                            <span style={{ fontSize: 48 }}>{user.name.toUpperCase().slice(0, 1)}</span>
                            {hoverPhoto && (
                                <Box className={classes && classes.centerAvatar}>
                                    <IconButton onClick={this.openUploadDialog} className={classes && classes.centerAvatar}>
                                        <EditIcon style={{ fontSize: 24, color: 'white' }} />
                                    </IconButton>
                                </Box>
                            )}
                        </Avatar>
                    }
                    <Typography component="h1" variant='h5'>
                        {user.name}
                    </Typography>
                    <Box id='profile-page-content' className={classes.content}>
                        <LinearProgress
                            id='busy-indicator'
                            className={classes && classes.busy}
                            style={{ visibility: isBusy ? 'visible' : 'hidden' }} />
                        <PhoneInput
                            setBusy={busy => this.setState({ isBusy: busy })}
                            verify={this.handlePhone}
                            phoneNo={phoneNo}
                            countryCode={countryCode}
                        />
                        <Grid container>
                            <Grid item xs={6} style={{ paddingRight: 16 }}>
                                <FormControl
                                    style={{ width: '100%' }}
                                    margin='normal'
                                >
                                    <InputLabel htmlFor="select-gender">{intl.formatMessage(messages.profileGender)}</InputLabel>
                                    <Select
                                        fullWidth
                                        onChange={this.genderChange}
                                        value={gender}
                                        input={<Input id="select-gender" />}
                                    >
                                        {GENDERS.map((item, index) => (
                                            <MenuItem key={index} value={item} selected={item === gender}>
                                                {item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} style={{ paddingLeft: 16 }}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <DatePicker
                                        fullWidth
                                        margin="normal"
                                        id="mui-pickers-date"
                                        label={intl.formatMessage(messages.profileBirth)}
                                        value={dateBirth}
                                        onChange={this.handleDateChange}
                                        format={'yyyy-MM-dd'}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            {!profile.emailVerified && (
                                <Grid item xs={12} style={{ padding: '16px 0', display: 'flex' }}>
                                    <StyledWarning />
                                    <span style={{ flex: 1 }}>{intl.formatMessage(messages.emailVerify)}</span>
                                    <Link to='/user/account/verify-email' component={RouterLink}>
                                        {intl.formatMessage(messages.verifyNow) + ' >'}
                                    </Link>
                                </Grid>
                            )}
                            {!profile.cellphoneVerified && (
                                <Grid item xs={12} style={{ padding: '16px 0', display: 'flex' }}>
                                    <StyledWarning />
                                    <span style={{ flex: 1 }}>{intl.formatMessage(messages.phoneVerify)}</span>
                                    <Link to='/' component={RouterLink}>
                                        {intl.formatMessage(messages.verifyNow) + ' >'}
                                    </Link>
                                </Grid>
                            )}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleUpdate}
                            disabled={disabled}
                        >
                            {intl.formatMessage(messages.profileSubmit)}
                        </Button>
                    </Box>
                </FormControl>
                <ImageUploadDialog
                    name={user.name}
                    open={openUpload}
                    onYes={this.saveAvatar}
                    onCancel={this.closeUploadDialog}
                />
            </Paper>
        );
    }
}

const mapStateToProps = state => ({
    profile: state.user.profile,
    token: state.user.token,
    user: state.user.user
})

const mapDispatchToProps = {
    setTitle: GlobalActions.setTitle,
    updateProfile: UserAction.updateProfile,
}

export default withSnackbar<withSnackbarProps>(injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ProfilePage))));