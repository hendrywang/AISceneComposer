# AI Scene Composer

轻量 3D「虚拟布景/分镜」工具:摆低模代理角色/道具/房间、设机位 → 导出干净截图 → 交给 Google Nano Banana 2(Gemini 图像)生成成品图。

> 项目总览与成本见 `.claude/skills/ai-scene-composer/SKILL.md`;详细文档见 [`docs/`](./docs)。

## 仓库结构(monorepo, pnpm + Turborepo)

```
apps/client          Expo 应用(web 构建:桌面 + iPad Safari)
packages/shared-types 前后端共享 TS 类型(Scene/Asset/...)
services/api         Cloud Run Node/TS 服务(调 Gemini)
docs/                项目文档
```

## 常用命令

```bash
pnpm install         # 安装全部依赖
pnpm web             # 启动客户端(web)
pnpm api             # 启动后端(本地)
pnpm typecheck       # 全量类型检查
```

详见 [docs/project-structure.md](./docs/project-structure.md) 与 [docs/phase-1-tasks.md](./docs/phase-1-tasks.md)。
