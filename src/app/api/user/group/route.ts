import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth';
import { hasPermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }
  const user = await verifySession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
  if (!hasPermission(user.role, PERMISSIONS.USER_READ)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // If ?all=1, return all groups (for admin UI)
  const url = new URL(request.url);
  if (url.searchParams.get('all') === '1') {
    const groups = await db.group.findMany({
      include: { mentor: true, mentees: true },
    });
    return NextResponse.json({ groups });
  }

  // Always try to find group where user is mentor (of any role)
  let group = await db.group.findFirst({
    where: { mentorId: user.id },
    include: { mentor: true, mentees: true },
  });
  // If not mentor, try as mentee (regardless of role)
  if (!group) {
    group = await db.group.findFirst({
      where: { mentees: { some: { id: user.id } } },
      include: { mentor: true, mentees: true },
    });
  }
  if (!group) {
    return NextResponse.json({ group: null });
  }
  return NextResponse.json({ group });
}

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }
  const user = await verifySession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
  // Find the group where the user is the mentor (of any role)
  const group = await db.group.findFirst({
    where: { mentorId: user.id },
  });
  if (!group) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  const { info } = body;
  await db.group.update({
    where: { id: group.id },
    data: { info },
  });
  return NextResponse.json({ success: true });
} 