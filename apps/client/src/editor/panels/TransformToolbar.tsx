import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEditor } from '../../store/editorStore';
import { saveSceneToFile, loadSceneFromFile } from '../sceneFile';
import { Button } from '../../ui/primitives/Button';
import { color, space } from '../../ui/theme';

/**
 * 顶部工具条 = 场景级操作:清空(新建空白场景 + 复位视角) / 保存 / 读取。
 * 物体级操作(移动/旋转/复制/拆分/删除)在选中物体后的悬浮工具条(SelectionHud)里。
 */
export function TransformToolbar({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  const clear = useEditor((s) => s.clear);
  const hasObjects = useEditor((s) => s.objects.length > 0);

  return (
    <View style={styles.row}>
      {/* 新建 = 完全空白的场景(清空物体 / 机位 / 底图)并复位视角 */}
      <Button
        label={t('transform.newScene')}
        icon="📄"
        compact={compact}
        tooltip={t('transform.newSceneTip')}
        tooltipPlace="bottom"
        onPress={clear}
      />
      <View style={styles.sep} />
      {/* 保存 = 把当前构图(含机位/底图)存成 .json 文件;读取 = 从文件还原 */}
      <Button
        label={t('transform.save')}
        icon="💾"
        compact={compact}
        disabled={!hasObjects}
        tooltip={t('transform.saveTip')}
        tooltipPlace="bottom"
        onPress={saveSceneToFile}
      />
      <Button
        label={t('transform.load')}
        icon="📂"
        compact={compact}
        tooltip={t('transform.loadTip')}
        tooltipPlace="bottom"
        onPress={loadSceneFromFile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  sep: { width: 1, height: 22, backgroundColor: color.border, marginHorizontal: space.xs },
});
