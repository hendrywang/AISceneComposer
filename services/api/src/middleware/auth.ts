import type { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { ensureFirebaseApp } from '../services/firebase';

export interface AuthedRequest extends Request {
  uid?: string;
}

/** 校验 Firebase ID Token;本地可设 SKIP_AUTH=1 跳过 */
export async function verifyAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  // SKIP_AUTH 仅本地有效:生产(NODE_ENV=production)下即便误设也忽略,强制校验。
  const skipAuth = process.env.SKIP_AUTH === '1' && process.env.NODE_ENV !== 'production';
  if (skipAuth) {
    console.warn('[auth] SKIP_AUTH active — bypassing Firebase auth (NODE_ENV != production)');
    req.uid = 'dev-user';
    return next();
  }
  if (process.env.SKIP_AUTH === '1') {
    console.error('[auth] SKIP_AUTH=1 ignored because NODE_ENV=production — enforcing token verification');
  }

  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'missing bearer token' });

  try {
    ensureFirebaseApp();
    const decoded = await getAuth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
}
