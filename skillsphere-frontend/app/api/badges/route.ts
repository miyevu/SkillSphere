import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const studentId = req.nextUrl.searchParams.get('studentId') || user.id;

  const badges = await prisma.badge.findMany({
    where: { studentId },
    include: { awardedBy: { select: { fullName: true } } },
    orderBy: { awardedAt: 'desc' },
  });

  return NextResponse.json({ badges });
}