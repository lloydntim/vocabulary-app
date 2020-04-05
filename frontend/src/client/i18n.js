import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

import translationEn from '../locales/en/translation.json';
import translationDe from '../locales/de/translation.json';
import translationEs from '../locales/es/translation.json';
import translationPt from '../locales/pt/translation.json';
import translationFr from '../locales/fr/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEn,
      },
      de: {
        translation: translationDe,
      },
      es: {
        translation: translationEs,
      },
      pt: {
        translation: translationPt,
      },
      fr: {
        translation: translationFr,
      },
    },
    detection: {
      order: ['cookie', 'navigator', 'localStorage', 'querystring', 'htmlTag', 'path', 'subdomain'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage', 'cookie'],
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
