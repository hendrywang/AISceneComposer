import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, Pressable, Text, StyleSheet, ScrollView } from 'react-native';
import { useEditor } from '../store/editorStore';
import SceneView from './SceneView';
import { PreviewCanvas } from './Preview';
import { CATALOG } from './catalog';
import { SCENES } from './scenes';
import { POSE_OPTIONS } from './poses';
import { ensureWebGlobalStyles } from './webGlobalStyles';
import { previewControl } from './cameraSync';

const CATEGORIES = CATALOG.reduce<string[]>(
  (acc, d) => (acc.includes(d.category) ? acc : [...acc, d.category]),
  [],
);

const RATIOS = [
  { id: '16:9', w: 16, h: 9 },
  { id: '4:3', w: 4, h: 3 },
  { id: '1:1', w: 1, h: 1 },
  { id: '3:4', w: 3, h: 4 },
  { id: '9:16', w: 9, h: 16 },
];
const PREVIEW_MAX = 260;
const RATIO_IDS = RATIOS.map((r) => r.id);
const EXPORT_LONG_EDGE = 1920; // 默认导出长边(FHD)

function ToolButton({
  label,
  onPress,
  active,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, active && styles.btnActive]}>
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

/** 简单下拉框(RN 跨端实现:点按展开列表) */
function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.dropdown}>
      <Pressable onPress={() => setOpen((o) => !o)} style={styles.dropdownBtn}>
        <Text style={styles.btnText}>{value} ▾</Text>
      </Pressable>
      {open && (
        <View style={styles.dropdownList}>
          {options.map((o) => (
            <Pressable
              key={o}
              onPress={() => {
                onChange(o);
                setOpen(false);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.btnText}>{o}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function Editor() {
  const add = useEditor((s) => s.add);
  const loadScene = useEditor((s) => s.loadScene);
  const clear = useEditor((s) => s.clear);
  const removeSelected = useEditor((s) => s.removeSelected);
  const select = useEditor((s) => s.select);
  const selectedId = useEditor((s) => s.selectedId);
  const objects = useEditor((s) => s.objects);
  const mode = useEditor((s) => s.transformMode);
  const setMode = useEditor((s) => s.setMode);
  const setPose = useEditor((s) => s.setPose);

  const runPreset = useEditor((s) => s.runPreset);
  const setFov = useEditor((s) => s.setFov);
  const requestSaveCamera = useEditor((s) => s.requestSaveCamera);
  const applyCamera = useEditor((s) => s.applyCamera);
  const removeCamera = useEditor((s) => s.removeCamera);
  const cameras = useEditor((s) => s.cameras);
  const bgImageUrl = useEditor((s) => s.bgImageUrl);
  const bgAspect = useEditor((s) => s.bgAspect);
  const setBg = useEditor((s) => s.setBg);

  useEffect(() => {
    ensureWebGlobalStyles();
  }, []);

  const selected = objects.find((o) => o.id === selectedId) ?? null;
  const selectedActor = selected?.kind === 'actor' ? selected : null;

  const [aspectId, setAspectId] = useState('16:9');
  const ratio = RATIOS.find((r) => r.id === aspectId) ?? RATIOS[0]!;
  // 有底图时画幅跟随照片比例(避免拉伸);否则用下拉框选的比例
  const ar = bgImageUrl && bgAspect ? bgAspect : ratio.w / ratio.h;
  const boxW = ar >= 1 ? PREVIEW_MAX : Math.round(PREVIEW_MAX * ar);
  const boxH = ar >= 1 ? Math.round(PREVIEW_MAX / ar) : PREVIEW_MAX;

  const downloadPreview = () => {
    const url = previewControl.capture?.(EXPORT_LONG_EDGE);
    if (!url || typeof document === 'undefined') return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `scene-${aspectId.replace(':', 'x')}.png`;
    a.click();
  };

  /** 上传一张照片作为预览背景(底图) */
  const pickImage = () => {
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        const img = new Image();
        img.onload = () => setBg(url, img.naturalWidth / img.naturalHeight);
        img.src = url;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <View style={styles.root}>
      <Canvas
        frameloop="demand"
        camera={{ position: [5, 4, 6], fov: 55 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#101014',
          touchAction: 'none',
        }}
        onPointerMissed={() => select(null)}
      >
        <SceneView />
      </Canvas>

      {/* 右侧:取景预览 + 画幅比例 */}
      <View style={styles.previewPanel}>
        <View style={styles.previewHeader}>
          <Dropdown value={aspectId} options={RATIO_IDS} onChange={setAspectId} />
          <Pressable onPress={pickImage} style={styles.btn}>
            <Text style={styles.btnText}>{bgImageUrl ? '换底图' : '上传底图'}</Text>
          </Pressable>
          {bgImageUrl && (
            <Pressable onPress={() => setBg(null, null)} style={styles.btn}>
              <Text style={styles.btnText}>✕ 底图</Text>
            </Pressable>
          )}
          <Pressable onPress={downloadPreview} style={styles.btn}>
            <Text style={styles.btnText}>⬇ 下载</Text>
          </Pressable>
        </View>
        <View style={[styles.previewBox, { width: boxW, height: boxH }]}>
          <PreviewCanvas />
        </View>
        <Text style={styles.previewHint}>取景预览 · 当前机位</Text>
      </View>

      {/* 左侧:资产库 */}
      <ScrollView style={styles.library} contentContainerStyle={styles.libContent}>
        <Text style={styles.section}>场景预设</Text>
        <View style={styles.libRow}>
          {SCENES.map((sc) => (
            <Pressable key={sc.id} onPress={() => loadScene(sc.id)} style={styles.chipBtn}>
              <Text style={styles.btnText}>{sc.name}</Text>
            </Pressable>
          ))}
          <Pressable onPress={clear} style={styles.chipBtn}>
            <Text style={styles.btnText}>清空</Text>
          </Pressable>
        </View>

        {CATEGORIES.map((cat) => (
          <View key={cat}>
            <Text style={styles.section}>{cat}</Text>
            {CATALOG.filter((d) => d.category === cat).map((d) => (
              <Pressable key={d.id} onPress={() => add(d.id)} style={styles.libItem}>
                <Text style={styles.libItemText}>{d.name}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* 顶部:变换工具 */}
      <View style={styles.topBar}>
        <ToolButton label="移动" onPress={() => setMode('translate')} active={mode === 'translate'} />
        <ToolButton label="旋转" onPress={() => setMode('rotate')} active={mode === 'rotate'} />
        <View style={styles.sep} />
        <ToolButton label="删除" onPress={removeSelected} />
      </View>

      {/* 选中角色:姿势栏 */}
      {selectedActor && (
        <View style={styles.poseBar}>
          <Text style={styles.label}>姿势</Text>
          {POSE_OPTIONS.map((po) => (
            <ToolButton
              key={po.id}
              label={po.label}
              onPress={() => setPose(selectedActor.id, po.id)}
              active={selectedActor.poseId === po.id}
            />
          ))}
        </View>
      )}

      {/* 底部:相机/镜头 */}
      <View style={styles.cameraPanel}>
        <View style={styles.row}>
          <Text style={styles.label}>镜头</Text>
          <ToolButton label="双人" onPress={() => runPreset('two-shot')} />
          <ToolButton label="过肩" onPress={() => runPreset('ots')} />
          <ToolButton label="仰拍" onPress={() => runPreset('low')} />
          <ToolButton label="俯拍" onPress={() => runPreset('high')} />
          <ToolButton label="特写" onPress={() => runPreset('closeup')} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>FOV</Text>
          <ToolButton label="广角" onPress={() => setFov(75)} />
          <ToolButton label="标准" onPress={() => setFov(50)} />
          <ToolButton label="长焦" onPress={() => setFov(28)} />
          <View style={styles.sep} />
          <ToolButton label="＋ 存机位" onPress={requestSaveCamera} />
        </View>
        {cameras.length > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>机位</Text>
            {cameras.map((c) => (
              <View key={c.id} style={styles.chip}>
                <Pressable onPress={() => applyCamera(c)}>
                  <Text style={styles.chipText}>{c.name}</Text>
                </Pressable>
                <Pressable onPress={() => removeCamera(c.id)} hitSlop={8}>
                  <Text style={styles.chipX}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const PANEL_BG = 'rgba(20,20,24,0.88)';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#101014' },

  previewPanel: { position: 'absolute', top: 12, right: 12, alignItems: 'flex-end', gap: 8 },
  previewHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    maxWidth: 300,
    zIndex: 10,
  },
  dropdown: { position: 'relative', zIndex: 10 },
  dropdownBtn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#2a2a32' },
  dropdownList: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#23232b',
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 90,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: '#3a3a44',
  },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 12 },
  previewBox: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3a3a44',
    backgroundColor: '#0b0b0e',
  },
  previewHint: { color: '#7e858d', fontSize: 11 },

  library: {
    position: 'absolute',
    top: 12,
    left: 12,
    bottom: 12,
    width: 150,
    backgroundColor: PANEL_BG,
    borderRadius: 12,
  },
  libContent: { padding: 10, gap: 6 },
  section: { color: '#7e858d', fontSize: 11, marginTop: 6, marginBottom: 2 },
  libRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  libItem: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#2a2a32' },
  libItemText: { color: '#ffffff', fontSize: 13 },
  chipBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#33333d' },

  topBar: {
    position: 'absolute',
    top: 12,
    left: 174,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PANEL_BG,
    padding: 8,
    borderRadius: 10,
  },
  poseBar: {
    position: 'absolute',
    top: 64,
    left: 174,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    backgroundColor: PANEL_BG,
    padding: 8,
    borderRadius: 10,
  },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#2a2a32' },
  btnActive: { backgroundColor: '#3b6ef6' },
  btnText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  sep: { width: 1, height: 20, backgroundColor: '#3a3a44', marginHorizontal: 2 },

  cameraPanel: {
    position: 'absolute',
    bottom: 16,
    left: 174,
    right: 12,
    gap: 8,
    backgroundColor: PANEL_BG,
    padding: 10,
    borderRadius: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  label: { color: '#9aa0a6', fontSize: 12, width: 32 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2a2a32',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  chipText: { color: '#ffffff', fontSize: 13 },
  chipX: { color: '#9aa0a6', fontSize: 12 },
});
