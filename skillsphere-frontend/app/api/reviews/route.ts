import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';
import { createNotification } from '@/lib/api-notify';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  const projectId = req.nextUrl.searchParams.get('projectId');

  const where = userId ? { revieweeId: userId } : projectId ? { projectId } : {};
  const reviews = await prisma.review.findMany({
    where,
    include: { reviewer: { select: { fullName: true } }, reviewee: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const project = await prisma.project.findUnique({ where: { id: body.projectId } });
  if (!project || project.status !== 'completed') {
    return NextResponse.json({ error: 'Project must be completed to leave a review' }, { status: 400 });
  }
  if (project.clientId !== user.id && project.freelancerId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const revieweeId = user.id === project.clientId ? project.freelancerId : project.clientId;

  const review = await prisma.review.create({
    data: {
      projectId: project.id,
      reviewerId: user.id,
      revieweeId,
      overallRating: body.overallRating,
      qualityRating: body.qualityRating || 0,
      communicationRating: body.communicationRating || 0,
      timelinessRating: body.timelinessRating || 0,
      professionalismRating: body.professionalismRating || 0,
      comment: body.comment || '',
    },
  });

  await createNotification({
    recipientId: revieweeId,
    type: 'review_received',
    title: 'You received a review',
    message: `${user.fullName} left you a ${body.overallRating}-star review.`,
    link: '/profile',
  });

  return NextResponse.json({ review });
}