/**
 * @name AppRouter
 * @description application router (private and public)
 * @version 1.0
 * @author Darko
 */
import React from 'react'
import { connect } from 'react-redux';
import { Route, Switch, RouteProps } from "react-router";

// material ui components
import Box from '@material-ui/core/Box';
import NoSsr from '@material-ui/core/NoSsr';

// 3rd party components
import Helmet from 'react-helmet';

// pages
import PrivateRoute from './PrivateRoute';
import PublicPage from './PublicPage';
import PrivatePage from './PrivatePage';


interface IAppRouterProps extends RouteProps {
    title: string;
}

export class AppRouter extends React.Component<IAppRouterProps> {

    public render() {
        const { title } = this.props;

        return (
            <NoSsr>
                <Box style={{ width: '100vw', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>{title}</title>
                    </Helmet>
                    <Switch>
                        <PrivateRoute path='/user' component={PrivatePage} />
                        <Route path='/' component={PublicPage} />
                    </Switch>
                </Box>
            </NoSsr>
        )
    }
}

const mapStateToProps = (state: any) => ({
    title: state.global.title
})

export default connect(mapStateToProps)(AppRouter);