/**
 * 资产库模型 —— CDN/Storage 上的预设,前端按需加载。
 * 资产只是「代理体」,会被 Nano Banana 重渲染(D6/D11)。
 */

export type AssetType = 'character' | 'prop' | 'environment';

/** 角色的一个固定姿势 = 一个静态 glTF(D4) */
export interface AssetPose {
  id: string;
  name: string;
  modelUrl: string;
}

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  /** 库面板缩略图 */
  thumbnailUrl: string;
  /** prop / environment 的 glTF */
  modelUrl?: string;
  /** character 才有:每姿势一个静态 glTF */
  poses?: AssetPose[];
  defaultScale: number;
}
