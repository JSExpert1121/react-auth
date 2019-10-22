import React from 'react';
import { Route, RouteComponentProps, Switch, Redirect } from 'react-router';
import CssBaseline from '@material-ui/core/CssBaseline';

import PrivateLayout from 'containers/layout/PrivateLayout';

// custom pages
import Dashboard from 'containers/pages/Dashboard';
import AccountPage from 'containers/pages/Account';

interface IPrivatePageProps extends RouteComponentProps {

}

const PrivatePage: React.FC<IPrivatePageProps> = (props) => {
    const { match } = props;
    return (
        <PrivateLayout {...props}>
            <CssBaseline />
            <Switch>
                <Route path={`${match.url}/dashboard`} component={Dashboard} />
                <Route path={`${match.url}/account`} component={AccountPage} />
                <Redirect to={`${match.url}/dashboard`} />
            </Switch>
        </PrivateLayout>
    )
}

export default PrivatePage;