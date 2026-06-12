/** 关节名(程序化人体的可旋转关节) */
export type JointName =
  | 'hipL'
  | 'hipR'
  | 'kneeL'
  | 'kneeR'
  | 'shoulderL'
  | 'shoulderR'
  | 'elbowL'
  | 'elbowR'
  | 'spine'
  | 'neck';

/** 一个姿势 = 若干关节的欧拉角(弧度);未列出的关节为 [0,0,0](默认直立) */
export type Pose = Partial<Record<JointName, [number, number, number]>>;

const HALF = Math.PI / 2;

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

export const POSE_OPTIONS: { id: string; label: string }[] = [
  { id: 'stand', label: '站立' },
  { id: 'walk', label: '走' },
  { id: 'sit', label: '坐' },
  { id: 'wave', label: '挥手' },
  { id: 'point', label: '指' },
  { id: 'cheer', label: '欢呼' },
];
