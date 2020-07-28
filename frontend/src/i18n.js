import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import nlError from './lang/nl/error.json';
import nlCommon from './lang/nl/common.json';
import nlManage from './lang/nl/manage.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      nl: {
        error: nlError,
        common: nlCommon,
        manage: nlManage,
      },
    },
    lng: 'nl',
    fallbackLng: 'nl',

    interpolation: {
      escapeValue: false, // Not necessary in React
    },
  });

export default i18n;
