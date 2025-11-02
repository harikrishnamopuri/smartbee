import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { adminDb } from '../../../lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) {
      return NextResponse.json({ ok: false, error: 'missing-token' }, { status: 401 });
    }
    if (!adminDb) {
      console.warn('adminDb not initialized; dropping contact');
      return NextResponse.json({ ok: false, error: 'firestore-not-configured' }, { status: 500 });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    await adminDb.collection('contacts').add({
      ...body,
      uid: decoded.uid,
      email: decoded.email || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('contact POST error', err);
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
  }
}
