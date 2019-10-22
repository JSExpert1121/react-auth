import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import App from './App';

import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import * as UserActions from 'store/actions/user';
import * as GlobalActions from 'store/actions/global';

import PrivatePage from 'containers/router/PrivatePage';
import PublicPage from 'containers/router/PublicPage';
import LoginPage from 'containers/pages/Auth/Login';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});
