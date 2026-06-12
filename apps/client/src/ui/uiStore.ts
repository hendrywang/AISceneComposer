import { create } from 'zustand';

/** 手机底部 Tab 触发的弹层种类 */
export type SheetKind = 'add' | 'pose' | 'camera';

/**
 * 临时 UI 态 —— 与场景文档(editorStore)分离,保证文档模型对后续 Firestore(D13)序列化干净。
 * 这些状态只影响布局呈现,不进画布订阅(避免无谓 3D 重绘)。
 */
interface UIState {
  /** iPad 竖屏:左侧资产抽屉开关 */
  libraryOpen: boolean;
  /** 手机:当前打开的底部弹层(同一时刻仅一个) */
  activeSheet: SheetKind | null;
  /** 紧凑态:把取景预览放大为覆盖层 */
  previewExpanded: boolean;

  /** 选中物体的悬浮工具条锚点(屏幕像素;由画布内的投影追踪器写入) */
  hudX: number;
  hudY: number;
  hudVisible: boolean;
  /** 正在拖动 gizmo(移动/旋转)→ 显示数值读数 */
  dragging: boolean;

  toggleLibrary: () => void;
  setLibrary: (open: boolean) => void;
  openSheet: (s: SheetKind) => void;
  closeSheet: () => void;
  togglePreview: () => void;
  setPreviewExpanded: (v: boolean) => void;
  setHud: (x: number, y: number, visible: boolean) => void;
  setDragging: (v: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  libraryOpen: false,
  activeSheet: null,
  previewExpanded: false,
  hudX: 0,
  hudY: 0,
  hudVisible: false,
  dragging: false,

  toggleLibrary: () => set((s) => ({ libraryOpen: !s.libraryOpen })),
  setLibrary: (open) => set({ libraryOpen: open }),
  openSheet: (s) => set({ activeSheet: s }),
  closeSheet: () => set({ activeSheet: null }),
  togglePreview: () => set((s) => ({ previewExpanded: !s.previewExpanded })),
  setPreviewExpanded: (v) => set({ previewExpanded: v }),
  setHud: (x, y, visible) => set({ hudX: x, hudY: y, hudVisible: visible }),
  setDragging: (v) => set({ dragging: v }),
}));
