import type { ModelDef, ScenePreset } from './types';
import { CATALOG } from './generated/catalog';
import { SCENES } from './scenes';

/** 按 id 取模型定义 */
export function getDef(id: string): ModelDef | undefined {
  return CATALOG.find((d) => d.id === id);
}

/** 取景/选择圈用的尺寸:human 用 body.height + 默认脚印;其余用条目自带的 footprint/height。 */
export function modelDims(def: ModelDef): { height: number; footprint: [number, number] } {
  if (def.source.kind === 'human') {
    return { height: def.height ?? def.source.body.height, footprint: def.footprint ?? [0.55, 0.4] };
  }
  return { height: def.height ?? 1, footprint: def.footprint ?? [1, 1] };
}

/**
 * 贡献护栏(纯函数,零依赖):校验目录与场景的一致性,返回错误清单(空数组 = 通过)。
 * 配套 `pnpm --filter @asc/resource-library check` 在 PR 时跑。类型系统是第一道关,这是第二道。
 */
export function validateCatalog(catalog: ModelDef[] = CATALOG, scenes: ScenePreset[] = SCENES): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const d of catalog) {
    if (ids.has(d.id)) errors.push(`重复的模型 id:${d.id}`);
    ids.add(d.id);
    if (d.source.kind === 'primitive' && d.source.parts.length === 0) {
      errors.push(`primitive 模型「${d.id}」没有任何 parts`);
    }
    if (d.source.kind === 'gltf' && !d.license?.license) {
      errors.push(`gltf 模型「${d.id}」缺少 license(开源再分发命脉)`);
    }
  }
  for (const sc of scenes) {
    for (const pl of sc.placements) {
      if (!ids.has(pl.modelId)) {
        errors.push(`场景「${sc.id}」引用了不存在的模型:${pl.modelId}`);
      }
    }
  }
  return errors;
}
