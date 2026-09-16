import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';
import { createNotification } from '@/lib/api-notify';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || (project.clientId !== user.id && project.freelancerId !== user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { text } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: 'Message text is required' }, { status: 400 });

  const message = await prisma.projectMessage.create({
    data: { projectId: project.id, senderId: user.id, text },
  });

  const recipientId = user.id === project.clientId ? project.freelancerId : project.clientId;
  await createNotification({
    recipientId,
    type: 'new_message',
    title: 'New message',
    message: `${user.fullName}: ${text.length > 60 ? text.slice(0, 60) + '…' : text}`,
    link: `/marketplace/projects/${project.id}`,
  });

  return NextResponse.json({ message });
}