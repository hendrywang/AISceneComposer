import { View, Text, StyleSheet } from 'react-native';
import { useEditor } from '../../store/editorStore';
import { Button } from '../../ui/primitives/Button';
import { Chip } from '../../ui/primitives/Chip';
import { color, space, font } from '../../ui/theme';

/** 相机/镜头:电影预设 / FOV / 存机位 / 已存机位。纯内容。 */
export function CameraDeck({ compact }: { compact?: boolean }) {
  const runPreset = useEditor((s) => s.runPreset);
  const setFov = useEditor((s) => s.setFov);
  const requestSaveCamera = useEditor((s) => s.requestSaveCamera);
  const applyCamera = useEditor((s) => s.applyCamera);
  const removeCamera = useEditor((s) => s.removeCamera);
  const cameras = useEditor((s) => s.cameras);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>镜头</Text>
        <Button label="双人" icon="👥" compact={compact} tooltip="双人镜头:框住主角和最近的另一个人" tooltipPlace="top" onPress={() => runPreset('two-shot')} />
        <Button label="合影" icon="👨‍👩‍👧" compact={compact} tooltip="合影:把所有角色都框进画面" tooltipPlace="top" onPress={() => runPreset('group')} />
        <Button label="过肩" icon="🎬" compact={compact} tooltip="过肩镜头:越过近端角色的肩膀看对方" tooltipPlace="top" onPress={() => runPreset('ots')} />
        <Button label="仰拍" icon="🔼" compact={compact} tooltip="仰拍:低机位向上看主角" tooltipPlace="top" onPress={() => runPreset('low')} />
        <Button label="俯拍" icon="🔽" compact={compact} tooltip="俯拍:高机位向下看主角" tooltipPlace="top" onPress={() => runPreset('high')} />
        <Button label="特写" icon="🔍" compact={compact} tooltip="特写:聚焦主角头部" tooltipPlace="top" onPress={() => runPreset('closeup')} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>FOV</Text>
        <Button label="广角" compact={compact} tooltip="广角 75°:视野大、透视夸张" tooltipPlace="top" onPress={() => setFov(75)} />
        <Button label="标准" compact={compact} tooltip="标准 50°:接近肉眼视角" tooltipPlace="top" onPress={() => setFov(50)} />
        <Button label="长焦" compact={compact} tooltip="长焦 28°:压缩空间、背景拉近" tooltipPlace="top" onPress={() => setFov(28)} />
        <View style={styles.sep} />
        <Button label="存机位" icon="＋" compact={compact} tooltip="保存当前机位,之后可一键切回" tooltipPlace="top" onPress={requestSaveCamera} />
      </View>

      {cameras.length > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>机位</Text>
          {cameras.map((c) => (
            <Chip key={c.id} label={c.name} onPress={() => applyCamera(c)} onRemove={() => removeCamera(c.id)} />
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
