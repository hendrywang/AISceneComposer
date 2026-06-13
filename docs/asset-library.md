# 资产库:清单 · 管线 · 许可

> 状态:草稿 v0.1
> 最后更新:2026-06-14
> 关联:主文档 [development-plan.md](./development-plan.md)(§6.2 资产库、`Asset` 模型);任务见 [phase-1-tasks.md](./phase-1-tasks.md) T3

---

## 资产的定位:代理体

资产**只是代理体**,会被 Nano Banana 2 重渲染,所以 3D 本身的"好看"不重要。只要求:**比例对、轮廓清晰、身份可区分**。角色固定姿势、无 IK/骨骼(D4)。(实现:默认改用**参数化人体 `Mannequin` + 关节欧拉角 FK 摆姿**;每姿势一个静态 glTF 仍作为 `gltf` 源的可选项保留。)

对应主文档 `Asset` 接口:`type: 'character'|'prop'|'environment'`;角色用 `poses[]`(每姿势一个 `modelUrl`)。

## 许可策略

| 来源           | 许可       | 商用       | 署名 | 再分发     | 用法                                              |
| -------------- | ---------- | ---------- | ---- | ---------- | ------------------------------------------------- |
| **Kenney**     | CC0        | ✅         | 否   | ✅         | **主用**:角色、家具、房间;低模、风格统一          |
| **Poly Haven** | CC0        | ✅         | 否   | ✅         | 高质量道具/环境(面数偏高,需审计优化)              |
| Mixamo         | Adobe 标准 | ✅         | 否   | ❌(须内嵌) | 可选:角色姿势更多;**禁用于训练 ML、禁单独再分发** |
| Meshy / Tripo  | CC BY 4.0  | ✅(须署名) | ✅   | ✅         | 可选补充:文生 3D,风格可控                         |

**结论:起步全用 Kenney(CC0,最干净)**;需要更丰富道具再用 Poly Haven;Mixamo 仅作姿势补充,且因"禁 ML 训练 / 禁再分发"条款,**走向商业化时优先 CC0 角色更稳妥**。

> 备注:我们的用法是把代理体截图喂给 Gemini **推理**出图(非用资产训练模型),与 Mixamo "禁训练"条款不冲突;但为规避歧义,默认偏向 CC0。

## 起步资产清单(原计划 ~8–10,够阶段 1 验证)

> **现状(2026-06-14)**:实际起步走了**数据驱动图元**路线——catalog 已有 **77 个模型 / 19 姿势 / 16 场景预设**,绝大多数是自产 primitive(`meta.json` 里的盒子 + 单面薄片)与参数化人体,**并非下载的 glTF / Kenney 资产**。加模型 = 加 `models/<id>/meta.json` 后 `pnpm gen`(详见 [`packages/resource-library/README.md`](../packages/resource-library/README.md))。下面的 Kenney/Mixamo 清单与 FBX→glTF 管线仍适用于将来引入真实 glTF 资产(`gltf` source)。

| #    | 资产        | 类型           | 来源                        | 备注                  |
| ---- | ----------- | -------------- | --------------------------- | --------------------- |
| 1    | 角色 A(站)  | character/pose | Kenney Mini Characters      | 身份色:红             |
| 2    | 角色 A(坐)  | character/pose | Kenney(或 Mixamo 烘焙坐姿)  | 同一角色不同 `poseId` |
| 3    | 角色 B(站)  | character/pose | Kenney Mini Characters      | 身份色:蓝             |
| 4    | 角色 B(坐)  | character/pose | Kenney / Mixamo             |                       |
| 5    | 椅子        | prop           | Kenney Furniture Kit        | < 1k 面               |
| 6    | 桌子        | prop           | Kenney Furniture Kit        | < 3k 面               |
| 7    | 书架/柜     | prop           | Kenney / Poly Haven         | Poly Haven 需审计面数 |
| 8    | 台灯        | prop           | Kenney Furniture Kit        | < 1k 面               |
| 9    | 房间(墙+地) | environment    | Kenney Building Kit(模块拼) | 单个室内场景          |
| (10) | 备用道具    | prop           | 视需要                      |                       |

足够摆出"室内双人对话"这一典型场景,验证机位与关系表达。

## 制作管线(FBX/OBJ → glTF → Firebase)

```
1. 获取        Kenney(.obj/.blend)/ Mixamo(.fbx,逐姿势单独下)/ Poly Haven(.blend/.obj)
2. 烘焙姿势    (仅 Mixamo)Blender 设时间轴到目标帧 → 选 Mesh+Armature → FBX 导出 Bake
3. 转 glTF     FBX2glTF model.fbx --draco       或   Blender 导出 glTF
4. 优化        gltf-transform optimize in.glb out.glb --draco   (再按需 quantize/meshopt)
5. 缩略图      离屏渲一张正交缩略图(库面板用)
6. 上传        gsutil 上传到 Cloud Storage;配 CORS(见 project-structure G6)
```

**多边形预算**(代理体,够用即可):

| 类别          | 三角面  |
| ------------- | ------- |
| 角色          | 5k–15k  |
| 小道具(椅/灯) | 0.3k–1k |
| 大道具(桌/柜) | 1k–3k   |
| 房间/环境     | 5k–20k  |

压缩后目标:角色 < ~1.5MB,道具 < ~50KB。

## 命名 / ID 约定

- `assetId`:`char_a` / `prop_chair` / `env_room01`(稳定、kebab 风格)。
- 角色姿势 `poseId`:`stand` / `sit` / `lean`;`modelUrl` = `models/char_a/stand.glb`。
- Storage 路径:`models/<assetId>/<poseId|model>.glb`、缩略图 `thumbnails/<assetId>.webp`。
- 库索引(`Asset[]`)可先放一份静态 JSON(随客户端打包),阶段 2 再移到 Firestore。

## 陷阱

- **CORS**:Three.js 跨域加载 glTF 必须先配 Storage CORS,否则被拦。
- **纹理须内嵌**:用 `.glb`(二进制内嵌),别用 `.gltf` + 外部 `.bin`/贴图(路径易断)。
- **烘焙姿势丢骨骼**:导出的是静态网格、无骨骼——这是有意为之(D4),FBX 导出可关掉 Armature 减体积。
- **Poly Haven 面数**:常比 Kenney 高很多,入库前用 `gltf-transform inspect` 审计并优化。
- **风格混搭**:代理体阶段无所谓(Gemini 会重渲染),但缩略图风格尽量统一,库面板更整齐。
