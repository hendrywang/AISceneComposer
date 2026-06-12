import * as THREE from 'three';

/**
 * 主视图 → 预览窗 的相机姿态同步(模块级单例,避免用 store 触发重渲染)。
 * 主 Canvas 每帧写入当前相机位姿;预览 Canvas 每帧读取并套用。
 */
export const cameraSync = {
  position: new THREE.Vector3(5, 4, 6),
  target: new THREE.Vector3(0, 0, 0),
  fov: 55,
  /** 预览 Canvas 注册自己的 invalidate,主视图相机变动时触发预览按需重绘 */
  invalidatePreview: null as (() => void) | null,
};

/** 预览导出控制:预览 Canvas 注册 capture(longEdge),下载按钮调用它在目标分辨率渲染并拿到 PNG dataURL */
export const previewControl = {
  capture: null as ((longEdge: number) => string | null) | null,
};
