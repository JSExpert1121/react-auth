import { formatMessages } from '../i18n.config';

jest.mock('translations/en.json', () => ({
    message1: 'Yes',
    message2: 'No',
}));

const koTranslationMessages = {
    message1: '안녕하세요',
    message2: '',
};

describe('formatMessages', () => {
    it('should build only defaults when DEFAULT_LOCALE', () => {
        const result = formatMessages('en', { a: 'a' });

        expect(result).toEqual({ a: 'a' });
    });

    it('should combine default locale and current locale when not DEFAULT_LOCALE', () => {
        const result = formatMessages('', koTranslationMessages);

        expect(result).toEqual({
            message1: '안녕하세요',
            message2: 'No',
        });
    });
});