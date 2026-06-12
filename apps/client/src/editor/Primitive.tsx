import * as THREE from 'three';
import type { Part } from '@asc/resource-library';

/**
 * 图元渲染:把 parts 渲成 box(默认)或单面朝内薄片(flat,门窗挂饰用)。原点在脚底(y=0)。
 * flat=true → 朝 +Z 的单面平面(经各自 rotationY 后朝室内,背面剔除 → 随近墙隐藏,不悬空)。
 * 纯渲染,无数据 —— 模型数据在 @asc/resource-library 的 'primitive' 源里。
 */
export function PrimitiveModel({ parts, color }: { parts: Part[]; color: string }) {
  return (
    <group>
      {parts.map((part, i) =>
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
