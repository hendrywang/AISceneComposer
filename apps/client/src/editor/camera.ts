import * as THREE from 'three';
import type { CameraPreset } from '@asc/shared-types';
import type { EditorObject } from '../store/editorStore';

export interface CamPose {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

const UP = new THREE.Vector3(0, 1, 0);
const vec = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const headOf = (o: EditorObject) => vec(o.position[0], o.size[1] * 0.92, o.position[2]);
const SHOULDER_HALF = 0.34; // 代理体肩半宽近似(让人物不会贴边被裁)

/** 把半径为 radius 的包围球完整收进竖直 FOV:d = R / sin(fov/2),再乘余量留白边。
 *  注:three.js 的 fov 是竖直角;按球拟合在横屏(主画布/16:9 默认)正确,极端竖屏(9:16)会略紧,可手动拉远。 */
function fitDistance(radius: number, fovDeg: number, margin = 1.12): number {
  const half = THREE.MathUtils.degToRad(fovDeg) / 2;
  return (radius / Math.max(0.01, Math.sin(half))) * margin;
}

/** 一组主体的取景包围球:水平按各人 (x,z) 铺开,竖直从地面 0 到最高身高。 */
function framingSphere(subjects: EditorObject[]): {
  center: THREE.Vector3;
  radius: number;
  maxH: number;
} {
  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  let maxH = 0;
  for (const s of subjects) {
    minX = Math.min(minX, s.position[0]);
    maxX = Math.max(maxX, s.position[0]);
    minZ = Math.min(minZ, s.position[2]);
    maxZ = Math.max(maxZ, s.position[2]);
    maxH = Math.max(maxH, s.size[1]);
  }
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  let horiz = 0;
  for (const s of subjects) {
    horiz = Math.max(horiz, Math.hypot(s.position[0] - cx, s.position[2] - cz));
  }
  horiz += SHOULDER_HALF;
  const vHalf = maxH / 2;
  return { center: vec(cx, vHalf, cz), radius: Math.hypot(horiz, vHalf), maxH };
}

/** 当前水平视角方位:从 target 指向 camera 的水平单位向量(沿用用户当前看的方向)。 */
function viewDir(camPos: THREE.Vector3, curTarget: THREE.Vector3): THREE.Vector3 {
  const dir = new THREE.Vector3().subVectors(camPos, curTarget);
  dir.y = 0;
  if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
  return dir.normalize();
}

/**
 * 选主体。primary:选中的角色;无选中时取最靠近所有角色质心的那个(稳定、居中,而非创建顺序)。
 * secondary:离 primary 最近的另一角色(用于双人/过肩)。
 */
function pickSubjects(objects: EditorObject[], selectedId: string | null) {
  const actors = objects.filter((o) => o.kind === 'actor');
  if (actors.length === 0) return { primary: null, secondary: null, actors };

  let primary = actors.find((a) => a.id === selectedId) ?? null;
  if (!primary) {
    let cx = 0;
    let cz = 0;
    for (const a of actors) {
      cx += a.position[0];
      cz += a.position[2];
    }
    cx /= actors.length;
    cz /= actors.length;
    let best = Infinity;
    for (const a of actors) {
      const d = Math.hypot(a.position[0] - cx, a.position[2] - cz);
      if (d < best) {
        best = d;
        primary = a;
      }
    }
  }

  let secondary: EditorObject | null = null;
  let best = Infinity;
  for (const a of actors) {
    if (a.id === primary!.id) continue;
    const d = vec(...primary!.position).distanceTo(vec(...a.position));
    if (d < best) {
      best = d;
      secondary = a;
    }
  }
  return { primary, secondary, actors };
}

/**
 * 基于选中角色 + 当前水平视角方位,计算镜头预设位姿。
 * 取景距离一律由「主体包围球 + FOV」推导(fitDistance),保证人数/间距变化时都框得下。
 */
export function computePreset(
  preset: CameraPreset,
  objects: EditorObject[],
  selectedId: string | null,
  camPos: THREE.Vector3,
  curTarget: THREE.Vector3,
): CamPose | null {
  const { primary, secondary, actors } = pickSubjects(objects, selectedId);
  if (!primary) return null;

  const dir = viewDir(camPos, curTarget);
  const pose = (p: THREE.Vector3, t: THREE.Vector3, fov: number): CamPose => ({
    position: [p.x, p.y, p.z],
    target: [t.x, t.y, t.z],
    fov,
  });

  switch (preset) {
    case 'group': {
      // 合影:把所有角色都框进去
      const { center, radius, maxH } = framingSphere(actors);
      const fov = 50;
      const d = fitDistance(radius, fov, 1.14);
      const p = center.clone().add(dir.clone().multiplyScalar(d));
      p.y = center.y + maxH * 0.22; // 略抬高,群像更稳
      return pose(p, center, fov);
    }
    case 'two-shot': {
      const pair = secondary ? [primary, secondary] : [primary];
      const { center, radius, maxH } = framingSphere(pair);
      let vd = dir;
      if (secondary) {
        // 视线若与两人连线太接近 → 一前一后会互相遮挡;改到最近的垂直方向,让两人横向铺开
        const axis = vec(
          secondary.position[0] - primary.position[0],
          0,
          secondary.position[2] - primary.position[2],
        );
        if (axis.lengthSq() > 1e-6) {
          axis.normalize();
          if (Math.abs(vd.dot(axis)) > 0.7) {
            const perp = new THREE.Vector3().crossVectors(UP, axis).normalize();
            vd = perp.dot(vd) >= 0 ? perp : perp.negate();
          }
        }
      }
      const fov = 40;
      const d = fitDistance(radius, fov, 1.1);
      const p = center.clone().add(vd.clone().multiplyScalar(d));
      p.y = center.y + maxH * 0.12;
      return pose(p, center, fov);
    }
    case 'ots': {
      if (!secondary) return computePreset('closeup', objects, selectedId, camPos, curTarget);
      const nearHead = headOf(primary);
      const farHead = headOf(secondary);
      const nf = new THREE.Vector3().subVectors(farHead, nearHead);
      nf.y = 0;
      if (nf.lengthSq() < 1e-6) nf.set(0, 0, 1);
      const sep = nf.length();
      nf.normalize();
      // 站在近端角色斜后方,越过其肩看向远端角色;后撤量随两人间距自适应
      const side = new THREE.Vector3().crossVectors(UP, nf).multiplyScalar(0.5);
      const back = Math.min(1.1, 0.55 + sep * 0.15);
      const p = nearHead
        .clone()
        .add(nf.clone().multiplyScalar(-back))
        .add(side)
        .add(vec(0, 0.12, 0));
      return pose(p, farHead, 38);
    }
    case 'low': {
      // 仰拍:低机位看单个主角的头
      const { center, radius } = framingSphere([primary]);
      const fov = 44;
      const d = fitDistance(radius, fov, 1.1);
      const p = center.clone().add(dir.clone().multiplyScalar(d));
      p.y = 0.45;
      return pose(p, headOf(primary), fov);
    }
    case 'high': {
      // 俯拍:高机位俯看单个主角
      const { center, radius, maxH } = framingSphere([primary]);
      const fov = 48;
      const d = fitDistance(radius, fov, 1.06);
      const p = center.clone().add(dir.clone().multiplyScalar(d * 0.7));
      p.y = maxH + d * 0.55;
      return pose(p, center, fov);
    }
    case 'closeup': {
      // 特写:框住头 + 少量肩
      const head = headOf(primary);
      const radius = Math.max(0.18, primary.size[1] * 0.16);
      const fov = 35;
      const d = fitDistance(radius, fov, 1.12);
      const p = head.clone().add(dir.clone().multiplyScalar(d));
      p.y = head.y + 0.03;
      return pose(p, head, fov);
    }
    case 'dutch':
    default:
      // dutch 需相机滚转,OrbitControls 锁 up=Y 暂不支持 → 回退特写
      return computePreset('closeup', objects, selectedId, camPos, curTarget);
  }
}
