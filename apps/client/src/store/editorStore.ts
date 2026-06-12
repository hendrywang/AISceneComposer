import { create } from 'zustand';
import type { Vec3, Camera, CameraPreset } from '@asc/shared-types';
import { getDef, modelDims, type ModelDef } from '../editor/catalog';
import { SCENES } from '../editor/scenes';

export type TransformMode = 'translate' | 'rotate';
export type ObjectKind = 'actor' | 'prop' | 'environment';

/**
 * 编辑器工作态对象。引用 catalog 的 modelId;kind/size 在创建时从 catalog 反规范化,
 * 便于相机取景/选择圈直接使用。保存时(T11)再映射回 shared-types。
 */
export interface EditorObject {
  id: string;
  modelId: string;
  kind: ObjectKind;
  position: Vec3;
  rotationY: number;
  color: string;
  size: [number, number, number]; // [footX, height, footZ]
  poseId?: string; // 仅 actor
  label?: string;
}

export type CameraCmd =
  | { type: 'save'; name: string }
  | { type: 'apply'; view: Camera }
  | { type: 'preset'; preset: CameraPreset }
  | { type: 'fov'; value: number }
  | null;

interface EditorState {
  objects: EditorObject[];
  selectedId: string | null;
  transformMode: TransformMode;
  cameras: Camera[];
  cameraCmd: CameraCmd;
  bgImageUrl: string | null;
  bgAspect: number | null;

  add: (modelId: string) => void;
  loadScene: (presetId: string) => void;
  clear: () => void;
  select: (id: string | null) => void;
  removeSelected: () => void;
  duplicateSelected: () => void;
  commitTransform: (id: string, position: Vec3, rotationY: number) => void;
  setMode: (m: TransformMode) => void;
  setPose: (id: string, poseId: string) => void;

  runPreset: (preset: CameraPreset) => void;
  setFov: (value: number) => void;
  requestSaveCamera: () => void;
  applyCamera: (view: Camera) => void;
  removeCamera: (id: string) => void;
  addCamera: (c: Omit<Camera, 'id'>) => void;
  clearCameraCmd: () => void;
  setBg: (url: string | null, aspect: number | null) => void;
}

const ACTOR_COLORS = ['#e23b3b', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'];

let counter = 0;
const uid = () => `o${(counter++).toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;

const spread = (i: number): number[] => [((i % 4) - 1.5) * 1.2, 0, Math.floor(i / 4) * 1.2];

function makeObject(
  def: ModelDef,
  position: number[],
  rotationY: number,
  actorColorIdx: number,
): EditorObject {
  const dims = modelDims(def);
  const isActor = def.type === 'actor';
  return {
    id: uid(),
    modelId: def.id,
    kind: def.type,
    position: [position[0]!, position[1]!, position[2]!],
    rotationY,
    color: isActor ? ACTOR_COLORS[actorColorIdx % ACTOR_COLORS.length]! : (def.defaultColor ?? '#b8b2a6'),
    size: [dims.footprint[0], dims.height, dims.footprint[1]],
    poseId: isActor ? 'stand' : undefined,
    label: def.name,
  };
}

export const useEditor = create<EditorState>((set) => ({
  objects: [],
  selectedId: null,
  transformMode: 'translate',
  cameras: [],
  cameraCmd: null,
  bgImageUrl: null,
  bgAspect: null,

  add: (modelId) =>
    set((s) => {
      const def = getDef(modelId);
      if (!def) return {};
      // 房间(环境)为单例:替换已有的、固定原点、不选中(避免误选整个房间)
      if (def.type === 'environment') {
        const base = s.objects.filter((o) => o.kind !== 'environment');
        const room = makeObject(def, [0, 0, 0], 0, 0);
        return { objects: [room, ...base], selectedId: s.selectedId };
      }
      const actorCount = s.objects.filter((o) => o.kind === 'actor').length;
      const p = spread(s.objects.length);
      const obj = makeObject(def, [p[0]!, 0, p[2]!], 0, actorCount);
      return { objects: [...s.objects, obj], selectedId: obj.id };
    }),

  loadScene: (presetId) =>
    set(() => {
      const preset = SCENES.find((p) => p.id === presetId);
      if (!preset) return {};
      let actorIdx = 0;
      const objects = preset.placements
        .map((pl) => {
          const def = getDef(pl.modelId);
          if (!def) return null;
          const idx = def.type === 'actor' ? actorIdx++ : 0;
          return makeObject(def, pl.position, pl.rotationY ?? 0, idx);
        })
        .filter((o): o is EditorObject => o !== null);
      return { objects, selectedId: null };
    }),

  clear: () => set({ objects: [], selectedId: null }),
  select: (id) => set({ selectedId: id }),

  removeSelected: () =>
    set((s) => ({
      objects: s.objects.filter((o) => o.id !== s.selectedId),
      selectedId: null,
    })),

  // 复制选中物体:在其旁边(世界 +X,按脚印宽度留间距)再放一份,并选中副本。
  // 角色副本取下一个身份色(沿用 add 的轮转),保证多人可区分;道具沿用原色。房间不复制。
  duplicateSelected: () =>
    set((s) => {
      const src = s.objects.find((o) => o.id === s.selectedId);
      if (!src || src.kind === 'environment') return {};
      const actorCount = s.objects.filter((o) => o.kind === 'actor').length;
      const gap = Math.max(src.size[0], 0.6) + 0.3;
      const copy: EditorObject = {
        ...src,
        id: uid(),
        position: [src.position[0] + gap, 0, src.position[2]],
        color: src.kind === 'actor' ? ACTOR_COLORS[actorCount % ACTOR_COLORS.length]! : src.color,
      };
      return { objects: [...s.objects, copy], selectedId: copy.id };
    }),

  commitTransform: (id, position, rotationY) =>
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? { ...o, position, rotationY } : o)),
    })),

  setMode: (m) => set({ transformMode: m }),
  setPose: (id, poseId) =>
    set((s) => ({
      objects: s.objects.map((o) => (o.id === id ? { ...o, poseId } : o)),
    })),

  runPreset: (preset) => set({ cameraCmd: { type: 'preset', preset } }),
  setFov: (value) => set({ cameraCmd: { type: 'fov', value } }),
  requestSaveCamera: () =>
    set((s) => ({ cameraCmd: { type: 'save', name: `机位 ${s.cameras.length + 1}` } })),
  applyCamera: (view) => set({ cameraCmd: { type: 'apply', view } }),
  removeCamera: (id) => set((s) => ({ cameras: s.cameras.filter((c) => c.id !== id) })),
  addCamera: (c) => set((s) => ({ cameras: [...s.cameras, { ...c, id: uid() }] })),
  clearCameraCmd: () => set({ cameraCmd: null }),
  setBg: (url, aspect) => set({ bgImageUrl: url, bgAspect: aspect }),
}));
