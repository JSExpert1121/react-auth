import { oauthClient } from './base';

export const setLanguage = (lang: string) => {
    oauthClient.setLanguage(lang);
}
