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
  const groups = await db.group.findMany({
    include: { mentor: true, mentees: true },
    orderBy: { groupNumber: 'asc' },
  });
  return NextResponse.json({ groups });
}

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }
  const user = await verifySession(sessionToken);
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const existing = await db.group.findMany({ select: { groupNumber: true } });
  const used = new Set(existing.map(g => g.groupNumber));
  let groupNumber = 1;
  while (used.has(groupNumber)) groupNumber++;
  const group = await db.group.create({ data: { groupNumber } });
  return NextResponse.json({ group });
}

export async function PUT(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }
  const user = await verifySession(sessionToken);
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id, mentorId, menteeIds, info } = await request.json();
  const group = await db.group.update({
    where: { id },
    data: {
      mentorId,
      info,
      mentees: {
        set: menteeIds.map((id: string) => ({ id })),
      },
    },
    include: { mentor: true, mentees: true },
  });
  return NextResponse.json({ group });
}

export async function DELETE(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }
  const user = await verifySession(sessionToken);
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await request.json();
  await db.group.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 