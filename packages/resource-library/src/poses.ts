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
};

/** 姿势选择器的展示项(id 必须是 POSES 的键) */
export const POSE_OPTIONS: { id: string; label: string }[] = [
  { id: 'stand', label: '站立' },
  { id: 'walk', label: '走' },
  { id: 'sit', label: '坐' },
  { id: 'wave', label: '挥手' },
  { id: 'point', label: '指' },
  { id: 'cheer', label: '欢呼' },
];
