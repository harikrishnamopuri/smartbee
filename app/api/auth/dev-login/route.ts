import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // This route is intentionally development-only. It checks environment variables
  // DEV_ADMIN_EMAIL and DEV_ADMIN_PASSWORD and returns success only when running
  // in a non-production environment.
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
    }

    const body = await request.json();
    const { email, password } = body || {};

    const devEmail = process.env.DEV_ADMIN_EMAIL;
    const devPassword = process.env.DEV_ADMIN_PASSWORD;

    if (!devEmail || !devPassword) {
      return NextResponse.json({ error: 'Dev admin not configured on server' }, { status: 400 });
    }

    if (email === devEmail && password === devPassword) {
      return NextResponse.json({ ok: true, email: devEmail });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (err: any) {
    console.error('dev-login error', err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
