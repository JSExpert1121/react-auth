import { Theme, createStyles } from '@material-ui/core/styles';
import Colors from 'assets/colors';

export const styleFn = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        padding: theme.spacing(3),
        maxWidth: 512,
        minWidth: 480,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        textAlign: 'center'
    },
    logo: {
        padding: theme.spacing(2, 0)
    },
    title: {
        fontSize: '1.5rem',
        color: 'rgba(0, 0, 0, 0.8)',
        padding: theme.spacing(2)
    },
    text: {
        fontSize: '0.875rem',
        color: 'rgba(0, 0, 0, 0.7)',
        padding: theme.spacing(2)
    },
    success: {
        color: 'rgba(0, 0, 0, 0.9)',
        padding: theme.spacing(1)
    },
    error: {
        fontSize: '0.875rem',
        color: Colors.error,
        padding: theme.spacing(0, 0, 0, 2)
    },
    busy: {
        width: '100%',
    },
    submit: {
        margin: theme.spacing(2, 0),
        height: 'calc(100% - 12px)'
    },
    bottomMenu: {
        width: '100%',
        display: 'flex',
        padding: theme.spacing(2, 0)
    }
});