import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';
import { createShallow } from '@material-ui/core/test-utils';

import HelpPage from '../index';
configure({ adapter: new Adapter() });



describe('containers/pages/Help', () => {
    const shallow = createShallow();

    const wrapper = shallow(<HelpPage />)
    test('snapshot test', () => {
        expect(wrapper).toMatchSnapshot();
    })
})