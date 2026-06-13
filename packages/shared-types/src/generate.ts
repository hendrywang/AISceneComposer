/**
 * 生成请求/响应 —— 客户端 → 后端 → Nano Banana 2。
 * 布景截图(blockingImage)以 multipart 文件单独上传,不放进 JSON;
 * 此处描述随附的 JSON 字段。
 */

/** 画风:生成时的风格切换(D10),决定 prompt 风格段 */
export type RenderStyle = 'realistic' | 'anime';

export interface GenerateRequest {
  prompt: string;
  style: RenderStyle;
  /** 可选:覆盖默认模型(如 'gemini-3.1-flash-image') */
  model?: string;
  // 角色一致性阶段(D5)再加:referenceImageUrls?: string[];
}

export interface GenerateResponse {
  /** 成图在 Cloud Storage 的可访问 URL */
  imageUrl: string;
  createdAt: number;
}

/** 一个可用出图模型(客户端用用户自带 Key 直接从 Google 列出) */
export interface ModelInfo {
  /** 模型 id(去掉 models/ 前缀),用于 generateContent 的 model 字段 */
  id: string;
  /** 展示名(Google 的 displayName,缺省回退到 id) */
  label: string;
}
