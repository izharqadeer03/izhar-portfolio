import { deleteExperience, fetchExperiences, upsertExperience } from '@izhar-os/database';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const experiences = await fetchExperiences();
    return NextResponse.json({ success: true, data: experiences });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch experiences' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const exp = await upsertExperience(body, body.sort_order);
    return NextResponse.json({ success: true, data: exp });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create experience' },
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
    const exp = await upsertExperience(body, body.sort_order);
    return NextResponse.json({ success: true, data: exp });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update experience' },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing experience ID' }, { status: 400 });
    }

    await deleteExperience(id);
    return NextResponse.json({ success: true, message: 'Experience deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete experience' },
      { status: 500 },
    );
  }
}
