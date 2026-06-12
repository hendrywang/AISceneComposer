import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useEditor } from '../../store/editorStore';
import { useUI } from '../../ui/uiStore';
import { useBreakpoint } from '../../ui/useBreakpoint';
import { Backdrop } from '../../ui/primitives/Backdrop';
import { useHoverTip, TooltipBubble, type TipPlace } from '../../ui/primitives/Tooltip';
import { color, space, radius, font, z, layout, elevation } from '../../ui/theme';
import { safeTop } from '../../ui/safeArea';
import { previewControl } from '../cameraSync';
// PreviewCanvas 只在此处挂载,保证全应用生命周期仅一个预览 WebGL 上下文(导出依赖它)。
import { PreviewCanvas } from '../Preview';

const RATIOS: { id: string; w: number; h: number }[] = [
  { id: '16:9', w: 16, h: 9 },
  { id: '4:3', w: 4, h: 3 },
  { id: '1:1', w: 1, h: 1 },
  { id: '3:4', w: 3, h: 4 },
  { id: '9:16', w: 9, h: 16 },
];
const RATIO_IDS = RATIOS.map((r) => r.id);
const EXPORT_LONG_EDGE = 1920; // 导出长边(FHD)

type Mode = 'rail' | 'thumb' | 'overlay';

/** 浮在预览框角上的圆形图标按钮(半透黑底,压在画面上清晰可读)。含悬停提示。 */
function IconBtn({
  icon,
  label,
  tip,
  place = 'bottom',
  onPress,
}: {
  icon: string;
  label?: string;
  tip?: string;
  place?: TipPlace;
  onPress: () => void;
}) {
  const { ref, hovered, align, hoverProps } = useHoverTip();
  return (
    <View ref={ref} style={styles.tipAnchor}>
      <Pressable
        onPress={onPress}
        hitSlop={6}
        {...(tip ? hoverProps : null)}
        style={({ pressed }) => [
          styles.iconBtn,
          label ? styles.iconBtnWide : null,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.iconGlyph}>{icon}</Text>
        {label ? <Text style={styles.iconLabel}>{label}</Text> : null}
      </Pressable>
      {hovered && tip ? <TooltipBubble label={tip} place={place} align={align} /> : null}
    </View>
  );
}

/** 左上角:图片比例小药丸 + 下拉(与角标图标同款半透样式)。含悬停提示。 */
function AspectPill({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const { ref, hovered, align, hoverProps } = useHoverTip();
  return (
    <View ref={ref} style={styles.aspectWrap}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        hitSlop={6}
        {...hoverProps}
        style={({ pressed }) => [styles.iconBtn, styles.aspectBtn, pressed && styles.pressed]}
      >
        <Text style={styles.aspectText}>{value}</Text>
        <Text style={styles.aspectCaret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {hovered && !open ? <TooltipBubble label="画面比例 / 导出尺寸" place="bottom" align={align} /> : null}
      {open && (
        <View style={styles.aspectList}>
          {RATIO_IDS.map((o) => (
            <Pressable
              key={o}
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
              style={({ pressed }) => [
                styles.aspectItem,
                pressed && styles.pressed,
                o === value && styles.aspectItemActive,
              ]}
            >
              <Text style={styles.aspectText}>{o}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

/**
 * 取景预览。单一 PreviewCanvas 实例(始终挂载于同一位置)→ 切换形态不重建,导出不失效。
 * 桌面=右栏 rail;紧凑=浮动缩略图 thumb;放大=覆盖层 overlay。
 * 功能键改为压在预览框四角的图标:左上=比例、右上=底图、右下=下载(overlay 额外左下=收起)。
 */
export function PreviewDock() {
  const bgImageUrl = useEditor((s) => s.bgImageUrl);
  const bgAspect = useEditor((s) => s.bgAspect);
  const setBg = useEditor((s) => s.setBg);

  const previewExpanded = useUI((s) => s.previewExpanded);
  const setPreviewExpanded = useUI((s) => s.setPreviewExpanded);

  const { isDesktop, width, height } = useBreakpoint();
  const mode: Mode = isDesktop ? 'rail' : previewExpanded ? 'overlay' : 'thumb';

  const [aspectId, setAspectId] = useState('16:9');
  const ratio = RATIOS.find((r) => r.id === aspectId) ?? RATIOS[0]!;
  const ar = bgImageUrl && bgAspect ? bgAspect : ratio.w / ratio.h;

  const longEdge =
    mode === 'thumb'
      ? layout.previewMin
      : mode === 'overlay'
        ? Math.min(width, height) * 0.74
        : layout.previewMax;
  const { boxW, boxH } = useMemo(() => {
    const w = ar >= 1 ? longEdge : Math.round(longEdge * ar);
    const h = ar >= 1 ? Math.round(longEdge / ar) : longEdge;
    return { boxW: w, boxH: h };
  }, [ar, longEdge]);

  const download = () => {
    const url = previewControl.capture?.(EXPORT_LONG_EDGE);
    if (!url || typeof document === 'undefined') return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `scene-${aspectId.replace(':', 'x')}.png`;
    a.click();
  };

  const pickImage = () => {
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        const img = new Image();
        img.onload = () => setBg(url, img.naturalWidth / img.naturalHeight);
        img.src = url;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const cardStyle = mode === 'rail' ? styles.rail : mode === 'overlay' ? styles.overlay : styles.thumb;

  return (
    <>
      {mode === 'overlay' && <Backdrop onPress={() => setPreviewExpanded(false)} />}
      <View style={[styles.card, cardStyle]} pointerEvents="box-none">
        <View style={[styles.frame, { width: boxW, height: boxH }]} pointerEvents="box-none">
          {/* 画布:始终挂载在同一位置 → 不重建 */}
          <View style={styles.box} pointerEvents="auto">
            <PreviewCanvas />
          </View>

          {mode === 'thumb' ? (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setPreviewExpanded(true)}
              pointerEvents="auto"
            >
              <View style={styles.thumbBadge} pointerEvents="none">
                <Text style={styles.thumbBadgeText}>⤢ 取景</Text>
              </View>
            </Pressable>
          ) : (
            <>
              {/* 左上:图片比例 */}
              <View style={styles.cornerTL} pointerEvents="auto">
                <AspectPill value={aspectId} onChange={setAspectId} />
              </View>
              {/* 右上:底图(+清除) */}
              <View style={styles.cornerTR} pointerEvents="auto">
                <IconBtn
                  icon="🖼"
                  tip={bgImageUrl ? '更换参考底图' : '上传参考底图(作为出图背景)'}
                  place="bottom"
                  onPress={pickImage}
                />
                {bgImageUrl ? (
                  <IconBtn icon="✕" tip="清除底图" place="bottom" onPress={() => setBg(null, null)} />
                ) : null}
              </View>
              {/* 右下:下载 */}
              <View style={styles.cornerBR} pointerEvents="auto">
                <IconBtn icon="⬇" tip="下载当前取景为 PNG(长边 1920)" place="top" onPress={download} />
              </View>
              {/* 覆盖层额外:左下 收起 */}
              {mode === 'overlay' && (
                <View style={styles.cornerBL} pointerEvents="auto">
                  <IconBtn
                    icon="✕"
                    label="收起"
                    tip="收起放大预览"
                    place="top"
                    onPress={() => setPreviewExpanded(false)}
                  />
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'flex-end' },
  rail: {
    position: 'absolute',
    top: safeTop,
    right: space.lg,
    paddingTop: space.lg,
    width: layout.rightDockW - space.lg,
  },
  thumb: { position: 'absolute', top: safeTop, right: space.lg, zIndex: z.panel },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: z.sheet,
  },

  frame: { position: 'relative' },
  tipAnchor: { position: 'relative' },
  box: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: '#0b0b0e',
    ...elevation.panel,
  },

  cornerTL: { position: 'absolute', top: space.sm, left: space.sm, zIndex: z.dropdown },
  cornerTR: {
    position: 'absolute',
    top: space.sm,
    right: space.sm,
    flexDirection: 'row',
    gap: space.xs,
    zIndex: z.panel,
  },
  cornerBR: { position: 'absolute', bottom: space.sm, right: space.sm, zIndex: z.panel },
  cornerBL: { position: 'absolute', bottom: space.sm, left: space.sm, zIndex: z.panel },

  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    height: 36,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  iconBtnWide: { gap: space.xs, paddingHorizontal: space.md },
  iconGlyph: { fontSize: 17 },
  iconLabel: { color: color.text, fontSize: font.label, fontWeight: font.weightBtn },

  aspectWrap: { position: 'relative' },
  aspectBtn: { gap: 2, paddingHorizontal: space.md },
  aspectText: { color: color.text, fontSize: font.label, fontWeight: font.weightBtn },
  aspectCaret: { color: color.textDim, fontSize: font.hint },
  aspectList: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.82)',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingVertical: space.xs,
    minWidth: 66,
  },
  aspectItem: { paddingVertical: space.sm, paddingHorizontal: space.md, borderRadius: radius.sm },
  aspectItemActive: { backgroundColor: color.accentDim },

  thumbBadge: {
    position: 'absolute',
    bottom: space.xs,
    left: space.xs,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
  },
  thumbBadgeText: { color: color.text, fontSize: font.hint, fontWeight: font.weightBtn },

  pressed: { opacity: 0.65 },
});
