import { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { color, space, radius, font, touch, z } from '../theme';

export interface DropdownProps {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  /** 列表展开方向(默认向右对齐) */
  align?: 'left' | 'right';
}

/** 简单下拉(RN 跨端:点按展开列表)。token 化 + 最小触控区。 */
export function Dropdown({ value, options, onChange, align = 'right' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      >
        <Text style={styles.btnText}>
          {value} {open ? '▴' : '▾'}
        </Text>
      </Pressable>
      {open && (
        <View style={[styles.list, align === 'right' ? { right: 0 } : { left: 0 }]}>
          {options.map((o) => (
            <Pressable
              key={o}
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
              style={({ pressed }) => [styles.item, pressed && styles.pressed, o === value && styles.itemActive]}
            >
              <Text style={styles.btnText}>{o}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative', zIndex: z.dropdown },
  btn: {
    minHeight: touch.min,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.sm,
    backgroundColor: color.surface,
    justifyContent: 'center',
  },
  list: {
    position: 'absolute',
    top: touch.min + space.xs,
    backgroundColor: color.surfaceHi,
    borderRadius: radius.sm,
    paddingVertical: space.xs,
    minWidth: 96,
    zIndex: z.dropdown,
    borderWidth: 1,
    borderColor: color.border,
  },
  item: { minHeight: touch.min, paddingHorizontal: space.lg, justifyContent: 'center', borderRadius: radius.sm },
  itemActive: { backgroundColor: color.accentDim },
  pressed: { opacity: 0.7 },
  btnText: { color: color.text, fontSize: font.btn, fontWeight: font.weightBtn },
});
