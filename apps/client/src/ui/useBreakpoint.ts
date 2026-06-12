import { useWindowDimensions } from 'react-native';
import { bp } from './theme';

export type Device = 'phone' | 'tablet' | 'desktop';

export interface Breakpoint {
  device: Device;
  width: number;
  height: number;
  isLandscape: boolean;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  /** 手机 或 平板竖屏 → 用抽屉/弹层等紧凑布局 */
  isCompact: boolean;
}

/**
 * 响应式断点(基于 useWindowDimensions,旋转/缩放自动 re-render)。
 * <600 手机 · 600–1023 平板(iPad 竖屏落此,isCompact) · ≥1024 桌面(iPad 横屏落此,主力面)。
 */
export function useBreakpoint(): Breakpoint {
  const { width, height } = useWindowDimensions();
  const device: Device = width >= bp.desktop ? 'desktop' : width >= bp.tablet ? 'tablet' : 'phone';
  const isLandscape = width >= height;
  return {
    device,
    width,
    height,
    isLandscape,
    isPhone: device === 'phone',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    isCompact: device === 'phone' || (device === 'tablet' && !isLandscape),
  };
}
