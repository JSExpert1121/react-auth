import React from 'react';
import clsx from 'clsx';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import { Theme } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import {
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
} from '@material-ui/icons';

import { amber, green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const useStyles1 = makeStyles((theme: Theme) => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

type SnackbarType = 'success' | 'warning' | 'error' | 'info';
interface ICustomSnackbarContentProps {
    className: string;
    message: string;
    variant: SnackbarType;
    onClose: () => void;
}

const CustomSnackbarContentWrapper: React.FC<ICustomSnackbarContentProps> = (props) => {
    const classes = useStyles1({});
    const { className, message, onClose, variant } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
        />
    );
}

const useStyles2 = makeStyles((theme: Theme) => ({
    margin: {
        margin: theme.spacing(1),
    }
}));

export interface ISnackbarProps {
    showMessage: boolean;
    message: string;
    variant: SnackbarType;
    handleClose: () => void;
}

interface ICustomSnackbarProps {
    open: boolean;
    message: string;
    variant: SnackbarType;
    handleClose: () => void;
}

const CustomSnackbar: React.FunctionComponent<ICustomSnackbarProps> = (props) => {
    const classes = useStyles2({});
    const { open, variant, message, handleClose } = props;
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={open}
            autoHideDuration={4000}
            TransitionComponent={Fade}
            onClose={handleClose}
        >
            <CustomSnackbarContentWrapper
                onClose={handleClose}
                variant={variant}
                message={message}
                className={classes.margin}
            />
        </Snackbar>
    );
};

export default CustomSnackbar;
