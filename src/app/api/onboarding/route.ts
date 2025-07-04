import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifySession } from '@/lib/auth';
import { hasPermission, PERMISSIONS } from '@/lib/rbac';
import { logDeniedAccess } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Get session token from cookies
  const sessionToken = request.cookies.get('session')?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const user = await verifySession(sessionToken);
  if (!user) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
  // Authorization: user:update
  if (!hasPermission(user.role, PERMISSIONS.USER_UPDATE)) {
    logDeniedAccess({ user, route: '/api/onboarding', reason: 'Missing user:update permission' });
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const userId = user.id;

  const body = await request.json();
  const { name, degreeProgramme, gender, studiedCS, yearsExperience, quizAnswers } = body;

  // Dummy skill score calculation: +10 for each correct quiz answer, +5 per year of experience, +10 if studiedCS
  const quizKey = [
    { id: 'q1', answer: '4' },
    { id: 'q2', answer: 'var_1' },
  ];
  let quizScore = 0;
  for (const q of quizKey) {
    if (quizAnswers[q.id] === q.answer) quizScore += 10;
  }
  const skillScore = quizScore + (Number(yearsExperience) * 5) + (studiedCS ? 10 : 0);

  // Save to DB (upsert in case user retries onboarding)
  await db.onboarding.upsert({
    where: { userId },
    update: {
      name, degreeProgramme, gender, studiedCS, yearsExperience, quizAnswers, skillScore,
    },
    create: {
      userId, name, degreeProgramme, gender, studiedCS, yearsExperience, quizAnswers, skillScore,
    },
  });

  return NextResponse.json({ success: true, skillScore });
} 