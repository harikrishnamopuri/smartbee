import admin from 'firebase-admin';
import { adminDb } from './firebaseAdmin';
import { NextResponse } from 'next/server';

/**
 * Verifies Authorization Bearer ID token and ensures the decoded email
 * is included in ADMIN_EMAILS (comma-separated) if that env var is set.
 * Returns decoded token on success or throws a NextResponse to short-circuit.
 */
export async function requireAdmin(request: Request) {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!token) {
    throw NextResponse.json({ ok: false, error: 'missing-token' }, { status: 401 });
  }

  if (!adminDb) {
    throw NextResponse.json({ ok: false, error: 'firestore-not-configured' }, { status: 500 });
  }

  let decoded: any;
  try {
    decoded = await admin.auth().verifyIdToken(token);
  } catch (err) {
    console.error('token verify failed', err);
    throw NextResponse.json({ ok: false, error: 'invalid-token' }, { status: 401 });
  }

  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length > 0) {
    const email = (decoded.email || '').toLowerCase();
    if (!allowed.includes(email)) {
      throw NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 });
    }
  }

  return decoded;
}
