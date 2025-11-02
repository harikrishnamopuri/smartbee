import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/requireAdmin';
import { addCourse } from '../../../../lib/tempStore';

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
    const course = await request.json();
    if (!course.title || !course.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Adding course:', { ...course, adminEmail }); // Debug log

    // Add course to temporary store
    try {
      const result = await addCourse({
        ...course,
        createdAt: new Date(),
        createdBy: adminEmail,
      });

      console.log('Course added with ID:', result.id); // Debug log

      // Return the new course with its ID
      return NextResponse.json(result);
    } catch (err) {
      console.error('Failed to save course:', err);
      return NextResponse.json({ error: 'Failed to save course' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error adding course:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}