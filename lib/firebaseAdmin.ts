import admin from 'firebase-admin';

export function initAdmin() {
  if (!admin.apps.length) {
    const svcBase64 = process.env.FIREBASE_SERVICE_ACCOUNT || '';
    if (!svcBase64) {
      // No service account configured; admin will remain uninitialized.
      console.warn('FIREBASE_SERVICE_ACCOUNT not set; Firestore admin will not be initialized.');
      return;
    }
    const svcJson = JSON.parse(Buffer.from(svcBase64, 'base64').toString('utf8'));
    admin.initializeApp({ credential: admin.credential.cert(svcJson as any) });
  }
}

initAdmin();

export const adminDb = admin.apps.length ? admin.firestore() : null;
export default admin;
