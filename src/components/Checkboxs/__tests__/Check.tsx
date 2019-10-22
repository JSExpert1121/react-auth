import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Check from '../Check';


import { createShallow } from '@material-ui/core/test-utils';
configure({ adapter: new Adapter() });

describe('components/Checkboxs/Check', () => {

    const shallow = createShallow();

    const Txt = 'Hello check!'
    let wrapper = undefined;
    beforeEach(() => {
        wrapper = shallow(<Check label={Txt} />);
    });

    test('UI components', () => {
        expect(wrapper.find(Box)).toHaveLength(2);
        expect(wrapper.find(Box).first().props().children).toHaveLength(2);
        expect(wrapper.find(Box).first().props().children[1]).toEqual(Txt);
        expect(wrapper.find(Box).last().find(Checkbox)).toHaveLength(1);
        expect(wrapper.find(Box).last().find(Checkbox).first().props()).toEqual({});
    })
})