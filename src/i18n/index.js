import en from './en.json';
import pt from './pt.json';

// PT-BR primary (Brazil/Portugal market). EN is the international toggle.
// Spanish was dropped in v3 — re-add later if pipeline justifies it.
export const translations = { pt, en };
export const defaultLang = 'pt';
export const supportedLangs = ['pt', 'en'];
