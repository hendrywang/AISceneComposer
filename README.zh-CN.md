# AI Scene Composer

[English](./README.md) | 简体中文

[![CI](https://github.com/hendrywang/AISceneComposer/actions/workflows/ci.yml/badge.svg)](https://github.com/hendrywang/AISceneComposer/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-20.x-339933?logo=node.js&logoColor=white)](./.nvmrc)

AI Scene Composer 是一个面向 AI 图片生成的轻量 3D「虚拟布景 / 分镜构图」工具。

它要解决的核心问题很具体：只用文字 prompt 生成图片时，角色位置、人物姿态、镜头角度、场景里细微的空间结构经常不可控。这个项目的思路是先用简单 3D 模型把参考图搭出来，再把这张参考图交给图像生成模型，让最终成片尽量保留你真正想要的构图关系。

基本流程：

1. 在 3D 编辑器里摆放彩色代理角色、道具和房间。
2. 像搭分镜或虚拟片场一样设置机位、视角和角色关系。
3. 导出一张干净的 blocking 参考图。
4. 把参考图交给 Google Gemini / Nano Banana 这类支持图像参考的生成模型。

> 当前状态：alpha。Web 编辑器、本地场景保存/读取、模型导入、资源库贡献流程已经可用；云端持久化和生产级生成链路还在建设中。

![AI Scene Composer 编辑器：网格舞台上摆放红蓝绿黄四个彩色代理角色，由合影机位取景，左侧是资源库与场景预设，配合变换工具、镜头预设与实时取景预览窗](./docs/assets/readme/editor.png)

## 为什么需要这个项目

AI 图像模型很强，但文字不是精确控制空间关系的好工具。

例如你写：

> 左边坐着一个小孩，中间站着一个高个女性并举起双手，右边两个人正在走路，广角电影镜头。

模型仍然可能把人物左右顺序弄错、姿势变掉、距离关系不稳定、镜头角度偏离，或者把背景结构画成完全不同的样子。

AI Scene Composer 把这些难以用文字稳定表达的空间控制交给 3D 层完成：

- 角色站在哪里，由 3D 位置决定。
- 谁高谁矮、谁坐着谁站着，在生成前就能看见。
- 镜头取景、FOV、角色相对大小可以显式调整。
- 图像模型只需要负责风格、细节、光影和真实质感。

## 示例

3D blocking 图故意做得很简单。它不是最终画面，而是一张「构图控制图」。

| 3D blocking 参考图                                                                        | 生成后的图片                                                                                |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| ![四个彩色代理角色组成的 3D blocking 参考图](./docs/assets/readme/blocking-reference.png) | ![根据 3D blocking 生成的末日雨景电影感图片](./docs/assets/readme/generated-result-01.jpeg) |

同一类 3D 参考关系，也可以通过不同 prompt / 风格生成另一种画面：

| 3D blocking 参考图                                                                         | 生成后的图片                                                                                 |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| ![第二张不同姿态关系的 3D blocking 参考图](./docs/assets/readme/blocking-reference-02.png) | ![另一张保留相似角色位置和构图关系的生成图片](./docs/assets/readme/generated-result-02.jpeg) |

关键点不在于 3D 小人本身是否好看，而在于最终生成图能更稳定地保留左/右关系、人物相对大小、姿态方向和机位构图。

## 功能

- **3D 虚拟布景编辑器**：摆放代理角色、道具和房间。
- **彩色身份角色**：用红、蓝、绿、黄等颜色区分角色，并在 prompt 中引用。
- **镜头系统**：保存机位、切换机位、调整 FOV、使用电影镜头预设。
- **干净导出**：导出无网格、无选中框、无 UI 控件的构图参考图。
- **本地场景文件**：保存和读取 JSON 场景快照。
- **glTF/GLB 导入**：运行时导入自己的模型，并可随场景文件保存。
- **模型拆分**：把导入的 glTF 模型按顶层部件拆开，方便单独移动或删除。
- **文件化资源库**：新增模型只需要新增 `models/<id>/meta.json`。
- **开源项目基础设施**：许可证、贡献指南、CI、lint、format、测试、资源署名都已配置。

## 它不是什么

- 不是完整的 3D 建模工具。
- 不是角色绑定、骨骼动画或 IK 系统。
- 不绑定单一图像模型；只要目标模型支持图像参考，就可以使用导出的 blocking 图。
- 还不是生产级 SaaS；Firebase 持久化、存储、队列、计费等能力仍在规划和开发中。

## 快速开始

要求：

- Node.js 20 或更高版本
- 通过 Corepack 使用 pnpm 9.15.3

```bash
corepack enable
corepack prepare pnpm@9.15.3 --activate
pnpm install
pnpm web
```

启动后打开终端输出的 Expo web 地址。

## 常用命令

```bash
pnpm gen                                  # 重新生成资源 catalog 和 CREDITS
pnpm web                                  # 启动 Web 编辑器
pnpm api                                  # 启动本地 API 骨架
pnpm build                                # 生成资源并构建/检查各包
pnpm build:web                            # 导出 Expo Web 构建
pnpm lint                                 # ESLint
pnpm test                                 # Node test runner + tsx
pnpm typecheck                            # Turbo TypeScript 检查
pnpm format:check                         # Prettier 格式检查
pnpm check                                # 本地完整门禁，等价于 CI 主流程
pnpm --filter @asc/resource-library check # 资源库一致性检查
```

## 仓库结构

```text
apps/client                 Expo web 编辑器：3D 场景、相机、导入/导出 UI
packages/resource-library   文件化模型资源库，也是最主要的贡献入口
packages/shared-types       前后端共享 TypeScript 类型
services/api                Cloud Run 风格 Node/TypeScript API 骨架
docs/                       架构、Firebase、资产管线、路线图文档
```

## 资源库

资源库是最适合社区贡献的部分：

```text
packages/resource-library/models/<asset-id>/meta.json
packages/resource-library/models/<asset-id>/model.glb
```

原则是「一个模型 = 一个文件夹」。修改模型元数据后需要运行 `pnpm gen`，并提交自动生成的 catalog 和许可署名文件。

详见 [packages/resource-library/README.md](./packages/resource-library/README.md) 和
[CONTRIBUTING.md](./CONTRIBUTING.md)。

## 架构

```text
3D 编辑器（Expo web + React Three Fiber）
        |
        | 干净的 blocking 参考图
        v
API 服务（Node / TypeScript，Cloud Run 风格）
        |
        | 图片 + prompt
        v
图像生成模型
```

编辑器保持轻量和本地优先。服务端负责模型 API 调用和密钥。长期计划是接入 Firebase Auth、Firestore 场景持久化、Cloud Storage 成图存储，以及可选的生成任务队列。

## 当前限制

- 生成 API 仍是骨架，还不是完整生产链路。
- 场景 JSON 如果内嵌用户导入模型，文件可能变大。
- 用户本地导入的模型只属于本地场景资产；除非许可证清楚，否则不要提交到仓库。
- 当前目标是 Web 和 iPad Safari，原生 iOS/Android 打包不是当前重点。

## 路线图

- 跑通端到端生成流程。
- 用 Firebase 持久化场景和生成图片。
- 给场景文件和导入资产增加更强的 schema 校验。
- 扩充 CC0 / 可再分发资源库。
- 沉淀写实和二次元风格 prompt 模板。
- 增加导出 blocking 图的视觉回归测试。

## 贡献

最容易参与的方式是给资源库添加干净、可再分发的模型资产。

提交 PR 前请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)。资产许可会严格审核：优先 CC0；需要署名的资产必须写清楚 attribution；来源不明或不可再分发的资产不要提交。

## 许可证

代码使用 Apache License 2.0。见 [LICENSE](./LICENSE) 和 [NOTICE](./NOTICE)。

3D 资产可能有各自许可证。资产级许可信息位于 `packages/resource-library/models/*/meta.json`，自动汇总见
[packages/resource-library/CREDITS.md](./packages/resource-library/CREDITS.md)。

不要默认认为所有模型资产都和仓库代码使用同一个许可证。

## 安全

如需报告安全问题，请不要公开发 issue。见 [SECURITY.md](./SECURITY.md)。

## 文档

- [项目结构](./docs/project-structure.md)
- [开发计划](./docs/development-plan.md)
- [阶段 1 任务](./docs/phase-1-tasks.md)
- [资源库说明](./docs/asset-library.md)
- [Firebase 架构](./docs/firebase-architecture.md)
- [部署指南](./docs/deployment.md)
- [开源发布指南](./docs/open-source-release.md)
