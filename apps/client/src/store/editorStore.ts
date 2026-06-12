import { create } from 'zustand';
import type { Vec3, Camera, CameraPreset } from '@asc/shared-types';
import { getDef, modelDims, SCENES, type ModelDef } from '@asc/resource-library';

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

/** 可保存/读取的场景快照(本地 JSON 文件):忠实记录构图 + 机位 + 参考底图。
 *  与 shared-types 的 Scene 是「编辑器全量快照 ⊇ 持久化契约」的关系;接 Firestore(D13)时再映射。 */
export interface SceneSnapshot {
  version: 1;
  objects: EditorObject[];
  cameras: Camera[];
  bgImageUrl: string | null;
  bgAspect: number | null;
  /** 场景里用到的运行时上传模型(gltf,file 为内嵌 data URL)→ 存档自包含、可分享 */
  userModels?: ModelDef[];
  savedAt: number;
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
  /** 运行时上传的模型(gltf data URL),与静态 CATALOG 并存、可放进场景、随存档保存 */
  userModels: ModelDef[];

  add: (modelId: string) => void;
  addUserModel: (def: ModelDef) => void;
  /** 把一个导入模型拆成多个部件对象;parts 带各自模型 + 相对原点的 (dx,dz) 模型空间偏移 */
  splitInto: (originalId: string, parts: { def: ModelDef; dx: number; dz: number }[]) => void;
  loadScene: (presetId: string) => void;
  loadSnapshot: (snap: SceneSnapshot) => void;
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

/** 解析 modelId:先查运行时上传的 userModels,再查静态 CATALOG。 */
function resolveDef(id: string, userModels: ModelDef[]): ModelDef | undefined {
  return userModels.find((m) => m.id === id) ?? getDef(id);
}

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
  userModels: [],

  add: (modelId) =>
    set((s) => {
      const def = resolveDef(modelId, s.userModels);
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

  addUserModel: (def) => set((s) => ({ userModels: [...s.userModels, def] })),

  // 拆分:移除原对象,按各部件的模型空间偏移(绕原 rotationY 旋转后)放到对应世界位置。
  splitInto: (originalId, parts) =>
    set((s) => {
      const orig = s.objects.find((o) => o.id === originalId);
      if (!orig || parts.length === 0) return {};
      const cos = Math.cos(orig.rotationY);
      const sin = Math.sin(orig.rotationY);
      const newObjs = parts.map((p) => {
        const wx = orig.position[0] + (p.dx * cos + p.dz * sin);
        const wz = orig.position[2] + (-p.dx * sin + p.dz * cos);
        return makeObject(p.def, [wx, 0, wz], orig.rotationY, 0);
      });
      return {
        userModels: [...s.userModels, ...parts.map((p) => p.def)],
        objects: [...s.objects.filter((o) => o.id !== originalId), ...newObjs],
        selectedId: null,
      };
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

  // 读取保存的快照:按 modelId 在当前库里重建(库里没有的模型跳过),
  // 保留各自的位置/旋转/颜色/姿势/标签,size 按当前 def 重算(库尺寸可能已更新)。
  loadSnapshot: (snap) =>
    set(() => {
      const userModels = snap.userModels ?? [];
      const objects = (snap.objects ?? [])
        .map((o) => {
          const def = resolveDef(o.modelId, userModels);
          if (!def) return null;
          const dims = modelDims(def);
          return {
            ...o,
            kind: def.type,
            size: [dims.footprint[0], dims.height, dims.footprint[1]] as [number, number, number],
          };
        })
        .filter((o): o is EditorObject => o !== null);
      return {
        objects,
        userModels,
        cameras: snap.cameras ?? [],
        bgImageUrl: snap.bgImageUrl ?? null,
        bgAspect: snap.bgAspect ?? null,
        selectedId: null,
      };
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
