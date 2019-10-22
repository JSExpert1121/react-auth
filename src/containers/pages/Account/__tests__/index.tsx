import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createShallow } from '@material-ui/core/test-utils';
import ProfilePage from '../Profile';
import SettingPage from '../Setting';
import VerifyEmailReq from '../VerifyEmailReq';
import VerifyEmail from '../VerifyEmail';
import AccountPage from '../index';

configure({ adapter: new Adapter() });

describe('containers/pages/Account routing', () => {

    const shallow = createShallow();
    const wrapper = shallow(<AccountPage match={{ url: '/' }} />);

    test('Snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });
});
