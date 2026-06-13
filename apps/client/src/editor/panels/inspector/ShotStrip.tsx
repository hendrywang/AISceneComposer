import { View, Text, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEditor } from '../../../store/editorStore';
import { useHoverTip, TooltipBubble } from '../../../ui/primitives/Tooltip';
import { color, space, radius, font } from '../../../ui/theme';

const THUMB_H = 46;
/** 截图瓷砖宽 = 16:9 缩略图宽,使「＋」按钮与放入的图片同尺寸。 */
const CAPTURE_W = Math.round(THUMB_H * (16 / 9));
/** '16:9' → 1.78,用于按各分镜的画幅给缩略图定宽(等高条带) */
const aspectNum = (id: string) => {
  const [w, h] = id.split(':').map(Number);
  return w && h ? w / h : 1;
};

/** 截图按钮:与 16:9 缩略图同尺寸的瓷砖,中间一个加号(含悬停提示)。 */
function CaptureTile({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const { ref, hovered, align, hoverProps } = useHoverTip();
  return (
    <View ref={ref} style={styles.tipAnchor}>
      <Pressable
        {...hoverProps}
        onPress={onPress}
        style={({ pressed }) => [styles.captureTile, pressed && styles.pressed]}
      >
        <Text style={styles.captureGlyph}>＋</Text>
      </Pressable>
      {hovered ? <TooltipBubble label={t('shot.captureTip')} place="top" align={align} /> : null}
    </View>
  );
}

/** 分镜缩略图条:截一张当前取景(＋ 瓷砖)+ 横向缩略图(点回取景 / ✕ 删)。 */
export function ShotStrip() {
  const { t } = useTranslation();
  const captureShot = useEditor((s) => s.captureShot);
  const applyShot = useEditor((s) => s.applyShot);
  const removeShot = useEditor((s) => s.removeShot);
  const shots = useEditor((s) => s.shots);
  const activeShotId = useEditor((s) => s.activeShotId);

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{t('shot.label')}</Text>
      <CaptureTile onPress={captureShot} />
      {shots.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.scrollRow}
        >
          {shots.map((sh) => (
            <View
              key={sh.id}
              style={[
                styles.thumb,
                { width: Math.round(THUMB_H * aspectNum(sh.aspect)) },
                sh.id === activeShotId && styles.thumbActive,
              ]}
            >
              <Pressable onPress={() => applyShot(sh)} style={styles.thumbHit}>
                {sh.thumbnail ? (
                  <Image source={{ uri: sh.thumbnail }} style={styles.thumbImg} />
                ) : (
                  <View style={styles.thumbPlaceholder}>
                    <Text style={styles.thumbPlaceholderText}>🎬</Text>
                  </View>
                )}
              </Pressable>
              <Pressable onPress={() => removeShot(sh.id)} hitSlop={6} style={styles.thumbRemove}>
                <Text style={styles.thumbRemoveText}>✕</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  label: { color: color.textDim, fontSize: font.label, fontWeight: font.weightBtn, minWidth: 30 },
  scroll: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
  scrollRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },

  tipAnchor: { position: 'relative' },
  captureTile: {
    width: CAPTURE_W,
    height: THUMB_H,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.accent,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureGlyph: { color: color.accent, fontSize: 24, fontWeight: font.weightTitle },

  thumb: {
    height: THUMB_H,
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: color.surface,
    position: 'relative',
  },
  thumbActive: { borderWidth: 2, borderColor: color.accent },
  thumbHit: { flex: 1 },
  thumbImg: { width: '100%', height: '100%' },
  thumbPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.surfaceHi },
  thumbPlaceholderText: { fontSize: 16 },
  thumbRemove: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: radius.sm,
  },
  thumbRemoveText: { color: '#fff', fontSize: 10, fontWeight: font.weightTitle },
  pressed: { opacity: 0.65 },
});
