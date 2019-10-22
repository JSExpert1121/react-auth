/**
 * @name PrivateHeader
 * @description Common Header for private pages.
 * @version 0.2 (basic)
 * @version 0.5 (profile, logout, language menu)
 * @todo Real Header(User, Notification, Menu, Title, ...)
 * @author Darko
 */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

// material ui components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Box from '@material-ui/core/Box';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import LanguageIcon from '@material-ui/icons/Language';
import WarningIcon from '@material-ui/icons/Warning';

// custom components
import ProfileButton from 'components/Buttons/ProfileButton';
import Colors from 'assets/colors';

// i18n
import { injectIntl, IntlShape } from 'react-intl';
import messages from 'translations/messages/layout';

import * as GlobalActions from 'store/actions/global';
import * as UserActions from 'store/actions/user';
import { appLocales } from 'config/i18n.config';
import { User, UserProfile } from 'types/user';

// component styles
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    left: {
        display: 'flex'
    },
    middle: {
        display: 'flex',
        flex: 1
    },
    menuButton: {
        marginRight: theme.spacing(1),
    },
    title: {
        padding: theme.spacing(1.5),
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    menuButtonR: {
        marginRight: theme.spacing(2),
    },
    menuButtonL: {
        marginLeft: theme.spacing(1),
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

export interface IHeaderProps extends RouteComponentProps {
    logout: () => Promise<any>;
    changeLocale: (locale: string) => void;
    locale: string;
    intl: IntlShape;
    user: User;
    profile: UserProfile;
}

export const PrivateHeader: React.FC<IHeaderProps> = props => {
    const classes = useStyles({});
    const [anchorEl, setAnchorEl] = React.useState(undefined as (HTMLElement | undefined));
    const [langAnchorEl, setLangAnchorEl] = React.useState(undefined as (HTMLElement | undefined));
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(undefined as (HTMLElement | undefined));

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const isLangMenuOpen = !!langAnchorEl;

    const { history, changeLocale, locale, intl, logout, user, profile } = props;

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(undefined);
    }

    const handleMenuClose = () => {
        setAnchorEl(undefined);
        handleMobileMenuClose();
    }

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    }

    const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setLangAnchorEl(event.currentTarget);
    }

    const handleLangMenuClose = (locale?: string) => {
        setLangAnchorEl(undefined);
        if (locale) {
            changeLocale(locale);
        }
    }

    const handleLogout = async () => {
        await logout();
        history.replace('/login');
    }

    const handleProfile = () => {
        history.push('/user/account/profile');
        handleMenuClose();
    }

    const handleSetting = () => {
        history.push('/user/account/setting');
        handleMenuClose();
    }

    const menuId = 'hitit-account-menu';
    const warning = !profile.emailVerified || !profile.cellphoneVerified;

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleProfile}>
                <ListItemIcon>
                    {warning ? (
                        <Badge
                            overlap='circle'
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                            badgeContent={<WarningIcon style={{ fontSize: 12, color: Colors.warning }} />}
                        >
                            <AccountCircle />
                        </Badge>
                    ) : (
                            <AccountCircle />
                        )
                    }
                </ListItemIcon>
                {intl.formatMessage(messages.profile)}
            </MenuItem>
            <MenuItem onClick={handleSetting}>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                {intl.formatMessage(messages.myaccount)}
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                    <LogoutIcon />
                </ListItemIcon>
                {intl.formatMessage(messages.logout)}
            </MenuItem>
        </Menu>
    );

    const mobileMenuId = 'hitit-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="show-notifications" color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <Typography>
                    {intl.formatMessage(messages.notify)}
                </Typography>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="current user"
                    aria-controls="primary-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <Typography>
                    {intl.formatMessage(messages.profile)}
                </Typography>
            </MenuItem>
        </Menu>
    );

    const langMenuId = 'hitit-language-menu';
    const renderLocaleMenu = (
        <Menu
            anchorEl={langAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={langMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isLangMenuOpen}
            onClose={() => handleLangMenuClose()}
        >
            {
                appLocales.map(local => (
                    <MenuItem
                        key={local.code}
                        onClick={() => handleLangMenuClose(local.code)}
                        selected={local.code === locale}
                    >
                        {local.name}
                    </MenuItem>
                ))
            }
        </Menu>
    );

    return (
        <Box className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Box className={classes.left}>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <Box className={classes.middle}>
                        <Typography className={classes.title} variant="h6" noWrap>
                            {'Hit! T'}
                        </Typography>
                    </Box>
                    <Box className={classes.sectionDesktop}>
                        <IconButton
                            aria-label="show language menu"
                            aria-controls={langMenuId}
                            aria-haspopup="true"
                            onClick={handleLangMenuOpen}
                            color="inherit"
                            className={classes.menuButtonR}
                        >
                            <LanguageIcon />
                        </IconButton>
                        <IconButton
                            aria-label="show-notifications"
                            color="inherit"
                            className={classes.menuButtonR}
                        >
                            <Badge badgeContent={17} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            edge="end"
                            aria-label="current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                            className={classes.menuButtonR}
                            style={{ padding: 8 }}
                        >
                            {warning ? (
                                <Badge
                                    overlap='circle'
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right'
                                    }}
                                    badgeContent={<WarningIcon style={{ fontSize: 12, color: Colors.warning }} />}
                                >
                                    <ProfileButton name={user.name} avatar={profile.photoUrl} />
                                </Badge>
                            ) : (
                                    <ProfileButton name={user.name} avatar={profile.photoUrl} />
                                )
                            }
                        </IconButton>
                    </Box>
                    <Box className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            {renderLocaleMenu}
        </Box>
    )
}

const mapStateToProps = (state: any) => ({
    locale: state.global.locale,
    user: state.user.user,
    profile: state.user.profile
});

const mapDispatchToProps = (dispatch: any) => ({
    changeLocale: (locale: string) => dispatch(GlobalActions.changeLocale(locale)),
    logout: () => dispatch(UserActions.logout())
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(PrivateHeader)));
