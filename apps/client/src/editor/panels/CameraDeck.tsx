import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEditor } from '../../store/editorStore';
import { Button } from '../../ui/primitives/Button';
import { Chip } from '../../ui/primitives/Chip';
import { color, space, font } from '../../ui/theme';

/** 相机/镜头:电影预设 / FOV / 存机位 / 已存机位。纯内容。 */
export function CameraDeck({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  const runPreset = useEditor((s) => s.runPreset);
  const setFov = useEditor((s) => s.setFov);
  const requestSaveCamera = useEditor((s) => s.requestSaveCamera);
  const applyCamera = useEditor((s) => s.applyCamera);
  const removeCamera = useEditor((s) => s.removeCamera);
  const cameras = useEditor((s) => s.cameras);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>{t('camera.lens')}</Text>
        <Button
          label={t('camera.twoShot')}
          icon="👥"
          compact={compact}
          tooltip={t('camera.twoShotTip')}
          tooltipPlace="top"
          onPress={() => runPreset('two-shot')}
        />
        <Button
          label={t('camera.group')}
          icon="👨‍👩‍👧"
          compact={compact}
          tooltip={t('camera.groupTip')}
          tooltipPlace="top"
          onPress={() => runPreset('group')}
        />
        <Button
          label={t('camera.ots')}
          icon="🎬"
          compact={compact}
          tooltip={t('camera.otsTip')}
          tooltipPlace="top"
          onPress={() => runPreset('ots')}
        />
        <Button
          label={t('camera.low')}
          icon="🔼"
          compact={compact}
          tooltip={t('camera.lowTip')}
          tooltipPlace="top"
          onPress={() => runPreset('low')}
        />
        <Button
          label={t('camera.high')}
          icon="🔽"
          compact={compact}
          tooltip={t('camera.highTip')}
          tooltipPlace="top"
          onPress={() => runPreset('high')}
        />
        <Button
          label={t('camera.closeup')}
          icon="🔍"
          compact={compact}
          tooltip={t('camera.closeupTip')}
          tooltipPlace="top"
          onPress={() => runPreset('closeup')}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>{t('camera.fov')}</Text>
        <Button
          label={t('camera.wide')}
          compact={compact}
          tooltip={t('camera.wideTip')}
          tooltipPlace="top"
          onPress={() => setFov(75)}
        />
        <Button
          label={t('camera.normal')}
          compact={compact}
          tooltip={t('camera.normalTip')}
          tooltipPlace="top"
          onPress={() => setFov(50)}
        />
        <Button
          label={t('camera.tele')}
          compact={compact}
          tooltip={t('camera.teleTip')}
          tooltipPlace="top"
          onPress={() => setFov(28)}
        />
        <View style={styles.sep} />
        <Button
          label={t('camera.save')}
          icon="＋"
          compact={compact}
          tooltip={t('camera.saveTip')}
          tooltipPlace="top"
          onPress={requestSaveCamera}
        />
      </View>

      {cameras.length > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>{t('nav.camera')}</Text>
          {cameras.map((c) => (
            <Chip
              key={c.id}
              label={c.name}
              onPress={() => applyCamera(c)}
              onRemove={() => removeCamera(c.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  label: { color: color.textDim, fontSize: font.label, fontWeight: font.weightBtn, minWidth: 30 },
  sep: { width: 1, height: 22, backgroundColor: color.border, marginHorizontal: space.xs },
});
