import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const proposals = await prisma.proposal.findMany({
    where: { studentId: user.id },
    include: { job: { select: { id: true, title: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ proposals });
}