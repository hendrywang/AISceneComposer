import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { color, radius, space, font, z, elevation } from '../theme';

export type TipPlace = 'top' | 'bottom';
export type TipAlign = 'start' | 'end';

const HOVER_DELAY = 450; // 悬停意图延时(ms):停留片刻才弹,避免划过就闪

/**
 * 悬停提示状态 + 自动定位 + 延时。
 * - RNW 的 hover 走指针事件 → 鼠标/触控板 **与 Apple Pencil 悬停** 都会触发;手指点按不触发。
 * - 悬停停留 ~0.45s 才显示(划过不弹);移开立即消失。
 * - onHoverIn 时量出触发元素在窗口中的位置,自动决定气泡往左还是往右展开(贴右边缘的按钮往左展),避免被屏幕裁切。
 * - 把返回的 ref 挂到 position:relative 的锚点 View 上,hoverProps 挂到 Pressable 上。
 */
export function useHoverTip(delay = HOVER_DELAY) {
  const ref = useRef<View>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = useState(false);
  const [align, setAlign] = useState<TipAlign>('start');

  const clearTimer = () => {
    if (timer.current != null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const onHoverIn = () => {
    const node = ref.current;
    if (node) {
      node.measureInWindow((x: number, _y: number, w: number) => {
        const sw = Dimensions.get('window').width;
        // 锚点中心落在屏幕右半 → 气泡贴右边(向左展开),否则贴左边(向右展开)
        setAlign(x + w / 2 > sw / 2 ? 'end' : 'start');
      });
    }
    clearTimer();
    timer.current = setTimeout(() => setHovered(true), delay);
  };

  const onHoverOut = () => {
    clearTimer();
    setHovered(false);
  };

  useEffect(() => clearTimer, []); // 卸载时清掉未触发的定时器

  return { ref, hovered, align, hoverProps: { onHoverIn, onHoverOut } };
}

/**
 * 提示气泡。绝对定位在触发元素上/下方;父元素需 position:relative。
 * 固定 minWidth + 自动换行 → 任意语言/长度都横向多行排版,绝不退化成竖排单字。
 */
export function TooltipBubble({
  label,
  place = 'top',
  align = 'start',
}: {
  label: string;
  place?: TipPlace;
  align?: TipAlign;
}) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.bubble,
        place === 'top' ? styles.top : styles.bottom,
        align === 'end' ? styles.end : styles.start,
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    minWidth: 132, // 防止被窄锚点挤成竖排单字
    maxWidth: 240,
    backgroundColor: 'rgba(10,10,12,0.97)',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
    zIndex: z.dropdown,
    ...elevation.panel,
  },
  top: { bottom: '100%', marginBottom: space.xs },
  bottom: { top: '100%', marginTop: space.xs },
  start: { left: 0 },
  end: { right: 0 },
  text: { color: color.text, fontSize: font.label, fontWeight: font.weightBtn, lineHeight: 17 },
});
