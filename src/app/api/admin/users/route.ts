import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth';

const ADMIN_ROLES = ['ADMIN', 'SENIOR_MENTOR', 'SUPERADMIN'];

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }
  const user = await verifySession(sessionToken);
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const users = await db.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
    orderBy: [{ role: 'asc' }, { lastName: 'asc' }],
  });
  return NextResponse.json({ users });
} 