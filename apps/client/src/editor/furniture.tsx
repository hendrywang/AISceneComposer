/** 家具 = 若干 box 部件的组合(代理用途,够表达轮廓即可)。部件原点在脚底(y=0)。 */
export interface Part {
  size: [number, number, number];
  pos: [number, number, number]; // 部件中心相对底部中心
  color?: string; // 覆盖默认色
}

export interface FurnitureDef {
  parts: Part[];
  footprint: [number, number];
  height: number;
}

const WOOD = '#b08d57';
const DARK = '#1f2937';
const CLOTH = '#6b7280';

export const FURNITURE: Record<string, FurnitureDef> = {
  room: {
    footprint: [6, 6],
    height: 3,
    parts: [
      { size: [6, 0.1, 6], pos: [0, -0.05, 0], color: '#6b5d4f' }, // 地面(顶面 y=0)
      { size: [6, 3, 0.1], pos: [0, 1.5, -3], color: '#cfcabd' }, // 后墙
      { size: [0.1, 3, 6], pos: [-3, 1.5, 0], color: '#c4bfb2' }, // 左墙
      { size: [0.1, 3, 6], pos: [3, 1.5, 0], color: '#c4bfb2' }, // 右墙
    ],
  },
  bed: {
    footprint: [1.5, 2.1],
    height: 0.6,
    parts: [
      { size: [1.5, 0.3, 2.1], pos: [0, 0.15, 0], color: WOOD },
      { size: [1.4, 0.18, 1.95], pos: [0, 0.39, 0], color: '#d9d2c5' },
      { size: [1.2, 0.12, 0.35], pos: [0, 0.5, -0.75], color: '#eeeae0' },
    ],
  },
  nightstand: { footprint: [0.45, 0.4], height: 0.5, parts: [{ size: [0.45, 0.5, 0.4], pos: [0, 0.25, 0], color: WOOD }] },
  wardrobe: { footprint: [1.0, 0.6], height: 2.0, parts: [{ size: [1.0, 2.0, 0.6], pos: [0, 1.0, 0], color: WOOD }] },
  desk: {
    footprint: [1.2, 0.6],
    height: 0.8,
    parts: [
      { size: [1.2, 0.05, 0.6], pos: [0, 0.75, 0], color: WOOD },
      { size: [0.05, 0.75, 0.05], pos: [-0.55, 0.375, -0.27], color: WOOD },
      { size: [0.05, 0.75, 0.05], pos: [0.55, 0.375, -0.27], color: WOOD },
      { size: [0.05, 0.75, 0.05], pos: [-0.55, 0.375, 0.27], color: WOOD },
      { size: [0.05, 0.75, 0.05], pos: [0.55, 0.375, 0.27], color: WOOD },
    ],
  },
  chair: {
    footprint: [0.45, 0.45],
    height: 0.95,
    parts: [
      { size: [0.45, 0.06, 0.45], pos: [0, 0.45, 0], color: WOOD },
      { size: [0.45, 0.5, 0.06], pos: [0, 0.7, -0.2], color: WOOD },
      { size: [0.05, 0.45, 0.05], pos: [-0.18, 0.225, -0.18], color: WOOD },
      { size: [0.05, 0.45, 0.05], pos: [0.18, 0.225, -0.18], color: WOOD },
      { size: [0.05, 0.45, 0.05], pos: [-0.18, 0.225, 0.18], color: WOOD },
      { size: [0.05, 0.45, 0.05], pos: [0.18, 0.225, 0.18], color: WOOD },
    ],
  },
  sofa: {
    footprint: [1.8, 0.85],
    height: 0.8,
    parts: [
      { size: [1.8, 0.4, 0.85], pos: [0, 0.2, 0], color: CLOTH },
      { size: [1.5, 0.15, 0.7], pos: [0, 0.47, 0.03], color: '#7c8595' },
      { size: [1.8, 0.5, 0.2], pos: [0, 0.55, -0.32], color: CLOTH },
      { size: [0.2, 0.5, 0.85], pos: [-0.8, 0.45, 0], color: CLOTH },
      { size: [0.2, 0.5, 0.85], pos: [0.8, 0.45, 0], color: CLOTH },
    ],
  },
  coffeeTable: {
    footprint: [1.0, 0.55],
    height: 0.45,
    parts: [
      { size: [1.0, 0.05, 0.55], pos: [0, 0.4, 0], color: WOOD },
      { size: [0.05, 0.4, 0.05], pos: [-0.45, 0.2, -0.23], color: WOOD },
      { size: [0.05, 0.4, 0.05], pos: [0.45, 0.2, -0.23], color: WOOD },
      { size: [0.05, 0.4, 0.05], pos: [-0.45, 0.2, 0.23], color: WOOD },
      { size: [0.05, 0.4, 0.05], pos: [0.45, 0.2, 0.23], color: WOOD },
    ],
  },
  tvStand: {
    footprint: [1.4, 0.4],
    height: 1.1,
    parts: [
      { size: [1.4, 0.4, 0.4], pos: [0, 0.2, 0], color: WOOD },
      { size: [1.1, 0.65, 0.05], pos: [0, 0.75, -0.1], color: DARK },
    ],
  },
  bookshelf: {
    footprint: [0.9, 0.3],
    height: 1.8,
    parts: [
      { size: [0.9, 1.8, 0.3], pos: [0, 0.9, 0], color: WOOD },
      { size: [0.82, 0.03, 0.26], pos: [0, 0.6, 0], color: '#8a6e44' },
      { size: [0.82, 0.03, 0.26], pos: [0, 1.2, 0], color: '#8a6e44' },
    ],
  },
  lamp: {
    footprint: [0.32, 0.32],
    height: 1.7,
    parts: [
      { size: [0.3, 0.05, 0.3], pos: [0, 0.025, 0], color: DARK },
      { size: [0.05, 1.5, 0.05], pos: [0, 0.75, 0], color: DARK },
      { size: [0.32, 0.25, 0.32], pos: [0, 1.6, 0], color: '#f5e9c8' },
    ],
  },
  plant: {
    footprint: [0.6, 0.6],
    height: 1.0,
    parts: [
      { size: [0.3, 0.3, 0.3], pos: [0, 0.15, 0], color: '#8a5a3a' },
      { size: [0.6, 0.7, 0.6], pos: [0, 0.65, 0], color: '#3f7d3f' },
    ],
  },
  blackboard: {
    footprint: [2.0, 0.2],
    height: 1.8,
    parts: [
      { size: [2.0, 1.0, 0.05], pos: [0, 1.3, 0], color: '#1f3b2f' },
      { size: [0.06, 1.3, 0.06], pos: [-0.95, 0.65, 0], color: WOOD },
      { size: [0.06, 1.3, 0.06], pos: [0.95, 0.65, 0], color: WOOD },
    ],
  },
  studentDesk: {
    footprint: [0.6, 0.45],
    height: 0.74,
    parts: [
      { size: [0.6, 0.04, 0.45], pos: [0, 0.7, 0], color: WOOD },
      { size: [0.04, 0.7, 0.04], pos: [-0.26, 0.35, -0.18], color: '#888' },
      { size: [0.04, 0.7, 0.04], pos: [0.26, 0.35, -0.18], color: '#888' },
      { size: [0.04, 0.7, 0.04], pos: [-0.26, 0.35, 0.18], color: '#888' },
      { size: [0.04, 0.7, 0.04], pos: [0.26, 0.35, 0.18], color: '#888' },
    ],
  },

  // ── 门窗装饰(靠墙摆放,提供方位标志) ──
  door: {
    footprint: [0.95, 0.14],
    height: 2.05,
    parts: [
      { size: [0.95, 2.05, 0.12], pos: [0, 1.025, 0], color: '#7a5a3a' },
      { size: [0.06, 0.12, 0.06], pos: [0.38, 1.0, 0.09], color: '#d9c27a' }, // 把手
    ],
  },
  window: {
    footprint: [1.4, 0.14],
    height: 2.15,
    parts: [
      { size: [1.4, 1.3, 0.12], pos: [0, 1.5, 0], color: '#cfcabd' }, // 窗框
      { size: [1.2, 1.1, 0.06], pos: [0, 1.5, 0.05], color: '#bcd4e6' }, // 玻璃
      { size: [1.24, 0.06, 0.08], pos: [0, 1.5, 0.06], color: '#cfcabd' }, // 横档
      { size: [0.06, 1.12, 0.08], pos: [0, 1.5, 0.06], color: '#cfcabd' }, // 竖档
    ],
  },
  painting: {
    footprint: [1.2, 0.1],
    height: 1.95,
    parts: [
      { size: [1.2, 0.85, 0.06], pos: [0, 1.5, 0], color: '#6b5036' }, // 画框
      { size: [1.05, 0.7, 0.07], pos: [0, 1.5, 0.02], color: '#8aa9b8' }, // 画面
    ],
  },
  rug: {
    footprint: [2.4, 1.7],
    height: 0.03,
    parts: [{ size: [2.4, 0.03, 1.7], pos: [0, 0.015, 0], color: '#9e6b6b' }],
  },
};

export function Furniture({ shapeId, color }: { shapeId: string; color: string }) {
  const def = FURNITURE[shapeId];
  if (!def) return null;
  return (
    <group>
      {def.parts.map((part, i) => (
        <mesh key={i} position={part.pos}>
          <boxGeometry args={part.size} />
          <meshStandardMaterial color={part.color ?? color} />
        </mesh>
      ))}
    </group>
  );
}
