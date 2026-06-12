import type { BodyParams } from './Mannequin';
import { FURNITURE } from './furniture';

export type ModelType = 'actor' | 'prop' | 'environment';

export type ModelSource =
  | { kind: 'human'; body: BodyParams }
  | { kind: 'furniture'; shapeId: string }
  | { kind: 'gltf'; url: string; poses?: Record<string, string> }; // 将来真实模型(T3)

export interface ModelDef {
  id: string;
  name: string;
  type: ModelType;
  category: string;
  defaultColor?: string;
  source: ModelSource;
}

const HAIR_DARK = '#2a2a2a';
const HAIR_BROWN = '#3a2a1a';

export const CATALOG: ModelDef[] = [
  // ── 人物(参数化人体) ──
  { id: 'man-tall', name: '高个男', type: 'actor', category: '人物', source: { kind: 'human', body: { height: 1.85, build: 1.0, shoulder: 1.1, hip: 0.95, head: 1.0, hair: HAIR_DARK } } },
  { id: 'man-heavy', name: '壮硕男', type: 'actor', category: '人物', source: { kind: 'human', body: { height: 1.75, build: 1.35, shoulder: 1.15, hip: 1.1, head: 1.0, hair: HAIR_DARK } } },
  { id: 'man-slim', name: '瘦高男', type: 'actor', category: '人物', source: { kind: 'human', body: { height: 1.78, build: 0.82, shoulder: 1.0, hip: 0.9, head: 1.0, hair: HAIR_DARK } } },
  { id: 'woman', name: '女性', type: 'actor', category: '人物', source: { kind: 'human', body: { height: 1.66, build: 0.95, shoulder: 0.9, hip: 1.05, head: 1.0, hair: HAIR_BROWN, hairStyle: 'long', bust: 0.55 } } },
  { id: 'woman-curvy', name: '丰满女', type: 'actor', category: '人物', source: { kind: 'human', body: { height: 1.64, build: 1.15, shoulder: 0.88, hip: 1.2, head: 1.0, hair: HAIR_BROWN, hairStyle: 'long', bust: 0.75 } } },
  { id: 'kid', name: '儿童', type: 'actor', category: '人物', source: { kind: 'human', body: { height: 1.2, build: 0.95, shoulder: 0.9, hip: 0.95, head: 1.25, hair: HAIR_DARK } } },

  // ── 家具 / 道具 ──
  { id: 'bed', name: '床', type: 'prop', category: '家具', defaultColor: '#b08d57', source: { kind: 'furniture', shapeId: 'bed' } },
  { id: 'nightstand', name: '床头柜', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'nightstand' } },
  { id: 'wardrobe', name: '衣柜', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'wardrobe' } },
  { id: 'desk', name: '书桌', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'desk' } },
  { id: 'chair', name: '椅子', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'chair' } },
  { id: 'sofa', name: '沙发', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'sofa' } },
  { id: 'coffeeTable', name: '茶几', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'coffeeTable' } },
  { id: 'tvStand', name: '电视柜', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'tvStand' } },
  { id: 'bookshelf', name: '书架', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'bookshelf' } },
  { id: 'lamp', name: '落地灯', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'lamp' } },
  { id: 'plant', name: '绿植', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'plant' } },
  { id: 'blackboard', name: '黑板', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'blackboard' } },
  { id: 'studentDesk', name: '课桌', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'studentDesk' } },
  { id: 'sideboard', name: '矮柜', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'sideboard' } },
  { id: 'pendant', name: '吊灯', type: 'prop', category: '家具', source: { kind: 'furniture', shapeId: 'pendant' } },

  // ── 门窗装饰(靠墙摆放,提供方位标志) ──
  { id: 'door', name: '门', type: 'prop', category: '门窗装饰', source: { kind: 'furniture', shapeId: 'door' } },
  { id: 'window', name: '窗户', type: 'prop', category: '门窗装饰', source: { kind: 'furniture', shapeId: 'window' } },
  { id: 'painting', name: '壁画', type: 'prop', category: '门窗装饰', source: { kind: 'furniture', shapeId: 'painting' } },
  { id: 'wallClock', name: '挂钟', type: 'prop', category: '门窗装饰', source: { kind: 'furniture', shapeId: 'wallClock' } },
  { id: 'wallTV', name: '壁挂电视', type: 'prop', category: '门窗装饰', source: { kind: 'furniture', shapeId: 'wallTV' } },
  { id: 'rug', name: '地毯', type: 'prop', category: '门窗装饰', source: { kind: 'furniture', shapeId: 'rug' } },

  // ── 场景元素 ──
  { id: 'room', name: '空房间', type: 'environment', category: '场景元素', source: { kind: 'furniture', shapeId: 'room' } },
  { id: 'roomBalcony', name: '阳台房间', type: 'environment', category: '场景元素', source: { kind: 'furniture', shapeId: 'roomBalcony' } },
];

export function getDef(id: string): ModelDef | undefined {
  return CATALOG.find((d) => d.id === id);
}

/** 取景/选择圈用的尺寸:[footX, height, footZ] */
export function modelDims(def: ModelDef): { height: number; footprint: [number, number] } {
  const s = def.source;
  if (s.kind === 'human') return { height: s.body.height, footprint: [0.55, 0.4] };
  if (s.kind === 'furniture') {
    const f = FURNITURE[s.shapeId];
    return f ? { height: f.height, footprint: f.footprint } : { height: 1, footprint: [1, 1] };
  }
  return { height: 1.8, footprint: [1, 1] };
}
