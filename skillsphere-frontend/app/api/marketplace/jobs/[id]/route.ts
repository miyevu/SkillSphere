import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.jobPost.findUnique({
    where: { id },
    include: {
      client: { select: { fullName: true, email: true } },
      proposals: { include: { student: { select: { fullName: true, email: true } } }, orderBy: { createdAt: 'desc' } },
    },
  });
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ job });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const job = await prisma.jobPost.findUnique({ where: { id } });
  if (!job || (job.clientId !== user.id && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.jobPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}