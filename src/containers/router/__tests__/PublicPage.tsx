import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createShallow } from '@material-ui/core/test-utils';
import PublicPage from '../PublicPage';
import PublicLayout from 'containers/layout/PublicLayout';
import Home from 'containers/pages/Home';
import LoginPage from 'containers/pages/Auth/Login';
import SignupPage from 'containers/pages/Auth/Signup';
import ResetPage from 'containers/pages/Auth/Reset';
import MapPage from 'containers/pages/Map';
import HelpPage from 'containers/pages/Help';


configure({ adapter: new Adapter() });

describe('Public Page', () => {

    const shallow = createShallow();
    const wrapper = shallow(<PublicPage match={{ url: '/', path: '/', isExact: false, params: {} }} />);

    test('snapshot', () => {
        expect(wrapper).toMatchSnapshot()
    });

    test('Public Layout', () => {
        expect(wrapper.find(PublicLayout)).toHaveLength(1);

        expect(wrapper.find(Switch)).toHaveLength(1);
        const children = wrapper.find(Switch).props().children;
        expect(children).toHaveLength(8);

        expect(children[0].type).toEqual(Route);
        expect(children[0].props).toEqual({ path: '/home', component: Home, exact: true });
        expect(children[1].type).toEqual(Route);
        expect(children[1].props).toEqual({ path: '/login', component: LoginPage });
        expect(children[2].type).toEqual(Route);
        expect(children[2].props).toEqual({ path: '/signup', component: SignupPage });
        expect(children[3].type).toEqual(Route);
        expect(children[3].props).toEqual({ path: '/logout', component: Home });
        expect(children[4].type).toEqual(Route);
        expect(children[4].props).toEqual({ path: '/reset', component: ResetPage });
        expect(children[5].type).toEqual(Route);
        expect(children[5].props).toEqual({ path: '/help', component: HelpPage });
        expect(children[6].type).toEqual(Route);
        expect(children[6].props).toEqual({ path: '/map', component: MapPage });
        expect(children[7].type).toEqual(Redirect);
        expect(children[7].props).toEqual({ to: '/home' });
    })
});