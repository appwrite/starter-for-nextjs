import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ onboarded: false });
  }
  const user = await verifySession(sessionToken);
  if (!user) {
    return NextResponse.json({ onboarded: false });
  }
  const onboarding = await db.onboarding.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ onboarded: !!onboarding });
} 