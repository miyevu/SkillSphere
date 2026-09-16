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

  const { decision, score, feedback } = await req.json();
  if (!['graded', 'resubmit_requested'].includes(decision)) {
    return NextResponse.json({ error: 'Invalid decision' }, { status: 400 });
  }

  const submission = await prisma.assignmentSubmission.findUnique({ where: { id } });
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.assignmentSubmission.update({
    where: { id },
    data: {
      status: decision,
      score: decision === 'graded' ? score ?? null : null,
      feedback: feedback || '',
      gradedById: user.id,
      gradedAt: new Date(),
    },
  });

  await createNotification({
    recipientId: submission.studentId,
    type: 'assignment_graded',
    title: decision === 'graded' ? 'Assignment graded' : 'Resubmission requested',
    message:
      decision === 'graded'
        ? `"${submission.assignmentTitle}" was graded: ${score}/100.`
        : `${user.fullName} requested changes on "${submission.assignmentTitle}".`,
    link: `/skills/${submission.skillId}/assignments/${submission.moduleId}`,
  });

  return NextResponse.json({ success: true });
}