import React from "react";
import { Route, Switch, RouteComponentProps, Redirect } from "react-router";
import PublicLayout from "containers/layout/PublicLayout";
import CssBaseline from '@material-ui/core/CssBaseline';

import Home from 'containers/pages/Home';
import LoginPage from 'containers/pages/Auth/Login';
import SignupPage from 'containers/pages/Auth/Signup';
import ResetPage from 'containers/pages/Auth/Reset';
import MapPage from 'containers/pages/Map';
import HelpPage from 'containers/pages/Help';

const PublicPage: React.FC<RouteComponentProps> = props => {
	const { match } = props;
	return (
		<PublicLayout>
			<CssBaseline />
			<Switch>
				<Route exact path={`${match.url}home`} component={Home} />
				<Route path={`${match.url}login`} component={LoginPage} />
				<Route path={`${match.url}signup`} component={SignupPage} />
				<Route path={`${match.url}logout`} component={Home} />
				<Route path={`${match.url}reset`} component={ResetPage} />
				<Route path={`${match.url}help`} component={HelpPage} />
				<Route path={`${match.url}map`} component={MapPage} />
				<Redirect to={`${match.url}home`} />
			</Switch>
		</PublicLayout>
	);
};

export default PublicPage;