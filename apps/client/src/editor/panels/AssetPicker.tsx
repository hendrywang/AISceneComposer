import { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, type LayoutChangeEvent } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEditor } from '../../store/editorStore';
import { CATALOG, SCENES, type ModelDef } from '@asc/resource-library';
import { importModel } from '../importModel';
import { Chip } from '../../ui/primitives/Chip';
import { useBreakpoint } from '../../ui/useBreakpoint';
import { color, space, radius, font } from '../../ui/theme';

/** 内置分类(来自 catalog,经 generate.ts 的 CATEGORY_ORDER 排序):人物 / 家具 / 装饰 / 场景。 */
const CATEGORIES = CATALOG.reduce<string[]>(
  (acc, d) => (acc.includes(d.category) ? acc : [...acc, d.category]),
  [],
);
/** 用户导入模型所属分类(importModel/splitModel 写死此值)。 */
const MINE = '我的模型';
/** 场景 Tab(预设整屋 + 空房间)的分类名。 */
const SCENE = '场景';
/** 工具条 5 个常驻 Tab:内置类目 + 永远在末位的「我的模型」。 */
const TABS = [...CATEGORIES, MINE];

/** 资产图标(MVP:emoji)。按 id 命中,按 category 兜底。后续可一行换成真实 3D 缩略图。 */
const GLYPH: Record<string, string> = {
  'man-tall': '🧍',
  'man-heavy': '🧍',
  'man-slim': '🧍',
  woman: '🧍‍♀️',
  'woman-curvy': '🧍‍♀️',
  kid: '🧒',
  bed: '🛏️',
  nightstand: '🗄️',
  wardrobe: '🚪',
  desk: '🪑',
  chair: '🪑',
  sofa: '🛋️',
  coffeeTable: '🟫',
  tvStand: '📺',
  bookshelf: '📚',
  lamp: '💡',
  plant: '🪴',
  blackboard: '⬛',
  studentDesk: '🪑',
  door: '🚪',
  window: '🪟',
  painting: '🖼️',
  rug: '🟪',
  room: '🏠',
  // 人物
  guard: '💂',
  elder: '🧓',
  'woman-tall': '🧍‍♀️',
  // 宫殿/古风
  pillar: '🏛️',
  throne: '👑',
  dais: '🟥',
  'red-carpet': '🟥',
  'palace-lantern': '🏮',
  'banner-drape': '🎏',
  'palace-gate': '⛩️',
  'palace-stairs': '🪜',
  // 现代室内 / 公共
  whiteboard: '📋',
  'office-desk': '🖥️',
  'office-chair': '💺',
  'filing-cabinet': '🗄️',
  'conference-table': '🪑',
  'projector-screen': '📽️',
  'kitchen-counter': '🧱',
  stove: '🍳',
  sink: '🚰',
  fridge: '🧊',
  'upper-cabinets': '🗄️',
  'kitchen-island': '🍽️',
  'dining-table': '🍽️',
  booth: '🪑',
  'bar-counter': '🍸',
  'bar-stool': '🪑',
  'cafe-table': '☕',
  'shop-shelf': '🧺',
  'shop-counter': '🛒',
  checkout: '💵',
  'hospital-bed': '🛏️',
  'iv-stand': '💉',
  'exam-table': '🩺',
  'reception-desk': '🛎️',
  // 室外 / 车辆
  tree: '🌳',
  'park-bench': '🪑',
  lamppost: '💡',
  fountain: '⛲',
  hedge: '🌿',
  'car-exterior': '🚗',
  'car-interior': '🚙',
  elevator: '🛗',
};
const CATEGORY_GLYPH: Record<string, string> = {
  人物: '👤',
  家具: '🛋️',
  装饰: '🖼️',
  室外: '🌳',
  场景: '🏠',
  我的模型: '📦',
};
/** 预设场景图标(emoji)。 */
const SCENE_GLYPH: Record<string, string> = {
  bedroom: '🛏️',
  living: '🛋️',
  classroom: '🏫',
  palaceHall: '🏯',
  palaceCourtyard: '⛩️',
  office: '🏢',
  kitchen: '🍳',
  restaurant: '🍽️',
  cafe: '☕',
  shop: '🛒',
  clinic: '🏥',
  meetingRoom: '📊',
  car: '🚗',
  street: '🏙️',
  park: '🌳',
  elevator: '🛗',
};
/** 类目中文名 → i18n 键(数据里 category 仍是中文,显示在 UI 层本地化)。 */
const CATEGORY_KEY: Record<string, string> = {
  人物: 'people',
  家具: 'furniture',
  装饰: 'decor',
  室外: 'outdoor',
  场景: 'scene',
  我的模型: 'mine',
};
const glyphFor = (d: ModelDef) => GLYPH[d.id] ?? CATEGORY_GLYPH[d.category] ?? '⬜';

/** 网格卡片(emoji + 文字):资产、空房间、预设场景共用同一样式。 */
function Tile({
  glyph,
  label,
  width,
  onPress,
}: {
  glyph: string;
  label: string;
  width: number;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { width }, pressed && styles.pressed]}>
      <Text style={styles.glyph}>{glyph}</Text>
      <Text style={styles.cardLabel} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * 资产浏览器:5 个常驻分类 Tab + 按 Tab 切换的内容区。数据全来自 catalog.ts。
 * - 人物 / 家具 / 装饰:CATALOG 卡片网格。
 * - 场景:预设整屋(SCENES)+ 空房间(CATALOG 中 category===场景)。
 * - 我的模型:常驻;顶部导入按钮,空时给提示,否则列出 userModels。
 * 纯内容(不自带滚动)。
 * @param onItemAdded 加入后回调(紧凑布局用来关闭抽屉/弹层)
 */
export function AssetPicker({ onItemAdded }: { onItemAdded?: () => void }) {
  const { t } = useTranslation();
  const add = useEditor((s) => s.add);
  const loadScene = useEditor((s) => s.loadScene);
  const userModels = useEditor((s) => s.userModels);

  const [activeCat, setActiveCat] = useState<string>(CATEGORIES[0]!);
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const { isDesktop } = useBreakpoint();
  const { cardW } = useMemo(() => {
    const gap = space.md;
    const minCard = 84;
    // 移动端(抽屉 / 底部弹层)固定一排 4 个;桌面左栏按宽度自适应。
    const auto = Math.max(2, Math.floor((width + gap) / (minCard + gap))) || 2;
    const c = isDesktop ? auto : 4;
    // 向下取整:c 张卡 + 间距精确等于容器宽时,高 DPI(安卓)逐卡进位会溢出,把末张挤到下一行
    // → 每行少 1 个(4 变 3)。取整留出零点几 px 余量,稳定排满 c 张。
    return { cardW: width > 0 ? Math.floor((width - gap * (c - 1)) / c) : minCard };
  }, [width, isDesktop]);

  const catalogItems = useMemo(() => CATALOG.filter((d) => d.category === activeCat), [activeCat]);

  const addItem = (id: string) => {
    add(id);
    onItemAdded?.();
  };
  const afterImport = () => {
    setActiveCat(MINE);
    onItemAdded?.();
  };

  const renderGrid = (list: ModelDef[]) => (
    <View style={styles.grid}>
      {list.map((d) => (
        <Tile
          key={d.id}
          glyph={glyphFor(d)}
          label={t(`model.${d.id}`, { defaultValue: d.name })}
          width={cardW}
          onPress={() => addItem(d.id)}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.wrap} onLayout={onLayout}>
      {/* 5 个常驻分类 Tab */}
      <View style={styles.chipRow}>
        {TABS.map((cat) => (
          <Chip
            key={cat}
            label={t(`category.${CATEGORY_KEY[cat]}`, { defaultValue: cat })}
            active={cat === activeCat}
            onPress={() => setActiveCat(cat)}
          />
        ))}
      </View>

      {/* 内容区:按 activeCat 分发 */}
      {activeCat === MINE ? (
        <View style={styles.wrap}>
          <Pressable
            onPress={() => importModel(afterImport)}
            style={({ pressed }) => [styles.importBtn, pressed && styles.pressed]}
          >
            <Text style={styles.importText}>⬆ {t('asset.importModel')}</Text>
          </Pressable>
          {userModels.length === 0 ? (
            <Text style={styles.hint}>
              {t('asset.noUserModels')}
              {'\n'}
              {t('asset.importHint')}
            </Text>
          ) : (
            renderGrid(userModels)
          )}
        </View>
      ) : activeCat === SCENE ? (
        <View style={styles.wrap}>
          <Text style={styles.section}>{t('asset.presetScenes')}</Text>
          <View style={styles.grid}>
            {SCENES.map((sc) => (
              <Tile
                key={sc.id}
                glyph={SCENE_GLYPH[sc.id] ?? '🏠'}
                label={t(`scene.${sc.id}`, { defaultValue: sc.name })}
                width={cardW}
                onPress={() => {
                  loadScene(sc.id);
                  onItemAdded?.();
                }}
              />
            ))}
          </View>
          <Text style={styles.section}>{t('asset.emptyRooms')}</Text>
          {renderGrid(catalogItems)}
        </View>
      ) : (
        renderGrid(catalogItems)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  section: { color: color.textFaint, fontSize: font.label, fontWeight: font.weightBtn, marginTop: space.sm },
  importBtn: {
    marginTop: space.xs,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
  },
  importText: { color: color.accent, fontSize: font.label, fontWeight: font.weightBtn },
  hint: { color: color.textFaint, fontSize: font.label, lineHeight: 18, marginTop: space.xs },
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
