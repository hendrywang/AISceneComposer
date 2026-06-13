/**
 * 场景数据模型 —— 用户编辑的核心对象。
 * 前端编辑它、后端拿它生成截图、Firestore 存它。
 * 对应 docs/development-plan.md §5。
 */

export type Vec3 = [number, number, number];

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

export interface Shot {
  id: string;
  /** 如「正面」「侧面」 */
  name: string;
  position: Vec3;
  /** look-at 点 */
  target: Vec3;
  fov: number;
  /** 画幅比例 id(RATIOS,如 '16:9'),还原构图用 */
  aspect: string;
  /** 取景缩略图(PNG dataURL);分镜条展示用,旧档/未截图为 null */
  thumbnail: string | null;
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
  /** 一个场景存多个分镜(D16) */
  shots: Shot[];
  activeShotId: string;
  createdAt: number;
  updatedAt: number;
}
