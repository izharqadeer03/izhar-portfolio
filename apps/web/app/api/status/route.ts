import { checkDatabaseConnection, getDatabaseStatus } from '@izhar-os/database';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await checkDatabaseConnection();
  return NextResponse.json({
    status: getDatabaseStatus(),
    connected: result.connected,
    message: result.message,
    latencyMs: result.latencyMs,
    timestamp: new Date().toISOString(),
  });
}
