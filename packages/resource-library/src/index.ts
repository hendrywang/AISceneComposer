// @asc/resource-library —— 纯数据的模型资源库(不依赖 React / three)。
// 渲染由前端 apps/client/src/editor 按 source.kind 消费这些数据。
export * from './types'; // 契约 + RW/RH/RD
export * from './poses'; // POSES + POSE_OPTIONS
export * from './scenes'; // SCENES(内置场景预设)
export * from './generated/catalog'; // CATALOG(由 `pnpm gen` 从 models/<id>/meta.json 生成)
export * from './catalog'; // getDef / modelDims / validateCatalog
