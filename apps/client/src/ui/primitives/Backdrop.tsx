import { Pressable, StyleSheet } from 'react-native';
import { color } from '../theme';

/** 半透遮罩:点击关闭上层覆盖物。父级负责定位与 zIndex。 */
export function Backdrop({ onPress }: { onPress: () => void }) {
  return <Pressable style={[StyleSheet.absoluteFill, styles.scrim]} onPress={onPress} />;
}

const styles = StyleSheet.create({
  scrim: { backgroundColor: color.scrim },
});
