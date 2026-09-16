import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';
import { createNotification } from '@/lib/api-notify';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user || (user.role !== 'LECTURER' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { decision, feedback } = await req.json();
  if (!['approved', 'rejected'].includes(decision)) {
    return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });
  }

  const request = await prisma.verificationRequest.findUnique({ where: { id } });
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.verificationRequest.update({
    where: { id },
    data: { status: decision, lecturerFeedback: feedback || '', lecturerId: user.id, reviewedAt: new Date() },
  });

  if (decision === 'approved') {
    await prisma.badge.create({
      data: {
        studentId: request.studentId,
        title: request.projectTitle,
        portfolioItemId: request.portfolioItemId,
        verificationId: request.id,
        awardedById: user.id,
      },
    });

    await createNotification({
      recipientId: request.studentId,
      type: 'verification_reviewed',
      title: 'Portfolio project verified!',
      message: `"${request.projectTitle}" was approved by ${user.fullName}. You earned a badge.`,
      link: '/profile',
    });
  } else {
    await createNotification({
      recipientId: request.studentId,
      type: 'verification_reviewed',
      title: 'Changes requested on your submission',
      message: `${user.fullName} requested changes on "${request.projectTitle}".`,
      link: '/portfolio',
    });
  }

  return NextResponse.json({ success: true });
}