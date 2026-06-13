import { useEffect, useRef } from 'react';
import { Animated, View, Pressable, StyleSheet } from 'react-native';
import { color, radius, space, z, layout, elevation } from '../theme';
import { safeTop, safeLeft } from '../safeArea';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number;
  /** 从哪侧滑入(默认左:资产库;右:检视面板) */
  side?: 'left' | 'right';
  children: React.ReactNode;
}

/**
 * 侧边滑入抽屉(iPad 竖屏:左=资产库、右=检视面板)。
 * 常挂载、用 translateX/opacity 动画进出;关闭时 pointerEvents=none → 不挡画布。
 */
export function Drawer({
  open,
  onClose,
  title,
  width = layout.drawerW,
  side = 'left',
  children,
}: DrawerProps) {
  const hidden = side === 'right' ? width : -width;
  const tx = useRef(new Animated.Value(open ? 0 : hidden)).current;
  const fade = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(tx, { toValue: open ? 0 : hidden, duration: 220, useNativeDriver: false }).start();
    Animated.timing(fade, { toValue: open ? 1 : 0, duration: 220, useNativeDriver: false }).start();
  }, [open, hidden, tx, fade]);

  return (
    <View pointerEvents={open ? 'auto' : 'none'} style={[StyleSheet.absoluteFill, { zIndex: z.drawer }]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: fade }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View
        style={[
          styles.panel,
          side === 'right' ? styles.panelRight : styles.panelLeft,
          {
            width,
            transform: [{ translateX: tx }],
            paddingTop: safeTop,
            paddingLeft: side === 'left' ? safeLeft : 0,
          },
        ]}
      >
        {title ? (
          <View style={styles.header}>
            <Animated.Text style={styles.title}>{title}</Animated.Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.close}>
              <Animated.Text style={styles.closeText}>✕</Animated.Text>
            </Pressable>
          </View>
        ) : null}
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { backgroundColor: color.scrim },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: color.panelSolid,
    borderColor: color.border,
    ...elevation.panel,
  },
  panelLeft: {
    left: 0,
    borderRightWidth: 1,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  panelRight: {
    right: 0,
    borderLeftWidth: 1,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.sm,
  },
  title: { color: color.text, fontSize: 16, fontWeight: '700' },
  close: { padding: space.xs },
  closeText: { color: color.textDim, fontSize: 16 },
});
