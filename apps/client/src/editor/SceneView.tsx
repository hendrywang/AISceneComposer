import { useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { useEditor, type EditorObject } from '../store/editorStore';
import { getDef } from './catalog';
import { ModelView } from './ModelView';
import CameraRig from './CameraRig';
import { cameraSync } from './cameraSync';

/** 物体内容:由 catalog 决定怎么渲染(人体/家具/将来 glTF)。父 group 原点在脚底(y=0)。 */
export function ObjectContent({ obj }: { obj: EditorObject }) {
  const def = getDef(obj.modelId);
  if (!def) return null;
  return <ModelView def={def} color={obj.color} poseId={obj.poseId} />;
}

/** 选中高亮:脚下一圈白环(对人体/方块都适用) */
function SelectionRing({ size }: { size: [number, number, number] }) {
  const r = Math.max(size[0], size[2]) * 0.6 + 0.2;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[r, r + 0.06, 48]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

/** 未选中:点击即选中 */
function ObjectNode({ obj }: { obj: EditorObject }) {
  const select = useEditor((s) => s.select);
  return (
    <group
      position={[obj.position[0], 0, obj.position[2]]}
      rotation={[0, obj.rotationY, 0, 'YXZ']}
      onClick={(e) => {
        e.stopPropagation();
        select(obj.id);
      }}
    >
      <ObjectContent obj={obj} />
    </group>
  );
}

/** 环境(房间):静态,不可选中/变换,避免误选整个房间 */
function StaticNode({ obj }: { obj: EditorObject }) {
  return (
    <group position={[obj.position[0], 0, obj.position[2]]} rotation={[0, obj.rotationY, 0, 'YXZ']}>
      <ObjectContent obj={obj} />
    </group>
  );
}

/**
 * 选中:被控对象是位于脚底(y=0)的 group → 手柄落在物体底部;平移锁地面 XZ、旋转只绕 Y。
 * 用「回调 ref + state」拿到真实 group,确保控件挂载时对象已就位。
 */
function SelectedTransform({ obj }: { obj: EditorObject }) {
  const [group, setGroup] = useState<THREE.Group | null>(null);
  const mode = useEditor((s) => s.transformMode);
  const commit = useEditor((s) => s.commitTransform);
  const select = useEditor((s) => s.select);

  // 拖动过程中持续把变换写回 store(对平移/旋转都可靠;旋转结束不会再被旧值拨回)
  const onObjectChange = () => {
    if (!group) return;
    commit(obj.id, [group.position.x, group.position.y, group.position.z], group.rotation.y);
  };

  return (
    <>
      <group
        ref={setGroup}
        position={[obj.position[0], 0, obj.position[2]]}
        rotation={[0, obj.rotationY, 0, 'YXZ']}
        onClick={(e) => {
          e.stopPropagation();
          select(obj.id);
        }}
      >
        <ObjectContent obj={obj} />
        <SelectionRing size={obj.size} />
      </group>
      {group && (
        <TransformControls
          object={group}
          mode={mode}
          onObjectChange={onObjectChange}
          showX={mode === 'translate'}
          showY={mode === 'rotate'}
          showZ={mode === 'translate'}
        />
      )}
    </>
  );
}

/** 主视图每帧把当前相机位姿写入 cameraSync,并触发预览窗按需重绘 */
function CameraSyncWriter() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const controls = useThree((s) => s.controls) as unknown as { target?: THREE.Vector3 } | null;
  useFrame(() => {
    cameraSync.position.copy(camera.position);
    if (controls?.target) cameraSync.target.copy(controls.target);
    cameraSync.fov = camera.fov;
    cameraSync.invalidatePreview?.();
  });
  return null;
}

export default function SceneView() {
  const objects = useEditor((s) => s.objects);
  const selectedId = useEditor((s) => s.selectedId);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 6, 2]} intensity={1.2} />

      <Grid infiniteGrid sectionColor="#3a3a3a" cellColor="#202020" fadeDistance={40} />

      {objects.map((o) =>
        o.kind === 'environment' ? (
          <StaticNode key={o.id} obj={o} />
        ) : o.id === selectedId ? (
          <SelectedTransform key={o.id} obj={o} />
        ) : (
          <ObjectNode key={o.id} obj={o} />
        ),
      )}

      <CameraRig />
      <CameraSyncWriter />
      <OrbitControls makeDefault />
      <GizmoHelper alignment="bottom-right" margin={[64, 64]}>
        <GizmoViewport />
      </GizmoHelper>
    </>
  );
}
