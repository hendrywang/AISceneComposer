// Expo monorepo 配置:监听 workspace 根、解析两处 node_modules、支持 glTF 资源
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// glTF 模型作为资源打包
config.resolver.assetExts.push('glb', 'gltf');

module.exports = config;
