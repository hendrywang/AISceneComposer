import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { color, radius, space, elevation } from '../theme';

export interface PanelProps {
  children: React.ReactNode;
  /** 不透底(抽屉/弹层用);默认半透浮层 */
  solid?: boolean;
  /** 去掉默认内边距 */
  noPadding?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** 统一浮层容器:背景 + 边框 + 圆角 + 投影。 */
export function Panel({ children, solid, noPadding, style }: PanelProps) {
  return (
    <View style={[styles.base, solid && styles.solid, !noPadding && styles.padding, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: color.panel,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    ...elevation.panel,
  },
  solid: { backgroundColor: color.panelSolid },
  padding: { padding: space.md },
});
