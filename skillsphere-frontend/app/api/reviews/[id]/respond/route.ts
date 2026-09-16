import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';
import { createNotification } from '@/lib/api-notify';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review || review.revieweeId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { response } = await req.json();
  await prisma.review.update({
    where: { id: review.id },
    data: { response, respondedAt: new Date() },
  });

  await createNotification({
    recipientId: review.reviewerId,
    type: 'review_response',
    title: 'Your review received a response',
    message: `${user.fullName} responded to your review.`,
    link: `/marketplace/projects/${review.projectId}`,
  });

  return NextResponse.json({ success: true });
}