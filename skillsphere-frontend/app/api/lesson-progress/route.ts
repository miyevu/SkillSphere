import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const skillId = req.nextUrl.searchParams.get('skillId');
  const where = skillId ? { userId: user.id, skillId } : { userId: user.id };

  const progress = await prisma.lessonProgress.findMany({ where });
  return NextResponse.json({ progress });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { skillId, lessonId, completed } = await req.json();
  if (!skillId || !lessonId) {
    return NextResponse.json({ error: 'skillId and lessonId are required' }, { status: 400 });
  }

  if (completed) {
    await prisma.lessonProgress.upsert({
      where: { userId_skillId_lessonId: { userId: user.id, skillId, lessonId } },
      update: {},
      create: { userId: user.id, skillId, lessonId },
    });
  } else {
    await prisma.lessonProgress.deleteMany({ where: { userId: user.id, skillId, lessonId } });
  }

  return NextResponse.json({ success: true });
}