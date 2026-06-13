import { View, StyleSheet } from 'react-native';
import { space } from '../../../ui/theme';
import { LensPicker } from './LensPicker';
import { AspectControl } from './AspectControl';
import { BgControl } from './BgControl';

/**
 * 检视面板正文:相机设置(镜头 + 画幅 + 底图)。
 * 姿势等「选中物体」操作在选中角色右上角的 HUD 快捷菜单(SelectionHud)里。
 * 断点无关 —— 桌面右栏、平板右抽屉、手机「相机」弹层共用。
 */
export function InspectorContent({ compact }: { compact?: boolean }) {
  return (
    <View style={styles.wrap}>
      <LensPicker compact={compact} />
      <AspectControl compact={compact} />
      <BgControl />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
});
