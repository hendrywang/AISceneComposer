import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { useEditor } from '../store/editorStore';
import type { ModelDef } from '@asc/resource-library';

// 运行时上传 glTF。关键:把上传内容**归一化成「自包含 GLB 的 data URL」**——
//   - 单个 .glb:直接 data URL;
//   - .gltf + scene.bin + textures/(从其它地方下载的典型形态):选整个文件夹,
//     把 JSON 里 buffers/images 的相对 uri 改写成所选文件的 blob URL → 解析 → 再导出成 GLB。
// 归一化后的 GLB 既能被 useGLTF 直接渲染,又能内嵌进存档(随场景保存/还原)。

const MAX_MB = 60;
let seq = 0;

const fileToDataUrl = (file: Blob): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = () => rej(r.error);
    r.readAsDataURL(file);
  });

const norm = (p: string) => decodeURIComponent(p).replace(/^\.?\//, '');

/** 把上传的文件集合归一化成一个自包含 GLB 的 data URL。 */
async function filesToGlb(files: File[]): Promise<{ name: string; dataUrl: string }> {
  // 相对路径(去掉顶层文件夹)→ File,并按 basename 兜底
  const byPath = new Map<string, File>();
  for (const f of files) {
    const rel = (f as unknown as { webkitRelativePath?: string }).webkitRelativePath;
    const stripped = rel ? rel.split('/').slice(1).join('/') : f.name;
    byPath.set(norm(stripped), f);
    byPath.set(norm(f.name), f);
  }

  const entry = files.find((f) => /\.glb$/i.test(f.name)) ?? files.find((f) => /\.gltf$/i.test(f.name));
  if (!entry) throw new Error('未找到 .gltf 或 .glb 入口文件');

  // 自包含的单个 .glb:直接用,无需重打包
  if (/\.glb$/i.test(entry.name)) {
    return { name: entry.name, dataUrl: await fileToDataUrl(entry) };
  }

  // .gltf:改写相对 uri → blob URL,解析,再导出 GLB
  const blobUrls: string[] = [];
  const toBlob = (uri: string): string => {
    if (!uri || uri.startsWith('data:')) return uri;
    const f = byPath.get(norm(uri)) ?? byPath.get(norm(uri.split('/').pop() ?? ''));
    if (!f) throw new Error(`缺少依赖文件:${uri}(请选包含 .bin / textures 的整个文件夹)`);
    const u = URL.createObjectURL(f);
    blobUrls.push(u);
    return u;
  };

  try {
    const json = JSON.parse(await entry.text());
    for (const b of json.buffers ?? []) if (b.uri) b.uri = toBlob(b.uri);
    for (const im of json.images ?? []) if (im.uri) im.uri = toBlob(im.uri);

    const loader = new GLTFLoader();
    const gltf = await loader.parseAsync(JSON.stringify(json), '');

    const exporter = new GLTFExporter();
    const glb = await new Promise<ArrayBuffer>((resolve, reject) =>
      exporter.parse(
        gltf.scene,
        (out) => resolve(out as ArrayBuffer),
        (e) => reject(e),
        { binary: true },
      ),
    );
    return { name: entry.name, dataUrl: await fileToDataUrl(new Blob([glb], { type: 'model/gltf-binary' })) };
  } finally {
    for (const u of blobUrls) URL.revokeObjectURL(u);
  }
}

/** 把选中的文件集合归一化、注册成 userModel 并放进场景。 */
async function register(files: File[], onDone?: () => void) {
  const totalMB = files.reduce((s, f) => s + f.size, 0) / 1024 / 1024;
  if (totalMB > MAX_MB && typeof window !== 'undefined') {
    if (!window.confirm(`模型较大(${totalMB.toFixed(1)}MB),可能影响性能与存档体积。仍要导入?`)) return;
  }
  try {
    const { name, dataUrl } = await filesToGlb(files);
    const id = `user-${Date.now().toString(36)}-${seq++}`;
    const def: ModelDef = {
      id,
      name: name.replace(/\.(glb|gltf)$/i, '').slice(0, 20) || '我的模型',
      type: 'prop',
      category: '我的模型',
      footprint: [1, 1],
      height: 1,
      source: { kind: 'gltf', file: dataUrl },
    };
    const st = useEditor.getState();
    st.addUserModel(def);
    st.add(id);
    onDone?.();
  } catch (e) {
    if (typeof window !== 'undefined') window.alert('导入失败:' + ((e as Error)?.message ?? e));
  }
}

function makeInput(directory: boolean): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  if (directory) (input as unknown as { webkitdirectory: boolean }).webkitdirectory = true;
  else input.accept = '.glb,.gltf,model/gltf-binary,model/gltf+json';
  return input;
}

/**
 * 单入口导入,自动判别格式:
 *   - 选到单个自包含 .glb → 直接用;
 *   - 选到 .gltf(需要 .bin / textures)→ 在同一手势内自动改用「选文件夹」补齐依赖。
 * 一个按钮、一次点击,glb 与 gltf 都走通(浏览器文件/文件夹是两种选择器,故 gltf 会再弹一次选文件夹)。
 */
export function importModel(onDone?: () => void) {
  if (typeof document === 'undefined') return;
  const fileInput = makeInput(false);
  fileInput.onchange = () => {
    const files = fileInput.files ? Array.from(fileInput.files) : [];
    if (files.length === 0) return;
    // 单个 .glb:自包含,直接处理
    if (files.length === 1 && /\.glb$/i.test(files[0]!.name)) {
      void register(files, onDone);
      return;
    }
    // 含 .gltf / 多文件:需要整个文件夹 → 同一手势内立即改用文件夹选择(勿在此前 await,否则手势失效被拦)
    const folderInput = makeInput(true);
    folderInput.onchange = () => {
      const ff = folderInput.files ? Array.from(folderInput.files) : [];
      if (ff.length > 0) void register(ff, onDone);
    };
    folderInput.click();
  };
  fileInput.click();
}
