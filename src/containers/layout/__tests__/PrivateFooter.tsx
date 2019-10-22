/* disable tslint */
import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';
import { createShallow } from '@material-ui/core/test-utils';

import Box from '@material-ui/core/Box';

import { PrivateFooter } from '../PrivateFooter';

configure({ adapter: new Adapter() });

describe('containers/layout/PrivateFooter', () => {

    let shallow = undefined;
    beforeAll(() => {
        shallow = createShallow();
    });

    let wrapper = undefined;
    beforeEach(() => {
        wrapper = shallow(<PrivateFooter />)
    });

    test('UI components', () => {
        expect(wrapper.find(Box)).toHaveLength(1);
        expect(wrapper.find(Box).first().props().children).toContain('Hit! T');
    })
})