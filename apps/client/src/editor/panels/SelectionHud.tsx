import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useEditor } from '../../store/editorStore';
import { useUI } from '../../ui/uiStore';
import { POSE_OPTIONS } from '../poses';
import { useHoverTip, TooltipBubble } from '../../ui/primitives/Tooltip';
import { color, space, radius, font, z, elevation } from '../../ui/theme';

/** HUD 内的小图标按钮(带悬停提示)。 */
function HudIconBtn({
  icon,
  tip,
  active,
  danger,
  onPress,
}: {
  icon: string;
  tip: string;
  active?: boolean;
  danger?: boolean;
  onPress: () => void;
}) {
  const { ref, hovered, align, hoverProps } = useHoverTip();
  return (
    <View ref={ref} style={styles.tipAnchor}>
      <Pressable
        {...hoverProps}
        onPress={onPress}
        style={({ pressed }) => [
          styles.iconBtn,
          active && styles.iconBtnActive,
          danger && styles.iconBtnDanger,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.iconGlyph}>{icon}</Text>
      </Pressable>
      {hovered ? <TooltipBubble label={tip} place="top" align={align} /> : null}
    </View>
  );
}

/**
 * 选中物体的悬浮快捷工具条:跟随物体右上角。
 * 折叠态 = 一个触发按钮;展开后 = 变换(移动/旋转/复制/删除)+ 角色姿势快捷选择。
 * 位置由画布内的 SelectionHudTracker 投影计算并写入 uiStore。
 */
export function SelectionHud() {
  const visible = useUI((s) => s.hudVisible);
  const x = useUI((s) => s.hudX);
  const y = useUI((s) => s.hudY);
  const dragging = useUI((s) => s.dragging);

  const selectedId = useEditor((s) => s.selectedId);
  const objects = useEditor((s) => s.objects);
  const mode = useEditor((s) => s.transformMode);
  const setMode = useEditor((s) => s.setMode);
  const duplicateSelected = useEditor((s) => s.duplicateSelected);
  const removeSelected = useEditor((s) => s.removeSelected);
  const setPose = useEditor((s) => s.setPose);

  const [open, setOpen] = useState(false);
  const sel = objects.find((o) => o.id === selectedId) ?? null;

  // 切换选择对象时收起,避免错位
  useEffect(() => {
    setOpen(false);
  }, [selectedId]);

  if (!visible || !sel) return null;
  const isActor = sel.kind === 'actor';

  // 拖动读数:移动 → 绝对坐标(米,Y 锁地面);旋转 → 角度(0–360°)
  const deg = ((((sel.rotationY * 180) / Math.PI) % 360) + 360) % 360;
  const readout =
    mode === 'rotate'
      ? `${deg.toFixed(0)}°`
      : `X ${sel.position[0].toFixed(2)}   Z ${sel.position[2].toFixed(2)}  m`;

  return (
    <View style={[styles.root, { left: x, top: y }]} pointerEvents="box-none">
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={({ pressed }) => [styles.trigger, open && styles.triggerOpen, pressed && styles.pressed]}
      >
        <Text style={styles.triggerGlyph}>{open ? '✕' : '✦'}</Text>
      </Pressable>

      {dragging && (
        <View style={styles.readout} pointerEvents="none">
          <Text style={styles.readoutText}>{readout}</Text>
        </View>
      )}

      {open && (
        <View style={styles.card}>
          {/* 变换 */}
          <View style={styles.row}>
            <HudIconBtn icon="🖐️" tip="移动" active={mode === 'translate'} onPress={() => setMode('translate')} />
            <HudIconBtn icon="🔄" tip="旋转" active={mode === 'rotate'} onPress={() => setMode('rotate')} />
            <HudIconBtn icon="📋" tip="复制" onPress={duplicateSelected} />
            <HudIconBtn icon="🗑" tip="删除" danger onPress={removeSelected} />
          </View>

          {/* 姿势(仅角色) */}
          {isActor && (
            <>
              <View style={styles.divider} />
              <Text style={styles.label}>姿势</Text>
              <View style={styles.poseRow}>
                {POSE_OPTIONS.map((po) => (
                  <Pressable
                    key={po.id}
                    onPress={() => setPose(sel.id, po.id)}
                    style={({ pressed }) => [
                      styles.poseChip,
                      sel.poseId === po.id && styles.poseChipActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.poseText}>{po.label}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', zIndex: z.toolbar, alignItems: 'flex-start' },
  tipAnchor: { position: 'relative' },

  trigger: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: color.accent,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.panel,
  },
  triggerOpen: { backgroundColor: color.surfaceHi },
  triggerGlyph: { color: color.text, fontSize: 15, fontWeight: font.weightTitle },

  readout: {
    marginTop: space.xs,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(10,10,12,0.92)',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
    ...elevation.panel,
  },
  readoutText: {
    color: color.text,
    fontSize: font.label,
    fontWeight: font.weightBtn,
    fontVariant: ['tabular-nums'],
  },

  card: {
    marginTop: space.sm,
    backgroundColor: color.panelSolid,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    padding: space.sm,
    gap: space.xs,
    maxWidth: 220,
    ...elevation.panel,
  },
  row: { flexDirection: 'row', gap: space.xs },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: { backgroundColor: color.accent },
  iconBtnDanger: { borderColor: color.danger },
  iconGlyph: { fontSize: 16, color: color.text },

  divider: { height: 1, backgroundColor: color.border, marginVertical: space.xs },
  label: { color: color.textFaint, fontSize: font.hint, fontWeight: font.weightBtn },
  poseRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  poseChip: {
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
    borderRadius: radius.sm,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: 'transparent',
    minHeight: 30,
    justifyContent: 'center',
  },
  poseChipActive: { backgroundColor: color.accentDim, borderColor: color.accent },
  poseText: { color: color.text, fontSize: font.label, fontWeight: font.weightBtn },

  pressed: { opacity: 0.7 },
});
