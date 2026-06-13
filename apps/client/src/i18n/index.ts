import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useSettings } from '../store/settingsStore';
import zhHans from './locales/zh-Hans';
import zhHant from './locales/zh-Hant';
import en from './locales/en';

export const resources = {
  'zh-Hans': { translation: zhHans },
  'zh-Hant': { translation: zhHant },
  en: { translation: en },
} as const;

// 初始语言 = 设置里持久化的语言(无持久值时为设备探测的默认)。
void i18n.use(initReactI18next).init({
  resources,
  lng: useSettings.getState().language,
  fallbackLng: 'en',
  interpolation: { escapeValue: false }, // React 已防 XSS
  returnNull: false,
  react: { useSuspense: false }, // 资源同步内置,无需 Suspense
});

export default i18n;
