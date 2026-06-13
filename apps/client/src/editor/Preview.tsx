import { useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEditor } from '../store/editorStore';
import { ObjectContent } from './SceneView';
import { SceneLighting } from './SceneLighting';
import { cameraSync, previewControl } from './cameraSync';

/** 预览相机:每帧镜像主视图机位(位置/朝向/FOV);画幅比例由 Canvas 容器尺寸决定 */
function PreviewCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    cameraSync.invalidatePreview = invalidate;
    return () => {
      if (cameraSync.invalidatePreview === invalidate) cameraSync.invalidatePreview = null;
    };
  }, [invalidate]);

  useFrame(() => {
    camera.position.copy(cameraSync.position);
    camera.up.set(0, 1, 0);
    camera.lookAt(cameraSync.target);
    if (camera.fov !== cameraSync.fov) {
      camera.fov = cameraSync.fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

/** 干净场景(无网格/手柄/选择圈)= 最终出图画面 */
function PreviewContent() {
  const objects = useEditor((s) => s.objects);
  return (
    <>
      <SceneLighting />
      {objects.map((o) => (
        <group key={o.id} position={[o.position[0], 0, o.position[2]]} rotation={[0, o.rotationY, 0, 'YXZ']}>
          <ObjectContent obj={o} />
        </group>
      ))}
    </>
  );
}

/** 用户上传的照片作为场景背景(会被渲染进画布,所以下载时自带背景) */
function PreviewBackground() {
  const url = useEditor((s) => s.bgImageUrl);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!url) {
      scene.background = null;
      invalidate();
      return;
    }
    let tex: THREE.Texture | null = null;
    let cancelled = false;
    new THREE.TextureLoader().load(url, (t) => {
      if (cancelled) {
        t.dispose();
        return;
      }
      t.colorSpace = THREE.SRGBColorSpace;
      tex = t;
      scene.background = t;
      invalidate();
    });
    return () => {
      cancelled = true;
      if (scene.background === tex) scene.background = null;
      tex?.dispose();
      invalidate();
    };
  }, [url, scene, invalidate]);
  return null;
}

/** 注册导出能力:渲染当前帧 → 取 canvas 的 PNG dataURL(所见即所得) */
function PreviewExporter() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useEffect(() => {
    // 临时放大渲染器到目标分辨率渲染一帧 → 截图 → 还原(预览仍小、出图清晰)
    previewControl.capture = (longEdge: number) => {
      const size = gl.getSize(new THREE.Vector2());
      const dpr = gl.getPixelRatio();
      const aspect = size.x / size.y || 1;
      const w = aspect >= 1 ? longEdge : Math.round(longEdge * aspect);
      const h = aspect >= 1 ? Math.round(longEdge / aspect) : longEdge;

      gl.setPixelRatio(1);
      gl.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      gl.render(scene, camera);
      const url = gl.domElement.toDataURL('image/png');

      // 还原到预览尺寸
      gl.setPixelRatio(dpr);
      gl.setSize(size.x, size.y, false);
      camera.aspect = size.x / size.y || 1;
      camera.updateProjectionMatrix();
      gl.render(scene, camera);
      return url;
    };
    return () => {
      previewControl.capture = null;
    };
  }, [gl, scene, camera]);
  return null;
}

/** 取景预览 Canvas:填满父容器(父容器按所选比例设尺寸) */
export function PreviewCanvas() {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{ position: [5, 4, 6], fov: 55 }}
      style={{ width: '100%', height: '100%', background: '#0b0b0e', touchAction: 'none' }}
    >
      <PreviewBackground />
      <PreviewContent />
      <PreviewCamera />
      <PreviewExporter />
    </Canvas>
  );
}
