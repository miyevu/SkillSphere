import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      client: { select: { fullName: true, email: true } },
      freelancer: { select: { fullName: true, email: true } },
      messages: { include: { sender: { select: { fullName: true, email: true } } }, orderBy: { createdAt: 'asc' } },
      reviews: true,
    },
  });

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (project.clientId !== user.id && project.freelancerId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({ project });
}