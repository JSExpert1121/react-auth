import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

// material ui components & icons
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

// i18n
import { injectIntl, IntlShape } from 'react-intl';
import messages from 'translations/messages/page.map';

// actions
import * as GlobalActions from 'store/actions/global';


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: 800
    }
}));

interface IMapViewProps extends RouteComponentProps {
    setTitle: (title: string) => void;
    intl: IntlShape;
}

export const MapView: React.FC<IMapViewProps> = (props) => {

    const { setTitle, intl } = props;
    React.useEffect(() => {
        setTitle(intl.formatMessage(messages.title));
    });

    const classes = useStyles({});
    return (
        <Box className={classes.root}>
        </Box>
    )
};

const mapDispatchToProps = (dispatch: any) => ({
    setTitle: (title: string) => dispatch(GlobalActions.setTitle(title)),
});

export default injectIntl(connect(undefined, mapDispatchToProps)(MapView));
