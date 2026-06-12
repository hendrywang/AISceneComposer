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
const headOf = (o: EditorObject) => vec(o.position[0], o.size[1] * 0.9, o.position[2]);
const chestOf = (o: EditorObject) => vec(o.position[0], o.size[1] * 0.55, o.position[2]);

function pickSubjects(objects: EditorObject[], selectedId: string | null) {
  const actors = objects.filter((o) => o.kind === 'actor');
  const primary = actors.find((a) => a.id === selectedId) ?? actors[0] ?? null;
  let secondary: EditorObject | null = null;
  if (primary) {
    let best = Infinity;
    for (const a of actors) {
      if (a.id === primary.id) continue;
      const d = vec(...primary.position).distanceTo(vec(...a.position));
      if (d < best) {
        best = d;
        secondary = a;
      }
    }
  }
  return { primary, secondary };
}

/**
 * 基于选中角色 + 当前水平视角方位,计算镜头预设位姿。
 * dir = 从 target 指向 camera 的水平向量:让预设在"用户当前看的方向"上变换,直觉且无需角色朝向。
 */
export function computePreset(
  preset: CameraPreset,
  objects: EditorObject[],
  selectedId: string | null,
  camPos: THREE.Vector3,
  curTarget: THREE.Vector3,
): CamPose | null {
  const { primary, secondary } = pickSubjects(objects, selectedId);
  if (!primary) return null;

  const dir = new THREE.Vector3().subVectors(camPos, curTarget);
  dir.y = 0;
  if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
  dir.normalize();

  const pHead = headOf(primary);
  const pChest = chestOf(primary);
  const pose = (p: THREE.Vector3, t: THREE.Vector3, fov: number): CamPose => ({
    position: [p.x, p.y, p.z],
    target: [t.x, t.y, t.z],
    fov,
  });

  switch (preset) {
    case 'two-shot': {
      const center = secondary ? chestOf(secondary).add(pChest).multiplyScalar(0.5) : pChest.clone();
      const spread = secondary
        ? vec(...primary.position).distanceTo(vec(...secondary.position)) + 1.5
        : 2.2;
      const dist = spread * 1.4 + 1.5;
      const p = center.clone().add(dir.clone().multiplyScalar(dist));
      p.y = center.y + 0.4;
      return pose(p, center, 40);
    }
    case 'ots': {
      if (!secondary) return computePreset('closeup', objects, selectedId, camPos, curTarget);
      const nearHead = pHead.clone();
      const farHead = headOf(secondary);
      const dirNF = new THREE.Vector3().subVectors(farHead, nearHead);
      dirNF.y = 0;
      if (dirNF.lengthSq() < 1e-6) dirNF.set(0, 0, 1);
      dirNF.normalize();
      const side = new THREE.Vector3().crossVectors(UP, dirNF).multiplyScalar(0.45);
      const p = nearHead
        .clone()
        .add(dirNF.clone().multiplyScalar(-0.8))
        .add(side)
        .add(vec(0, 0.1, 0));
      return pose(p, farHead, 35);
    }
    case 'low': {
      const p = pChest.clone().add(dir.clone().multiplyScalar(2.4));
      p.y = 0.4;
      return pose(p, pHead, 42);
    }
    case 'high': {
      const p = pChest.clone().add(dir.clone().multiplyScalar(2.2));
      p.y = pChest.y + 2.6;
      return pose(p, pChest, 48);
    }
    case 'closeup': {
      const p = pHead.clone().add(dir.clone().multiplyScalar(1.2));
      p.y = pHead.y + 0.05;
      return pose(p, pHead, 35);
    }
    default:
      // dutch 等未实现:回退到双人
      return computePreset('two-shot', objects, selectedId, camPos, curTarget);
  }
}
