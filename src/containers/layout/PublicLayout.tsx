/**
 * @name PublicLayout
 * @description Common Layout for public pages. Only includes Header for now
 * @version 0.2 (basic)
 * @todo Real layout
 * @author Darko
 */
import React from 'react';

// material ui components & icons
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';

// custom components
import Header from './PublicHeader';
import Footer from './PublicFooter';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%'
    },
    contents: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    }
}));

interface IPublicLayoutProps {
}

export const PublicLayout: React.FC<IPublicLayoutProps> = (props) => {
    const { children } = props;
    const classes = useStyles({});

    return (
        <Box className={classes.root}>
            <Header />
            <Box component='main' className={classes.contents}>
                {children}
            </Box>
            <Footer />
        </Box>
    )
};

export default PublicLayout;
