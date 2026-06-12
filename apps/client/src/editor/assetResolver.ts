/**
 * 模型加载机制的唯一接缝:把资源库的「服务相对路径」(如 `models/<id>/model.glb`)
 * 解析成 `useGLTF` 可加载的 URI。换托管方式只改这里,模型数据与渲染层都不动。
 *
 * - dev:留空 → 走 `/models/...` 静态托管(apps/client/public/models,由 `pnpm gen` 拷贝产出)。
 * - prod:把 MODELS_BASE 指向 Cloud Storage / CDN(同一相对路径,配 CORS / 见 G6)。
 */
const MODELS_BASE: string = '';

export function resolveModelUri(file: string): string {
  // 运行时上传的模型(data:)、blob、或绝对 URL → 原样返回(不加托管前缀)
  if (/^(data:|blob:|https?:)/.test(file)) return file;
  return MODELS_BASE ? `${MODELS_BASE.replace(/\/$/, '')}/${file}` : `/${file}`;
}
