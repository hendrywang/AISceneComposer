import { View, ScrollView, StyleSheet } from 'react-native';
import { useEditor } from '../../../store/editorStore';
import { useUI } from '../../../ui/uiStore';
import { Panel } from '../../../ui/primitives/Panel';
import { space, layout } from '../../../ui/theme';
import { safeTop } from '../../../ui/safeArea';
import { previewBox } from './framing';
import { InspectorContent } from './InspectorContent';

/**
 * 桌面右栏检视面板:顶部为预览留白(PreviewMount 的 rail 绝对覆盖其上),其下为相机+选中,可滚动。
 * 预览高度与 PreviewMount 同源(previewBox + previewMax)→ 内容恰好落在预览下方,画幅变化时一起重排。
 */
export function InspectorPanel() {
  const inspectorOpen = useUI((s) => s.inspectorOpen);
  const bottomBarH = useUI((s) => s.bottomBarH);
  const aspectId = useEditor((s) => s.aspectId);
  const bgImageUrl = useEditor((s) => s.bgImageUrl);
  const bgAspect = useEditor((s) => s.bgAspect);
  const { boxH } = previewBox(aspectId, bgImageUrl, bgAspect, layout.previewMax);
  // 与 PreviewMount 桌面 rail 的 paddingTop 一致(顶部留白)。
  const contentTop = space.lg + boxH + space.md;
  // 让出底部工具条(分镜+出图)实测高度 + 上下留白 → 面板浮于工具条之上,工具条得以保持对齐坐标系而不被遮挡。
  const dockBottom = bottomBarH > 0 ? space.lg + bottomBarH + space.lg : space.lg;

  // 默认收起;由预览右上角「🎛」按钮(toggleInspector)开关。
  if (!inspectorOpen) return null;

  return (
    <View style={[styles.dock, { bottom: dockBottom }]} pointerEvents="box-none">
      <View style={[styles.contentWrap, { top: contentTop }]} pointerEvents="box-none">
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} pointerEvents="auto">
          <Panel>
            <InspectorContent compact />
          </Panel>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    top: safeTop,
    right: space.lg,
    // bottom 由组件按底部工具条实测高度给(浮于工具条之上,不遮挡)。
    width: layout.rightDockW - space.lg,
  },
  // 宽度与预览框一致(previewMax)且右对齐 → 设置面板与上方预览左右边缘对齐(16:9/4:3/1:1)。
  contentWrap: { position: 'absolute', right: 0, bottom: 0, width: layout.previewMax },
  scroll: { flex: 1 },
});
