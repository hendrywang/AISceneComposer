# @asc/resource-library

AI Scene Composer 的**模型资源库**——一个文件化、社区可共建的 3D 资产库。

编辑器里能摆的所有东西（人物 / 家具 / 门窗 / 房间 / 姿势 / 场景预设）都定义在这里。
核心理念:**一个模型 = 一个文件夹**(`models/<id>/`),里面一个 `meta.json` 说清楚一切;
真实模型再放一个 `.glb`。加模型 = 建文件夹 → 跑 `pnpm gen` → 发 PR,**不动任何中心文件**。

> 库本身是纯数据(不 import React / three)。渲染由前端 `apps/client/src/editor/ModelView.tsx`
> 按 `source.kind` 分发(图元 / 人体 / 房间壳 / glTF)。

---

## 目录

```
models/                      # ← 贡献面:一个模型 = 一个文件夹
  <id>/meta.json             # 模型清单(必有)
  <id>/model.glb             # gltf 模型才有(纹理内嵌的 .glb)
  _template/                 # 可照抄的模板(下划线开头 → 生成器跳过)
src/
  types.ts                   # 全部类型契约 + 房间尺寸 RW/RH/RD(先看这个)
  poses.ts                   # 姿势库 POSES + UI 选项 POSE_OPTIONS
  scenes.ts                  # 内置场景预设 SCENES(起手式排布)
  catalog.ts                 # getDef / modelDims / validateCatalog
  generated/catalog.ts       # ⚠️ 自动生成的 CATALOG,勿手改
  index.ts                   # 统一导出
scripts/generate.ts          # `pnpm gen`:扫 meta.json → 生成 CATALOG + 拷 glb + CREDITS
CREDITS.md                   # 自动生成的许可署名
```

每个模型是一个 `ModelDef`:库面板卡片(`id`/`name`/`category`)+ 怎么渲染(`source`)+ 取景尺寸(`footprint`/`height`)。`source.kind`:

| kind        | 含义                      | 关键数据                                                                       |
| ----------- | ------------------------- | ------------------------------------------------------------------------------ |
| `gltf`      | **真实 3D 资产(主推)**    | `file`(本文件夹内的 .glb)+ 可选 `poses`(姿势名 → 静态 glTF);**必带 `license`** |
| `primitive` | 盒子/薄片拼装(零工具占位) | `parts`(每个 `{ size, pos, color?, flat? }`)                                   |
| `human`     | 参数化人体                | `body`(身高/胖瘦/肩/髋/头/发/胸 倍数)                                          |
| `roomShell` | 单面内向反向盒房间        | `variant: 'plain' \| 'balcony'`                                                |

---

## 加一个真实模型(glTF) ← 最常见

1. 准备一个 `.glb`(web 原生、**纹理内嵌**;FBX/OBJ 等先按 `docs/asset-library.md` 的管线转成 glTF)。
2. 新建文件夹 `models/<你的-id>/`,放进 `model.glb`,再写 `meta.json`(照抄 `models/_template/meta.gltf.json`):

```json
{
  "id": "oak-chair",
  "name": "橡木椅",
  "type": "prop",
  "category": "家具",
  "footprint": [0.5, 0.5],
  "height": 0.9,
  "license": { "license": "CC0-1.0", "source": "Kenney", "attribution": "Kenney Furniture Kit" },
  "source": { "kind": "gltf", "file": "model.glb" }
}
```

3. `pnpm gen` → 模型自动进库面板。发 PR。

> 角色多姿势(D4):`"source": { "kind": "gltf", "file": "stand.glb", "poses": { "stand": "stand.glb", "sit": "sit.glb" } }`,把各姿势 `.glb` 一并放进文件夹。
> `license` 对 gltf **必填**(开源再分发的命脉),会自动汇进 `CREDITS.md`。

## 加一个图元模型(无需 3D 工具)

只写 `meta.json`(照抄 `models/_template/meta.primitive.json`),`parts` 用盒子拼:

```json
{
  "id": "stool",
  "name": "凳子",
  "type": "prop",
  "category": "家具",
  "footprint": [0.4, 0.4],
  "height": 0.45,
  "source": {
    "kind": "primitive",
    "parts": [{ "size": [0.4, 0.05, 0.4], "pos": [0, 0.45, 0], "color": "#b08d57" }]
  }
}
```

部件原点在脚底(y=0);`size=[宽,高,深]`,`pos`=部件中心。贴墙挂饰加 `"flat": true`(朝内单面薄片,随近墙隐藏)。

## 加一个体型 / 姿势 / 场景

- **体型**:`models/<id>/meta.json`,`"source": { "kind": "human", "body": { "height": 1.5, "build": 0.85, "shoulder": 0.95, "hip": 0.95, "head": 1.1, "hair": "#2a2a2a" } }`。
- **姿势**:在 `src/poses.ts` 的 `POSES` 加一条(关节名见 `types.ts` 的 `JointName`,值是欧拉角弧度),并在 `POSE_OPTIONS` 加一行。姿势是跨人体共享的,故仍集中在一个文件。
- **场景预设**:在 `src/scenes.ts` 的 `SCENES` 加一条,`placements` 的 `modelId` 引用任意模型。这是**精简起手式**(只有 modelId + 位置 + 朝向);用户可再编辑的「构图存档」是另一回事,映射 `@asc/shared-types` 的 `Scene`。

---

## 生成与校验

```bash
pnpm gen                                       # 扫 meta.json → 生成 CATALOG + 拷 glb 到 client public + CREDITS
pnpm --filter @asc/resource-library typecheck  # 类型这道关(生成的 CATALOG 必须符合 ModelDef[])
pnpm --filter @asc/resource-library check       # 一致性:id 唯一 / 场景引用不悬空 / primitive 有 parts / gltf 有 license
```

根目录 `pnpm web` / `pnpm dev` 会先自动跑 `gen`。`apps/client/public/models/` 是 gen 产物(已 gitignore),`.glb` 源文件在本包的 `models/<id>/`。

`id` 是稳定契约(场景预设与用户存档都按 `id` 引用)——**改名/删除前先确认没有引用**。
