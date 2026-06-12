import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { getDef, type ModelDef } from '@asc/resource-library';
import { useEditor } from '../store/editorStore';
import { resolveModelUri } from './assetResolver';

// 把一个 glTF 模型按「顶层部件」拆成多个独立对象:每个部件单独导出成自包含 GLB,
// 各自成为可分别选中/删除/移动的对象。部件位置 = 原对象位置 + 该部件在模型里的偏移。

const blobToDataUrl = (b: Blob): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(b);
  });

const exportGlb = (obj: THREE.Object3D): Promise<ArrayBuffer> =>
  new Promise((res, rej) =>
    new GLTFExporter().parse(obj, (o) => res(o as ArrayBuffer), (e) => rej(e), { binary: true }),
  );

const hasMesh = (o: THREE.Object3D): boolean => {
  let found = false;
  o.traverse((n) => {
    if ((n as THREE.Mesh).isMesh) found = true;
  });
  return found;
};

/** 穿过「单子节点」包裹层,找到真正有多个部件的那一层 */
function partLevel(scene: THREE.Object3D): THREE.Object3D[] {
  let node = scene;
  while (node.children.length === 1) node = node.children[0]!;
  return node.children.filter(hasMesh);
}

export async function splitSelected() {
  if (typeof window === 'undefined') return;
  const st = useEditor.getState();
  const obj = st.objects.find((o) => o.id === st.selectedId);
  if (!obj) return;
  const def = st.userModels.find((m) => m.id === obj.modelId) ?? getDef(obj.modelId);
  if (!def || def.source.kind !== 'gltf') {
    window.alert('只有导入的 glTF 模型可以拆分');
    return;
  }

  try {
    const gltf = await new GLTFLoader().loadAsync(resolveModelUri(def.source.file));
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);
    const children = partLevel(scene);
    if (children.length < 2) {
      window.alert('这个模型只有一个部件,无法拆分(可能整体是一个网格)');
      return;
    }

    const parts: { def: ModelDef; dx: number; dz: number }[] = [];
    let i = 0;
    for (const child of children) {
      child.updateWorldMatrix(true, true);
      const box = new THREE.Box3().setFromObject(child);
      const cx = (box.min.x + box.max.x) / 2;
      const cz = (box.min.z + box.max.z) / 2;
      const size = new THREE.Vector3();
      box.getSize(size);

      // 克隆该部件,把它的世界变换(水平居中到原点)烘进导出根节点
      const clone = child.clone(true);
      const m = child.matrixWorld.clone().premultiply(new THREE.Matrix4().makeTranslation(-cx, 0, -cz));
      m.decompose(clone.position, clone.quaternion, clone.scale);
      clone.matrixAutoUpdate = true;
      const wrap = new THREE.Group();
      wrap.add(clone);

      const glb = await exportGlb(wrap);
      const dataUrl = await blobToDataUrl(new Blob([glb], { type: 'model/gltf-binary' }));
      parts.push({
        def: {
          id: `user-${Date.now().toString(36)}-s${i}`,
          name: `${def.name}·${i + 1}`,
          type: 'prop',
          category: '我的模型',
          footprint: [Math.max(size.x, 0.2), Math.max(size.z, 0.2)],
          height: Math.max(size.y, 0.2),
          source: { kind: 'gltf', file: dataUrl },
        },
        dx: cx,
        dz: cz,
      });
      i++;
    }

    st.splitInto(obj.id, parts);
  } catch (e) {
    window.alert('拆分失败:' + ((e as Error)?.message ?? e));
  }
}
