# AI Scene Composer — 开发文档

> 状态:**v1.0 — 决策已全部锁定(D1–D17,Q1–Q9 全部 ✅)**
> 最后更新:2026-06-11
> 用途:作为项目的单一事实来源(source of truth)。本文档先一起过一遍、逐条确认后,再进入开发。

---

## 1. 项目概述

### 1.1 要解决的问题

用 AI 直接生成图片时,**场景、角色、背景的空间关系很难控制**,基本是随机的:

- 纯文字 prompt 是很弱的空间信号,模型无法把"左/右/谁看着谁/什么机位"可靠地绑定到具体像素。
- 想要"精准还原 / 精准控制"角色之间的关系和摄像机角度,光靠文字做不到。

### 1.2 核心思路

**先用轻量 3D 搭出"布景示意图",再交给 AI 渲染成成品。**

> 用户在 3D 里摆好角色、道具、房间,设定摄像机角度 → 导出一张干净的布景截图 → 连同 prompt 一起交给 **Google Nano Banana 2(Gemini 图像模型)** → 出图。

几何关系(谁在哪、什么姿势、什么机位)由用户精确控制;纹理、光影、风格、写实细节交给 AI。两件事各做各擅长的。

### 1.3 产品定位

**这不是 3D 建模工具,而是一个「虚拟布景 / 分镜机位」工具** —— 数字版的"摆人偶 + 架摄像机"。

心智模型对了,范围就小了:不需要建模、雕刻、骨骼动画,只需要**摆积木 + 转相机 + 截图**。

### 1.4 关键简化:因为用 Nano Banana 2,可以砍掉一大半技术栈

Nano Banana 2 是强多模态模型,能直接"看懂"一张参考图的构图和机位。因此:

- **不需要** ControlNet / 深度图 / 法线图 / 分割图那套硬约束管线(那是给 Stable Diffusion / FLUX 用的)。
- **不需要** ComfyUI 之类的生成后端。
- 前端只需导出**一张干净、可读的 3D 布景截图** + prompt 即可。

前端因此从"要做 GPU 多通道渲染的 3D 引擎"降级为"轻量 3D 编辑器",Three.js 绰绰有余。

---

## 2. 核心设计决策(已确定)

| # | 决策 | 结论 | 备注 |
|---|------|------|------|
| D1 | 控制方式 | 3D 布景截图 + prompt → Nano Banana 2 | 放弃纯文字控制 |
| D2 | 生成模型 | Google Nano Banana 2(Gemini 图像) | 已验证效果好 |
| D3 | 是否用 ControlNet/深度图管线 | **否** | 模型能直接读参考图 |
| D4 | 角色姿势 | **预设几种固定姿势即可,不做 IK/骨骼** | 每个姿势 = 一个静态 glTF |
| D5 | 角色一致性 | **MVP 先不做,延后**,后续交给 Nano Banana(多图条件)解决 | 数据结构预留 `referenceImages` 字段 |
| D6 | 预设资产规模 | 几十 ~ 100 个(角色 / 道具 / 场景)即可 | 生成时还能再控制细节 |
| D7 | 产品核心 | **摄像机 / 镜头系统**(角色关系靠机位表达) | 重点打磨 |
| D8 | 客户端策略 | 客户端做薄,后端做厚 | API key 不能进客户端 |
| D9 | 上线顺序 | **Web 先行**,验证闭环后再铺三端 | 见路线图 |
| D10 | 画风 | **写实 + 二次元都支持**,作为生成时的风格切换 | 见 §4.2;几乎不增加资产成本 |
| D11 | 资产来源 | **免费库起步**(Mixamo + Kenney / Poly Haven) | 见 §6.2 |
| D12 | 前端框架 | **Expo (RN + react-native-web) + Three.js** | 见 §3.2 |
| D13 | 账号体系 | **MVP 即用 Firebase 全家桶**:Auth + Firestore + Cloud Storage | 见 §3.3 |
| D14 | 后端语言 | **Node + TypeScript**,跑在 Firebase Cloud Run | 与前端共享 TS 类型;Firebase Admin SDK 一等支持 |
| D15 | 目标平台(当前) | **自用优先:Web + iPad**(Safari 跑 Expo web 构建);Android / 原生三端打包延后到商业化 | 见 §3.2、§8 |
| D16 | 多机位 | 多机位**数据层 day 1 就支持**(`cameras[]`);"一键批量出图"只是个按钮,非独立阶段 | 见 §6.1 |
| D17 | 配方验证 | **✅ 已实测通过**:Blender 摆造型 → Nano Banana 还原度高、人物位置完全保留 | 最大风险点已退役 |

---

## 3. 系统架构

### 3.1 整体架构

```
[Web]   [Android]   [iOS]          ← 薄壳:共享 TS 3D 核心 + 各自 UI
   \        |        /                只做:搭场景 → 导出截图 → 展示结果
    \       |       /
     [ 后端 / BFF ]                  ← 鉴权、任务队列、缓存、计费、内容审核
        |          \                    独占生成链路(API key 在这里)
   [Nano Banana 2]  [对象存储 + CDN]
   (Gemini Image API)
```

**核心原则:**
- 三个客户端只干三件事:**搭 3D 场景 → 导出示意图 → 展示结果**。
- 所有重活(调 Google API、存图、计费、限流、审核)放后端。
- 真正的性能瓶颈在**网络与生成链路**,不在客户端 GPU(本地 3D 是低模代理,很轻)。

### 3.2 跨端框架选型

| 方案 | 三端复用 | 移动端 3D 体感 | 适合 |
|------|---------|---------------|------|
| **Expo (RN + react-native-web) + Three.js(expo-gl)** ⭐ 主推 | 高 | 好(3D 跑在原生 GL 上下文,非 WebView) | 默认选择 |
| Capacitor + Web Three.js | 最高 | 一般(3D 在 WebView 里) | 纯 Web 团队、3D 极轻 |
| Unity / Godot | 中 | 最好 | 需主机级流畅度;包体大、要游戏引擎技能 |

**✅ 已定:Expo + Three.js(D12)**。一套 TypeScript,Web 走 WebGL、移动端跑原生 GL、UI 用 React 三端共享。复用率与移动端手感平衡最好。
> 自用阶段(D15):直接用 **Expo 的 web 构建**,桌面浏览器 + iPad Safari 都能跑,无需原生打包;等商业化再出 App Store / Android 包,代码不重写。

### 3.3 推荐技术栈(顺 Google 生态)

| 层 | 选型 |
|----|------|
| 前端 / 3D | Expo (RN + react-native-web) + Three.js(`expo-gl` / `expo-three`) |
| 鉴权 / 存储 / 数据库 | **✅ Firebase 全家桶(D13)**:Auth(登录)+ Firestore(场景文档/项目数据)+ Cloud Storage(资产、截图、成图),三端原生 SDK |
| 后端逻辑 / 调模型 | **Cloud Run + Node/TypeScript(D14)** 调 Vertex AI / Gemini Image API |
| 任务队列 | Cloud Tasks |
| 图片分发 | Cloud Storage + Cloud CDN |

理由:Firebase 把"三端鉴权 + 存储 + 实时同步"几乎包圆,后端只需写一个"接收截图 → 调 Nano Banana → 存结果"的薄服务,且与 Google 图像模型同生态,鉴权和延迟都顺。

---

## 4. 核心流程:布景 → 生成

这是产品命门,**应在第 1 周独立验证(见路线图阶段 0)**。

### 4.1 截图规范(示意图)

- 编辑器视图里有网格、gizmo、选中高亮;**导出时切到"渲染模式"**:隐藏所有辅助元素。
- 角色按"身份纯色"渲染(红/蓝/绿…),便于在 prompt 里映射"哪个颜色是谁"。
  - 具体风格(纯色块 / 灰模 clay / 带文字标签)由阶段 0 验证后锁定。
- 离屏渲染成固定尺寸(如 1024×1024 或 16:9),压成 **WebP** 再上传。

### 4.2 Prompt 模板(待阶段 0 调优)

```
[场景描述] + [颜色→角色映射] + [在发生什么/关系] + [风格&光线] + [镜头说明]
```

示例:
> "A cozy bedroom. The red figure is a young woman standing, looking down.
> The blue figure is a man sitting on the bed, looking up at her.
> Tense conversation, warm evening light, cinematic. Low-angle shot, 35mm."

待验证:文字里补一句镜头说明("low-angle shot")是否有帮助,还是光靠截图模型就懂。

**画风作为生成时的风格切换(D10):** 同一套 3D 代理资产同时服务写实和二次元 —— 因为资产只是被 Nano Banana 重渲染的代理体,风格差异完全体现在 prompt 的风格段(如 `cinematic photoreal, 35mm` vs `anime illustration, cel shading`)。因此"两者都支持"几乎不增加资产成本,只需在阶段 0 各验证一套风格 prompt 配方。

### 4.3 生成请求

```typescript
// 发给后端 → Nano Banana 2
interface GenerateRequest {
  blockingImage: Blob;        // 离屏渲染的布景截图,WebP
  prompt: string;
  style: 'realistic' | 'anime';   // 画风切换(D10),决定 prompt 风格段
  // 一致性阶段再加:referenceImages?: Blob[];
}
```

---

## 5. 数据结构

整个场景是一份 JSON 文档:前端编辑它、后端拿它生成截图、未来云端同步也用它。

```typescript
// ── 场景文档(用户编辑的核心对象)──
interface Scene {
  id: string;
  ownerId: string;                           // Firebase Auth uid(D13),用于数据隔离
  name: string;
  environment: { assetId: string };          // 房间/场景预设
  actors: Actor[];
  props: Prop[];
  cameras: Camera[];                          // 一个场景存多个机位(杀手级功能)
  activeCameraId: string;
  createdAt: number; updatedAt: number;
}

interface Actor {
  id: string;
  assetId: string;
  poseId: string;                            // 选中的固定姿势
  position: [number, number, number];
  rotationY: number;                         // 只需绕地面轴转向
  idColor: string;                           // 身份纯色:截图区分 + prompt 映射
  label?: string;                            // "Anna"、"男主"…写进 prompt
}

interface Prop {
  id: string; assetId: string;
  position: [number, number, number];
  rotationY: number; scale: number;
}

interface Camera {
  id: string; name: string;                  // "过肩-1"、"仰拍"
  position: [number, number, number];
  target: [number, number, number];          // look-at 点
  fov: number;
  preset?: CameraPreset;                      // 'ots'|'two-shot'|'low'|'high'|'dutch'|'closeup'
}
```

```typescript
// ── 资产库(CDN 上的预设,前端按需加载)──
interface Asset {
  id: string;
  type: 'character' | 'prop' | 'environment';
  name: string;
  thumbnailUrl: string;                       // 库面板缩略图
  modelUrl?: string;                          // prop/environment 的 glTF
  poses?: { id: string; name: string; modelUrl: string }[];  // 角色:每姿势一个静态 glTF
  defaultScale: number;
}
```

**扩展性设计:**
- 加新姿势 = 往 `poses` 数组塞一条。
- 加角色一致性 = 给 `GenerateRequest` 加 `referenceImages` 字段。
- 都不动主干。

**存储映射(Firebase 全家桶,D13):**
- `Scene` 文档存 **Firestore**,按 `ownerId` 做用户数据隔离(安全规则)。
- 资产 glTF / 缩略图、布景截图、AI 成图存 **Cloud Storage**,文档里只存 URL 引用。
- 登录用 **Firebase Auth**,三端共用同一套账号。

---

## 6. 前端编辑器设计

### 6.1 镜头系统(产品核心,重点打磨)

角色关系靠机位表达,镜头不能只给 orbit:

- **电影镜头语言预设**:过肩(OTS)、双人镜(two-shot)、仰拍、俯拍、斜角(Dutch)、特写、大远景 —— 点一下相机自动摆好。
- **FOV 可调**:广角夸张透视、长焦压缩空间,直接决定角色间的视角关系。最容易被忽略但效果差异最大的旋钮。
- **"看向目标"模式**:相机始终框住选中角色。
- **一个场景存多个机位**:数据层 day 1 就支持(`cameras[]`),"加机位"零成本。在此之上,"一键对所有机位批量出图"只是一个按钮(循环渲染 N 张截图 → 提交 N 个生成任务),**不是独立开发阶段(D16)**。同一布景多角度出图,对讲故事/漫画是杀手级功能。
- 实现:`CameraPreset` 不存死坐标,而是**根据选中角色实时计算**相机位置/朝向(如"过肩"= 站在 A 身后看向 B),换了摆位点一下就重新就位。

### 6.2 资产库

- 100 个资产足够,分三类:角色 / 道具 / 场景(房间)。
- **资产只是"代理体"**,会被 Nano Banana 重渲染 → **不做精模**,重点是比例对、轮廓清晰、身份可区分。
- 角色:每个角色配 3–5 个固定姿势(站/坐/靠),每姿势一个静态 glTF。
- **身份用纯色区分**,prompt 里写"红色的人是 Anna"。
- 来源(待定,见 Q3):人物 Mixamo,道具/房间 Kenney / Poly Haven / Sketchfab 低模。

### 6.3 编辑 vs 渲染两种模式

- 编辑模式:网格、gizmo、选中高亮、操作辅助。
- 渲染模式:隐藏全部辅助 + 身份纯色 + 固定尺寸离屏渲染 → 导出截图。

### 6.4 基本交互(MVP)

- 从库面板拖入资产到场景。
- 选中后:移动(贴地)、绕 Y 轴旋转、删除。
- 切换/新建相机,调 FOV,套用镜头预设。
- 一键"生成":导出截图 → 发后端 → 展示结果。

---

## 7. 性能优化

### 7.1 客户端 3D(让编辑器跟手)
- **按需渲染**:仅在用户操作时重绘,不要常驻 rAF 死循环(编辑器最大省电/省性能技巧)。
- GPU 实例化处理重复物体;模型 Draco/meshopt 压缩,贴图 KTX2/Basis。
- 优先 WebGPU(iOS 26 / 新版 Android Chrome 已支持),降级 WebGL2。
- 资产按需懒加载。

### 7.2 生成链路(用户感知的"快慢")
- 截图压成 WebP/JPEG 再上传,别传原始 PNG。
- 生成走**异步任务队列**:提交 job → 立刻返回 → WebSocket/SSE 或轮询拿进度;绝不让移动端 hang 在长 HTTP 请求上。
- **乐观 UI + 渐进式预览**:先出低分辨率快图占位,再替换终图。
- **缓存**:相同场景+prompt 命中缓存直接返回。
- 结果存对象存储 + CDN,移动端就近拉取。

### 7.3 后端 / 基础设施
- 一套后端服务三端共用(BFF)。
- 鉴权用跨端 SDK(Firebase Auth)。

---

## 8. 开发路线图(按最省时间排序)

| 阶段 | 时间 | 做什么 | 目的 / 为什么这个顺序 |
|------|------|--------|----------------------|
| **0. 配方验证** | ✅ 已完成 | 用户已用 Blender 摆造型 → Nano Banana 出图,**还原度高、人物位置完全保留**(室内场景已验证)。核心假设成立。剩余收尾(锁定截图风格 + 写实/二次元两套 prompt)并入阶段 1 | 最大风险点已退役 |
| **1. 最小编辑器 + Firebase** | 第 2–4 周 | Three.js 载入 5–10 个资产,摆放/旋转/贴地,一个相机带 orbit + 几个镜头预设,一键截图 → 后端 → 出图。接入 **Firebase Auth + Firestore + Storage**(登录、存场景、存图)。**只做 Web** | Web 单端跑通闭环最快,验证产品成立 |
| **2. 内容与打磨** | 之后 | 扩到 100 个资产、补全镜头预设、多机位批量出图 | 内容铺量,可持续做 |
| **3. 角色一致性** | 之后 | 给生成请求加角色参考图,交给 Nano Banana 处理跨场景一致 | D5,延后项 |
| **4. 原生打包(延后)** | 商业化时 | Expo 一套码出 iOS/Android 原生包。自用阶段不做——Web 构建已覆盖桌面 + iPad Safari(D15) | 自用阶段不需要;商业化再铺 |

### 阶段 0 成功判据 — ✅ 已通过
用户实测:Blender 摆简单造型 → Nano Banana 出图,**还原度高、人物位置完全保留**(室内场景)。核心假设成立,直接进阶段 1。
剩余收尾(可在阶段 1 顺手做):① 锁定导出截图的统一风格;② 沉淀写实 / 二次元两套 prompt 模板;③ 试多机位是否各自忠实。

---

## 9. 待确认事项(评审时逐条过)

| # | 问题 | 影响 | 结论 |
|---|------|------|----------|
| Q1 | 目标画风偏写实还是二次元/插画? | 资产风格、prompt 模板 | ✅ 已定:两者都支持,生成时切换(D10) |
| Q3 | 资产来源? | 内容成本、风格统一 | ✅ 已定:免费库起步(D11) |
| Q5 | 前端选 Expo 还是 Capacitor? | 团队技术背景 | ✅ 已定:Expo(D12) |
| Q6 | MVP 是否需要登录体系? | 后端复杂度 | ✅ 已定:用 Firebase 全家桶(D13) |
| Q2 | 阶段 0 配方验证 | 验证效率 | ✅ 已完成:用户已用 Blender 实测,还原度高(D17) |
| Q4 | 后端语言 | 开发效率 | ✅ 已定:Node + TS on Cloud Run(D14) |
| Q7 | 首批资产做多少个 | 阶段 1 工作量 | ✅ 已定:5–10 个起步 |
| Q8 | 商业化 / 计费 | 后端设计 | ✅ 已定:自用优先,暂不商业化(D15) |
| Q9 | 多机位批量出图 | 阶段范围 | ✅ 已定:数据层 day1,批量出图是按钮非阶段(D16) |

---

## 10. 配套文档

本文档是总纲;以下三份子文档承接细节,均从本文档派生:

| 文档 | 内容 | 何时看 |
|------|------|--------|
| [phase-1-tasks.md](./phase-1-tasks.md) | 阶段 1(最小编辑器 + Firebase)的任务拆解,带验收标准与里程碑 | 进入开发、排期、验收时 |
| [project-structure.md](./project-structure.md) | 项目结构/脚手架设计:monorepo 目录树、依赖清单、关键配置、初始化命令、已知坑 | 搭脚手架、配环境时 |
| [firebase-architecture.md](./firebase-architecture.md) | Firebase 架构:托管选型(经典 Hosting vs App Hosting)、产品映射、请求流、rewrite→Cloud Run、安全规则 | 配 Firebase、接后端时 |
| [asset-library.md](./asset-library.md) | 资产清单、制作管线(FBX→glTF→Firebase)、许可策略、命名约定 | 备资产、做内容时 |

---

## 附:术语

- **示意图 / 布景截图(blocking image)**:从 3D 编辑器导出的、喂给 AI 的构图参考图。
- **代理体(proxy)**:低模占位资产,只为表达位置/姿势/轮廓,不追求精度。
- **Nano Banana 2**:Google 的 Gemini 图像生成/编辑模型(本项目的生成引擎)。
- **镜头预设(camera preset)**:基于选中角色实时计算机位的电影镜头模板。
