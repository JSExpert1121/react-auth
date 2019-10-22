/**
 * @name i18n.config
 * @description config file for i18n. currently support ko and en
 * @version 1.0
 * @todo add locales
 * @author Darko
 */
const enMessages = require('translations/en.json');
const koMessages = require('translations/ko.json');

export const DEFAULT_LOCALE = 'en';

export const appLocales = [
    { code: 'en', name: 'English' },
    { code: 'ko', name: 'Korean' }
];

// auxilliary function to generate messages for each locales
export const formatMessages: (locale: string, messages: Record<string, string>) => Record<string, string> = (locale, messages) => {
    const defaultFormattedMessages =
        locale !== DEFAULT_LOCALE
            ? formatMessages(DEFAULT_LOCALE, enMessages)
            : {};
    const flattenFormattedMessages = (formattedMessages: Record<string, string>, key: string) => {
        const formattedMessage =
            !messages[key] && locale !== DEFAULT_LOCALE
                ? defaultFormattedMessages[key]
                : messages[key];
        return Object.assign(formattedMessages, { [key]: formattedMessage });
    };
    return Object.keys(messages).reduce(flattenFormattedMessages, {});
};

export const translationMessages = {
    en: formatMessages('en', enMessages),
    ko: formatMessages('ko', koMessages),
};
