import { View, StyleSheet } from 'react-native';
import { useEditor } from '../../store/editorStore';
import { Button } from '../../ui/primitives/Button';
import { color, space } from '../../ui/theme';

/** 变换工具(移动/旋转/删除)。纯内容,由 LayoutShell 包浮层并定位。 */
export function TransformToolbar({ compact }: { compact?: boolean }) {
  const mode = useEditor((s) => s.transformMode);
  const setMode = useEditor((s) => s.setMode);
  const removeSelected = useEditor((s) => s.removeSelected);
  const duplicateSelected = useEditor((s) => s.duplicateSelected);
  const clear = useEditor((s) => s.clear);
  const selectedId = useEditor((s) => s.selectedId);
  const hasObjects = useEditor((s) => s.objects.length > 0);

  return (
    <View style={styles.row}>
      <Button
        label="移动"
        icon="🖐️"
        compact={compact}
        active={mode === 'translate'}
        tooltip="移动:沿地面拖动选中的物体"
        tooltipPlace="bottom"
        onPress={() => setMode('translate')}
      />
      <Button
        label="旋转"
        icon="🔄"
        compact={compact}
        active={mode === 'rotate'}
        tooltip="旋转:绕竖直轴转动选中的物体"
        tooltipPlace="bottom"
        onPress={() => setMode('rotate')}
      />
      <View style={styles.sep} />
      {/* 复制 = 在旁边再放一份;删除 = 当前选中物体;清空 = 整个场景从头来 */}
      <Button
        label="复制"
        icon="📋"
        compact={compact}
        disabled={!selectedId}
        tooltip="复制选中的物体,在旁边再放一份"
        tooltipPlace="bottom"
        onPress={duplicateSelected}
      />
      <Button
        label="删除"
        icon="🗑"
        tone="danger"
        compact={compact}
        disabled={!selectedId}
        tooltip="删除当前选中的物体"
        tooltipPlace="bottom"
        onPress={removeSelected}
      />
      <Button
        label="清空"
        icon="🧹"
        compact={compact}
        disabled={!hasObjects}
        tooltip="清空整个场景,从头开始"
        tooltipPlace="bottom"
        onPress={clear}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  sep: { width: 1, height: 22, backgroundColor: color.border, marginHorizontal: space.xs },
});
