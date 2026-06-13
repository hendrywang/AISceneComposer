import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { ModelInfo } from '@asc/shared-types';
import { type AppLanguage, detectDeviceLanguage } from '../i18n/languages';

/** 出图分辨率档(像素长边),价格随之变化。 */
export type OutputResolution = '512' | '1024' | '2048' | '4096';

/** Nano Banana 2(默认,沿用现有 generateContent + 底图条件生成链路)。 */
export const DEFAULT_MODEL = 'gemini-3.1-flash-image';

/**
 * 用户设置 —— 首个引入持久化的 store(zustand persist → localStorage)。
 * 与 editorStore(场景文档)分离:这些是跨会话的偏好,不进场景存档。
 * API Key 为 BYOK:明文存本机浏览器,随请求发往自有后端,后端用它调 Gemini。
 */
export interface SettingsState {
  geminiApiKey: string;
  /** 出图模型 id(Gemini 图像族) */
  model: string;
  /** 用 Key 校验后从 Google 读到的可用出图模型(空 = 还没查过,UI 回退内置清单) */
  availableModels: ModelInfo[];
  /** 出图分辨率档 */
  outputResolution: OutputResolution;
  /** 取景/导出 PNG 的长边像素 */
  exportLongEdge: number;
  /** 默认画幅比例(如 '16:9') */
  defaultAspect: string;
  /** 界面语言 */
  language: AppLanguage;

  setApiKey: (v: string) => void;
  setModel: (v: string) => void;
  setAvailableModels: (v: ModelInfo[]) => void;
  setOutputResolution: (v: OutputResolution) => void;
  setExportLongEdge: (v: number) => void;
  setDefaultAspect: (v: string) => void;
  setLanguage: (v: AppLanguage) => void;
}

/** 无 localStorage(SSR/构建/原生)时的空实现,避免持久化中间件抛错。 */
const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      geminiApiKey: '',
      model: DEFAULT_MODEL,
      availableModels: [],
      outputResolution: '1024',
      exportLongEdge: 1920,
      defaultAspect: '16:9',
      // 首次启动随设备语言;之后被 persist 的持久值覆盖。
      language: detectDeviceLanguage(),

      setApiKey: (v) => set({ geminiApiKey: v }),
      setModel: (v) => set({ model: v }),
      setAvailableModels: (v) => set({ availableModels: v }),
      setOutputResolution: (v) => set({ outputResolution: v }),
      setExportLongEdge: (v) => set({ exportLongEdge: v }),
      setDefaultAspect: (v) => set({ defaultAspect: v }),
      setLanguage: (v) => set({ language: v }),
    }),
    {
      name: 'asc-settings',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' && window.localStorage ? window.localStorage : noopStorage,
      ),
    },
  ),
);
