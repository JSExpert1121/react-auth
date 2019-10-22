/**
 * @name PublicHeader
 * @description Common Header for public pages. GotoMap/Login/Logo
 * @version 0.2 (basic)
 * @todo Real Header
 * @author Darko
 */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

// material ui components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import LanguageIcon from '@material-ui/icons/Language';

// i18n
import { FormattedMessage } from 'react-intl';
import messages from 'translations/messages/layout';

import logo from 'assets/images/logo.png';
import logoText from 'assets/images/logo_text.png';
import * as GlobalActions from 'store/actions/global';
import { appLocales } from 'config/i18n.config';


// component styles
const useStyles = makeStyles(theme => ({
    root: {
    },
    grow: {
        flex: 1
    },
    menuButtonR: {
        marginRight: theme.spacing(1),
    },
    menuButtonL: {
        marginLeft: theme.spacing(1),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    sectionDesktop: {
        display: 'flex',
    },
}));

export interface IHeaderProps extends RouteComponentProps {
    changeLocale: (locale: string) => void;
    locale: string;
}

export const PublicHeader: React.FC<IHeaderProps> = props => {
    const classes = useStyles({});
    const { history, changeLocale, locale } = props;
    const [anchorEl, setAnchorEl] = React.useState(undefined as (HTMLElement | undefined));
    const isMenuOpen = Boolean(anchorEl);

    const handleLogin = () => {
        history.push('/login');
    }

    const goHome = () => {
        history.push('/');
    }

    const goMap = () => {
        history.push('/map');
    }

    const handleLangMenuClose = (locale?: string) => {
        setAnchorEl(undefined);
        if (locale) {
            changeLocale(locale);
        }
    }

    const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    }

    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id='language-menu'
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
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
                    <img src={logo} alt='logo' height={48} width='auto' onClick={goHome} style={{ cursor: 'pointer', paddingRight: 16 }} />
                    <img src={logoText} alt='Hit!T' height={32} width='auto' onClick={goHome} style={{ cursor: 'pointer' }} />
                    <Box className={classes.grow}>
                        <Button color="inherit" onClick={goMap} className={classes.menuButtonL}>
                            <FormattedMessage {...messages.map} />
                        </Button>
                    </Box>
                    <Box className={classes.sectionDesktop}>
                        <IconButton
                            aria-label="show language menu"
                            aria-controls='show-lang-menu'
                            aria-haspopup="true"
                            onClick={handleLangMenuOpen}
                            color="inherit"
                            className={classes.menuButtonR}
                        >
                            <LanguageIcon />
                        </IconButton>
                        <Button color="inherit" onClick={handleLogin} className={classes.menuButtonR}>
                            <FormattedMessage {...messages.login} />
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </Box>
    )
}

const mapStateToProps = (state: any) => ({
    locale: state.global.locale
});

const mapDispatchToProps = (dispatch: any) => ({
    changeLocale: (locale: string) => dispatch(GlobalActions.changeLocale(locale)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PublicHeader));
