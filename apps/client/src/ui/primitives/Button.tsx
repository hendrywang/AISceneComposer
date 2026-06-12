import { Pressable, Text, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { color, space, radius, font, touch } from '../theme';
import { useHoverTip, TooltipBubble, type TipPlace } from './Tooltip';

export type ButtonTone = 'default' | 'accent' | 'danger';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  active?: boolean;
  icon?: string; // emoji/glyph 前缀
  tone?: ButtonTone;
  compact?: boolean; // 桌面更紧凑(36 高)
  disabled?: boolean;
  grow?: boolean; // flex:1 填满
  tooltip?: string; // 悬停提示(鼠标/触控板/Apple Pencil 悬停时显示)
  tooltipPlace?: TipPlace; // 提示方向(默认上方;顶部工具栏用 'bottom')
  style?: StyleProp<ViewStyle>;
}

/** 统一按钮:token 化、最小触控区、激活/按下/禁用态一致。可选悬停提示。 */
export function Button({
  label,
  onPress,
  active,
  icon,
  tone = 'default',
  compact,
  disabled,
  grow,
  tooltip,
  tooltipPlace = 'top',
  style,
}: ButtonProps) {
  const bg = active
    ? tone === 'danger'
      ? color.danger
      : color.accent
    : color.surface;

  const { ref, hovered, align, hoverProps } = useHoverTip();

  const button = (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      {...(tooltip ? hoverProps : null)}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        { backgroundColor: bg },
        grow && styles.grow,
        active && styles.activeBorder,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}
        <Text
          style={[styles.label, tone === 'danger' && !active && styles.dangerText]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );

  if (!tooltip) return button;
  return (
    <View ref={ref} style={[styles.anchor, grow && styles.grow]}>
      {button}
      {hovered ? <TooltipBubble label={tooltip} place={tooltipPlace} align={align} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touch.min,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.sm,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compact: { minHeight: touch.minDesktop, paddingVertical: space.sm },
  grow: { flex: 1 },
  anchor: { position: 'relative' },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  icon: { fontSize: font.btn },
  label: { color: color.text, fontSize: font.btn, fontWeight: font.weightBtn },
  dangerText: { color: color.danger },
  activeBorder: { borderColor: 'rgba(255,255,255,0.18)' },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.38 },
});
