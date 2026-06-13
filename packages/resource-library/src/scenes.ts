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

  // ── 宫殿/古风 ──
  {
    id: 'palaceHall',
    name: '宫殿大殿',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      { modelId: 'banner-drape', position: [-1.4, 0, -2.9] }, // 后墙旗幔
      { modelId: 'banner-drape', position: [1.4, 0, -2.9] },
      { modelId: 'painting', position: [0, 0, -2.9] }, // 御像
      { modelId: 'dais', position: [0, 0, -2.1] }, // 高台
      { modelId: 'throne', position: [0, 0, -2.25] }, // 宝座
      { modelId: 'pillar', position: [-1.9, 0, -0.8] }, // 列柱(纵深)
      { modelId: 'pillar', position: [1.9, 0, -0.8] },
      { modelId: 'pillar', position: [-1.9, 0, 1.2] },
      { modelId: 'pillar', position: [1.9, 0, 1.2] },
      { modelId: 'red-carpet', position: [0, 0, 0.2] }, // 中轴红毯
      { modelId: 'palace-lantern', position: [-1.2, 0, -0.6] },
      { modelId: 'palace-lantern', position: [1.2, 0, -0.6] },
      // 皇帝坐宝座,面向 +Z(朝堂下/镜头)
      { modelId: 'elder', position: [0, 0, -1.95], rotationY: 0, poseId: 'sit', colorIndex: 4 },
      // 主角:堂前中央,面向宝座(-Z),拱手禀奏(身在最前,群臣在其后)
      { modelId: 'guard', position: [0, 0, 1.5], rotationY: B, poseId: 'salute', colorIndex: 0 },
      // 群臣:主角身后两侧,面向 +Z(朝主角/镜头)
      { modelId: 'man-tall', position: [-1.1, 0, 0.4], rotationY: 0, poseId: 'bow', colorIndex: 1 },
      { modelId: 'woman', position: [1.1, 0, 0.4], rotationY: 0, poseId: 'listen', colorIndex: 2 },
      { modelId: 'man-slim', position: [-1.7, 0, 1.1], rotationY: 0, poseId: 'salute', colorIndex: 3 },
      { modelId: 'woman-tall', position: [1.7, 0, 1.1], rotationY: 0, poseId: 'bow', colorIndex: 5 },
      // 殿前侍卫
      { modelId: 'guard', position: [-2.4, 0, -1.0], rotationY: R, poseId: 'stand', colorIndex: 6 },
      { modelId: 'guard', position: [2.4, 0, -1.0], rotationY: L, poseId: 'stand', colorIndex: 6 },
    ],
  },
  {
    id: 'palaceCourtyard',
    name: '宫殿庭院',
    placements: [
      { modelId: 'outdoor-plaza', position: [0, 0, 0] },
      { modelId: 'palace-gate', position: [0, 0, -5.5] }, // 远处宫门
      { modelId: 'palace-stairs', position: [0, 0, -2.6] }, // 中央台阶
      { modelId: 'pillar', position: [-3.0, 0, -1.0] },
      { modelId: 'pillar', position: [3.0, 0, -1.0] },
      { modelId: 'pillar', position: [-3.0, 0, 1.5] },
      { modelId: 'pillar', position: [3.0, 0, 1.5] },
      { modelId: 'tree', position: [-4.5, 0, 2.2] },
      { modelId: 'tree', position: [4.5, 0, 2.2] },
      // 主角立阶前,群臣分立(高低差由台阶 prop 暗示)
      { modelId: 'guard', position: [0, 0, 1.6], rotationY: B, poseId: 'salute' },
      { modelId: 'man-tall', position: [-1.3, 0, 0.4], rotationY: 0, poseId: 'bow' },
      { modelId: 'woman-tall', position: [1.3, 0, 0.4], rotationY: 0, poseId: 'listen' },
      { modelId: 'elder', position: [0, 0, -1.0], rotationY: 0, poseId: 'stand' },
    ],
  },

  // ── 现代室内 ──
  {
    id: 'office',
    name: '办公室',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      { modelId: 'whiteboard', position: [0, 0, -2.9] }, // 后墙白板
      { modelId: 'window', position: [-2.9, 0, 0.4], rotationY: L },
      { modelId: 'door', position: [2.9, 0, 1.8], rotationY: R },
      { modelId: 'wallClock', position: [2.0, 0, -2.9] },
      { modelId: 'office-desk', position: [-1.4, 0, 0.6] },
      { modelId: 'office-chair', position: [-1.4, 0, 1.4] },
      { modelId: 'office-desk', position: [1.3, 0, -0.4] },
      { modelId: 'office-chair', position: [1.3, 0, 0.3] },
      { modelId: 'filing-cabinet', position: [2.5, 0, -2.4] },
      { modelId: 'plant', position: [-2.5, 0, 2.4] },
      { modelId: 'pendant', position: [0, 0, 0] },
      { modelId: 'man-slim', position: [-1.4, 0, 1.4], rotationY: B, poseId: 'sit' }, // 伏案
      { modelId: 'woman', position: [-0.4, 0, -2.2], rotationY: 0, poseId: 'point' }, // 白板前讲解
      { modelId: 'man-tall', position: [0.9, 0, 0.6], rotationY: 0, poseId: 'listen' },
    ],
  },
  {
    id: 'kitchen',
    name: '厨房',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      { modelId: 'upper-cabinets', position: [0, 0, -2.9] }, // 后墙吊柜
      { modelId: 'window', position: [2.9, 0, 0], rotationY: R },
      { modelId: 'door', position: [-2.9, 0, 1.8], rotationY: L },
      { modelId: 'kitchen-counter', position: [-1.2, 0, -2.5] },
      { modelId: 'stove', position: [0.2, 0, -2.5] },
      { modelId: 'sink', position: [1.4, 0, -2.5] },
      { modelId: 'fridge', position: [2.4, 0, -2.4] },
      { modelId: 'kitchen-island', position: [0, 0, 0.4] },
      { modelId: 'pendant', position: [0, 0, 0.4] },
      { modelId: 'man-heavy', position: [0, 0, -1.7], rotationY: 0, poseId: 'stand' }, // 灶前
      { modelId: 'woman', position: [0, 0, 1.5], rotationY: B, poseId: 'talk' }, // 岛台另一侧
    ],
  },
  {
    id: 'restaurant',
    name: '餐厅',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      { modelId: 'painting', position: [0, 0, -2.9] },
      { modelId: 'window', position: [-2.9, 0, 0], rotationY: L },
      { modelId: 'door', position: [2.9, 0, 2.0], rotationY: R },
      { modelId: 'bar-counter', position: [0, 0, -2.4] },
      { modelId: 'booth', position: [-2.4, 0, -0.5], rotationY: L },
      { modelId: 'booth', position: [2.4, 0, -0.5], rotationY: R },
      { modelId: 'dining-table', position: [-0.8, 0, 0.8] },
      { modelId: 'dining-table', position: [1.1, 0, 0.8] },
      { modelId: 'chair', position: [-0.8, 0, 1.5], rotationY: B },
      { modelId: 'chair', position: [-0.8, 0, 0.1] },
      { modelId: 'pendant', position: [0, 0, 0.6] },
      { modelId: 'woman-curvy', position: [-0.8, 0, 1.5], rotationY: B, poseId: 'sit' },
      { modelId: 'man-slim', position: [-0.8, 0, 0.1], rotationY: 0, poseId: 'talk' },
      { modelId: 'woman', position: [1.7, 0, 0.8], rotationY: R, poseId: 'stand' }, // 服务员
    ],
  },
  {
    id: 'cafe',
    name: '咖啡馆',
    placements: [
      { modelId: 'roomBalcony', position: [0, 0, 0] }, // 右墙落地窗(街景感)
      { modelId: 'wallClock', position: [0, 0, -2.9] },
      { modelId: 'door', position: [-2.9, 0, 2.0], rotationY: L },
      { modelId: 'bar-counter', position: [-0.5, 0, -2.4] },
      { modelId: 'bar-stool', position: [-1.2, 0, -1.5] },
      { modelId: 'bar-stool', position: [-0.4, 0, -1.5] },
      { modelId: 'cafe-table', position: [1.2, 0, 0.6] },
      { modelId: 'cafe-table', position: [0.2, 0, 1.7] },
      { modelId: 'chair', position: [1.2, 0, 1.2], rotationY: B },
      { modelId: 'chair', position: [1.2, 0, 0.0] },
      { modelId: 'plant', position: [-2.5, 0, 2.4] },
      { modelId: 'pendant', position: [0.5, 0, 0.5] },
      // 坐站混合
      { modelId: 'woman', position: [1.2, 0, 1.2], rotationY: B, poseId: 'sit' },
      { modelId: 'man-tall', position: [1.2, 0, 0.0], rotationY: 0, poseId: 'talk' },
      { modelId: 'man-slim', position: [-0.4, 0, -1.5], rotationY: 0, poseId: 'sit' }, // 吧凳
    ],
  },

  // ── 公共/商业 ──
  {
    id: 'shop',
    name: '商店',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      { modelId: 'painting', position: [0, 0, -2.9] },
      { modelId: 'window', position: [0, 0, 2.9], rotationY: F }, // 前墙橱窗
      { modelId: 'door', position: [2.4, 0, 2.9], rotationY: F },
      { modelId: 'shop-shelf', position: [-2.4, 0, -1.0], rotationY: L },
      { modelId: 'shop-shelf', position: [-2.4, 0, 1.0], rotationY: L },
      { modelId: 'shop-shelf', position: [0, 0, -2.4] },
      { modelId: 'shop-counter', position: [2.0, 0, 0], rotationY: R },
      { modelId: 'pendant', position: [0, 0, 0.4] },
      { modelId: 'woman', position: [2.0, 0, 0.7], rotationY: R, poseId: 'stand' }, // 店员柜后
      { modelId: 'man-tall', position: [-1.6, 0, 0.2], rotationY: L, poseId: 'point' }, // 顾客
    ],
  },
  {
    id: 'clinic',
    name: '诊所',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      { modelId: 'wallClock', position: [0, 0, -2.9] },
      { modelId: 'window', position: [-2.9, 0, 0], rotationY: L },
      { modelId: 'door', position: [2.9, 0, 2.0], rotationY: R },
      { modelId: 'hospital-bed', position: [-1.2, 0, -1.0] },
      { modelId: 'iv-stand', position: [-2.3, 0, -1.6] },
      { modelId: 'exam-table', position: [1.6, 0, -1.5], rotationY: R },
      { modelId: 'reception-desk', position: [1.4, 0, 2.0], rotationY: B },
      { modelId: 'pendant', position: [0, 0, 0] },
      { modelId: 'woman-tall', position: [-1.2, 0, -1.0], rotationY: 0, poseId: 'sit' }, // 病人床上
      { modelId: 'man-slim', position: [-0.1, 0, -1.0], rotationY: R, poseId: 'talk' }, // 医生
    ],
  },
  {
    id: 'meetingRoom',
    name: '会议室',
    placements: [
      { modelId: 'room', position: [0, 0, 0] },
      { modelId: 'projector-screen', position: [0, 0, -2.9] },
      { modelId: 'window', position: [-2.9, 0, 0.4], rotationY: L },
      { modelId: 'door', position: [2.9, 0, 2.0], rotationY: R },
      { modelId: 'conference-table', position: [0, 0, 0.2] },
      { modelId: 'office-chair', position: [-1.1, 0, 1.4], rotationY: B },
      { modelId: 'office-chair', position: [0.1, 0, 1.4], rotationY: B },
      { modelId: 'office-chair', position: [1.1, 0, 1.4], rotationY: B },
      { modelId: 'office-chair', position: [-1.1, 0, -1.0] },
      { modelId: 'office-chair', position: [1.1, 0, -1.0] },
      { modelId: 'pendant', position: [0, 0, 0.2] },
      // 围桌而坐 + 一人屏前演示
      { modelId: 'man-tall', position: [-1.1, 0, 1.4], rotationY: B, poseId: 'sit' },
      { modelId: 'woman', position: [0.1, 0, 1.4], rotationY: B, poseId: 'listen' },
      { modelId: 'man-slim', position: [1.1, 0, 1.4], rotationY: B, poseId: 'sit' },
      { modelId: 'woman-curvy', position: [-1.1, 0, -1.0], rotationY: 0, poseId: 'listen' },
      { modelId: 'guard', position: [1.8, 0, -2.1], rotationY: 0, poseId: 'point' }, // 演示者
    ],
  },

  // ── 车内 & 室外 ──
  {
    id: 'car',
    name: '车内',
    placements: [
      { modelId: 'outdoor-plaza', position: [0, 0, 0] }, // 地面+天空(车停在外)
      { modelId: 'car-interior', position: [0, 0, 0] },
      { modelId: 'guard', position: [-0.45, 0, -0.2], rotationY: 0, poseId: 'drive' }, // 司机(左)
      { modelId: 'woman', position: [0.45, 0, -0.2], rotationY: 0, poseId: 'talk' }, // 副驾
    ],
  },
  {
    id: 'street',
    name: '街道',
    placements: [
      { modelId: 'outdoor-plaza', position: [0, 0, 0] },
      { modelId: 'lamppost', position: [-3.0, 0, -1.0] },
      { modelId: 'lamppost', position: [3.0, 0, 1.5] },
      { modelId: 'park-bench', position: [-2.4, 0, 1.5], rotationY: R },
      { modelId: 'tree', position: [3.6, 0, -2.0] },
      { modelId: 'car-exterior', position: [3.2, 0, 3.0], rotationY: L }, // 路边停车
      { modelId: 'hedge', position: [0, 0, -4.2] },
      { modelId: 'man-tall', position: [-0.6, 0, 0.5], rotationY: 0, poseId: 'talk' },
      { modelId: 'woman', position: [0.6, 0, 0.5], rotationY: 0, poseId: 'listen' },
      { modelId: 'man-slim', position: [-2.4, 0, 1.5], rotationY: R, poseId: 'sit' }, // 长椅
    ],
  },
  {
    id: 'park',
    name: '公园',
    placements: [
      { modelId: 'outdoor-grass', position: [0, 0, 0] },
      { modelId: 'tree', position: [-3.0, 0, -2.0] },
      { modelId: 'tree', position: [3.0, 0, -1.5] },
      { modelId: 'tree', position: [-3.6, 0, 2.6] },
      { modelId: 'fountain', position: [0, 0, -1.6] },
      { modelId: 'park-bench', position: [1.8, 0, 1.5], rotationY: R },
      { modelId: 'hedge', position: [-2.6, 0, 3.0] },
      { modelId: 'kid', position: [-0.5, 0, 1.6], rotationY: 0, poseId: 'run' },
      { modelId: 'woman-curvy', position: [1.8, 0, 1.5], rotationY: R, poseId: 'sit' },
      { modelId: 'man-tall', position: [0.6, 0, 0.3], rotationY: 0, poseId: 'talk' },
    ],
  },
  {
    id: 'elevator',
    name: '电梯',
    placements: [
      { modelId: 'elevator', position: [0, 0, 0] }, // 密闭轿厢(单例环境)
      { modelId: 'man-tall', position: [-0.5, 0, -0.4], rotationY: 0, poseId: 'stand' },
      { modelId: 'woman', position: [0.5, 0, -0.4], rotationY: 0, poseId: 'listen' },
      { modelId: 'man-slim', position: [0, 0, 0.3], rotationY: 0, poseId: 'stand' },
    ],
  },
];
