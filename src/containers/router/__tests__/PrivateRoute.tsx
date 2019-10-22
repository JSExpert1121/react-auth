import React from 'react';
import { Route, Redirect, MemoryRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createShallow, createMount } from '@material-ui/core/test-utils';
import DefPrivateRoute, { PrivateRoute } from '../PrivateRoute';
import PrivatePage from '../PrivatePage';

// store mock
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
configure({ adapter: new Adapter() });

const MOCK_PATH = '/user/dashboard';

describe('Private Route', () => {

    const shallow = createShallow();

    test('snapshot', () => {
        const tree = shallow(
            <PrivateRoute
                user={{}}
                path={MOCK_PATH}
                component={PrivatePage}
            />
        );
        expect(tree).toMatchSnapshot()
    })

    test('logged in status', () => {
        const wrapper = shallow(
            <PrivateRoute
                user={{}}
                path={MOCK_PATH}
                component={PrivatePage}
            />
        );
        expect(wrapper.find(Redirect)).toHaveLength(0);

        const route = wrapper.find(Route);
        expect(route).toHaveLength(1);
        expect(route.props()).toEqual({
            component: PrivatePage,
            path: MOCK_PATH
        });
    });

    test('not logged in status', () => {
        const wrapper = shallow(
            <PrivateRoute
                user={undefined}
                path={MOCK_PATH}
                component={PrivatePage}
            />
        );
        expect(wrapper.find(Route)).toHaveLength(0);

        const redirect = wrapper.find(Redirect);
        expect(redirect).toHaveLength(1);
        expect(redirect.props()).toEqual({
            to: {
                pathname: '/login',
                state: { referrer: MOCK_PATH }
            }
        });
    });
});

describe('connected component', () => {
    const mount = createMount();

    test('without user', () => {
        const wrapper = mount(
            <Provider store={mockStore({ user: {} })}>
                <MemoryRouter>
                    {<DefPrivateRoute />}
                </MemoryRouter>
            </Provider>
        );

        expect(wrapper.find(PrivateRoute).find(Redirect)).toHaveLength(1);
    });

    test('with user', () => {
        const wrapper = mount(
            <Provider store={mockStore({ user: { user: {} } })}>
                <MemoryRouter>
                    {<DefPrivateRoute />}
                </MemoryRouter>
            </Provider>
        );
        expect(wrapper.find(PrivateRoute).find(Redirect)).toHaveLength(0);
        expect(wrapper.find(PrivateRoute).find(Route)).toHaveLength(1);
    });
});