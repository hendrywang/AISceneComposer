import { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEditor } from '../../store/editorStore';
import { useSettings } from '../../store/settingsStore';
import { useUI } from '../../ui/uiStore';
import { useBreakpoint } from '../../ui/useBreakpoint';
import { Backdrop } from '../../ui/primitives/Backdrop';
import { useHoverTip, TooltipBubble, type TipPlace } from '../../ui/primitives/Tooltip';
import { color, space, radius, font, z, layout } from '../../ui/theme';
import { safeTop } from '../../ui/safeArea';
import { previewControl } from '../cameraSync';
import { PreviewSurface } from './inspector/PreviewSurface';
import { previewBox } from './inspector/framing';

type Mode = 'rail' | 'thumb' | 'overlay';

/** 浮在预览框角上的圆形图标按钮(半透黑底,压在画面上清晰可读)。含悬停提示。 */
function IconBtn({
  icon,
  tip,
  place = 'top',
  onPress,
}: {
  icon: string;
  tip: string;
  place?: TipPlace;
  onPress: () => void;
}) {
  const { ref, hovered, align, hoverProps } = useHoverTip();
  return (
    <View ref={ref} style={styles.tipAnchor}>
      <Pressable
        onPress={onPress}
        hitSlop={6}
        {...hoverProps}
        style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
      >
        <Text style={styles.iconGlyph}>{icon}</Text>
      </Pressable>
      {hovered ? <TooltipBubble label={tip} place={place} align={align} /> : null}
    </View>
  );
}

/**
 * 取景预览的挂载与摆放器:唯一 PreviewSurface(始终挂载)→ 切换形态不重建,导出不失效。
 * 桌面=右栏 rail;紧凑=浮动缩略图 thumb;放大=覆盖层 overlay。
 * 比例/底图/出图已归入右侧检视面板与底部出图按钮;预览框只保留下载与放大/收起。
 */
export function PreviewMount() {
  const { t } = useTranslation();
  const bgImageUrl = useEditor((s) => s.bgImageUrl);
  const bgAspect = useEditor((s) => s.bgAspect);
  const aspectId = useEditor((s) => s.aspectId);
  const exportLongEdge = useSettings((s) => s.exportLongEdge);

  const previewExpanded = useUI((s) => s.previewExpanded);
  const setPreviewExpanded = useUI((s) => s.setPreviewExpanded);

  const { isDesktop, width, height } = useBreakpoint();
  const mode: Mode = isDesktop ? 'rail' : previewExpanded ? 'overlay' : 'thumb';

  const longEdge =
    mode === 'thumb'
      ? layout.previewMin
      : mode === 'overlay'
        ? Math.min(width, height) * 0.74
        : layout.previewMax;
  const { boxW, boxH } = useMemo(
    () => previewBox(aspectId, bgImageUrl, bgAspect, longEdge),
    [aspectId, bgImageUrl, bgAspect, longEdge],
  );

  const download = () => {
    const url = previewControl.capture?.(exportLongEdge);
    if (!url || typeof document === 'undefined') return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `scene-${aspectId.replace(':', 'x')}.png`;
    a.click();
  };

  const cardStyle = mode === 'rail' ? styles.rail : mode === 'overlay' ? styles.overlay : styles.thumb;

  return (
    <>
      {mode === 'overlay' && <Backdrop onPress={() => setPreviewExpanded(false)} />}
      <View
        style={[
          styles.card,
          cardStyle,
          mode === 'rail' && { paddingTop: space.lg },
          mode === 'thumb' && { marginTop: space.lg },
        ]}
        pointerEvents="box-none"
      >
        <PreviewSurface width={boxW} height={boxH}>
          {mode === 'thumb' ? (
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setPreviewExpanded(true)}
              pointerEvents="auto"
            >
              <View style={styles.thumbBadge} pointerEvents="none">
                <Text style={styles.thumbBadgeText}>⤢</Text>
              </View>
            </Pressable>
          ) : (
            <>
              {/* 桌面:预览右上角「相机设置」→ 开/关右侧检视面板 */}
              {mode === 'rail' && (
                <View style={styles.cornerTR} pointerEvents="auto">
                  <IconBtn
                    icon="🎛"
                    tip={t('inspector.title')}
                    place="bottom"
                    onPress={() => useUI.getState().toggleInspector()}
                  />
                </View>
              )}
              <View style={styles.cornerBR} pointerEvents="auto">
                <IconBtn
                  icon="⬇"
                  tip={t('preview.downloadPng', { px: exportLongEdge })}
                  place="top"
                  onPress={download}
                />
              </View>
            </>
          )}
        </PreviewSurface>
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

  tipAnchor: { position: 'relative' },
  cornerTR: { position: 'absolute', top: space.sm, right: space.sm, zIndex: z.panel },
  cornerBR: { position: 'absolute', bottom: space.sm, right: space.sm, zIndex: z.panel },

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
  iconGlyph: { fontSize: 17 },

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
