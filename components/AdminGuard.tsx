"use client";
import React, { useEffect, useState } from 'react';
import { initFirebaseClient } from '../lib/firebaseClient';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Developer fallback: if a dev admin flag is set in localStorage, allow access.
    try {
      const devFlag = typeof window !== 'undefined' ? localStorage.getItem('devAdmin') : null;
      if (devFlag === 'true') {
        setIsAdmin(true);
        setLoading(false);
        return;
      }
    } catch (e) {
      // ignore localStorage errors
    }
    const auth = initFirebaseClient();
    const unsub = auth.onAuthStateChanged(async (user: any) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        // Optionally verify token with server to check admin role. For now assume signed-in user is allowed.
        // You can call an API like /api/admin/check to validate admin status.
        setIsAdmin(true);
      } catch (err) {
        console.error('AdminGuard token error', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <div className="p-8">Checking permissions...</div>;
  if (!isAdmin) return <div className="p-8">You must be signed in as an admin to view this page.</div>;
  return <>{children}</>;
}
