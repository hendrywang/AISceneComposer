import type { RenderStyle } from '@asc/shared-types';

export interface GenerateImageInput {
  blockingImage: Buffer;
  prompt: string;
  style: RenderStyle;
}

export interface GenerateImageOutput {
  dataUrl: string;
  mimeType: string;
}

/** 画风段(D10):同套代理资产,风格差异体现在 prompt */
const STYLE_PROMPT: Record<RenderStyle, string> = {
  realistic: 'cinematic photoreal, 35mm, natural lighting',
  anime: 'anime illustration, clean cel shading',
};

const DEFAULT_MODEL = process.env.GEMINI_IMAGE_MODEL ?? 'gemini-3.1-flash-image';

/**
 * 调 Nano Banana 2(Gemini 图像)。骨架实现:
 * 配置 GEMINI_API_KEY 后接通;否则抛错提示。
 * 响应解析以官方 @google/genai SDK 实际结构为准。
 */
export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 未配置 —— 配置后接通 Nano Banana 2(见 services/api/.env.example)');
  }

  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey });

  const fullPrompt = `${input.prompt}\n\nStyle: ${STYLE_PROMPT[input.style]}`;

  const result = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: [
      {
        role: 'user',
        parts: [
          { text: fullPrompt },
          {
            inlineData: {
              mimeType: 'image/webp',
              data: input.blockingImage.toString('base64'),
            },
          },
        ],
      },
    ],
  });

  const parts = result.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inlineData?.data);
  if (!imgPart?.inlineData?.data) {
    throw new Error('模型未返回图像');
  }
  const mimeType = imgPart.inlineData.mimeType ?? 'image/png';
  return {
    mimeType,
    dataUrl: `data:${mimeType};base64,${imgPart.inlineData.data}`,
  };
}
