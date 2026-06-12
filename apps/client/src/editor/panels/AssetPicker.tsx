import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, type LayoutChangeEvent } from 'react-native';
import { useEditor } from '../../store/editorStore';
import { CATALOG, SCENES, type ModelDef } from '@asc/resource-library';
import { importModel } from '../importModel';
import { Chip } from '../../ui/primitives/Chip';
import { color, space, radius, font } from '../../ui/theme';

const CATEGORIES = CATALOG.reduce<string[]>(
  (acc, d) => (acc.includes(d.category) ? acc : [...acc, d.category]),
  [],
);

/** 资产图标(MVP:emoji)。按 id 命中,按 category 兜底。后续可一行换成真实 3D 缩略图。 */
const GLYPH: Record<string, string> = {
  'man-tall': '🧍', 'man-heavy': '🧍', 'man-slim': '🧍',
  woman: '🧍‍♀️', 'woman-curvy': '🧍‍♀️', kid: '🧒',
  bed: '🛏️', nightstand: '🗄️', wardrobe: '🚪', desk: '🪑', chair: '🪑', sofa: '🛋️',
  coffeeTable: '🟫', tvStand: '📺', bookshelf: '📚', lamp: '💡', plant: '🪴',
  blackboard: '⬛', studentDesk: '🪑',
  door: '🚪', window: '🪟', painting: '🖼️', rug: '🟪', room: '🏠',
};
const CATEGORY_GLYPH: Record<string, string> = {
  人物: '👤', 家具: '🛋️', 门窗装饰: '🚪', 场景元素: '🏠', 我的模型: '📦',
};
const glyphFor = (d: ModelDef) => GLYPH[d.id] ?? CATEGORY_GLYPH[d.category] ?? '⬜';

function AssetCard({ d, width, onAdd }: { d: ModelDef; width: number; onAdd: () => void }) {
  return (
    <Pressable
      onPress={onAdd}
      style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}
    >
      <Text style={styles.glyph}>{glyphFor(d)}</Text>
      <Text style={styles.cardLabel} numberOfLines={1}>
        {d.name}
      </Text>
    </Pressable>
  );
}

/**
 * 资产浏览器:场景预设 chip + 分类 Tab + 卡片网格。纯内容(不自带滚动)。
 * 数据全来自 catalog.ts —— 新增模型 = 改数据,UI 自动出现。
 * @param onItemAdded 加入后回调(紧凑布局用来关闭抽屉/弹层)
 */
export function AssetPicker({ onItemAdded }: { onItemAdded?: () => void }) {
  const add = useEditor((s) => s.add);
  const loadScene = useEditor((s) => s.loadScene);
  const userModels = useEditor((s) => s.userModels);

  const [activeCat, setActiveCat] = useState(CATEGORIES[0]!);
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const { cols, cardW } = useMemo(() => {
    const gap = space.md;
    const minCard = 84;
    const c = Math.max(2, Math.floor((width + gap) / (minCard + gap))) || 2;
    return { cols: c, cardW: width > 0 ? (width - gap * (c - 1)) / c : minCard };
  }, [width]);

  const categories = useMemo(() => {
    const cats = [...CATEGORIES];
    for (const m of userModels) if (!cats.includes(m.category)) cats.push(m.category);
    return cats;
  }, [userModels]);
  const items = useMemo(
    () => [...CATALOG, ...userModels].filter((d) => d.category === activeCat),
    [activeCat, userModels],
  );
  const afterImport = () => { setActiveCat('我的模型'); onItemAdded?.(); };

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {/* 场景预设 */}
      <Text style={styles.section}>场景预设</Text>
      <View style={styles.chipRow}>
        {SCENES.map((sc) => (
          <Chip key={sc.id} label={sc.name} onPress={() => { loadScene(sc.id); onItemAdded?.(); }} />
        ))}
      </View>

      {/* 分类 Tab + 导入模型(单按钮,自动判别 .glb / .gltf) */}
      <View style={styles.sectionRow}>
        <Text style={styles.section}>资产库</Text>
        <Pressable onPress={() => importModel(afterImport)} hitSlop={6} style={({ pressed }) => [styles.importBtn, pressed && styles.pressed]}>
          <Text style={styles.importText}>⬆ 导入模型</Text>
        </Pressable>
      </View>
      <View style={styles.chipRow}>
        {categories.map((cat) => (
          <Chip key={cat} label={cat} active={cat === activeCat} onPress={() => setActiveCat(cat)} />
        ))}
      </View>

      {/* 卡片网格 */}
      <View style={styles.grid}>
        {items.map((d) => (
          <AssetCard key={d.id} d={d} width={cardW} onAdd={() => { add(d.id); onItemAdded?.(); }} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  section: { color: color.textFaint, fontSize: font.label, fontWeight: font.weightBtn, marginTop: space.sm },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  importBtn: {
    marginTop: space.sm,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.accent,
  },
  importText: { color: color.accent, fontSize: font.label, fontWeight: font.weightBtn },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, marginTop: space.xs },
  card: {
    minHeight: 76,
    paddingVertical: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
  },
  glyph: { fontSize: font.glyph },
  cardLabel: { color: color.text, fontSize: font.label, fontWeight: font.weightBtn, maxWidth: '92%' },
  pressed: { opacity: 0.7, borderColor: color.accent },
});
