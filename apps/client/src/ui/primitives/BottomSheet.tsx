import { useEffect, useRef } from 'react';
import { Animated, View, Pressable, Text, ScrollView, StyleSheet } from 'react-native';
import { color, radius, space, font, z, elevation } from '../theme';
import { safeBottom } from '../safeArea';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

/**
 * 底部弹层(手机:添加/姿势/机位)。
 * 常挂载、translateY 滑入;关闭时 pointerEvents=none。内容可滚动,底部留安全区。
 */
export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const ty = useRef(new Animated.Value(open ? 0 : 800)).current;
  const fade = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(ty, { toValue: open ? 0 : 800, duration: 240, useNativeDriver: false }).start();
    Animated.timing(fade, { toValue: open ? 1 : 0, duration: 240, useNativeDriver: false }).start();
  }, [open, ty, fade]);

  return (
    <View pointerEvents={open ? 'auto' : 'none'} style={[StyleSheet.absoluteFill, { zIndex: z.sheet }]}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, { opacity: fade }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[styles.sheet, { transform: [{ translateY: ty }] }]}>
        <View style={styles.grip} />
        {title ? (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8} style={styles.close}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>
        ) : null}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: safeBottom }]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrim: { backgroundColor: color.scrim },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '82%',
    backgroundColor: color.panelSolid,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.border,
    ...elevation.panel,
  },
  grip: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: color.border,
    marginTop: space.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.xs,
  },
  title: { color: color.text, fontSize: font.title, fontWeight: font.weightTitle },
  close: { padding: space.xs },
  closeText: { color: color.textDim, fontSize: font.title },
  scroll: { flexGrow: 0 },
  content: { padding: space.lg, gap: space.md },
});
