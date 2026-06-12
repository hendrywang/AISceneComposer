# 贡献指南

感谢参与 AI Scene Composer！最常见也最受欢迎的贡献是**给资源库加模型**。

## 开发环境

```bash
pnpm install
pnpm web          # 启动 Web 编辑器(会先自动跑资源库 gen)
pnpm typecheck    # 全仓类型检查
```

## 加一个 3D 模型(最常见)

模型库在 [`packages/resource-library`](packages/resource-library/README.md),范式是**一个模型 = 一个文件夹**:

1. 在 `packages/resource-library/models/<你的-id>/` 新建文件夹。
2. 放一个 `meta.json`(照抄 `models/_template/`);真实模型再放一个纹理内嵌的 `model.glb`。
3. 跑 `pnpm gen`,模型自动进库面板。
4. 跑校验,然后发 PR:

```bash
pnpm gen
pnpm --filter @asc/resource-library typecheck
pnpm --filter @asc/resource-library check
```

详细字段、四种 `source.kind`、姿势/场景的加法,见 **[资源库 README](packages/resource-library/README.md)**。

## 许可红线(务必遵守)

- 真实 glTF 资产 `meta.json` **必须带 `license`**(校验会拦截缺失)。
- **优先 CC0**(如 Kenney);CC-BY 需在 `attribution` 写清署名;来源不明 / 禁再分发的素材**不要提交**。
- 许可信息会自动汇总进 `packages/resource-library/CREDITS.md`。
- 用 `.glb`(纹理内嵌),不要 `.gltf` + 外部贴图(路径易断)。

## PR 约定

- 一个模型 / 一个主题 = 一个 PR,保持小而聚焦。
- 提交前确保 `pnpm typecheck` 与资源库 `check` 通过。
- 改了 `meta.json` 一定要跑 `pnpm gen` 并把 `src/generated/catalog.ts` 一并提交。
