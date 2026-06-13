import type { ModelDef } from '@asc/resource-library';
import { Mannequin } from './Mannequin';
import { PrimitiveModel } from './Primitive';
import { RoomShell } from './RoomShell';
import { OutdoorShell } from './OutdoorShell';
import { GltfModel } from './Gltf';

/** 统一渲染器:按模型来源分发(程序化人体 / 图元 / 房间壳 / glTF)。内容原点在脚底(y=0)。 */
export function ModelView({ def, color, poseId }: { def: ModelDef; color: string; poseId?: string }) {
  const s = def.source;
  if (s.kind === 'human') {
    return <Mannequin body={s.body} pose={poseId ?? 'stand'} color={color} />;
  }
  if (s.kind === 'primitive') {
    return <PrimitiveModel parts={s.parts} color={color} />;
  }
  if (s.kind === 'roomShell') {
    return <RoomShell variant={s.variant} />;
  }
  if (s.kind === 'outdoorShell') {
    return <OutdoorShell ground={s.ground} sky={s.sky} backdrop={s.backdrop} />;
  }
  if (s.kind === 'gltf') {
    return <GltfModel file={s.file} poseFile={poseId ? s.poses?.[poseId] : undefined} />;
  }
  return null;
}
