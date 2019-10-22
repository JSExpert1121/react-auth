import {
    GLOBAL_CHANGE_LOCALE,
    GLOBAL_SET_TITLE
} from '../../constants';

import * as GlobalAction from '../global';

const MOCK_LOCALE = 'ko';
const MOCK_TITLE = 'Hit!T';

describe('Global Actions', () => {

    test('change locale action', () => {
        const expectedAction = {
            type: GLOBAL_CHANGE_LOCALE,
            payload: MOCK_LOCALE
        };

        expect(GlobalAction.changeLocale(MOCK_LOCALE)).toEqual(expectedAction);
    });

    test('set title', () => {
        const expectedAction = {
            type: GLOBAL_SET_TITLE,
            payload: MOCK_TITLE
        };

        expect(GlobalAction.setTitle(MOCK_TITLE)).toEqual(expectedAction);
    });
})