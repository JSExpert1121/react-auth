import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build';

import { createShallow } from '@material-ui/core/test-utils';
import { LanguageProvider } from '../LanguageProvider';
import { translationMessages } from 'config/i18n.config';
import { IntlProvider } from 'react-intl';

configure({ adapter: new Adapter() });

describe('Language Provider', () => {

    const shallow = createShallow();
    const wrapper = shallow(<LanguageProvider locale='en' messages={translationMessages} />);

    test('snapshot', () => {
        expect(wrapper).toMatchSnapshot()
    });

    test('children', () => {
        expect(wrapper.find(IntlProvider)).toHaveLength(1);
        expect(wrapper.props().children).toEqual(wrapper.find(IntlProvider).props().children);
    })

});