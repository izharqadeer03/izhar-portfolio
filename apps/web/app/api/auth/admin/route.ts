import { ADMIN_SECRET_KEY } from '@izhar-os/database';
import { NextRequest, NextResponse } from 'next/server';

function getAdminSecret(): string {
  return (process.env.ADMIN_SECRET_KEY || ADMIN_SECRET_KEY || 'admin123').trim();
}

export async function POST(req: NextRequest) {
  try {
    const { key } = await req.json();
    const adminKey = getAdminSecret();

    if (!key || key.trim() !== adminKey) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin passcode' },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Admin authenticated successfully',
      token: adminKey,
    });

    response.cookies.set('izhar_admin_session', adminKey, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Authentication error' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const adminKey = getAdminSecret();
  const authHeader = req.headers.get('Authorization') || req.headers.get('x-admin-key');
  const cookie = req.cookies.get('izhar_admin_session')?.value?.trim();

  const isValid =
    (authHeader && authHeader.replace(/^Bearer\s+/i, '').trim() === adminKey) ||
    cookie === adminKey;

  return NextResponse.json({
    authenticated: Boolean(isValid),
  });
}
