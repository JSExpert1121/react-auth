import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createShallow } from '@material-ui/core/test-utils';
import PrivatePage from '../PrivatePage';
import PrivateLayout from 'containers/layout/PrivateLayout';
import Dashboard from 'containers/pages/Dashboard';
import AccountPage from 'containers/pages/Account';


configure({ adapter: new Adapter() });

describe('Public Page', () => {

    const shallow = createShallow();
    const wrapper = shallow(<PrivatePage match={{ url: '/user', path: '/user', isExact: false, params: {} }} />);

    test('snapshot', () => {
        expect(wrapper).toMatchSnapshot()
    });

    test('Public Layout', () => {
        expect(wrapper.find(PrivateLayout)).toHaveLength(1);

        expect(wrapper.find(Switch)).toHaveLength(1);
        const children = wrapper.find(Switch).props().children;
        expect(children).toHaveLength(3);

        expect(children[0].type).toEqual(Route);
        expect(children[0].props).toEqual({ path: '/user/dashboard', component: Dashboard });
        expect(children[1].type).toEqual(Route);
        expect(children[1].props).toEqual({ path: '/user/account', component: AccountPage });
        expect(children[2].type).toEqual(Redirect);
        expect(children[2].props).toEqual({ to: '/user/dashboard' });
    })
});