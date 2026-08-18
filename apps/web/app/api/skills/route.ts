import { deleteSkill, fetchSkillCategories, fetchSkills, upsertSkill } from '@izhar-os/database';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [skills, categories] = await Promise.all([fetchSkills(), fetchSkillCategories()]);
    return NextResponse.json({ success: true, data: { skills, categories } });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch skills' },
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
    const skill = await upsertSkill(body, body.sort_order);
    return NextResponse.json({ success: true, data: skill });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create skill' },
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
    const skill = await upsertSkill(body, body.sort_order);
    return NextResponse.json({ success: true, data: skill });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update skill' },
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
      return NextResponse.json({ success: false, message: 'Missing skill ID' }, { status: 400 });
    }

    await deleteSkill(id);
    return NextResponse.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete skill' },
      { status: 500 },
    );
  }
}
