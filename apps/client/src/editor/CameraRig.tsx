import { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useEditor } from '../store/editorStore';
import { computePreset, type CamPose } from './camera';

type OrbitLike = { target: THREE.Vector3; update: () => void };

/** Canvas 内的相机执行器:消费 store.cameraCmd,操作相机 + OrbitControls */
export default function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const controls = useThree((s) => s.controls) as unknown as OrbitLike | null;
  const invalidate = useThree((s) => s.invalidate);

  const cmd = useEditor((s) => s.cameraCmd);
  const clear = useEditor((s) => s.clearCameraCmd);
  const addCamera = useEditor((s) => s.addCamera);
  const objects = useEditor((s) => s.objects);
  const selectedId = useEditor((s) => s.selectedId);

  useEffect(() => {
    if (!cmd || !controls) return;

    const apply = (p: CamPose) => {
      camera.position.set(p.position[0], p.position[1], p.position[2]);
      controls.target.set(p.target[0], p.target[1], p.target[2]);
      camera.fov = p.fov;
      camera.updateProjectionMatrix();
      controls.update();
      invalidate();
    };

    switch (cmd.type) {
      case 'apply':
        apply({ position: cmd.view.position, target: cmd.view.target, fov: cmd.view.fov });
        break;
      case 'preset': {
        const p = computePreset(cmd.preset, objects, selectedId, camera.position, controls.target);
        if (p) apply(p);
        break;
      }
      case 'fov':
        camera.fov = cmd.value;
        camera.updateProjectionMatrix();
        invalidate();
        break;
      case 'save':
        addCamera({
          name: cmd.name,
          position: [camera.position.x, camera.position.y, camera.position.z],
          target: [controls.target.x, controls.target.y, controls.target.z],
          fov: camera.fov,
        });
        break;
    }
    clear();
    // 只在收到新命令时执行。
  }, [cmd]);

  return null;
}
