# 项目结构 / 脚手架设计

> 状态:草稿 v0.1
> 最后更新:2026-06-11
> 关联:主文档 [development-plan.md](./development-plan.md);任务见 [phase-1-tasks.md](./phase-1-tasks.md)
> 说明:本文档是**执行级设计**,照着即可初始化项目。本阶段只写文档,不实际建代码(用户确认)。依赖版本为 2026-06 当下值,搭脚手架时以官方最新为准。

---

## 目标平台(当前)

- **只做 Expo 的 web 构建**:桌面浏览器 + iPad Safari(D15)。
- **原生(iOS/Android)打包延后**:因 React Three Fiber 与 Expo 当前存在 `expo-gl` 版本冲突,原生构建会坏(见 Gotchas G1)。Web 路径不受影响。

## 为什么用 monorepo

前端(Expo)与后端(Cloud Run / Node)要**共享同一套 TypeScript 类型**(`Scene`/`Asset`/...,见主文档 §5),避免两处各写一遍、走样。采用 **pnpm workspace + Turborepo**,类型放在 `packages/shared-types`,前后端都依赖它。

## 目录树

```
ai-scene-composer/
├── pnpm-workspace.yaml            # packages: ["apps/*","packages/*","services/*"]
├── turbo.json                     # 构建/lint 流水线
├── package.json                   # 根 workspace
├── tsconfig.base.json             # 共享 TS 配置
├── docs/                          # 本套文档
│
├── apps/
│   └── client/                    # Expo 应用(web 构建)
│       ├── app.json
│       ├── metro.config.js        # 追加 .glb/.gltf 资源扩展名
│       ├── package.json
│       └── src/
│           ├── App.tsx
│           ├── editor/            # 3D 编辑器(场景、相机、摆放、点选)
│           │   ├── Canvas.tsx
│           │   ├── controls/      # OrbitControls + 触摸点选(见 G2)
│           │   ├── camera/        # 镜头预设(实时算位)
│           │   └── export/        # 渲染模式 + 截图导出
│           ├── assets/            # 资产库面板 + glTF 加载
│           ├── generate/          # 调后端、style 切换、结果展示
│           ├── firebase/          # JS SDK 初始化、Auth、Firestore、Storage
│           ├── store/             # zustand:scene/selection/camera 状态
│           └── ui/                # 通用 UI
│
├── packages/
│   └── shared-types/              # 前后端共享类型(raw .ts,无构建步)
│       ├── package.json           # exports: { ".": "./src/index.ts" }
│       └── src/
│           ├── scene.ts           # Scene / Actor / Prop / Camera
│           ├── asset.ts           # Asset
│           ├── generate.ts        # GenerateRequest
│           └── index.ts
│
└── services/
    └── api/                       # Cloud Run Node/TS 服务
        ├── Dockerfile
        ├── package.json
        ├── .env.example
        └── src/
            ├── index.ts           # Express 入口
            ├── routes/generate.ts # POST /generate -> Gemini
            ├── middleware/auth.ts # 校验 Firebase ID Token
            └── services/gemini.ts # 调 Nano Banana 2(Gemini 图像)
```

> `shared-types` 用 **TS project references** 被 `apps/client` 与 `services/api` 引用(`"references":[{"path":"../../packages/shared-types"}]`),不打包、直接引 `.ts` 源码,和 Expo/Metro 配合最省事。

## 实现状态

> ✅ 脚手架已搭建并验证(2026-06-11):monorepo 装好、三包 typecheck 通过、Expo web 打包成功(**零告警**)。下表为**实际锁定版本**。

## 依赖清单(分区)

| 区域 | 包 | 备注 |
|------|----|------|
| 核心 | `expo`(SDK 56)、`react@19.2`、`react-native@0.85`、`three@0.184` | Expo web;React/RN 跟随 SDK 对齐 |
| 3D(**web**) | `@react-three/fiber@9`、`@react-three/drei@10` | 主 3D 层;`frameloop="demand"` = 按需渲染,drei 提供 OrbitControls/Gizmo |
| Web | `react-native-web@0.21` | web 渲染 |
| 状态 | `zustand`(后续接入) | 编辑器场景/选中/相机 |
| 数据(客户端) | `firebase@12+`、`@react-native-async-storage/async-storage`(后续接入) | Auth/Firestore/Storage + 持久化 |
| 后端 | `express@5`、`firebase-admin@14`(**Node 20+**)、`@google/genai@2`、`multer@2` | Gen AI SDK 可走 Vertex AI 后端 |
| 工具 | `pnpm@9`、`turbo@2.9`、`typescript@6`、`tsx@4` | |
| 资产管线(devDep) | `@gltf-transform/cli`、`FBX2glTF` | 见 [asset-library.md](./asset-library.md) |

> **为何 3D 用 R3F+drei 而非 expo-three**:`expo-three@8.0.0` 已停更,peer 卡在 `three@^0.166 / react@^17 / RN@^0.64`,与 SDK 56 严重摩擦(安装/打包告警)。`@react-three/fiber@9 + @react-three/drei@10 + three@0.184` 为 React 19 同代设计,互相兼容、零告警,且自带按需渲染与 OrbitControls。expo-gl/expo-three 已移除;原生阶段再单独评估原生 3D 方案。

## 关键配置要点

- `pnpm-workspace.yaml`:声明 `apps/*`、`packages/*`、`services/*`。
- `metro.config.js`:把 `glb`、`gltf` 加进 `resolver.assetExts`,否则 Expo 不打包模型。
- `tsconfig`:根用 project references;`shared-types` 输出声明、被两端引用。
- 客户端 Firebase:`initializeApp` + `getAuth/getFirestore/getStorage`;Auth 持久化用 `getReactNativePersistence(AsyncStorage)`。
- 后端 Firebase:`admin.initializeApp()`(Cloud Run 自动取凭据);`Dockerfile` 基于 `node:20`。
- 模型生成:`services/api` 持有 Google 凭据/API key —— **绝不进客户端**。
- Cloud Storage 配 **CORS**,否则 Three.js 跨域加载 glTF 会被拦(见 G6)。

## 初始化命令清单(仅文档,供下一步执行)

```bash
# 1. monorepo 根
pnpm init && pnpm add -Dw turbo typescript eslint prettier

# 2. Expo 客户端
pnpm create expo-app apps/client --template blank-typescript
#    再装 three/@react-three/fiber/@react-three/drei/firebase/zustand 等

# 3. 共享类型
mkdir -p packages/shared-types/src    # 放 scene.ts/asset.ts/generate.ts

# 4. 后端
mkdir -p services/api/src             # express + firebase-admin + @google/genai
```

## Gotchas(已知坑,均来自调研)

| # | 坑 | 影响 | 对策 |
|---|----|------|------|
| G1 | **R3F 原生(`@react-three/fiber/native`)依赖 expo-gl,版本易冲突** | 原生 iOS/Android 构建坏 | 本阶段 R3F 走 **web**(不受影响);原生延后(D15),届时再评估原生 3D 方案 |
| G2 | **OrbitControls 吃触摸事件 → 射线点选失效** | iPad 上点不中物体 | 自定义触摸处理 / 分离 raycaster 与 OrbitControls 的事件;见 T2 |
| G3 | **iOS 模拟器 GLView 崩溃** | 无法用模拟器验证 | 必须真机 iPad 测试 |
| G4 | **GLTFLoader 纹理不自动回收** | 久用显存泄漏 | 删除物体时 `dispose()` 几何/材质/纹理 |
| G5 | **devicePixelRatio / 画布尺寸不匹配** | 触摸坐标→射线错位 | 画布 `逻辑×dpr`,CSS 缩回逻辑尺寸 |
| G6 | **Cloud Storage 跨域** | glTF/图片加载被 CORS 拦 | 配置 Storage CORS;`.glb` 内嵌纹理 |
| G7 | **Firebase JS SDK 在 RN 无 localStorage** | 登录态丢失 | `getReactNativePersistence(AsyncStorage)` |
| G8 | **iPad WebGL/WebGPU 显存上限** | 大场景 OOM | 资产低模 + 按需加载 + Draco 压缩;真机 profile |
