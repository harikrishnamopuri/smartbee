import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initAdmin } from '../../../lib/firebaseAdmin';

export async function GET() {
  try {
    initAdmin();
    const db = getFirestore();
    const doc = await db.collection('settings').doc('siteTheme').get();
    if (!doc.exists) return NextResponse.json({ theme: null });
    return NextResponse.json(doc.data());
  } catch (error: any) {
    console.error('Error fetching theme:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
