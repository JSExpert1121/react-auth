import React from 'react';
import { MemoryRouter, withRouter } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createMount } from '@material-ui/core/test-utils';
import { ThemeProvider } from '@material-ui/styles';
import { IntlProvider, injectIntl } from "react-intl";

import { translationMessages } from 'config/i18n.config';
import theme from 'config/theme.config';

// store mock
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
import {
    GLOBAL_SET_TITLE,
} from 'store/constants';

import DefMapView from '../index';

configure({ adapter: new Adapter() });

const ConnectedMapView = withRouter(DefMapView);

describe('containers/pages/Map', () => {

    const store = mockStore({
        user: undefined,
        token: undefined
    });

    const mount = createMount();
    const setTitle = jest.fn();
    const wrapper = mount(
        <Provider store={store}>
            <MemoryRouter>
                <IntlProvider locale='en' messages={translationMessages.en}>
                    <ThemeProvider theme={theme}>
                        {<ConnectedMapView />}
                    </ThemeProvider>
                </IntlProvider>
            </MemoryRouter>
        </Provider>
    );

    test('Snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    });

    test('SetTitle', done => {
        wrapper.update();
        expect(store.getActions()).toHaveLength(1);
        expect(store.getActions()).toContainEqual({
            type: GLOBAL_SET_TITLE,
            payload: 'Map View'
        });
        done();
    });
});
