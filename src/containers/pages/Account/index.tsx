import * as React from 'react';
import { Switch, Route, RouteComponentProps } from 'react-router-dom';

import ProfilePage from './Profile';
import SettingPage from './Setting';
import VerifyEmailReq from './VerifyEmailReq';
import VerifyEmail from './VerifyEmail';

interface IAccountProps extends RouteComponentProps {
}

const Account: React.FC<IAccountProps> = (props) => {

    const { match } = props;
    return (
        <Switch>
            <Route path={`${match.url}/profile`} component={ProfilePage} />
            <Route path={`${match.url}/setting`} component={SettingPage} />
            <Route path={`${match.url}/verify-email`} component={VerifyEmailReq} />
            <Route path={`${match.url}/verifyuser`} component={VerifyEmail} />
        </Switch>
    );
};

export default Account;
