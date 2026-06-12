import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';

/** 懒初始化 Firebase Admin(Cloud Run 自动取凭据;本地用 GOOGLE_APPLICATION_CREDENTIALS) */
export function ensureFirebaseApp() {
  if (getApps().length === 0) {
    initializeApp({ credential: applicationDefault() });
  }
}
