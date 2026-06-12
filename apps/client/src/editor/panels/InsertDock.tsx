import { ScrollView, StyleSheet } from 'react-native';
import { AssetPicker } from './AssetPicker';
import { space } from '../../ui/theme';

/** 资产库滚动容器(桌面左栏 / iPad 竖屏抽屉复用)。手机弹层直接用 AssetPicker(避免嵌套滚动)。 */
export function InsertDock({ onItemAdded }: { onItemAdded?: () => void }) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <AssetPicker onItemAdded={onItemAdded} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: space.lg, gap: space.sm },
});
