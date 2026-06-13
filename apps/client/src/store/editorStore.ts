import { create } from 'zustand';
import type { Vec3, Shot, RenderStyle } from '@asc/shared-types';
import { getDef, modelDims, SCENES, type ModelDef } from '@asc/resource-library';
import { generateFromPreview } from '../editor/generate';
import { previewControl, cameraSync } from '../editor/cameraSync';
import { useSettings } from './settingsStore';
import i18n from '../i18n';

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
  shots: Shot[];
  /** @deprecated 旧档写的是 cameras;loadSnapshot 读取时回退 */
  cameras?: Shot[];
  bgImageUrl: string | null;
  bgAspect: number | null;
  /** 场景里用到的运行时上传模型(gltf,file 为内嵌 data URL)→ 存档自包含、可分享 */
  userModels?: ModelDef[];
  savedAt: number;
}

export type CameraCmd =
  | { type: 'apply'; view: Shot }
  | { type: 'fov'; value: number }
  | { type: 'reset' }
  | null;

interface EditorState {
  objects: EditorObject[];
  selectedId: string | null;
  transformMode: TransformMode;
  shots: Shot[];
  /** 当前选中分镜(分镜条高亮) */
  activeShotId: string | null;
  cameraCmd: CameraCmd;
  bgImageUrl: string | null;
  bgAspect: number | null;
  /** 当前画幅比例 id(RATIOS,如 '16:9');从 PreviewDock 上提,分镜可存/还原 */
  aspectId: string;
  /** 当前镜头焦距(竖直 FOV 度);镜头按钮据此高亮 */
  fov: number;
  /** 运行时上传的模型(gltf data URL),与静态 CATALOG 并存、可放进场景、随存档保存 */
  userModels: ModelDef[];

  // 出图(P0-A):提示词 + 画风 + 异步生成态(结果放 store,跨断点 chrome 重挂存活)
  prompt: string;
  style: RenderStyle;
  genStatus: 'idle' | 'running' | 'done' | 'error';
  genResultUrl: string | null;
  genError: string | null;

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

  setFov: (value: number) => void;
  setAspect: (id: string) => void;
  /** 把当前取景(机位+画幅+缩略图)存成一格分镜 */
  captureShot: () => void;
  applyShot: (shot: Shot) => void;
  removeShot: (id: string) => void;
  clearCameraCmd: () => void;
  setBg: (url: string | null, aspect: number | null) => void;

  setPrompt: (v: string) => void;
  setStyle: (v: RenderStyle) => void;
  generate: () => Promise<void>;
  clearGen: () => void;
}

const ACTOR_COLORS = ['#e23b3b', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#ec4899'];

/** 解析 modelId:先查运行时上传的 userModels,再查静态 CATALOG。 */
function resolveDef(id: string, userModels: ModelDef[]): ModelDef | undefined {
  return userModels.find((m) => m.id === id) ?? getDef(id);
}

let counter = 0;
const uid = () => `o${(counter++).toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;

const spread = (i: number): number[] => [((i % 4) - 1.5) * 1.2, 0, Math.floor(i / 4) * 1.2];

/** 分镜缩略图长边(px) */
const THUMB_EDGE = 192;

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

export const useEditor = create<EditorState>((set, get) => ({
  objects: [],
  selectedId: null,
  transformMode: 'translate',
  shots: [],
  activeShotId: null,
  cameraCmd: null,
  bgImageUrl: null,
  bgAspect: null,
  aspectId: useSettings.getState().defaultAspect,
  fov: 55,
  userModels: [],
  prompt: '',
  style: 'realistic',
  genStatus: 'idle',
  genResultUrl: null,
  genError: null,

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
      const shots = (snap.shots ?? snap.cameras ?? []).map((sh) => ({
        ...sh,
        aspect: sh.aspect ?? '16:9',
        thumbnail: sh.thumbnail ?? null,
      }));
      return {
        objects,
        userModels,
        shots,
        activeShotId: null,
        bgImageUrl: snap.bgImageUrl ?? null,
        bgAspect: snap.bgAspect ?? null,
        selectedId: null,
      };
    }),

  // 新建一个完全空白的场景:清空物体 / 机位 / 参考底图,并复位相机视角(坐标系归位)。
  clear: () =>
    set({
      objects: [],
      selectedId: null,
      shots: [],
      activeShotId: null,
      bgImageUrl: null,
      bgAspect: null,
      fov: 55,
      cameraCmd: { type: 'reset' },
    }),
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

  setFov: (value) => set({ cameraCmd: { type: 'fov', value }, fov: value }),
  setAspect: (id) => set({ aspectId: id }),
  captureShot: () => {
    // 缩略图来自预览 Canvas(渲染副作用),先取出再进 set;机位读实时同源的 cameraSync。
    const thumbnail = previewControl.capture?.(THUMB_EDGE) ?? null;
    const { position: p, target: t, fov } = cameraSync;
    set((s) => {
      const shot: Shot = {
        id: uid(),
        name: i18n.t('shot.name', { n: s.shots.length + 1 }),
        position: [p.x, p.y, p.z],
        target: [t.x, t.y, t.z],
        fov,
        aspect: s.aspectId,
        thumbnail,
      };
      return { shots: [...s.shots, shot], activeShotId: shot.id };
    });
  },
  applyShot: (shot) =>
    set({
      cameraCmd: { type: 'apply', view: shot },
      aspectId: shot.aspect,
      activeShotId: shot.id,
      fov: shot.fov,
    }),
  removeShot: (id) =>
    set((s) => ({
      shots: s.shots.filter((sh) => sh.id !== id),
      activeShotId: s.activeShotId === id ? null : s.activeShotId,
    })),
  clearCameraCmd: () => set({ cameraCmd: null }),
  setBg: (url, aspect) => set({ bgImageUrl: url, bgAspect: aspect }),

  setPrompt: (v) => set({ prompt: v }),
  setStyle: (v) => set({ style: v }),
  clearGen: () => set({ genStatus: 'idle', genResultUrl: null, genError: null }),
  generate: async () => {
    const { prompt, style, genStatus } = get();
    if (genStatus === 'running') return; // 防重复提交
    if (!prompt.trim()) {
      set({ genStatus: 'error', genError: i18n.t('errors.enterPrompt') });
      return;
    }
    set({ genStatus: 'running', genError: null, genResultUrl: null });
    try {
      const url = await generateFromPreview({ prompt: prompt.trim(), style });
      set({ genStatus: 'done', genResultUrl: url });
    } catch (e) {
      set({ genStatus: 'error', genError: (e as Error)?.message ?? i18n.t('errors.generateFailed') });
    }
  },
}));
