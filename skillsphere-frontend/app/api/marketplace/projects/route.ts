import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { OR: [{ clientId: user.id }, { freelancerId: user.id }] },
    include: {
      client: { select: { fullName: true, email: true } },
      freelancer: { select: { fullName: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ projects });
}