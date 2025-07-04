import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth';
import { hasPermission, PERMISSIONS } from '@/lib/rbac';
import { logDeniedAccess } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ onboarded: false });
  }
  const user = await verifySession(sessionToken);
  if (!user) {
    return NextResponse.json({ onboarded: false });
  }
  // Authorization: user:read
  if (!hasPermission(user.role, PERMISSIONS.USER_READ)) {
    logDeniedAccess({ user, route: '/api/onboarding/status', reason: 'Missing user:read permission' });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const onboarding = await db.onboarding.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ onboarded: !!onboarding });
} 