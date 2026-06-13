import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEditor } from '../../../store/editorStore';
import { Button } from '../../../ui/primitives/Button';
import { color, space, font } from '../../../ui/theme';

/**
 * 镜头焦段(对标 iPhone 17 的 0.5×–8×):中文焦段名 + 全画幅等效毫米。
 * fov = 该焦段竖直视角(full-frame 24mm 片高:2·atan(12/mm))。
 */
const LENSES: { key: string; zoom: string; mm: number; fov: number }[] = [
  { key: 'ultraWide', zoom: '0.5×', mm: 13, fov: 85 },
  { key: 'wide', zoom: '1×', mm: 24, fov: 53 },
  { key: 'normal', zoom: '2×', mm: 48, fov: 28 },
  { key: 'tele', zoom: '4×', mm: 100, fov: 14 },
  { key: 'superTele', zoom: '8×', mm: 200, fov: 7 },
];

/** 镜头焦段:一排毫米按钮(与画幅同款,选中高亮);焦段名 + iPhone 倍数在悬停提示。 */
export function LensPicker({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  const fov = useEditor((s) => s.fov);
  const setFov = useEditor((s) => s.setFov);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t('camera.lens')}</Text>
      <View style={styles.row}>
        {LENSES.map((l) => (
          <Button
            key={l.key}
            label={`${l.mm}mm`}
            compact={compact}
            active={l.fov === fov}
            tooltip={t('camera.lensTip', { name: t(`camera.${l.key}`), zoom: l.zoom, mm: l.mm })}
            onPress={() => setFov(l.fov)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  label: { color: color.textDim, fontSize: font.label, fontWeight: font.weightBtn },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
});
