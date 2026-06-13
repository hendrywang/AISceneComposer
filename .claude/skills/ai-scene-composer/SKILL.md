---
name: ai-scene-composer
description: AI Scene Composer 项目总览与成本参考。开始或更新本项目任何工作前先读——项目目标、已锁定决策(D1–D17)、技术架构、文档地图、运行成本与每张出图价格。涉及本项目的规划、开发、改架构、估算成本时调用。
---

# AI Scene Composer — 项目总览(skill)

> 这是项目的"打开即懂"入口。详细内容在 `docs/` 下;本文件给全貌 + 成本,便于后续每次更新前快速对齐。
> 维护:决策或价格变动时,更新本文件对应小节(并同步 `docs/development-plan.md`)。最后更新 2026-06-14。

## 一句话

一个轻量 3D「虚拟布景/分镜」工具:用户摆低模代理角色/道具/房间、设机位 → 导出干净截图 → 交给 Google **Nano Banana 2**(Gemini 图像)生成成品图。解决"纯文字 prompt 控制不了构图与机位"的痛点。**不是 3D 建模工具,是摆积木 + 架相机 + 截图。**

## 文档地图(`docs/`)

| 文档                       | 内容                                                                             |
| -------------------------- | -------------------------------------------------------------------------------- |
| `development-plan.md`      | **总纲**:问题、思路、决策表 D1–D17、架构、数据结构、路线图                       |
| `phase-1-tasks.md`         | 阶段 1(最小编辑器 + Firebase)任务拆解 T1–T13,带验收标准                          |
| `project-structure.md`     | monorepo 目录树、依赖、配置、初始化命令、8 个已知坑                              |
| `firebase-architecture.md` | Firebase 架构:经典 Hosting vs App Hosting、产品映射、rewrite→Cloud Run、安全规则 |
| `asset-library.md`         | 起步资产清单、FBX→glTF→Firebase 管线、许可策略                                   |

## 已锁定决策(改动前先看,勿重新讨论)

- **D1–D3** 控制方式 = 3D 布景截图 + prompt → Nano Banana 2;**不用** ControlNet/深度图管线。
- **D4** 角色只用**固定姿势**、**不做 IK/骨骼**。(实现:默认走参数化人体 `Mannequin` + 关节欧拉角 FK 摆姿;per-pose 静态 glTF 仍作为 `gltf` 源可选项保留。)
- **D5** 角色一致性**延后**,后续交给 Nano Banana(多图条件)。
- **D6/D11** 资产 ~100 个起步,**免费库**(Kenney CC0 主用)。
- **D7** 产品核心 = **镜头/分镜系统**(角色关系靠机位表达;数据层为 `Shot`)。
- **D10** 画风写实 + 二次元,做成**生成时风格切换**(同套代理资产通吃)。
- **D12** 前端 **Expo + Three.js**;Web 走 WebGL,移动端原生 GL。
- **D13** **Firebase 全家桶**:Auth + Firestore + Cloud Storage。
- **D14** 后端 **Node + TypeScript on Cloud Run**(与前端共享 TS 类型)。
- **D15** 当前**自用优先:Web + iPad(Safari)**;原生打包延后到商业化。
- **D16** 多机位数据层 day1 就支持;批量出图只是个按钮,非独立阶段。
- **D17** 配方已实测通过(Blender→Nano Banana 还原度高)。

## 架构速览

- **托管**:经典 Firebase Hosting(静态 SPA + CDN);**不是 App Hosting**。`/api/**` 用 rewrite 接 Cloud Run(同源免 CORS)。
- **数据/资产/登录**:Firestore(`Scene` 按 `ownerId`)+ Cloud Storage(glTF/截图/成图)+ Auth。
- **生成后端**:独立 Cloud Run(Node)调 Gemini,密钥只在服务端。
- **安全**:App Check + Security Rules(按归属隔离)。
- **关键风险**:R3F+Expo 原生有 expo-gl 冲突 → 只做 Web;iPad 上 OrbitControls 吃触摸事件 → 点选要专门处理;glTF 纹理不自动回收 → 删除要 `dispose()`。

## 已实现(代码,截至 2026-06-14)

**前端编辑器**(`apps/client`,Expo web + R3F + drei + zustand)—— 已跑通,typecheck + web 打包零告警:

- **数据驱动模型库** `packages/resource-library`:加模型 = 加 `models/<id>/meta.json` 后 `pnpm gen`;`ModelView` 按 `source.kind` 分发(`human` / `primitive` / `roomShell` / `outdoorShell` / `gltf`)。**catalog 现共 77 个模型**。
- **参数化人体** `editor/Mannequin.tsx` + `packages/resource-library/src/poses.ts`:身高/围度/肩/髋/头/发型/胸部参数;9 体型(含卫士/长者/高个女);**19 姿势**(站/走/跑/坐/席地/开车/跪/鞠躬/行礼/说话/讲解/倾听… 启用 spine/neck);**自动落地**(Box3 量最低点对齐 y=0)。
- **图元资产套件** `packages/resource-library/models/*/meta.json`:家具/装饰/宫殿古风/厨房/办公/商业/医疗/室外/车辆 等(盒子 + 单面薄片拼装,自包含可序列化)。
- **室内/室外环境** `editor/RoomShell.tsx` + `editor/OutdoorShell.tsx` + `editor/SceneLighting.tsx`:室内反向盒房间;室外引擎 = 大地面 + 顶点色渐变天空穹 + 远景剪影;`SceneLighting` 依当前环境在室内/室外光鬼间**自动切换**,主画布与预览/导出画布共用(WYSIWYG);上传参考照片时隐藏天空、保留地面。
- **场景预设** `packages/resource-library/src/scenes.ts`:**16 个**(卧室/客厅/教室/办公室/厨房/餐厅/咖啡馆/商店/诊所/会议室 + 室外街道/公园/宫殿庭院 + 车内 + 电梯 + 宫殿大殿);`loadScene` 一键载入,**多数自带已就位 + 已摆姿势的人物**(`Placement` 支持 `poseId`/`colorIndex`,`validateCatalog` 校验姿势名);房间/室外环境单例、不可选。
- **编辑交互** `editor/SceneView.tsx`:点选 + 地面光圈高亮;TransformControls 移动(锁地 XZ)/ 旋转(绕 Y)。状态在 `store/editorStore.ts`(modelId 驱动)。
- **分镜/机位系统** `editor/CameraRig.tsx`(消费 `store.cameraCmd`)+ `editor/panels/inspector/ShotStrip.tsx`:把当前取景(机位 + 画幅)**截存为分镜缩略图**(`captureShot`),点选回放/切换(`applyShot`);FOV/镜头档(`LensPicker`,超广角…超长焦)。**注意**:旧的相机电影预设(过肩/双人/仰/俯/特写)与 `camera.ts` 已在重构中移除。
- **取景预览窗** `editor/Preview.tsx` + `cameraSync.ts`:实时镜像主视图机位;画幅切换;**上传底图**(设为 scene.background,预览比例随照片);**下载导出** PNG(长边由设置 `exportLongEdge` 控制,默认 1920)。
- **设置面板** `store/settingsStore.ts`(localStorage 持久化):**BYOK** 填自己的 Gemini/Nano Banana Key、选模型、出图分辨率、默认画幅、语言。
- **三语 i18n** `apps/client/src/i18n`:en / zh-Hans(文案真相源)/ zh-Hant,缺键 TS 报错。
- **本地分享/扩展** `editor/sceneFile.ts` + `importModel.ts` + `splitModel.ts`:保存/读取场景 JSON,导入 glTF/GLB 并归一化为自包含 GLB data URL,可按顶层部件拆分导入模型。

**后端** `services/api`:Express + multer + firebase-admin + `@google/genai`;**`POST /api/generate` 已接通真实出图**(`services/gemini.ts` 调 `gemini-3.1-flash-image`,支持 BYOK `x-gemini-key`;`middleware/auth.ts` 用 Admin SDK 验 ID token,`SKIP_AUTH=1` 本地跳鉴权)。**仅剩** Cloud Storage 持久化是 TODO(现回 dataURL)。

**共享类型** `packages/shared-types`:Scene/Actor/Prop/**Shot**(原 `Camera`,含 `aspect`/`thumbnail`)/Asset/GenerateRequest。

### 关键技术坑 & 解法(改代码前必看)

- 旋转过 180° 跳回 → 选中 group 用 **Euler 顺序 `YXZ`**(Y 为首轴),读回/回写一致。
- 旋转/移动不保存 → TransformControls 用 **`onObjectChange`** 实时写回(不要只用 onMouseUp)。
- 手柄停在原点 → 选中对象 = **底部 group + `object={group}`**(回调 ref+state),手柄落脚底。
- iPad 首触拖动整页 → `body{position:fixed}` + canvas `touch-action:none`(`editor/webGlobalStyles.ts`)。
- iPad 双指缩放令工具栏消失 → 拦截 `gesturestart/change/end` + 双击。
- FOV:广角 = 大视场角、长焦 = 小视场角(别把 mm 当度数)。
- 性能:R3F `frameloop="demand"` 按需渲染;预览靠 `cameraSync` 跨 canvas 同步机位。

### 尚未实现(下一步)

- **Cloud Storage 持久化**:出图已端到端接通,但成图现以 dataURL 回显;上传到 Cloud Storage 返回真实 URL 仍 TODO。
- **Firebase 客户端接入**(Auth/Firestore/Storage,D13)未做:部署件(`firebase.json`/`firestore.rules`/`storage.rules`)+ 后端 Admin 鉴权已就绪,但客户端无 Firebase SDK,场景存档仍是本地 JSON。
- **角色一致性**(D5)、原生打包(D15)延后。

---

## 💰 成本 / 价格(自用量级)

> 数据 as of 2026-06-11,**易变,上线前务必复核**(见下"需复核")。

**核心结论:出图占账单约 99%。** 其余服务(Firestore / Storage / Hosting / Auth / App Check / Cloud Run 闲置 / Cloud Tasks)在自用量级**都落在免费额度内 ≈ $0**。

### 每张出图价格(@1024px)

| 模型                   | 别名                        | 单价/张            | 备注                |
| ---------------------- | --------------------------- | ------------------ | ------------------- |
| Gemini 3.1 Flash Image | **Nano Banana 2(当前默认)** | **~$0.067**        | 推荐主用            |
| Gemini 2.5 Flash Image | 旧版 Nano Banana            | ~$0.039            | **2026-10-02 停用** |
| Gemini 3 Pro Image     | Nano Banana Pro             | ~$0.134(4K ~$0.24) | 质量更高、更贵      |
| Imagen 4 Fast          | —                           | ~$0.02             | 备选最便宜          |

- 任何付费图像模型**无免费额度**;**批处理(batch)约半价**。
- 分辨率影响价格(3.1 Flash:512px $0.045 / 1K $0.067 / 2K $0.101 / 4K $0.151)。

### 自用月成本估算

假设:500 张/月 + 轻量 Firestore/Storage/Hosting + Cloud Run 闲置缩到零。

| 项                                                                         | 成本                                      |
| -------------------------------------------------------------------------- | ----------------------------------------- |
| 出图 500 张(3.1 Flash @$0.067)                                             | **~$33.5**                                |
| Firestore / Storage / Hosting / Auth / App Check / Cloud Run / Cloud Tasks | ~$0(均在免费额度)                         |
| **合计**                                                                   | **~$33/月**(区间 $20–67,取决于选哪个模型) |

### 拇指法则与控成本

- **月成本 ≈ 出图张数 × 每张价**。@$0.067:1000 张≈$67、5000 张≈$335。
- 省钱:默认用 **Flash 而非 Pro**;预览用低分辨率/便宜档;**缓存**相同"场景+prompt";能批处理就批处理(半价)。

### 需复核(最易变)

1. **模型命名与价格**变动快——2.5 Flash Image 将于 2026-10-02 停用;3.1 Flash 约 2026-02 上线。定稿前复核模型名与每张价。
2. **Vertex AI 区域端点定价** 2026-07-01 调整(若走 Vertex 而非 Developer API)。
3. Cloud Run 免费额度仅 Tier-1 区域;确认部署区域。

**来源**(均 2026-06-11 取):ai.google.dev/gemini-api/docs/pricing · cloud.google.com/vertex-ai/generative-ai/pricing · firebase.google.com/pricing · cloud.google.com/run/pricing · cloud.google.com/tasks/pricing
