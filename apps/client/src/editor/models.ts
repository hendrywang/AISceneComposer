import type { ModelInfo } from '@asc/shared-types';
import { useSettings } from '../store/settingsStore';
import i18n from '../i18n';

// 直接问 Google 的 Gemini REST —— BYOK:用用户自己的 Key,浏览器可跨域直连(已验证 CORS),
// 无需自有后端在跑。出图仍走后端(那是另一条链路)。
const GEMINI_MODELS_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface RawModel {
  name?: string;
  displayName?: string;
  supportedGenerationMethods?: string[];
}

/**
 * 用当前设置里的 Key 直接向 Google 校验并读取可用出图模型。
 * 筛 gemini 图像族(name 含 image 且支持 generateContent),与出图链路一致;Imagen(predict)不收。
 * 无 Key / 连接失败 / Key 无效都会抛出可读错误(供「验证」按钮展示)。
 */
export async function fetchAvailableModels(): Promise<ModelInfo[]> {
  const { geminiApiKey } = useSettings.getState();
  if (!geminiApiKey) throw new Error(i18n.t('settings.needKey'));

  let resp: Response;
  try {
    resp = await fetch(`${GEMINI_MODELS_URL}?pageSize=1000`, {
      headers: { 'x-goog-api-key': geminiApiKey },
    });
  } catch {
    throw new Error(i18n.t('errors.cannotReachGoogle'));
  }

  if (!resp.ok) {
    // Google 错误体:{ error: { message, status } }
    let msg = i18n.t('errors.genFailedStatus', { status: resp.status });
    try {
      const body = (await resp.json()) as { error?: { message?: string } };
      if (body?.error?.message) msg = body.error.message;
    } catch {
      /* 非 JSON 响应,沿用状态码消息 */
    }
    throw new Error(msg);
  }

  const data = (await resp.json()) as { models?: RawModel[] };
  const out: ModelInfo[] = [];
  for (const m of data.models ?? []) {
    const id = (m.name ?? '').replace(/^models\//, '');
    if (!id || !id.includes('image')) continue;
    const methods = m.supportedGenerationMethods ?? [];
    if (methods.length === 0 || methods.includes('generateContent')) {
      out.push({ id, label: m.displayName || id });
    }
  }
  out.sort((a, b) => b.id.localeCompare(a.id)); // 新版本在前
  return out;
}
