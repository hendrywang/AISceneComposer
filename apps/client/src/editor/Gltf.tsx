import { Component, Suspense, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { Clone, useGLTF } from '@react-three/drei';
import { resolveModelUri } from './assetResolver';

/** 模型加载失败时兜底:渲染空,绝不让错误冒泡到 Canvas(否则丢失 WebGL 上下文、整页崩)。 */
class GltfErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('[Gltf] 模型加载失败:', err);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * glTF 渲染:加载真实 3D 资产('gltf' 源)。入参是「服务相对路径」或上传模型的 data URL。
 * 自动落地:很多 glTF 原点在几何中心(拖进场景会半埋地下)。用包围盒量出最低点上移到 y=0,
 * 与 Mannequin 同一约定,任意资产都正确着地。
 */
function GltfContent({ uri }: { uri: string }) {
  const { scene } = useGLTF(uri);
  const ref = useRef<THREE.Group>(null);
  const [offY, setOffY] = useState(0);

  useLayoutEffect(() => {
    const g = ref.current;
    if (!g) return;
    const box = new THREE.Box3().setFromObject(g);
    if (Number.isFinite(box.min.y) && Math.abs(box.min.y) > 1e-4) {
      setOffY((prev) => prev - box.min.y);
    }
  }, [uri]);

  return (
    <group position={[0, offY, 0]}>
      <Clone ref={ref} object={scene} />
    </group>
  );
}

export function GltfModel({ file, poseFile }: { file: string; poseFile?: string }) {
  const uri = resolveModelUri(poseFile || file);
  return (
    <GltfErrorBoundary key={uri}>
      <Suspense fallback={null}>
        <GltfContent uri={uri} />
      </Suspense>
    </GltfErrorBoundary>
  );
}
