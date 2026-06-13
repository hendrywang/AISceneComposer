/** 应用支持的界面语言。 */
export type AppLanguage = 'zh-Hans' | 'zh-Hant' | 'en';

/** 语言切换器用的有序清单(标签用各自语言书写,便于识别)。 */
export const LANGUAGES: { id: AppLanguage; label: string }[] = [
  { id: 'zh-Hans', label: '简体中文' },
  { id: 'zh-Hant', label: '繁體中文' },
  { id: 'en', label: 'English' },
];

/**
 * 设备语言 → 应用语言;识别不出一律回退英文。
 * Web-only(D15):直接读 navigator.language,避免引入 expo-localization(它会拽进
 * react-native 的 Flow 源,破坏 Node 测试 / esbuild 转译)。无 navigator 时回退英文。
 */
export function detectDeviceLanguage(): AppLanguage {
  try {
    const nav = typeof navigator !== 'undefined' ? navigator : undefined;
    const tag = (nav?.language ?? '').toLowerCase();
    if (tag.startsWith('zh')) {
      if (['hant', 'tw', 'hk', 'mo'].some((s) => tag.includes(s))) return 'zh-Hant';
      return 'zh-Hans';
    }
    return 'en';
  } catch {
    return 'en';
  }
}
