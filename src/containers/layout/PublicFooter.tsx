/**
 * @name PublicFooter
 * @description Page footer for private pages
 * @version 0.2 (basic)
 * @todo according to spec
 * @author Darko
 */
import * as React from 'react';

import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        textAlign: 'center',
        padding: theme.spacing(2)
    }
}));

interface IPublicFooterProps {
}

export const PublicFooter: React.FunctionComponent<IPublicFooterProps> = (props) => {

    const classes = useStyles({});

    return (
        <Box className={classes.root}>
            &copy;&nbsp;Hit! T corporation inc.
        </Box>
    );
};

export default PublicFooter;
