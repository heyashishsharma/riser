import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("⚠️ WARNING: Firebase environment variables are missing! Check your .env.local file.");
  } else {
    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      console.log("🔥 Firebase Admin successfully initialized!");
    } catch (error) {
      console.error('❌ Firebase admin initialization error. Your private key might be malformed in .env.local', error);
    }
  }
}

// Safely export the db so the app doesn't crash on boot if keys are missing
const db = getApps().length > 0 ? getFirestore() : ({} as any);

export { db };
