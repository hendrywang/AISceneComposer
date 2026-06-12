import { Mannequin } from './Mannequin';
import { Furniture } from './furniture';
import type { ModelDef } from './catalog';

/** 统一渲染器:按模型来源分发(程序化人体 / 家具图元 / 将来 glTF)。内容原点在脚底(y=0)。 */
export function ModelView({
  def,
  color,
  poseId,
}: {
  def: ModelDef;
  color: string;
  poseId?: string;
}) {
  const s = def.source;
  if (s.kind === 'human') {
    return <Mannequin body={s.body} pose={poseId ?? 'stand'} color={color} />;
  }
  if (s.kind === 'furniture') {
    return <Furniture shapeId={s.shapeId} color={color} />;
  }
  // s.kind === 'gltf':T3 接入真实模型时实现(useGLTF + Clone + Suspense)
  return null;
}
