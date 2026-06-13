import { getDef } from '@asc/resource-library';
import { useEditor } from '../store/editorStore';

// 室外光照调性(随 sky 变化):半球天光色 / 地光色 / 太阳强度 / 环境光强度。
const OUTDOOR_RIG: Record<string, { sky: string; ground: string; sun: number; amb: number }> = {
  day: { sky: '#bcd6f0', ground: '#6b6b5e', sun: 1.6, amb: 0.28 },
  dusk: { sky: '#e8b88a', ground: '#4a4036', sun: 1.2, amb: 0.3 },
  night: { sky: '#243042', ground: '#1a1a22', sun: 0.5, amb: 0.22 },
  overcast: { sky: '#cfd4d8', ground: '#5d5d54', sun: 0.9, amb: 0.45 },
};

/**
 * 全局光照:依当前环境切换光鬼。主视图(SceneView)与预览/导出画布(Preview)共用此组件,
 * 保证截图与编辑器一致。室内为默认光鬼,与历史**逐像素一致**(勿改强度/方位,既有室内场景零变化);
 * 室外用半球天光 + 更高更强的太阳。
 */
export function SceneLighting() {
  const env = useEditor((s) => s.objects.find((o) => o.kind === 'environment'));
  const src = env ? getDef(env.modelId)?.source : undefined;

  if (src && src.kind === 'outdoorShell') {
    const r = OUTDOOR_RIG[src.sky ?? 'day'] ?? OUTDOOR_RIG.day!;
    return (
      <>
        <hemisphereLight color={r.sky} groundColor={r.ground} intensity={0.6} />
        <ambientLight intensity={r.amb} />
        <directionalLight position={[6, 10, 4]} intensity={r.sun} />
      </>
    );
  }

  // 室内默认(与历史一致)
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 6, 2]} intensity={1.2} />
    </>
  );
}
