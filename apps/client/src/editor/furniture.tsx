import * as THREE from 'three';

/** 家具 = 若干 box 部件的组合(代理用途,够表达轮廓即可)。部件原点在脚底(y=0)。
 *  flat=true 的部件渲染为「朝 +Z 的单面平面」:经各自 rotationY 后朝向室内,
 *  从背面剔除 → 靠墙挂饰会随近墙一起隐藏,不会悬空。size 取 [宽, 高]。 */
export interface Part {
  size: [number, number, number];
  pos: [number, number, number]; // 部件中心相对底部中心
  color?: string; // 覆盖默认色
  flat?: boolean; // 单面朝内薄片(门窗挂饰用)
}

export interface FurnitureDef {
  parts: Part[];
  footprint: [number, number];
  height: number;
}

const WOOD = '#b08d57';
const DARK = '#1f2937';
const CLOTH = '#6b7280';

// 房间尺寸(虚拟布景:单面内向反向盒)
export const RW = 6;
export const RH = 3;
export const RD = 6;
const FLOOR_C = '#6b5d4f';
const CEIL_C = '#e7e3da';
const WALL_C = '#cbc6ba';
const WALL_BACK_C = '#bdb8ac'; // 后墙略深,给纵深

export const FURNITURE: Record<string, FurnitureDef> = {
  // room / roomBalcony 由 Furniture 特判为「反向盒」渲染,这里只保留尺寸用于取景/选择
  room: { footprint: [RW, RD], height: RH, parts: [] },
  roomBalcony: { footprint: [RW, RD], height: RH, parts: [] }, // 右墙为落地窗 + 阳台
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

  // ── 落地家具:矮柜(前中景纵深,跨场景复用) ──
  sideboard: {
    footprint: [1.6, 0.45],
    height: 0.75,
    parts: [
      { size: [1.6, 0.7, 0.45], pos: [0, 0.35, 0], color: WOOD },
      { size: [1.66, 0.05, 0.5], pos: [0, 0.72, 0], color: '#8a6e44' },
      { size: [0.5, 0.5, 0.02], pos: [-0.38, 0.35, 0.23], color: '#9a7b4d' },
      { size: [0.5, 0.5, 0.02], pos: [0.38, 0.35, 0.23], color: '#9a7b4d' },
    ],
  },

  // ── 吊灯:吊在天花下,给仰拍/天花区纵向兴趣(空中悬挂,非靠墙) ──
  pendant: {
    footprint: [0.5, 0.5],
    height: 2.95,
    parts: [
      { size: [0.03, 0.62, 0.03], pos: [0, 2.64, 0], color: DARK }, // 吊线
      { size: [0.48, 0.26, 0.48], pos: [0, 2.32, 0], color: '#f3e7c4' }, // 灯罩
      { size: [0.3, 0.06, 0.3], pos: [0, 2.18, 0], color: '#fff4d6' }, // 灯口
    ],
  },

  // ── 门窗装饰(flat 单面朝内,随墙隐藏) ──
  door: {
    footprint: [0.95, 0.14],
    height: 2.05,
    parts: [
      { flat: true, size: [0.95, 2.05, 0], pos: [0, 1.025, 0], color: '#7a5a3a' },
      { flat: true, size: [0.82, 1.9, 0], pos: [0, 1.03, 0.01], color: '#8a6a44' }, // 门芯
      { flat: true, size: [0.1, 0.1, 0], pos: [0.34, 1.0, 0.02], color: '#d9c27a' }, // 把手
    ],
  },
  window: {
    footprint: [1.4, 0.14],
    height: 2.15,
    parts: [
      { flat: true, size: [1.4, 1.3, 0], pos: [0, 1.5, 0], color: '#cfcabd' }, // 窗框
      { flat: true, size: [1.2, 1.1, 0], pos: [0, 1.5, 0.01], color: '#bcd4e6' }, // 玻璃
      { flat: true, size: [1.24, 0.06, 0], pos: [0, 1.5, 0.02], color: '#cfcabd' }, // 横档
      { flat: true, size: [0.06, 1.12, 0], pos: [0, 1.5, 0.02], color: '#cfcabd' }, // 竖档
    ],
  },
  painting: {
    footprint: [1.2, 0.1],
    height: 1.95,
    parts: [
      { flat: true, size: [1.2, 0.85, 0], pos: [0, 1.5, 0], color: '#6b5036' }, // 画框
      { flat: true, size: [1.05, 0.7, 0], pos: [0, 1.5, 0.01], color: '#8aa9b8' }, // 画面
    ],
  },
  wallClock: {
    footprint: [0.5, 0.1],
    height: 1.95,
    parts: [
      { flat: true, size: [0.52, 0.52, 0], pos: [0, 1.7, 0], color: '#3a3a40' }, // 外圈
      { flat: true, size: [0.42, 0.42, 0], pos: [0, 1.7, 0.01], color: '#efece4' }, // 表盘
      { flat: true, size: [0.04, 0.18, 0], pos: [0, 1.74, 0.02], color: '#222' }, // 分针
      { flat: true, size: [0.13, 0.04, 0], pos: [0.04, 1.7, 0.02], color: '#222' }, // 时针
    ],
  },
  wallTV: {
    footprint: [1.6, 0.1],
    height: 1.9,
    parts: [
      { flat: true, size: [1.6, 0.95, 0], pos: [0, 1.4, 0], color: '#15171c' }, // 边框
      { flat: true, size: [1.5, 0.85, 0], pos: [0, 1.4, 0.01], color: '#2b3340' }, // 屏幕
    ],
  },
  rug: {
    footprint: [2.4, 1.7],
    height: 0.03,
    parts: [{ size: [2.4, 0.03, 1.7], pos: [0, 0.015, 0], color: '#9e6b6b' }],
  },
};

/** 落地窗 + 阳台:挂在右墙(+X)开口外。窗框为细盒,玻璃为朝内单面半透,阳台为实体盒。 */
function Balcony() {
  const RAIL = '#8a6e44';
  const PARAPET = '#cfcabd';
  const TILE = '#9a948a';
  const posts: [number, number, number][] = [
    [3, 1.5, -2.6],
    [3, 1.5, -0.87],
    [3, 1.5, 0.87],
    [3, 1.5, 2.6],
  ];
  return (
    <group>
      {/* 落地窗框(竖梃 + 上/中/下横档) */}
      {posts.map((p, i) => (
        <mesh key={`v${i}`} position={p}>
          <boxGeometry args={[0.08, RH, 0.08]} />
          <meshStandardMaterial color={CEIL_C} />
        </mesh>
      ))}
      <mesh position={[3, RH - 0.06, 0]}>
        <boxGeometry args={[0.1, 0.1, 5.3]} />
        <meshStandardMaterial color={CEIL_C} />
      </mesh>
      <mesh position={[3, 1.4, 0]}>
        <boxGeometry args={[0.08, 0.08, 5.3]} />
        <meshStandardMaterial color={CEIL_C} />
      </mesh>
      <mesh position={[3, 0.05, 0]}>
        <boxGeometry args={[0.14, 0.1, 5.3]} />
        <meshStandardMaterial color={CEIL_C} />
      </mesh>
      {/* 玻璃:朝室内(-X)单面半透 */}
      <mesh position={[2.97, 1.45, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[5.2, 2.8]} />
        <meshStandardMaterial color="#bcd4e6" transparent opacity={0.14} side={THREE.FrontSide} />
      </mesh>
      {/* 阳台地面(向外延伸)+ 矮护栏 */}
      <mesh position={[3.7, -0.05, 0]}>
        <boxGeometry args={[1.4, 0.1, 5.4]} />
        <meshStandardMaterial color={TILE} />
      </mesh>
      <mesh position={[4.37, 0.5, 0]}>
        <boxGeometry args={[0.14, 1.0, 5.4]} />
        <meshStandardMaterial color={PARAPET} />
      </mesh>
      <mesh position={[3.7, 0.5, -2.7]}>
        <boxGeometry args={[1.4, 1.0, 0.14]} />
        <meshStandardMaterial color={PARAPET} />
      </mesh>
      <mesh position={[3.7, 0.5, 2.7]}>
        <boxGeometry args={[1.4, 1.0, 0.14]} />
        <meshStandardMaterial color={PARAPET} />
      </mesh>
      <mesh position={[4.37, 1.03, 0]}>
        <boxGeometry args={[0.18, 0.08, 5.5]} />
        <meshStandardMaterial color={RAIL} />
      </mesh>
      {/* 阳台绿植 */}
      <mesh position={[4.0, 0.25, -2.0]}>
        <boxGeometry args={[0.4, 0.5, 0.4]} />
        <meshStandardMaterial color="#8a5a3a" />
      </mesh>
      <mesh position={[4.0, 0.62, -2.0]}>
        <boxGeometry args={[0.5, 0.55, 0.5]} />
        <meshStandardMaterial color="#3f7d3f" />
      </mesh>
    </group>
  );
}

/** 房间外壳:单面内向反向盒(BackSide)。近处面被背面剔除 → 任意角度都透视看进室内。
 *  balcony=true 时右墙(+X)开口为落地窗 + 室外阳台。 */
function RoomShell({ balcony }: { balcony?: boolean }) {
  return (
    <group>
      <mesh position={[0, RH / 2, 0]}>
        <boxGeometry args={[RW, RH, RD]} />
        {/* 分组序:0 +X右 / 1 -X左 / 2 +Y天花 / 3 -Y地面 / 4 +Z前 / 5 -Z后 */}
        <meshStandardMaterial
          attach="material-0"
          side={THREE.BackSide}
          {...(balcony ? { transparent: true, opacity: 0, depthWrite: false } : { color: WALL_C })}
        />
        <meshStandardMaterial attach="material-1" color={WALL_C} side={THREE.BackSide} />
        <meshStandardMaterial attach="material-2" color={CEIL_C} side={THREE.BackSide} />
        <meshStandardMaterial attach="material-3" color={FLOOR_C} side={THREE.BackSide} />
        <meshStandardMaterial attach="material-4" color={WALL_C} side={THREE.BackSide} />
        <meshStandardMaterial attach="material-5" color={WALL_BACK_C} side={THREE.BackSide} />
      </mesh>
      {balcony && <Balcony />}
    </group>
  );
}

export function Furniture({ shapeId, color }: { shapeId: string; color: string }) {
  if (shapeId === 'room') return <RoomShell />;
  if (shapeId === 'roomBalcony') return <RoomShell balcony />;
  const def = FURNITURE[shapeId];
  if (!def) return null;
  return (
    <group>
      {def.parts.map((part, i) =>
        part.flat ? (
          <mesh key={i} position={part.pos}>
            <planeGeometry args={[part.size[0], part.size[1]]} />
            <meshStandardMaterial color={part.color ?? color} side={THREE.FrontSide} />
          </mesh>
        ) : (
          <mesh key={i} position={part.pos}>
            <boxGeometry args={part.size} />
            <meshStandardMaterial color={part.color ?? color} />
          </mesh>
        ),
      )}
    </group>
  );
}
