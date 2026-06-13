import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { color, radius, elevation } from '../../../ui/theme';
// PreviewCanvas 只在此处挂载,保证全应用生命周期仅一个预览 WebGL 上下文(导出依赖它)。
import { PreviewCanvas } from '../../Preview';

/**
 * 预览画布盒子:承载全应用唯一的 PreviewCanvas(WebGL 上下文)。
 * 只要本组件保持在同一渲染槽位、PreviewCanvas 永远是其子节点,画布就不会重挂(导出/截图依赖此)。
 * 尺寸由父级给定;children = 压在画面上的角标控件(chrome)。
 */
export function PreviewSurface({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children?: ReactNode;
}) {
  return (
    <View style={[styles.frame, { width, height }]} pointerEvents="box-none">
      <View style={styles.box} pointerEvents="auto">
        <PreviewCanvas />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { position: 'relative' },
  box: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: '#0b0b0e',
    ...elevation.panel,
  },
});
