import { fetchAboutProfile, updateAboutProfile } from '@izhar-os/database';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const about = await fetchAboutProfile();
    return NextResponse.json({ success: true, data: about });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch about data' },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateAboutProfile(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update about data' },
      { status: 500 },
    );
  }
}
