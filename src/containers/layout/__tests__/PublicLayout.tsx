import React from 'react';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';
import { createShallow } from '@material-ui/core/test-utils';

import Box from '@material-ui/core/Box';

import { PublicLayout } from '../PublicLayout';
import Header from '../PublicHeader';
import Footer from '../PublicFooter';

configure({ adapter: new Adapter() });

describe('containers/layout/PublicLayout', () => {

    let shallow = undefined;
    beforeAll(() => {
        shallow = createShallow();
    });

    let wrapper = undefined;
    const children = 'hello layout';
    beforeEach(() => {
        wrapper = shallow(<PublicLayout>{children}</PublicLayout>)
    });

    test('UI components', () => {
        expect(wrapper.find(Box)).toHaveLength(2);
        expect(wrapper.find(Box).first().props().children).toHaveLength(3);
        expect(wrapper.find(Box).first().find(Header)).toHaveLength(1);
        expect(wrapper.find(Box).first().find(Footer)).toHaveLength(1);
        expect(wrapper.find(Box).last().props().children).toEqual(children);
    })
});