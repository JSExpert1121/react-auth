import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';
import { createShallow } from '@material-ui/core/test-utils';

import Box from '@material-ui/core/Box';

import { PrivateLayout } from '../PrivateLayout';
import Header from '../PrivateHeader';
import Footer from '../PrivateFooter';

configure({ adapter: new Adapter() });

describe('containers/layout/PrivateLayout', () => {

    let shallow = undefined;
    beforeAll(() => {
        shallow = createShallow();
    });

    let wrapper = undefined;
    const children = 'hello layout';
    beforeEach(() => {
        wrapper = shallow(<PrivateLayout>{children}</PrivateLayout>)
    });

    test('UI components', () => {
        expect(wrapper.find(Box)).toHaveLength(2);
        expect(wrapper.find(Box).first().props().children).toHaveLength(3);
        expect(wrapper.find(Box).first().find(Header)).toHaveLength(1);
        expect(wrapper.find(Box).first().find(Footer)).toHaveLength(1);
        expect(wrapper.find(Box).last().props().children).toEqual(children);
    })
});