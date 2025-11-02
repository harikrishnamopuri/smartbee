import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/requireAdmin';
import { adminDb } from '../../../../lib/firebaseAdmin';

function toCSV(items: any[], fields: string[]) {
  const esc = (v: any) => {
    if (v === undefined || v === null) return '';
    const s = String(v);
    if (s.includes(',') || s.includes('\n') || s.includes('"')) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const header = fields.join(',');
  const rows = items.map((it) => fields.map((f) => esc(it[f])).join(','));
  return [header, ...rows].join('\n');
}

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    if (!adminDb) return NextResponse.json({ ok: false, error: 'firestore-not-configured' }, { status: 500 });

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const pageSize = Math.min(200, Math.max(1, parseInt(url.searchParams.get('pageSize') || '20', 10)));
    const format = (url.searchParams.get('format') || '').toLowerCase();

    const offset = (page - 1) * pageSize;
    const q = adminDb.collection('contacts').orderBy('createdAt', 'desc').offset(offset).limit(pageSize);
    const snap = await q.get();
    const items = snap.docs.map((d: any) => ({ id: d.id, ...(d.data ? d.data() : d.data) }));

    if (format === 'csv') {
      const fields = ['createdAt', 'email', 'uid', 'topic', 'message'];
      const csv = toCSV(items.map((it) => ({
        createdAt: it.createdAt ? (it.createdAt.toDate ? it.createdAt.toDate() : it.createdAt) : '',
        email: it.email || '',
        uid: it.uid || '',
        topic: it.topic || '',
        message: it.message || ''
      })), fields);
      return new Response(csv, { headers: { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="contacts.csv"' } });
    }

    return NextResponse.json({ ok: true, items, page, pageSize });
  } catch (err: any) {
    if (err instanceof Response) return err;
    console.error('admin contacts error', err);
    return NextResponse.json({ ok: false, error: 'internal' }, { status: 500 });
  }
}
