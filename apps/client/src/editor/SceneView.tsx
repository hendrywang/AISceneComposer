import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Grid, OrbitControls, TransformControls, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { useEditor, type EditorObject } from '../store/editorStore';
import { useUI } from '../ui/uiStore';
import { getDef } from '@asc/resource-library';
import { ModelView } from './ModelView';
import { SceneLighting } from './SceneLighting';
import CameraRig from './CameraRig';
import { cameraSync } from './cameraSync';

/** 物体内容:按 modelId 解析(运行时上传的 userModels 优先,再查静态 catalog)。父 group 原点在脚底(y=0)。 */
export function ObjectContent({ obj }: { obj: EditorObject }) {
  const userModels = useEditor((s) => s.userModels);
  const def = userModels.find((m) => m.id === obj.modelId) ?? getDef(obj.modelId);
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
  const setDragging = useUI((s) => s.setDragging);

  // 拖动过程中持续把变换写回 store(对平移/旋转都可靠;旋转结束不会再被旧值拨回)
  const onObjectChange = () => {
    if (!group) return;
    commit(obj.id, [group.position.x, group.position.y, group.position.z], group.rotation.y);
  };

  // 中途取消选择/删除时,确保拖动标记复位
  useEffect(() => () => setDragging(false), [setDragging]);

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
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          showX={mode === 'translate'}
          showY={mode === 'rotate'}
          showZ={mode === 'translate'}
        />
      )}
    </>
  );
}

/** 把选中物体「顶部」投影到屏幕像素,写入 uiStore → 悬浮工具条(SelectionHud)据此定位、跟随。
 *  仅在按需渲染的帧里更新(位移/旋转/选择变化时);静止时不更新。 */
const _proj = new THREE.Vector3();
function SelectionHudTracker() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  const selectedId = useEditor((s) => s.selectedId);
  const objects = useEditor((s) => s.objects);
  const setHud = useUI((s) => s.setHud);

  const sel = objects.find((o) => o.id === selectedId) ?? null;
  const last = useRef({ x: 0, y: 0, v: false });

  // 选择变化时强制渲染一帧,确保锚点立即算出
  useEffect(() => {
    invalidate();
  }, [selectedId, invalidate]);

  useFrame(() => {
    if (!sel || sel.kind === 'environment') {
      if (last.current.v) {
        last.current = { x: 0, y: 0, v: false };
        setHud(0, 0, false);
      }
      return;
    }
    _proj.set(sel.position[0], sel.size[1], sel.position[2]).project(camera);
    const inFront = _proj.z < 1;
    const sx = Math.max(
      12,
      Math.min((_proj.x * 0.5 + 0.5) * size.width + 28, Math.max(12, size.width - 232)),
    );
    const sy = Math.max(
      12,
      Math.min((1 - (_proj.y * 0.5 + 0.5)) * size.height - 28, Math.max(12, size.height - 210)),
    );
    if (
      Math.abs(sx - last.current.x) > 0.5 ||
      Math.abs(sy - last.current.y) > 0.5 ||
      inFront !== last.current.v
    ) {
      last.current = { x: sx, y: sy, v: inFront };
      setHud(sx, sy, inFront);
    }
  });
  return null;
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

export default function SceneView({ gizmoMargin = [72, 72] }: { gizmoMargin?: [number, number] }) {
  const objects = useEditor((s) => s.objects);
  const selectedId = useEditor((s) => s.selectedId);

  return (
    <>
      <SceneLighting />

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
      <SelectionHudTracker />
      <OrbitControls makeDefault />
      {/* 方位小立方:右下角留白由 Editor 按断点传入(桌面/iPad 贴角,手机抬高避开 Tab 栏) */}
      <GizmoHelper alignment="bottom-right" margin={gizmoMargin}>
        <GizmoViewport />
      </GizmoHelper>
    </>
  );
}
