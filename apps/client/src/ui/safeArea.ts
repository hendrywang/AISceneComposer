import { Platform } from 'react-native';

/**
 * 安全区内边距 —— 适配 iPhone 刘海/Home 条。
 * web:透传 CSS `env(safe-area-inset-*)`(react-native-web 会原样写进 DOM 样式);
 * native:返回 0(原生打包延后,D15)。
 *
 * 类型标成 number 便于直接用于 padding,把唯一的 cast 收敛在此处。
 * 注意:env() 仅在 <meta viewport-fit=cover> 存在时非 0(见 webGlobalStyles)。
 * 用法上只单独作为某一侧 padding,勿与数字做算术(web 下是字符串)。
 */
const inset = (side: 'top' | 'bottom' | 'left' | 'right'): number =>
  Platform.OS === 'web' ? (`env(safe-area-inset-${side}, 0px)` as unknown as number) : 0;

export const safeTop = inset('top');
export const safeBottom = inset('bottom');
export const safeLeft = inset('left');
export const safeRight = inset('right');
