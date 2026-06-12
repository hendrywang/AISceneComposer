import type { ScenePreset } from './types';

/**
 * 场景预设 = 房间壳 + 家具/门窗的预置排布(库内置的「起手式」,只读)。
 * 注意:这是精简的摆位数据(只有 modelId + 位置 + 朝向),不含颜色/姿势/机位;
 *       用户自己摆的、可再编辑的「构图存档」是另一回事 → 映射 shared-types 的 Scene。
 *
 * 关键:四面墙各有不同标志物(门/窗/画/钟/电视/黑板…)→ 转到任意方向都有方位参照与背景;
 *       并用高低错落(高柜/书架/绿植/吊灯 vs 矮桌/地毯)制造前中后景视差。
 * 靠墙件朝向:后墙 rotationY=0;左墙 +90°(L);右墙 -90°(R);前墙 180°(F)。
 */
const L = Math.PI / 2; // 左墙朝向
const R = -Math.PI / 2; // 右墙朝向
const B = Math.PI; // 家具背对(180°)
const F = Math.PI; // 前墙挂饰朝室内(-Z)

export const SCENES: ScenePreset[] = [
  {
    id: 'bedroom',
    name: '卧室',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      // 四壁标志物
      { modelId: 'painting', position: [0.6, 0, -2.9] }, // 后墙挂画
      { modelId: 'window', position: [-2.9, 0, 0.2], rotationY: L }, // 左墙窗
      { modelId: 'door', position: [2.9, 0, 1.7], rotationY: R }, // 右墙门
      { modelId: 'wallClock', position: [-0.6, 0, 2.9], rotationY: F }, // 前墙挂钟
      // 家具(高低错落)
      { modelId: 'bed', position: [-1.2, 0, -1.3] }, // 床头靠后墙
      { modelId: 'nightstand', position: [-2.45, 0, -1.4] },
      { modelId: 'wardrobe', position: [2.25, 0, -2.4] }, // 背墙右角(高)
      { modelId: 'sideboard', position: [-2.1, 0, -2.55] }, // 背墙左角(矮)
      { modelId: 'bookshelf', position: [2.5, 0, -0.3], rotationY: R }, // 右墙中(高)
      { modelId: 'desk', position: [1.6, 0, 1.9], rotationY: B },
      { modelId: 'chair', position: [1.6, 0, 1.15] },
      { modelId: 'rug', position: [-0.5, 0, 0.6] },
      { modelId: 'lamp', position: [-2.55, 0, 2.4] }, // 前左角(高)
      { modelId: 'plant', position: [2.55, 0, 2.5] }, // 前右角
      { modelId: 'pendant', position: [-0.4, 0, -0.2] }, // 吊灯
    ],
  },
  {
    id: 'living',
    name: '客厅',
    placements: [
      { modelId: 'roomBalcony', position: [0, 0, 0] }, // 右墙 = 落地窗 + 阳台
      // 标志物(右墙已是落地窗,不再单独放窗)
      { modelId: 'wallTV', position: [0, 0, -2.9] }, // 后墙壁挂电视
      { modelId: 'painting', position: [-2.9, 0, -0.8], rotationY: L }, // 左墙壁画
      { modelId: 'door', position: [1.4, 0, 2.9], rotationY: F }, // 前墙门
      { modelId: 'wallClock', position: [-1.6, 0, 2.9], rotationY: F }, // 前墙挂钟
      // 家具(沙发面朝电视)
      { modelId: 'sofa', position: [0, 0, 1.5], rotationY: B },
      { modelId: 'coffeeTable', position: [0, 0, 0.3] },
      { modelId: 'rug', position: [0, 0, 0.5] },
      { modelId: 'bookshelf', position: [-2.5, 0, -2.4] }, // 背墙左角(高)
      { modelId: 'sideboard', position: [2.2, 0, -2.5] }, // 背墙右角(矮)
      { modelId: 'plant', position: [-2.5, 0, -1.3] }, // 左墙中
      { modelId: 'chair', position: [2.1, 0, 1.2], rotationY: B }, // 单椅
      { modelId: 'plant', position: [2.55, 0, 2.4] }, // 前右角
      { modelId: 'lamp', position: [-2.55, 0, 2.3] }, // 前左角(高)
      { modelId: 'pendant', position: [0, 0, 0.3] }, // 吊灯
    ],
  },
  {
    id: 'classroom',
    name: '教室',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      // 四壁标志物
      { modelId: 'blackboard', position: [0, 0, -2.85] }, // 后墙黑板
      { modelId: 'window', position: [-2.9, 0, -0.6], rotationY: L }, // 左墙窗
      { modelId: 'window', position: [-2.9, 0, 1.1], rotationY: L },
      { modelId: 'door', position: [2.9, 0, 1.7], rotationY: R }, // 右墙门
      { modelId: 'wallClock', position: [0, 0, 2.9], rotationY: F }, // 前墙挂钟
      { modelId: 'desk', position: [-1.3, 0, -1.95] }, // 讲台
      // 课桌椅:2 排 x 3 列,朝向黑板(-Z)
      { modelId: 'studentDesk', position: [-1.3, 0, -0.4] },
      { modelId: 'studentDesk', position: [0, 0, -0.4] },
      { modelId: 'studentDesk', position: [1.3, 0, -0.4] },
      { modelId: 'studentDesk', position: [-1.3, 0, 0.9] },
      { modelId: 'studentDesk', position: [0, 0, 0.9] },
      { modelId: 'studentDesk', position: [1.3, 0, 0.9] },
      { modelId: 'chair', position: [-1.3, 0, 0.15], rotationY: B },
      { modelId: 'chair', position: [0, 0, 0.15], rotationY: B },
      { modelId: 'chair', position: [1.3, 0, 0.15], rotationY: B },
      { modelId: 'chair', position: [-1.3, 0, 1.45], rotationY: B },
      { modelId: 'chair', position: [0, 0, 1.45], rotationY: B },
      { modelId: 'chair', position: [1.3, 0, 1.45], rotationY: B },
      // 角落与纵向(高低错落)
      { modelId: 'bookshelf', position: [2.45, 0, -2.4] }, // 背墙右角(高)
      { modelId: 'sideboard', position: [2.45, 0, 0.4], rotationY: R }, // 右墙中(矮)
      { modelId: 'plant', position: [-2.5, 0, 2.5] }, // 前左角
      { modelId: 'pendant', position: [-0.9, 0, 0.25] }, // 吊灯
      { modelId: 'pendant', position: [0.9, 0, 0.25] },
    ],
  },
];
