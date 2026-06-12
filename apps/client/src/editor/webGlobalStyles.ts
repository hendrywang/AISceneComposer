import { Platform } from 'react-native';

const CSS = `
  html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; }
  body { position: fixed; inset: 0; overflow: hidden; overscroll-behavior: none; }
  #root { display: flex; }
  canvas { touch-action: none; display: block; }
`;

/**
 * web 端全局设置(原生为 no-op):
 * 1) html/body/#root 撑满视口;body 固定 + 禁滚动 → 画布适配、页面不被拖动。
 * 2) touch-action:none 只加在 canvas → 触摸给 OrbitControls;其余 UI(资产库)可正常滚动。
 * 3) 拦截 iOS Safari 的捏合/双击「整页缩放」手势 → 否则缩放后 position:fixed 工具栏会被缩出可视区而"消失"。
 *    注:这不影响画布里 OrbitControls 的双指缩放(走 touch/pointer,另一套事件)。
 */
export function ensureWebGlobalStyles() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  let style = document.querySelector<HTMLStyleElement>('style[data-asc="global"]');
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('data-asc', 'global');
    document.head.appendChild(style);
  }
  style.textContent = CSS;

  const w = window as unknown as { __ascNoZoom?: boolean };
  if (!w.__ascNoZoom) {
    w.__ascNoZoom = true;
    const prevent = (e: Event) => e.preventDefault();
    const d = document as unknown as {
      addEventListener: (t: string, l: (e: Event) => void, o?: AddEventListenerOptions) => void;
    };
    // iOS Safari 专有的捏合手势事件
    d.addEventListener('gesturestart', prevent, { passive: false });
    d.addEventListener('gesturechange', prevent, { passive: false });
    d.addEventListener('gestureend', prevent, { passive: false });
    // 双击缩放
    d.addEventListener('dblclick', prevent, { passive: false });
  }
}
