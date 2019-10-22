import React from 'react';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import Avatar from '@material-ui/core/Avatar';

import { createShallow } from '@material-ui/core/test-utils';
configure({ adapter: new Adapter() });

import ProfileButton from '../ProfileButton';

const MOCK_NAME = 'darko-vasilev';
const MOCK_PHOTO = 'https://google.com/000.png';

describe('components/Buttons/ProfileButton', () => {
    const shallow = createShallow();

    test('UI components', () => {
        const wrapper = shallow(
            <ProfileButton name={MOCK_NAME} avatar={MOCK_PHOTO} />
        );

        expect(wrapper.find(Avatar)).toHaveLength(1);
        expect(wrapper.find(Avatar).first().props().src).toEqual(MOCK_PHOTO);
        expect(wrapper.find(Avatar).first().props().alt).toEqual(MOCK_NAME);

    });

    test('UI components for empty avatar', () => {
        const wrapper = shallow(
            <ProfileButton name={MOCK_NAME} />
        );

        expect(wrapper.find(Avatar)).toHaveLength(1);
        expect(wrapper.find(Avatar).first().props().children).toEqual('D');
    });
})