import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { createShallow, createMount } from '@material-ui/core/test-utils';

import EllipsisText from '../Ellipsis';

configure({ adapter: new Adapter() });

describe('components/Typography/Ellipsis', () => {

    const shallow = createShallow();
    const childTxt = 'Hello world';

    test('UI without', () => {
        const wrapper = shallow(<EllipsisText hidden={false}>{childTxt}</EllipsisText>);

        expect(wrapper).toMatchSnapshot();
        expect(wrapper.find('span')).toHaveLength(1);
        expect(wrapper.find('span').first().props().children).toEqual(childTxt);
        console.log(wrapper.find('span').first().props());
    });

    test('UI without', () => {
        const wrapper = shallow(<EllipsisText hidden={true}>{childTxt}</EllipsisText>);
        expect(wrapper).toMatchSnapshot();
    });
});