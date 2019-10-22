import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import Helmet from 'react-helmet';
import { AppRouter } from '../index';
import PrivateRoute from '../PrivateRoute';
import PrivatePage from '../PrivatePage';
import PublicPage from '../PublicPage';
import { createShallow } from '@material-ui/core/test-utils';

configure({ adapter: new Adapter() });

const MOCK_TITLE = 'Hit! T';

describe('containers/router/app-router', () => {

    const shallow = createShallow();
    const wrapper = shallow(<AppRouter title={MOCK_TITLE} />);

    test('Helmet component', () => {
        expect(wrapper.find(Helmet)).toHaveLength(1);
        const helmetChildren = wrapper.find(Helmet).props().children;
        expect(helmetChildren).toHaveLength(2);
        expect(helmetChildren[1].props.children).toEqual(MOCK_TITLE);
    });

    test('Switch component', () => {
        expect(wrapper.find(Switch)).toHaveLength(1);
        const switchChildren = wrapper.find(Switch).props().children;
        expect(switchChildren).toHaveLength(2);

        expect(switchChildren[0].type).toEqual(PrivateRoute);
        expect(switchChildren[0].props).toEqual({ component: PrivatePage, path: '/user' });

        expect(switchChildren[1].type).toEqual(Route);
        expect(switchChildren[1].props).toEqual({ component: PublicPage, path: '/' });
    });
})