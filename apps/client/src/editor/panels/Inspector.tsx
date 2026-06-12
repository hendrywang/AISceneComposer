import { View, Text, StyleSheet } from 'react-native';
import { useEditor, type EditorObject } from '../../store/editorStore';
import { POSE_OPTIONS } from '@asc/resource-library';
import { Button } from '../../ui/primitives/Button';
import { color, space, font } from '../../ui/theme';

/** 当前选中的角色(无则 null)。供 LayoutShell 决定是否展示姿势/检视面板。 */
export function useSelectedActor(): EditorObject | null {
  const selectedId = useEditor((s) => s.selectedId);
  const objects = useEditor((s) => s.objects);
  const sel = objects.find((o) => o.id === selectedId) ?? null;
  return sel?.kind === 'actor' ? sel : null;
}

/** 检视面板:目前 = 角色姿势。未来可加颜色/缩放等对象属性。纯内容。 */
export function Inspector({ actor, compact }: { actor: EditorObject; compact?: boolean }) {
  const setPose = useEditor((s) => s.setPose);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>姿势</Text>
      <View style={styles.row}>
        {POSE_OPTIONS.map((po) => (
          <Button
            key={po.id}
            label={po.label}
            compact={compact}
            active={actor.poseId === po.id}
            onPress={() => setPose(actor.id, po.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  label: { color: color.textDim, fontSize: font.label, fontWeight: font.weightBtn },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
});
