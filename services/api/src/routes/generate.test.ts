/// <reference types="node" />

import assert from 'node:assert/strict';
import { test, afterEach } from 'node:test';
import type { Server } from 'node:http';
import express from 'express';
import { makeGenerateRouter, type GenerateDeps } from './generate';
import type { GenerateImageOutput } from '../services/gemini';

// PNG 签名 + IHDR 起始(足够让 mimetype/路由逻辑走通,不解码)
const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452', 'hex');

let server: Server | null = null;

/** 起一个只挂 /api/generate 的临时 app,注入桩 generateImage,返回 base URL。 */
function start(generateImage: GenerateDeps['generateImage']): Promise<string> {
  process.env.SKIP_AUTH = '1';
  process.env.NODE_ENV = 'test';
  const app = express();
  app.use('/api/generate', makeGenerateRouter({ generateImage }));
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const addr = server!.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      resolve(`http://127.0.0.1:${port}`);
    });
  });
}

afterEach(
  () =>
    new Promise<void>((resolve) => {
      if (!server) return resolve();
      server.close(() => {
        server = null;
        resolve();
      });
    }),
);

interface FormFields {
  prompt?: string;
  style?: string;
  file?: { buf: Buffer; type: string };
}

function form(fields: FormFields): FormData {
  const fd = new FormData();
  if (fields.prompt !== undefined) fd.append('prompt', fields.prompt);
  if (fields.style !== undefined) fd.append('style', fields.style);
  if (fields.file) {
    // 包一层 Uint8Array:Node Buffer 的 ArrayBufferLike 不直接满足 DOM Blob 的 BlobPart 类型。
    const bytes = new Uint8Array(fields.file.buf);
    fd.append('blockingImage', new Blob([bytes], { type: fields.file.type }), 'blocking.png');
  }
  return fd;
}

const okGen = async (): Promise<GenerateImageOutput> => ({
  dataUrl: 'data:image/png;base64,AAAA',
  mimeType: 'image/png',
});

test('200 with stubbed generator when SKIP_AUTH bypass is active', async () => {
  const base = await start(okGen);
  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    body: form({ prompt: 'a quiet room', style: 'realistic', file: { buf: PNG, type: 'image/png' } }),
  });
  assert.equal(res.status, 200);
  const j = (await res.json()) as { imageUrl: string };
  assert.equal(j.imageUrl, 'data:image/png;base64,AAAA');
});

test('400 when prompt is missing', async () => {
  const base = await start(async () => {
    throw new Error('generateImage should not be called');
  });
  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    body: form({ file: { buf: PNG, type: 'image/png' } }),
  });
  assert.equal(res.status, 400);
});

test('400 when the blocking image file is missing', async () => {
  const base = await start(async () => {
    throw new Error('generateImage should not be called');
  });
  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    body: form({ prompt: 'hello' }),
  });
  assert.equal(res.status, 400);
});

test('400 when the uploaded file is not an image', async () => {
  const base = await start(async () => {
    throw new Error('generateImage should not be called');
  });
  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    body: form({
      prompt: 'hello',
      style: 'realistic',
      file: { buf: Buffer.from('not an image'), type: 'text/plain' },
    }),
  });
  assert.equal(res.status, 400);
});

test('forwards the real upload mimetype into generateImage (not a hardcoded type)', async () => {
  let seen = '';
  const base = await start(async (input) => {
    seen = input.mimeType;
    return { dataUrl: 'data:image/png;base64,AA', mimeType: 'image/png' };
  });
  await fetch(`${base}/api/generate`, {
    method: 'POST',
    body: form({ prompt: 'hello', style: 'realistic', file: { buf: PNG, type: 'image/png' } }),
  });
  assert.equal(seen, 'image/png');
});
