import type { TextStyle, ViewStyle } from 'react-native';

/**
 * 设计 token —— 全编辑器唯一的颜色/间距/字号/层级来源。
 * 纯 TS 对象(非 Context),StyleSheet.create 在模块作用域直接读取,零运行时开销。
 * 深色调沿用既有界面,补齐视觉升级所需的状态色/阴影/层级/断点。
 */

export const color = {
  bg: '#101014', // 画布 + 根背景
  panel: 'rgba(20,20,24,0.88)', // 浮层(半透,画布微透)
  panelSolid: '#16161a', // 抽屉/弹层(不透,避免画布穿透)
  surface: '#2a2a32', // 按钮/列表项底
  surfaceAlt: '#33333d', // chip 底
  surfaceHi: '#23232b', // 下拉列表底
  border: '#3a3a44',
  accent: '#3b6ef6', // 激活态实底
  accentDim: 'rgba(59,110,246,0.16)', // 选中弱底
  danger: '#e2503b', // 删除/危险动作
  text: '#ffffff',
  textDim: '#9aa0a6', // 标签
  textFaint: '#7e858d', // 区段标题/提示
  scrim: 'rgba(0,0,0,0.5)', // 抽屉/弹层遮罩
} as const;

export const space = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16, xxl: 24 } as const;

export const radius = { sm: 8, md: 10, lg: 12, xl: 16, pill: 999 } as const;

export const font = {
  hint: 11,
  label: 12,
  body: 13,
  btn: 14,
  title: 16,
  glyph: 22, // 资产卡片图标
  weightBtn: '600' as TextStyle['fontWeight'],
  weightTitle: '700' as TextStyle['fontWeight'],
} as const;

/** 触控规范:触屏 ≥44pt(Apple HIG);桌面指针精确可用 36。 */
export const touch = { min: 44, minDesktop: 36, hitSlop: 8 } as const;

/** 浮层投影(web → box-shadow;Android → elevation;iOS → shadow*)。 */
export const elevation: { panel: ViewStyle } = {
  panel: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
};

/** z 层级唯一来源,取代散落的 zIndex:10/1000。 */
export const z = {
  canvas: 0,
  panel: 10,
  toolbar: 20,
  drawer: 30,
  scrim: 35,
  sheet: 40,
  dropdown: 1000,
} as const;

/** 断点阈值(dp;react-native-web 下等于 CSS px)。 */
export const bp = { phone: 0, tablet: 600, desktop: 1024 } as const;

/** 布局尺寸 token —— 消灭魔法数字(尤其 left:174)。 */
export const layout = {
  libraryW: 200, // 桌面左栏宽
  rightDockW: 312, // 桌面右栏宽
  previewMax: 280, // 预览框长边上限
  previewMin: 132, // 紧凑态浮动缩略图长边
  gutter: space.lg, // 浮层与边的统一间距
  drawerW: 300, // iPad 竖屏左抽屉
  tabBarH: 60, // 手机底部 Tab 高
  toolbarH: 52, // 顶部工具条高
  gizmoGutter: 140, // 底部工具条右边界对齐右下角坐标系(gizmo,桌面 margin 72 + 尺寸)左侧的留白
} as const;

export const theme = { color, space, radius, font, touch, elevation, z, bp, layout };
export type Theme = typeof theme;
