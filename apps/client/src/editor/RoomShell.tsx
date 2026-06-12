import * as THREE from 'three';
import { RW, RH, RD } from '@asc/resource-library';

// 房间外壳的渲染色(纯渲染常量;尺寸 RW/RH/RD 来自资源库,与 environments 数据共用)
const FLOOR_C = '#6b5d4f';
const CEIL_C = '#e7e3da';
const WALL_C = '#cbc6ba';
const WALL_BACK_C = '#bdb8ac'; // 后墙略深,给纵深

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

/**
 * 房间外壳:单面内向反向盒(BackSide)。近处面被背面剔除 → 任意角度都透视看进室内。
 * variant='balcony' 时右墙(+X)开口为落地窗 + 室外阳台。
 */
export function RoomShell({ variant }: { variant: 'plain' | 'balcony' }) {
  const balcony = variant === 'balcony';
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
