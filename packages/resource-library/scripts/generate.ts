// 生成器:扫 models/<id>/meta.json → 校验 → 产出 src/generated/catalog.ts
//   + 把 gltf 模型文件拷到 apps/client/public/models/<id>/(dev 静态托管)
//   + 产出 CREDITS.md(许可署名聚合)。
// 用法:pnpm --filter @asc/resource-library gen  (或根目录 pnpm gen)
import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
  mkdirSync,
  rmSync,
  copyFileSync,
  statSync,
} from 'fs';
import { join, resolve } from 'path';
import { compactJson } from './format';

const PKG = resolve('.');
const MODELS_DIR = join(PKG, 'models');
const GEN_DIR = join(PKG, 'src', 'generated');
const PUBLIC_DIR = resolve(PKG, '..', '..', 'apps', 'client', 'public', 'models');

// 库面板分类 Tab 的顺序;表外的分类按字母排在其后
const CATEGORY_ORDER = ['人物', '家具', '装饰', '室外', '场景'];
const VALID_TYPES = ['actor', 'prop', 'environment'];

const errors: string[] = [];
const fail = (id: string, msg: string) => errors.push(`[${id}] ${msg}`);

/** 校验一条 meta.json;同时把 gltf 的相对 file 展开为「服务相对路径」并记录待拷贝文件 */
function validate(id: string, dir: string, d: any, toCopy: [string, string][]) {
  if (d.id !== id) fail(id, `meta.json 的 id「${d.id}」与文件夹名不一致`);
  if (!d.name) fail(id, '缺少 name');
  if (!VALID_TYPES.includes(d.type)) fail(id, `type 非法:${d.type}`);
  if (!d.category) fail(id, '缺少 category');
  const s = d.source;
  if (!s || typeof s.kind !== 'string') {
    fail(id, '缺少 source.kind');
    return;
  }

  if (s.kind === 'primitive') {
    if (!Array.isArray(s.parts) || s.parts.length === 0) fail(id, 'primitive 没有 parts');
  } else if (s.kind === 'human') {
    for (const k of ['height', 'build', 'shoulder', 'hip', 'head']) {
      if (typeof s.body?.[k] !== 'number') fail(id, `human body.${k} 缺失或非数字`);
    }
  } else if (s.kind === 'roomShell') {
    if (s.variant !== 'plain' && s.variant !== 'balcony') fail(id, `roomShell variant 非法:${s.variant}`);
  } else if (s.kind === 'outdoorShell') {
    const enums: Record<string, string[]> = {
      ground: ['grass', 'stone', 'paving', 'sand'],
      sky: ['day', 'dusk', 'night', 'overcast'],
      backdrop: ['none', 'cityline', 'treeline', 'wall'],
    };
    for (const [k, allowed] of Object.entries(enums)) {
      if (s[k] !== undefined && !allowed.includes(s[k])) fail(id, `outdoorShell ${k} 非法:${s[k]}`);
    }
  } else if (s.kind === 'gltf') {
    if (!d.license?.license) fail(id, 'gltf 必须带 license(开源再分发命脉)');
    const files = [s.file, ...Object.values(s.poses ?? {})] as string[];
    for (const f of files) {
      if (typeof f !== 'string') {
        fail(id, 'gltf file/poses 路径非字符串');
        continue;
      }
      if (!existsSync(join(dir, f))) {
        fail(id, `找不到模型文件:${f}`);
        continue;
      }
      toCopy.push([join(dir, f), join(PUBLIC_DIR, id, f)]);
    }
    // 展开为服务相对路径:models/<id>/<file>
    s.file = `models/${id}/${s.file}`;
    if (s.poses) for (const k of Object.keys(s.poses)) s.poses[k] = `models/${id}/${s.poses[k]}`;
  } else {
    fail(id, `未知 source.kind:${s.kind}`);
  }

  // 取景尺寸:非人体需要 footprint + height
  if (s.kind !== 'human') {
    if (!Array.isArray(d.footprint) || d.footprint.length !== 2) fail(id, '缺少 footprint [宽,深]');
    if (typeof d.height !== 'number') fail(id, '缺少 height');
  }
}

// ── 扫描 ──
const entries: any[] = [];
const toCopy: [string, string][] = [];
for (const id of readdirSync(MODELS_DIR)) {
  if (id.startsWith('_') || id.startsWith('.')) continue; // 跳过 _template / 草稿 / 隐藏
  const dir = join(MODELS_DIR, id);
  if (!statSync(dir).isDirectory()) continue;
  const metaPath = join(dir, 'meta.json');
  if (!existsSync(metaPath)) {
    fail(id, '缺少 meta.json');
    continue;
  }
  let def: any;
  try {
    def = JSON.parse(readFileSync(metaPath, 'utf8'));
  } catch {
    fail(id, 'meta.json 不是合法 JSON');
    continue;
  }
  validate(id, dir, def, toCopy);
  entries.push(def);
}

if (errors.length > 0) {
  console.error(`资源库生成失败(${errors.length}):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

// ── 排序(类别顺序 + id) ──
const catRank = (c: string) => {
  const i = CATEGORY_ORDER.indexOf(c);
  return i < 0 ? CATEGORY_ORDER.length : i;
};
entries.sort((a, b) => catRank(a.category) - catRank(b.category) || a.id.localeCompare(b.id));

// ── 产出 generated/catalog.ts ──
mkdirSync(GEN_DIR, { recursive: true });
const header =
  '// ⚠️ 自动生成,请勿手改。改模型 = 改 models/<id>/meta.json,然后 `pnpm gen`。\n' +
  "import type { ModelDef } from '../types';\n\n";
writeFileSync(
  join(GEN_DIR, 'catalog.ts'),
  header + 'export const CATALOG: ModelDef[] = ' + compactJson(entries) + ';\n',
);

// ── 拷贝 gltf 模型文件到 client public(dev 托管) ──
rmSync(PUBLIC_DIR, { recursive: true, force: true });
for (const [src, dest] of toCopy) {
  mkdirSync(join(dest, '..'), { recursive: true });
  copyFileSync(src, dest);
}

// ── 产出 CREDITS.md ──
const licensed = entries.filter((e) => e.license?.license);
let credits = '# 资源库署名 / 许可\n\n> 本文件由 `pnpm gen` 自动生成,请勿手改。\n\n';
credits += '图元(primitive)模型为本仓自产。以下为带许可的真实资产:\n\n';
credits += '| 模型 | id | 许可 | 来源 | 署名 |\n|------|----|------|------|------|\n';
for (const e of licensed) {
  const l = e.license;
  credits += `| ${e.name} | \`${e.id}\` | ${l.license} | ${l.source ?? '-'} | ${l.attribution ?? '-'} |\n`;
}
writeFileSync(join(PKG, 'CREDITS.md'), credits);

console.log(
  `资源库生成完成:${entries.length} 个模型,${licensed.length} 个带许可资产,拷贝 ${toCopy.length} 个文件 → public/models`,
);
