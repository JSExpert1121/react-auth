import {
    GLOBAL_CHANGE_LOCALE,
    GLOBAL_SET_TITLE
} from '../../constants';
import reducer from '../global';

const initState = {
    locale: 'en',
    title: 'Hit! t'
};

describe('global reducer', () => {

    test('Initial state', () => {
        expect(reducer(undefined, { type: '' })).toEqual(initState);
    });

    test('Change locale', () => {
        expect(reducer(undefined, { type: GLOBAL_CHANGE_LOCALE, payload: 'ko' })).toEqual({
            locale: 'ko',
            title: 'Hit! t'
        });
    });

    test('Set title', () => {
        expect(reducer(undefined, { type: GLOBAL_SET_TITLE, payload: 'Hit! T' })).toEqual({
            locale: 'en',
            title: 'Hit! T'
        });
    })
})