import { seedAllDefaultData, checkDatabaseConnection } from '@izhar-os/database';
import { NextRequest, NextResponse } from 'next/server';
import { isAuthorizedAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const connection = await checkDatabaseConnection();
  return NextResponse.json({
    success: true,
    connection,
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { force } = await req.json().catch(() => ({ force: true }));
    const result = await seedAllDefaultData(Boolean(force));

    return NextResponse.json({
      success: result.success,
      seeded: result.seeded,
      error: result.error,
      message: result.success
        ? 'Database schema migrated and default content seeded successfully'
        : `Seeding error: ${result.error}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { success: false, message: `Failed to execute seed: ${message}` },
      { status: 500 },
    );
  }
}
