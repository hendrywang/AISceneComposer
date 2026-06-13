import type { RenderStyle, GenerateResponse } from '@asc/shared-types';
import { previewControl } from './cameraSync';
import { useSettings } from '../store/settingsStore';
import i18n from '../i18n';

// 必须写成完整静态成员表达式 —— Expo 在 web 构建时按字面量内联 EXPO_PUBLIC_*(禁止解构)。
const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export interface GenerateArgs {
  prompt: string;
  style: RenderStyle;
  /** 覆盖取景分辨率(测试/无头用) */
  longEdge?: number;
}

/** data URL → Blob:web 下 fetch 接受 data: 协议并产出带类型的 Blob。 */
async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

/**
 * 取当前取景帧(已合成背景的 PNG)→ multipart POST 到 /api/generate → 返回成图 URL。
 * 注意:capture() 同步改写共享预览画布,必须在任何 await 之前调用、立即拿到 dataUrl。
 */
export async function generateFromPreview(args: GenerateArgs): Promise<string> {
  const { geminiApiKey, model, outputResolution } = useSettings.getState();
  const longEdge = args.longEdge ?? Number(outputResolution);
  const capture = previewControl.capture;
  if (!capture) throw new Error(i18n.t('errors.previewNotReady'));

  const dataUrl = capture(longEdge); // 同步:先于任何 await
  if (!dataUrl) throw new Error(i18n.t('errors.captureFailed'));

  const blob = await dataUrlToBlob(dataUrl); // image/png

  const formData = new FormData();
  // 不要手动设 Content-Type:让浏览器自带 multipart boundary(匹配 multer single)。
  formData.append('blockingImage', blob, 'blocking.png');
  formData.append('prompt', args.prompt);
  formData.append('style', args.style);
  formData.append('model', model);

  // BYOK:有 Key 才带 x-gemini-key 头(留空则让后端回退到 env Key)。
  // 接入 Firebase Auth 后在此加:Authorization: `Bearer ${idToken}`
  const headers: Record<string, string> = {};
  if (geminiApiKey) headers['x-gemini-key'] = geminiApiKey;

  let resp: Response;
  try {
    resp = await fetch(`${API_BASE}/api/generate`, { method: 'POST', headers, body: formData });
  } catch {
    throw new Error(i18n.t('errors.cannotConnect', { base: API_BASE }));
  }

  if (!resp.ok) {
    let msg = i18n.t('errors.genFailedStatus', { status: resp.status });
    try {
      const body = (await resp.json()) as { error?: string };
      if (body?.error) msg = body.error;
    } catch {
      /* 非 JSON 响应,沿用状态码消息 */
    }
    throw new Error(msg);
  }

  const data = (await resp.json()) as GenerateResponse;
  if (!data?.imageUrl) throw new Error(i18n.t('errors.serverNoImage'));
  return data.imageUrl;
}
