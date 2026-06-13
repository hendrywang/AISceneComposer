import { View, Text, TextInput, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useEditor } from '../../store/editorStore';
import { useUI } from '../../ui/uiStore';
import { Backdrop } from '../../ui/primitives/Backdrop';
import { Button } from '../../ui/primitives/Button';
import { color, space, radius, font, z, elevation } from '../../ui/theme';
import type { RenderStyle } from '@asc/shared-types';

const STYLE_OPTIONS: { id: RenderStyle; label: string }[] = [
  { id: 'realistic', label: '写实' },
  { id: 'anime', label: '二次元' },
];

/**
 * 出图面板(模态)。构图来自当前取景(PreviewDock 的 capture);本面板只负责
 * 提示词 + 画风 + 触发生成,并就地回显结果(可下载)。生成中锁交互、禁关闭。
 */
export function GenerateDock() {
  const open = useUI((s) => s.generateOpen);
  const close = useUI((s) => s.closeGenerate);

  const prompt = useEditor((s) => s.prompt);
  const style = useEditor((s) => s.style);
  const status = useEditor((s) => s.genStatus);
  const resultUrl = useEditor((s) => s.genResultUrl);
  const genError = useEditor((s) => s.genError);
  const setPrompt = useEditor((s) => s.setPrompt);
  const setStyle = useEditor((s) => s.setStyle);
  const generate = useEditor((s) => s.generate);
  const clearGen = useEditor((s) => s.clearGen);

  if (!open) return null;

  const running = status === 'running';

  const downloadResult = () => {
    if (!resultUrl || typeof document === 'undefined') return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `generated-${Date.now()}.png`;
    a.click();
  };

  return (
    <View style={[StyleSheet.absoluteFill, styles.layer]} pointerEvents="box-none">
      <Backdrop onPress={running ? () => undefined : close} />
      <View style={styles.center} pointerEvents="box-none">
        <View style={styles.card} pointerEvents="auto">
          <View style={styles.header}>
            <Text style={styles.title}>AI 出图</Text>
            <Pressable onPress={running ? undefined : close} hitSlop={8}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.hint}>构图来自当前取景。在这里描述画面风格、光线与氛围。</Text>

            <Text style={styles.label}>提示词</Text>
            <TextInput
              value={prompt}
              onChangeText={setPrompt}
              editable={!running}
              multiline
              placeholder="例:黄昏暖光下的客厅,电影感,写实细节…"
              placeholderTextColor={color.textFaint}
              style={styles.input}
            />

            <Text style={styles.label}>画风</Text>
            <View style={styles.styleRow}>
              {STYLE_OPTIONS.map((o) => (
                <Button
                  key={o.id}
                  label={o.label}
                  tone="accent"
                  active={style === o.id}
                  disabled={running}
                  grow
                  onPress={() => setStyle(o.id)}
                />
              ))}
            </View>

            <Button
              label={running ? '生成中…' : '生成'}
              icon="✨"
              tone="accent"
              active
              disabled={running}
              onPress={generate}
            />

            {status === 'error' && genError ? <Text style={styles.error}>{genError}</Text> : null}

            {status === 'done' && resultUrl ? (
              <View style={styles.resultWrap}>
                <Image source={{ uri: resultUrl }} style={styles.result} resizeMode="contain" />
                <View style={styles.resultBtns}>
                  <Button label="下载" icon="⬇" onPress={downloadResult} grow />
                  <Button label="重置" onPress={clearGen} grow />
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { zIndex: z.sheet },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  card: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '88%',
    backgroundColor: color.panelSolid,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.border,
    padding: space.lg,
    gap: space.md,
    ...elevation.panel,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: color.text, fontSize: font.title, fontWeight: font.weightTitle },
  close: { color: color.textDim, fontSize: font.title, paddingHorizontal: space.xs },
  body: { gap: space.md, paddingBottom: space.xs },
  hint: { color: color.textFaint, fontSize: font.label },
  label: { color: color.textDim, fontSize: font.label, fontWeight: font.weightBtn },
  input: {
    minHeight: 92,
    maxHeight: 160,
    color: color.text,
    backgroundColor: color.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
    padding: space.md,
    fontSize: font.body,
    textAlignVertical: 'top',
  },
  styleRow: { flexDirection: 'row', gap: space.sm },
  error: { color: color.danger, fontSize: font.label },
  resultWrap: { gap: space.sm },
  result: {
    width: '100%',
    height: 260,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.border,
    backgroundColor: '#0b0b0e',
  },
  resultBtns: { flexDirection: 'row', gap: space.sm },
});
