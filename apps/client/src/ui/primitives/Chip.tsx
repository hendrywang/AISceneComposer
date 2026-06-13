import { Pressable, Text, View, StyleSheet } from 'react-native';
import { color, space, radius, font, touch } from '../theme';

export interface ChipProps {
  label: string;
  onPress: () => void;
  active?: boolean;
  /** 可选的删除回调:出现一个 ✕ 角标 */
  onRemove?: () => void;
}

/** 紧凑标签按钮(分类 Tab)。 */
export function Chip({ label, onPress, active, onRemove }: ChipProps) {
  return (
    <View style={[styles.wrap, active && styles.wrapActive]}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.press, pressed && styles.pressed]}>
        <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
          {label}
        </Text>
      </Pressable>
      {onRemove ? (
        <Pressable onPress={onRemove} hitSlop={touch.hitSlop} style={styles.remove}>
          <Text style={styles.removeText}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.surfaceAlt,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: space.xs,
    minHeight: 34,
  },
  wrapActive: { backgroundColor: color.accentDim, borderColor: color.accent },
  press: { paddingVertical: space.sm, paddingHorizontal: space.sm, justifyContent: 'center' },
  pressed: { opacity: 0.7 },
  label: { color: color.text, fontSize: font.body, fontWeight: font.weightBtn },
  labelActive: { color: color.text },
  remove: { paddingHorizontal: space.xs, paddingVertical: space.xs },
  removeText: { color: color.textDim, fontSize: font.label },
});
