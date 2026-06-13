import { Router } from 'express';
import multer from 'multer';
import type { GenerateResponse, RenderStyle } from '@asc/shared-types';
import { verifyAuth } from '../middleware/auth';
import { generateImage } from '../services/gemini';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export interface GenerateDeps {
  generateImage: typeof generateImage;
}

/**
 * 构造 /api/generate 路由。
 * 工厂形态:默认注入真实 generateImage;测试可注入桩,避免真打 Gemini。
 *
 * POST /
 * multipart/form-data:blockingImage(文件)+ prompt + style
 */
export function makeGenerateRouter(deps: GenerateDeps = { generateImage }): Router {
  const router = Router();

  router.post('/', verifyAuth, upload.single('blockingImage'), async (req, res) => {
    try {
      const prompt = String(req.body.prompt ?? '');
      const style = (req.body.style as RenderStyle) ?? 'realistic';
      const file = req.file;

      if (!file?.buffer) return res.status(400).json({ error: 'blockingImage (file) is required' });
      if (!prompt) return res.status(400).json({ error: 'prompt is required' });
      if (!file.mimetype || !file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'blockingImage must be an image' });
      }

      const image = await deps.generateImage({
        blockingImage: file.buffer,
        mimeType: file.mimetype,
        prompt,
        style,
      });

      // TODO(M1.4):把 image 上传到 Cloud Storage,返回真实 URL;现阶段先回 data URL
      const response: GenerateResponse = {
        imageUrl: image.dataUrl,
        createdAt: Date.now(),
      };
      res.json(response);
    } catch (err) {
      console.error('[generate] error', err);
      res.status(500).json({ error: (err as Error).message ?? 'generation failed' });
    }
  });

  return router;
}

export const generateRouter = makeGenerateRouter();
