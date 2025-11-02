import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initAdmin } from '../../../../lib/firebaseAdmin';
import { requireAdmin } from '../../../../lib/requireAdmin';

export async function POST(request: Request) {
  try {
    const adminEmail = await requireAdmin(request);
    if (!adminEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const theme = body.theme || null;

    initAdmin();
    const db = getFirestore();
    await db.collection('settings').doc('siteTheme').set({ theme, updatedAt: new Date(), updatedBy: adminEmail });

    return NextResponse.json({ ok: true, theme });
  } catch (error: any) {
    console.error('Error setting theme:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
