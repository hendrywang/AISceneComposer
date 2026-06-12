/**
 * 场景数据模型 —— 用户编辑的核心对象。
 * 前端编辑它、后端拿它生成截图、Firestore 存它。
 * 对应 docs/development-plan.md §5。
 */

export type Vec3 = [number, number, number];

/** 电影镜头预设:基于选中角色实时计算机位(不存死坐标) */
export type CameraPreset = 'ots' | 'two-shot' | 'low' | 'high' | 'dutch' | 'closeup';

export interface Actor {
  id: string;
  assetId: string;
  /** 选中的固定姿势(D4:不做 IK,每姿势一个静态 glTF) */
  poseId: string;
  position: Vec3;
  /** 只需绕地面轴转向 */
  rotationY: number;
  /** 身份纯色:截图区分 + prompt 映射(如「红色的人是 Anna」) */
  idColor: string;
  /** 写进 prompt 的名字,如「Anna」「男主」 */
  label?: string;
}

export interface Prop {
  id: string;
  assetId: string;
  position: Vec3;
  rotationY: number;
  scale: number;
}

export interface Camera {
  id: string;
  /** 如「过肩-1」「仰拍」 */
  name: string;
  position: Vec3;
  /** look-at 点 */
  target: Vec3;
  fov: number;
  preset?: CameraPreset;
}

export interface Scene {
  id: string;
  /** Firebase Auth uid(D13),用于数据隔离 */
  ownerId: string;
  name: string;
  /** 房间/场景预设 */
  environment: { assetId: string };
  actors: Actor[];
  props: Prop[];
  /** 一个场景存多个机位(D16) */
  cameras: Camera[];
  activeCameraId: string;
  createdAt: number;
  updatedAt: number;
}
