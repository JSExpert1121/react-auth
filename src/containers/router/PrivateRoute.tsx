
import React from 'react';
import { connect } from 'react-redux';
import { RouteProps, Route, Redirect, RouteComponentProps } from 'react-router';


interface PrivateRouteProps extends RouteProps {
    user: any;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
    const { component, user, ...rest } = props;

    // Redirect to the login page if logged in user doesn't exist
    if (!user) {
        return <Redirect to={{
            pathname: '/login',
            state: { referrer: props.path }
        }} />;
    }

    const Component = component as React.ComponentClass<RouteComponentProps>;
    return <Route {...rest} component={Component} />
}

const mapStateToProps = (state: any) => ({
    user: state.user.user
})

export default connect(mapStateToProps)(PrivateRoute);