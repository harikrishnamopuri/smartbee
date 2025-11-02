import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';

const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Log the config for debugging (remove in production)
console.log('Firebase Client Config:', {
  apiKey: clientConfig.apiKey,
  authDomain: clientConfig.authDomain,
  projectId: clientConfig.projectId,
  // Hide sensitive values
  hasMessagingSenderId: !!clientConfig.messagingSenderId,
  hasAppId: !!clientConfig.appId
});

export function initFirebaseClient() {
  if (!getApps().length) {
    console.log('Initializing Firebase app...');
    initializeApp(clientConfig);
  }
  return getAuth();
}

export async function signInWithGoogle() {
  const auth = initFirebaseClient();
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function signOut() {
  const auth = initFirebaseClient();
  return fbSignOut(auth);
}

export async function getIdToken(): Promise<string | null> {
  const auth = initFirebaseClient();
  const user = auth.currentUser;
  if (user) return user.getIdToken();
  // wait for auth state change once
  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged(async (u: any) => {
      unsub();
      if (u) {
        const t = await u.getIdToken();
        resolve(t);
      } else {
        resolve(null);
      }
    });
  });
}
