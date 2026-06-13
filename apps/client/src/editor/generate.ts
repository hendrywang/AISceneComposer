import type { RenderStyle, GenerateResponse } from '@asc/shared-types';
import { previewControl } from './cameraSync';

const EXPORT_LONG_EDGE = 1920; // 与 PreviewDock 导出分辨率一致(长边 FHD)

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
  const longEdge = args.longEdge ?? EXPORT_LONG_EDGE;
  const capture = previewControl.capture;
  if (!capture) throw new Error('预览画布尚未就绪,请稍后再试');

  const dataUrl = capture(longEdge); // 同步:先于任何 await
  if (!dataUrl) throw new Error('取景截图失败');

  const blob = await dataUrlToBlob(dataUrl); // image/png

  const formData = new FormData();
  // 不要手动设 Content-Type:让浏览器自带 multipart boundary(匹配 multer single)。
  formData.append('blockingImage', blob, 'blocking.png');
  formData.append('prompt', args.prompt);
  formData.append('style', args.style);

  // 接入 Firebase Auth 后在此加:headers: { Authorization: `Bearer ${idToken}` }
  let resp: Response;
  try {
    resp = await fetch(`${API_BASE}/api/generate`, { method: 'POST', body: formData });
  } catch {
    throw new Error(`无法连接生成服务(${API_BASE})。本地需先启动后端:pnpm api`);
  }

  if (!resp.ok) {
    let msg = `生成失败(${resp.status})`;
    try {
      const body = (await resp.json()) as { error?: string };
      if (body?.error) msg = body.error;
    } catch {
      /* 非 JSON 响应,沿用状态码消息 */
    }
    throw new Error(msg);
  }

  const data = (await resp.json()) as GenerateResponse;
  if (!data?.imageUrl) throw new Error('服务端未返回图像');
  return data.imageUrl;
}
