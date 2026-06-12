/**
 * 场景预设 = 房间壳 + 家具/门窗预置排布。
 * 关键:让背墙 / 左墙 / 右墙 各有不同标志物(门、窗、壁画、电视、黑板…),
 * 这样镜头转动时方位清晰,AI 也能判断朝向。
 * 房间:背墙 z=-3、左墙 x=-3、右墙 x=+3,正面敞开。
 * 靠墙件朝向:背墙 rotationY=0;左墙 +90°;右墙 -90°。
 */
export interface Placement {
  modelId: string;
  position: [number, number, number];
  rotationY?: number;
}

export interface ScenePreset {
  id: string;
  name: string;
  placements: Placement[];
}

const L = Math.PI / 2; // 左墙朝向
const R = -Math.PI / 2; // 右墙朝向
const B = Math.PI; // 背对(180°)

export const SCENES: ScenePreset[] = [
  {
    id: 'bedroom',
    name: '卧室',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      { modelId: 'bed', position: [-1.3, 0, -1.3] }, // 床头靠背墙
      { modelId: 'nightstand', position: [-2.5, 0, -2.3] },
      { modelId: 'wardrobe', position: [2.3, 0, -2.4] }, // 背墙右
      { modelId: 'painting', position: [0.4, 0, -2.9] }, // 背墙挂画
      { modelId: 'window', position: [-2.9, 0, 0.6], rotationY: L }, // 左墙窗
      { modelId: 'door', position: [2.9, 0, 1.7], rotationY: R }, // 右墙门
      { modelId: 'desk', position: [1.7, 0, 1.7], rotationY: B },
      { modelId: 'chair', position: [1.7, 0, 1.0] },
      { modelId: 'rug', position: [-0.4, 0, 0.8] },
      { modelId: 'lamp', position: [-2.6, 0, 1.8] },
    ],
  },
  {
    id: 'living',
    name: '客厅',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      { modelId: 'tvStand', position: [0, 0, -2.6] }, // 背墙电视
      { modelId: 'door', position: [2.2, 0, -2.9] }, // 背墙右侧门
      { modelId: 'painting', position: [-2.9, 0, -0.3], rotationY: L }, // 左墙壁画
      { modelId: 'window', position: [2.9, 0, -0.3], rotationY: R }, // 右墙窗
      { modelId: 'sofa', position: [0, 0, 1.6], rotationY: B }, // 面朝电视
      { modelId: 'coffeeTable', position: [0, 0, 0.4] },
      { modelId: 'rug', position: [0, 0, 0.6] },
      { modelId: 'bookshelf', position: [-2.5, 0, -2.4] }, // 背墙左角
      { modelId: 'plant', position: [2.4, 0, 1.8] },
      { modelId: 'lamp', position: [-2.5, 0, 1.8] },
    ],
  },
  {
    id: 'classroom',
    name: '教室',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      { modelId: 'blackboard', position: [0, 0, -2.8] }, // 背墙黑板
      { modelId: 'desk', position: [0, 0, -2.0] }, // 讲台
      { modelId: 'window', position: [-2.9, 0, -0.5], rotationY: L }, // 左墙窗
      { modelId: 'window', position: [-2.9, 0, 1.1], rotationY: L },
      { modelId: 'door', position: [2.9, 0, 1.6], rotationY: R }, // 右墙门
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
    ],
  },
];
