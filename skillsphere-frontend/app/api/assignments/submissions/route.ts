import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';
import { notifyAllLecturers } from '@/lib/api-notify';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const assignmentId = req.nextUrl.searchParams.get('assignmentId');

  const baseWhere = user.role === 'LECTURER' || user.role === 'ADMIN' ? {} : { studentId: user.id };
  const where = assignmentId ? { ...baseWhere, assignmentId } : baseWhere;

  const submissions = await prisma.assignmentSubmission.findMany({
    where,
    include: { student: { select: { fullName: true, email: true } } },
    orderBy: { submittedAt: 'desc' },
  });

  return NextResponse.json({ submissions });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  if (!body.assignmentId || !body.skillId || !body.moduleId || !body.submissionLink?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const submission = await prisma.assignmentSubmission.create({
    data: {
      assignmentId: body.assignmentId,
      skillId: body.skillId,
      moduleId: body.moduleId,
      assignmentTitle: body.assignmentTitle || '',
      studentId: user.id,
      submissionLink: body.submissionLink,
      submissionNote: body.submissionNote || '',
    },
  });

  await notifyAllLecturers({
    type: 'assignment_submitted',
    title: 'New assignment submission',
    message: `${user.fullName} submitted "${body.assignmentTitle}".`,
    link: '/lecturer/dashboard',
  });

  return NextResponse.json({ submission });
}