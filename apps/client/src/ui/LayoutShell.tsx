import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from './useBreakpoint';
import { useUI, type SheetKind } from './uiStore';
import { color, space, font, z, layout } from './theme';
import { safeTop, safeBottom } from './safeArea';
import { Panel } from './primitives/Panel';
import { Button } from './primitives/Button';
import { Drawer } from './primitives/Drawer';
import { BottomSheet } from './primitives/BottomSheet';
import { InsertDock } from '../editor/panels/InsertDock';
import { AssetPicker } from '../editor/panels/AssetPicker';
import { FileBar } from '../editor/panels/FileBar';
import { ShotDock } from '../editor/panels/ShotDock';
import { PreviewMount } from '../editor/panels/PreviewMount';
import { InspectorPanel } from '../editor/panels/inspector/InspectorPanel';
import { InspectorContent } from '../editor/panels/inspector/InspectorContent';
import { GenerateDock } from '../editor/panels/GenerateDock';
import { SettingsDock } from '../editor/panels/SettingsDock';
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
      <PreviewMount />
      <GenerateDock />
      <SettingsDock />
    </View>
  );
}

/* ── 桌面 / iPad 横屏:左库 + 中央浮层 + 右栏预览 ── */
function DesktopChrome() {
  const { t } = useTranslation();
  const setBottomBarH = useUI((s) => s.setBottomBarH);
  return (
    <>
      {/* 左:资产库(纯创建) */}
      <View style={styles.leftDock} pointerEvents="box-none">
        <Panel noPadding style={styles.fill}>
          <InsertDock />
        </Panel>
      </View>

      {/* 中上:文件栏(姿势改由选中角色右上角的 HUD 提供) */}
      <View style={styles.centerTop} pointerEvents="box-none">
        <Panel>
          <FileBar compact />
        </Panel>
      </View>

      {/* 中下:分镜 + 出图。右边界恒对齐右下角坐标系(gizmo);检视面板打开时由其自身上移让位,工具条不动。 */}
      <View
        style={styles.centerBottom}
        onLayout={(e) => setBottomBarH(e.nativeEvent.layout.height)}
        pointerEvents="box-none"
      >
        <Panel>
          <View style={styles.bottomRow}>
            <View style={styles.bottomFill}>
              <ShotDock />
            </View>
            <Button
              label={t('nav.generate')}
              icon="✨"
              compact
              tooltip={t('preview.genFromFraming')}
              tooltipPlace="top"
              style={styles.generateBtn}
              onPress={() => useUI.getState().openGenerate()}
            />
          </View>
        </Panel>
      </View>

      {/* 右:检视面板(预览 + 相机 + 选中) */}
      <InspectorPanel />
    </>
  );
}

/* ── iPad 竖屏 / 小平板:顶部条 + 抽屉库 + 底部相机 + 浮动预览 ── */
function TabletChrome() {
  const { t } = useTranslation();
  const libraryOpen = useUI((s) => s.libraryOpen);
  const toggleLibrary = useUI((s) => s.toggleLibrary);
  const setLibrary = useUI((s) => s.setLibrary);
  const inspectorOpen = useUI((s) => s.inspectorOpen);
  const toggleInspector = useUI((s) => s.toggleInspector);
  const setInspector = useUI((s) => s.setInspector);

  return (
    <>
      {/* 顶部条:资产开关 + 变换工具 + 检视开关 */}
      <View style={styles.topBar} pointerEvents="box-none">
        <Panel>
          <View style={styles.topRow}>
            <Pressable
              onPress={toggleLibrary}
              style={({ pressed }) => [styles.menuBtn, pressed && styles.pressed]}
            >
              <Text style={styles.menuIcon}>☰</Text>
              <Text style={styles.menuLabel}>{t('nav.assets')}</Text>
            </Pressable>
            <View style={styles.vsep} />
            <FileBar compact />
            <View style={styles.vsep} />
            <Pressable
              onPress={toggleInspector}
              style={({ pressed }) => [styles.menuBtn, pressed && styles.pressed]}
            >
              <Text style={styles.menuIcon}>▦</Text>
              <Text style={styles.menuLabel}>{t('inspector.title')}</Text>
            </Pressable>
          </View>
        </Panel>
      </View>

      {/* 底部:分镜储存条 + 出图(居中浮层) */}
      <View style={styles.bottomCenter} pointerEvents="box-none">
        <Panel>
          <View style={styles.bottomRow}>
            <View style={styles.bottomFill}>
              <ShotDock />
            </View>
            <Button
              label={t('nav.generate')}
              icon="✨"
              compact
              tooltip={t('preview.genFromFraming')}
              tooltipPlace="top"
              style={styles.generateBtn}
              onPress={() => useUI.getState().openGenerate()}
            />
          </View>
        </Panel>
      </View>

      {/* 左侧资产抽屉 */}
      <Drawer open={libraryOpen} onClose={() => setLibrary(false)} title={t('nav.assetLibrary')} side="left">
        <InsertDock onItemAdded={() => setLibrary(false)} />
      </Drawer>

      {/* 右侧检视抽屉(相机 + 选中) */}
      <Drawer
        open={inspectorOpen}
        onClose={() => setInspector(false)}
        title={t('inspector.title')}
        side="right"
      >
        <ScrollView contentContainerStyle={styles.drawerBody}>
          <InspectorContent compact />
        </ScrollView>
      </Drawer>
    </>
  );
}

/* ── 手机:顶部工具(选中时)+ 底部 4 Tab + 弹层 ── */
function PhoneChrome() {
  const { t } = useTranslation();
  const activeSheet = useUI((s) => s.activeSheet);
  const openSheet = useUI((s) => s.openSheet);
  const closeSheet = useUI((s) => s.closeSheet);
  const setPreviewExpanded = useUI((s) => s.setPreviewExpanded);
  const generateOpen = useUI((s) => s.generateOpen);

  const open = (s: SheetKind) => {
    setPreviewExpanded(false);
    openSheet(s);
  };

  return (
    <>
      {/* 顶部:变换工具常驻(含清空),选道具也能用 */}
      <View style={styles.phoneTop} pointerEvents="box-none">
        <Panel>
          <FileBar />
        </Panel>
      </View>

      {/* 底部 Tab 栏:添加 / 相机(检视) / 分镜 / 出图(放大预览点缩略图;姿势在相机弹层) */}
      <View style={[styles.tabBar, { paddingBottom: safeBottom }]} pointerEvents="auto">
        <Tab icon="➕" label={t('nav.add')} active={activeSheet === 'add'} onPress={() => open('add')} />
        <Tab
          icon="📷"
          label={t('inspector.camera')}
          active={activeSheet === 'camera'}
          onPress={() => open('camera')}
        />
        <Tab
          icon="🎬"
          label={t('shot.label')}
          active={activeSheet === 'shots'}
          onPress={() => open('shots')}
        />
        <Tab
          icon="✨"
          label={t('nav.generate')}
          active={generateOpen}
          onPress={() => useUI.getState().openGenerate()}
        />
      </View>

      {/* 弹层:添加 / 相机 / 分镜 */}
      <BottomSheet open={activeSheet === 'add'} title={t('nav.addAssets')} onClose={closeSheet}>
        <AssetPicker onItemAdded={closeSheet} />
      </BottomSheet>
      <BottomSheet open={activeSheet === 'camera'} title={t('inspector.camera')} onClose={closeSheet}>
        <InspectorContent />
      </BottomSheet>
      <BottomSheet open={activeSheet === 'shots'} title={t('shot.label')} onClose={closeSheet}>
        <ShotDock />
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
    right: layout.gizmoGutter, // 右边界恒对齐右下角坐标系;检视面板改为上移让位,不再推挤工具条
    bottom: space.lg,
  },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  bottomFill: { flex: 1, minWidth: 0 },
  generateBtn: { backgroundColor: color.accent },

  /* tablet */
  topBar: { position: 'absolute', top: safeTop, left: space.lg, marginTop: space.lg },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  menuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    minHeight: 44,
  },
  menuIcon: { color: color.text, fontSize: font.title },
  menuLabel: { color: color.text, fontSize: font.btn, fontWeight: font.weightBtn },
  vsep: { width: 1, height: 22, backgroundColor: color.border, marginHorizontal: space.xs },
  bottomCenter: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    bottom: 0,
    paddingBottom: space.lg,
    alignItems: 'center',
  },
  drawerBody: { padding: space.lg, gap: space.sm },

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
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    minHeight: layout.tabBarH,
    gap: 2,
  },
  tabDisabled: { opacity: 0.35 },
  tabIcon: { fontSize: 20 },
  tabLabel: { color: color.textDim, fontSize: font.hint, fontWeight: font.weightBtn },
  tabActiveText: { color: color.accent },

  pressed: { opacity: 0.7 },
});
