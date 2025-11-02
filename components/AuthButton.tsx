"use client";
import React from 'react';
import { initFirebaseClient, signInWithGoogle, signOut } from '../lib/firebaseClient';

export default function AuthButton() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const auth = initFirebaseClient();
    const unsub = auth.onAuthStateChanged((u: any) => setUser(u));
    return () => unsub();
  }, []);

  if (user) {
    return <button onClick={() => signOut()} className="px-3 py-1 border rounded">Sign out</button>;
  }
  return (
    <button onClick={() => signInWithGoogle()} className="px-3 py-1 bg-honey rounded">
      Sign in
    </button>
  );
}
