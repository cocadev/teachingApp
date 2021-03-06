import ReactNative from 'react-native';
import I18n, {getLanguages} from 'react-native-i18n';

// Import all locales
import en from './en.json';
import pt from './pt.json';

// Should the app fallback to English if user locale doesn't exists
I18n.fallbacks = true;

// Define the supported translations
I18n.translations = {
  en,
  pt
};

getLanguages().then(languages => {
  console.log(languages); // ['en-US', 'en']
  if (languages[0] == 'pt-BR' || languages[0] == 'pt-PT') {
    I18n.defaultLocale = "pt";
    I18n.locale = "pt";
    I18n.currentLocale();
    console.log('turi but portugaliskai!');  
  } else {
    I18n.defaultLocale = "en";
    I18n.locale = "en";
    I18n.currentLocale();
    console.log('turi but angliskai!');
  }
});

const currentLocale = I18n.currentLocale();

// Is it a RTL language?
export const isRTL = currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string
export function strings(name, params = {}) {
  return I18n.t(name, params);
};

export default I18n;