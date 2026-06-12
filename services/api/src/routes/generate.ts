import { Router } from 'express';
import multer from 'multer';
import type { GenerateResponse, RenderStyle } from '@asc/shared-types';
import { verifyAuth } from '../middleware/auth';
import { generateImage } from '../services/gemini';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const generateRouter = Router();

/**
 * POST /api/generate
 * multipart/form-data:blockingImage(文件)+ prompt + style
 */
generateRouter.post('/', verifyAuth, upload.single('blockingImage'), async (req, res) => {
  try {
    const prompt = String(req.body.prompt ?? '');
    const style = (req.body.style as RenderStyle) ?? 'realistic';
    const blockingImage = req.file?.buffer;

    if (!blockingImage) return res.status(400).json({ error: 'blockingImage (file) is required' });
    if (!prompt) return res.status(400).json({ error: 'prompt is required' });

    const image = await generateImage({ blockingImage, prompt, style });

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
