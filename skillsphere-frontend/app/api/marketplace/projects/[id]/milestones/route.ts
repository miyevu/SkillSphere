import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.clientId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { title, dueDate } = await req.json();
  const milestones = project.milestones as Array<Record<string, unknown>>;
  milestones.push({ id: crypto.randomUUID(), title, dueDate, status: 'pending', deliverableLink: '' });

  await prisma.project.update({ where: { id: project.id }, data: { milestones: milestones as unknown as object } });
  return NextResponse.json({ success: true });
}