import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const enrollments = await prisma.enrollment.findMany({ where: { userId: user.id } });
  return NextResponse.json({ enrollments });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { skillId } = await req.json();
  if (!skillId) return NextResponse.json({ error: 'skillId is required' }, { status: 400 });

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_skillId: { userId: user.id, skillId } },
    update: {},
    create: { userId: user.id, skillId },
  });

  return NextResponse.json({ enrollment });
}