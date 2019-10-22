import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

// material ui components & icons
import Box from '@material-ui/core/Box';
import { makeStyles, Theme, StyledComponentProps } from '@material-ui/core/styles';

// 3rd party libraries
import { injectIntl, WrappedComponentProps } from 'react-intl';
import messages from 'translations/messages/page.dashboard';

// actions & apis & types
import * as GlobalActions from 'store/actions/global';
// import * as UserActions from 'store/actions/user';
// import * as MemberApi from 'service/member';


const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        width: '100%',
    }
}));

interface IDashboardProps extends RouteComponentProps, StyledComponentProps, WrappedComponentProps {
    setTitle: (title: string) => void;
}

const Dashboard: React.FunctionComponent<IDashboardProps> = (props) => {

    const { setTitle, intl } = props;
    React.useEffect(() => {
        setTitle(intl.formatMessage(messages.title));
    });

    const classes = useStyles({});
    return (
        <Box className={classes.root}>
            Dashboard
        </Box>
    );
};

const mapStateToProps = (state: any) => ({
});

const mapDispatchToProps = (dispatch: any) => ({
    setTitle: (title: string) => dispatch(GlobalActions.setTitle(title)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
