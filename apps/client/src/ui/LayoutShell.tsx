import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useBreakpoint } from './useBreakpoint';
import { useUI, type SheetKind } from './uiStore';
import { color, space, font, z, layout } from './theme';
import { safeTop, safeBottom } from './safeArea';
import { Panel } from './primitives/Panel';
import { Drawer } from './primitives/Drawer';
import { BottomSheet } from './primitives/BottomSheet';
import { InsertDock } from '../editor/panels/InsertDock';
import { AssetPicker } from '../editor/panels/AssetPicker';
import { TransformToolbar } from '../editor/panels/TransformToolbar';
import { Inspector, useSelectedActor } from '../editor/panels/Inspector';
import { CameraDeck } from '../editor/panels/CameraDeck';
import { PreviewDock } from '../editor/panels/PreviewDock';
import { SelectionHud } from '../editor/panels/SelectionHud';

/**
 * 唯一感知断点的组件:把 5 个面板按设备摆放在全屏画布之上。
 * 桌面=三区(左库+中浮层+右栏);平板=抽屉+底部相机+浮动预览;手机=底部 Tab + 弹层。
 * PreviewDock 在所有断点只渲染一次(自定位)→ 预览 Canvas 全程保持挂载,导出不失效。
 */
export function LayoutShell() {
  const { device } = useBreakpoint();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {device === 'desktop' && <DesktopChrome />}
      {device === 'tablet' && <TabletChrome />}
      {device === 'phone' && <PhoneChrome />}
      <SelectionHud />
      <PreviewDock />
    </View>
  );
}

/* ── 桌面 / iPad 横屏:左库 + 中央浮层 + 右栏预览 ── */
function DesktopChrome() {
  const actor = useSelectedActor();
  return (
    <>
      {/* 左:资产库常驻栏 */}
      <View style={styles.leftDock} pointerEvents="box-none">
        <Panel noPadding style={styles.fill}>
          <InsertDock />
        </Panel>
      </View>

      {/* 中上:变换工具 + 检视(姿势),纵向堆叠,无魔法偏移 */}
      <View style={styles.centerTop} pointerEvents="box-none">
        <Panel>
          <TransformToolbar compact />
        </Panel>
        {actor && (
          <Panel>
            <Inspector actor={actor} compact />
          </Panel>
        )}
      </View>

      {/* 中下:相机镜头 */}
      <View style={styles.centerBottom} pointerEvents="box-none">
        <Panel>
          <CameraDeck compact />
        </Panel>
      </View>
    </>
  );
}

/* ── iPad 竖屏 / 小平板:顶部条 + 抽屉库 + 底部相机 + 浮动预览 ── */
function TabletChrome() {
  const actor = useSelectedActor();
  const libraryOpen = useUI((s) => s.libraryOpen);
  const toggleLibrary = useUI((s) => s.toggleLibrary);
  const setLibrary = useUI((s) => s.setLibrary);

  return (
    <>
      {/* 顶部条:抽屉开关 + 变换工具 */}
      <View style={styles.topBar} pointerEvents="box-none">
        <Panel>
          <View style={styles.topRow}>
            <Pressable onPress={toggleLibrary} style={({ pressed }) => [styles.menuBtn, pressed && styles.pressed]}>
              <Text style={styles.menuIcon}>☰</Text>
              <Text style={styles.menuLabel}>资产</Text>
            </Pressable>
            <View style={styles.vsep} />
            <TransformToolbar compact />
          </View>
        </Panel>
      </View>

      {/* 选中角色:姿势检视浮层 */}
      {actor && (
        <View style={styles.tabletInspector} pointerEvents="box-none">
          <Panel>
            <Inspector actor={actor} compact />
          </Panel>
        </View>
      )}

      {/* 底部:相机镜头(居中浮层) */}
      <View style={styles.bottomCenter} pointerEvents="box-none">
        <Panel>
          <CameraDeck compact />
        </Panel>
      </View>

      {/* 左侧资产抽屉 */}
      <Drawer open={libraryOpen} onClose={() => setLibrary(false)} title="资产库">
        <InsertDock onItemAdded={() => setLibrary(false)} />
      </Drawer>
    </>
  );
}

/* ── 手机:顶部工具(选中时)+ 底部 4 Tab + 弹层 ── */
function PhoneChrome() {
  const actor = useSelectedActor();
  const activeSheet = useUI((s) => s.activeSheet);
  const openSheet = useUI((s) => s.openSheet);
  const closeSheet = useUI((s) => s.closeSheet);
  const setPreviewExpanded = useUI((s) => s.setPreviewExpanded);
  const previewExpanded = useUI((s) => s.previewExpanded);

  const open = (s: SheetKind) => {
    setPreviewExpanded(false);
    openSheet(s);
  };
  const openFrame = () => {
    closeSheet();
    setPreviewExpanded(true);
  };

  return (
    <>
      {/* 顶部:变换工具常驻(含清空),选道具也能用 */}
      <View style={styles.phoneTop} pointerEvents="box-none">
        <Panel>
          <TransformToolbar />
        </Panel>
      </View>

      {/* 底部 Tab 栏 */}
      <View style={[styles.tabBar, { paddingBottom: safeBottom }]} pointerEvents="auto">
        <Tab icon="➕" label="添加" active={activeSheet === 'add'} onPress={() => open('add')} />
        <Tab icon="🎭" label="姿势" active={activeSheet === 'pose'} disabled={!actor} onPress={() => open('pose')} />
        <Tab icon="📷" label="机位" active={activeSheet === 'camera'} onPress={() => open('camera')} />
        <Tab icon="🖼" label="出图" active={previewExpanded} onPress={openFrame} />
      </View>

      {/* 弹层:添加 / 姿势 / 机位 */}
      <BottomSheet open={activeSheet === 'add'} title="添加资产" onClose={closeSheet}>
        <AssetPicker onItemAdded={closeSheet} />
      </BottomSheet>
      <BottomSheet open={activeSheet === 'pose'} title="姿势" onClose={closeSheet}>
        {actor ? <Inspector actor={actor} /> : null}
      </BottomSheet>
      <BottomSheet open={activeSheet === 'camera'} title="相机 · 镜头" onClose={closeSheet}>
        <CameraDeck />
      </BottomSheet>
    </>
  );
}

function Tab({
  icon,
  label,
  active,
  disabled,
  onPress,
}: {
  icon: string;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.tab, pressed && styles.pressed, disabled && styles.tabDisabled]}
    >
      <Text style={[styles.tabIcon, active && styles.tabActiveText]}>{icon}</Text>
      <Text style={[styles.tabLabel, active && styles.tabActiveText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },

  /* desktop */
  leftDock: {
    position: 'absolute',
    top: safeTop,
    left: space.lg,
    bottom: space.lg,
    width: layout.libraryW,
    paddingTop: space.lg,
  },
  centerTop: {
    position: 'absolute',
    top: safeTop,
    left: layout.libraryW + space.lg * 2,
    marginTop: space.lg,
    gap: space.sm,
  },
  centerBottom: {
    position: 'absolute',
    left: layout.libraryW + space.lg * 2,
    right: layout.rightDockW + space.lg,
    bottom: space.lg,
  },

  /* tablet */
  topBar: { position: 'absolute', top: safeTop, left: space.lg, marginTop: space.lg },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  menuBtn: { flexDirection: 'row', alignItems: 'center', gap: space.xs, paddingHorizontal: space.sm, paddingVertical: space.sm, minHeight: 44 },
  menuIcon: { color: color.text, fontSize: font.title },
  menuLabel: { color: color.text, fontSize: font.btn, fontWeight: font.weightBtn },
  vsep: { width: 1, height: 22, backgroundColor: color.border, marginHorizontal: space.xs },
  tabletInspector: { position: 'absolute', top: safeTop, left: space.lg, right: space.lg, marginTop: 72 },
  bottomCenter: { position: 'absolute', left: space.lg, right: space.lg, bottom: 0, paddingBottom: space.lg, alignItems: 'center' },

  /* phone */
  phoneTop: { position: 'absolute', top: safeTop, left: space.lg, marginTop: space.lg },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: color.panelSolid,
    borderTopWidth: 1,
    borderColor: color.border,
    zIndex: z.toolbar,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: space.sm, minHeight: layout.tabBarH, gap: 2 },
  tabDisabled: { opacity: 0.35 },
  tabIcon: { fontSize: 20 },
  tabLabel: { color: color.textDim, fontSize: font.hint, fontWeight: font.weightBtn },
  tabActiveText: { color: color.accent },

  pressed: { opacity: 0.7 },
});
