import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEditor } from '../../../store/editorStore';
import { Button } from '../../../ui/primitives/Button';
import { color, space, font } from '../../../ui/theme';
import { RATIO_IDS } from './framing';

/** 画幅:一排比例按钮(读写 store.aspectId)。 */
export function AspectControl({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  const aspectId = useEditor((s) => s.aspectId);
  const setAspect = useEditor((s) => s.setAspect);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t('inspector.aspect')}</Text>
      <View style={styles.row}>
        {RATIO_IDS.map((id) => (
          <Button
            key={id}
            label={id}
            compact={compact}
            active={id === aspectId}
            onPress={() => setAspect(id)}
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
