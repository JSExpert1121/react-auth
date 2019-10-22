import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';

// import { WrappedComponentProps, injectIntl } from 'react-intl';
// import messages from 'translations/messages/global';

const useStyles = makeStyles((theme: Theme) => ({
    relative: {
        position: 'relative',
        left: '0px',
        top: '0px',
    },
    busy: {
        position: 'absolute',
        left: 'calc(50% - 16px)',
        top: 'calc(50% - 16px)',
    },
}));

export interface IConfirmDialogProps {
    open: boolean;
    onYes: () => Promise<any> | void;
    yes?: string;
    ok?: string;
    cancel?: string;
    onCancel?: () => void;
    title?: string;
    message: string | React.ReactNode;
}

const ConfirmDialog: React.FC<IConfirmDialogProps> = props => {

    const classes = useStyles({});
    const {
        open, onYes, onCancel, title, message, yes, cancel, ok
    } = props;


    return (
        <Dialog open={open} onClose={onCancel} aria-labelledby="confirm-dialog-title">
            <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
            <DialogContent className={classes.relative}>
                <DialogContentText id="confirm-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {onCancel && (
                    <Button id='confirm-button-cancel' onClick={onCancel} autoFocus>
                        {cancel}
                    </Button>
                )}
                <Button onClick={onYes} color="primary">
                    {onCancel ? yes : ok}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmDialog.defaultProps = {
    title: 'Confirm',
    yes: 'Yes',
    ok: 'OK',
    cancel: 'Cancel'
};

export default ConfirmDialog;
