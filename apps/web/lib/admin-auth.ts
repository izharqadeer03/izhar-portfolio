import { ADMIN_SECRET_KEY } from '@izhar-os/database';
import { NextRequest } from 'next/server';

/**
 * Verify admin request authorization.
 */
export function isAuthorizedAdmin(req: NextRequest): boolean {
  const secret = (process.env.ADMIN_SECRET_KEY || ADMIN_SECRET_KEY || 'admin123').trim();
  const authHeader = req.headers.get('Authorization') || req.headers.get('x-admin-key');
  if (authHeader) {
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token === secret) {
      return true;
    }
  }

  const cookie = req.cookies.get('izhar_admin_session')?.value?.trim();
  if (cookie === secret) {
    return true;
  }

  return false;
}

