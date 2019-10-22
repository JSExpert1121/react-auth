/**
 * @name GlobalAction
 * @description global application configuration. language and title
 * @version 1.0
 * @todo according to spec
 * @author Darko
 */
import {
    GLOBAL_CHANGE_LOCALE,
    GLOBAL_SET_TITLE
} from '../constants';
import * as ApiConfig from 'service/config';

export const changeLocale = (locale: string) => {
    ApiConfig.setLanguage(locale);
    return ({
        type: GLOBAL_CHANGE_LOCALE,
        payload: locale
    });
}

export const setTitle = (title: string) => ({
    type: GLOBAL_SET_TITLE,
    payload: title
})

