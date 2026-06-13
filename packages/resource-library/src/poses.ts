import type { Pose } from './types';

const HALF = Math.PI / 2;

/**
 * 姿势库:姿势名 → 关节欧拉角(弧度)。未列出的关节默认 [0,0,0](直立)。
 * 想加一个姿势?复制一条改关节角即可(关节名见 types.ts 的 JointName),再在 POSE_OPTIONS 加一行给 UI。
 */
export const POSES: Record<string, Pose> = {
  stand: {},
  walk: {
    hipR: [-0.4, 0, 0],
    hipL: [0.4, 0, 0],
    shoulderR: [0.5, 0, 0],
    shoulderL: [-0.5, 0, 0],
    elbowR: [-0.3, 0, 0],
    elbowL: [-0.3, 0, 0],
  },
  sit: {
    hipR: [-HALF, 0, 0],
    hipL: [-HALF, 0, 0],
    kneeR: [HALF, 0, 0],
    kneeL: [HALF, 0, 0],
    shoulderR: [-0.2, 0, 0],
    shoulderL: [-0.2, 0, 0],
  },
  wave: {
    shoulderR: [0, 0, 2.5],
    elbowR: [0, 0, -0.6],
  },
  point: {
    shoulderR: [-1.5, 0, 0],
  },
  cheer: {
    shoulderR: [0, 0, 2.6],
    shoulderL: [0, 0, -2.6],
    elbowR: [0, 0, -0.3],
    elbowL: [0, 0, 0.3],
  },

  // ── 对话/戏剧(启用 spine/neck)。约定:肩/髋 x 负=前,膝 x 正=后弯,脊柱 x 正=前倾。 ──
  talk: {
    shoulderR: [-0.45, 0, 0.25],
    elbowR: [-1.1, 0, 0],
    spine: [0.04, 0, 0],
    neck: [0.05, 0, 0],
  },
  explain: {
    shoulderR: [-0.55, 0, 0.35],
    shoulderL: [-0.55, 0, -0.35],
    elbowR: [-1.0, 0, 0],
    elbowL: [-1.0, 0, 0],
  },
  listen: {
    shoulderR: [-0.05, 0, 0.05],
    shoulderL: [-0.05, 0, -0.05],
    elbowR: [-1.45, 0, 0],
    elbowL: [-1.45, 0, 0],
  },
  bow: {
    spine: [0.6, 0, 0],
    neck: [0.18, 0, 0],
    shoulderR: [0.35, 0, 0],
    shoulderL: [0.35, 0, 0],
  },
  salute: {
    shoulderR: [-1.1, 0, 0.15],
    elbowR: [-1.7, 0, 0],
    spine: [0.03, 0, 0],
  },
  kneel: {
    hipR: [0.15, 0, 0],
    kneeR: [2.2, 0, 0],
    hipL: [-1.3, 0, 0],
    kneeL: [1.3, 0, 0],
    spine: [0.08, 0, 0],
  },
  akimbo: {
    shoulderR: [0, 0, 0.9],
    shoulderL: [0, 0, -0.9],
    elbowR: [-1.4, 0, 0],
    elbowL: [-1.4, 0, 0],
  },
  leanBack: {
    spine: [-0.22, 0, 0],
    neck: [-0.08, 0, 0],
    shoulderR: [-0.12, 0, 0],
    shoulderL: [-0.12, 0, 0],
  },
  lookLeft: {
    neck: [0, 0.7, 0],
    spine: [0, 0.18, 0],
  },
  lookRight: {
    neck: [0, -0.7, 0],
    spine: [0, -0.18, 0],
  },
  run: {
    hipR: [-0.85, 0, 0],
    hipL: [0.6, 0, 0],
    kneeR: [0.35, 0, 0],
    kneeL: [1.1, 0, 0],
    shoulderR: [0.9, 0, 0],
    shoulderL: [-1.0, 0, 0],
    elbowR: [-1.2, 0, 0],
    elbowL: [-1.2, 0, 0],
    spine: [0.16, 0, 0],
  },
  // 坐姿(髋水平+膝竖直):自动落地后臀部≈小腿高,与椅面/车座高度吻合。
  drive: {
    hipR: [-HALF, 0, 0],
    hipL: [-HALF, 0, 0],
    kneeR: [HALF, 0, 0],
    kneeL: [HALF, 0, 0],
    shoulderR: [-1.0, 0, 0.05],
    shoulderL: [-1.0, 0, -0.05],
    elbowR: [-0.9, 0, 0],
    elbowL: [-0.9, 0, 0],
  },
  sitFloor: {
    hipR: [-1.55, 0, 0.05],
    hipL: [-1.55, 0, -0.05],
    kneeR: [0.3, 0, 0],
    kneeL: [0.3, 0, 0],
    spine: [-0.05, 0, 0],
    shoulderR: [-0.25, 0, 0],
    shoulderL: [-0.25, 0, 0],
  },
};

/** 姿势选择器的展示项(id 必须是 POSES 的键) */
export const POSE_OPTIONS: { id: string; label: string }[] = [
  { id: 'stand', label: '站立' },
  { id: 'walk', label: '走' },
  { id: 'run', label: '跑' },
  { id: 'sit', label: '坐' },
  { id: 'sitFloor', label: '席地' },
  { id: 'drive', label: '开车' },
  { id: 'kneel', label: '下跪' },
  { id: 'bow', label: '鞠躬' },
  { id: 'salute', label: '行礼' },
  { id: 'talk', label: '说话' },
  { id: 'explain', label: '讲解' },
  { id: 'listen', label: '倾听' },
  { id: 'akimbo', label: '叉腰' },
  { id: 'leanBack', label: '后仰' },
  { id: 'lookLeft', label: '看左' },
  { id: 'lookRight', label: '看右' },
  { id: 'point', label: '指' },
  { id: 'wave', label: '挥手' },
  { id: 'cheer', label: '欢呼' },
];
