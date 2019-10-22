/**
 * @name PrivateLayout
 * @description Common Layout for private pages. 
 * @version 0.1 (only skeleton)
 * @version 0.2 (basic)
 * @todo Real layout
 * @author Darko
 */
import React from 'react';

// material ui components & icons
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';

// custom components
import Header from './PrivateHeader';
import Footer from './PrivateFooter';


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


interface IPrivateLayoutProps {
}

export const PrivateLayout: React.FC<IPrivateLayoutProps> = (props) => {
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

export default PrivateLayout;
