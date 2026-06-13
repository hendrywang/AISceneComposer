import { View, StyleSheet } from 'react-native';
import { useBreakpoint } from '../../ui/useBreakpoint';
import { space } from '../../ui/theme';
import { ShotStrip } from './inspector/ShotStrip';

/** 分镜储存条的响应式外壳:非桌面断点自限宽,保证横向缩略图条可滑动而非撑开浮层。 */
export function ShotDock() {
  const { width, isDesktop } = useBreakpoint();
  const wrapMax = isDesktop ? null : { maxWidth: Math.min(width - space.lg * 2, 640) };
  return (
    <View style={[styles.wrap, wrapMax]}>
      <ShotStrip />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
});
