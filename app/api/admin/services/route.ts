import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/requireAdmin';
import { addService } from '../../../../lib/tempStore';

export async function POST(request: Request) {
  try {
    // Special handling for dev admin token
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    
    let adminEmail = '';
    
    if (token === 'dev-admin-token') {
      // Allow dev admin token
      adminEmail = process.env.DEV_ADMIN_EMAIL || 'admin@local.test';
    } else {
      // Verify Firebase admin token
      try {
        const adminUser = await requireAdmin(request);
        if (!adminUser) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        adminEmail = adminUser.email || '';
      } catch (err) {
        console.error('Admin verification failed:', err);
        return NextResponse.json({ error: 'Admin verification failed' }, { status: 401 });
      }
    }

    // Get and validate request body
    const service = await request.json();
    if (!service.title || !service.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Adding service:', { ...service, adminEmail }); // Debug log

    // Add service to temporary store
    try {
      const result = await addService({
        ...service,
        createdAt: new Date(),
        createdBy: adminEmail,
      });

      console.log('Service added with ID:', result.id); // Debug log

      // Return the new service with its ID
      return NextResponse.json(result);
    } catch (err) {
      console.error('Failed to save service:', err);
      return NextResponse.json({ error: 'Failed to save service' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error adding service:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}