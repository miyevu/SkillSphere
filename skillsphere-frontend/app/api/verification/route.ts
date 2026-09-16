import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';
import { notifyAllLecturers } from '@/lib/api-notify';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const portfolioItemId = req.nextUrl.searchParams.get('portfolioItemId');

  if (portfolioItemId) {
    const request = await prisma.verificationRequest.findFirst({
      where: { portfolioItemId },
      orderBy: { submittedAt: 'desc' },
    });
    return NextResponse.json({ request });
  }

  const where = user.role === 'LECTURER' || user.role === 'ADMIN' ? {} : { studentId: user.id };
  const requests = await prisma.verificationRequest.findMany({
    where,
    include: { student: { select: { fullName: true, email: true } } },
    orderBy: { submittedAt: 'desc' },
  });

  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  if (!body.portfolioItemId) {
    return NextResponse.json({ error: 'portfolioItemId is required' }, { status: 400 });
  }

  const item = await prisma.portfolioItem.findUnique({ where: { id: body.portfolioItemId } });
  if (!item || item.userId !== user.id) {
    return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
  }

  const request = await prisma.verificationRequest.create({
    data: {
      portfolioItemId: item.id,
      studentId: user.id,
      projectTitle: item.title,
      projectDescription: item.description,
      projectLink: item.projectLink,
    },
  });

  await notifyAllLecturers({
    type: 'verification_submitted',
    title: 'New portfolio verification request',
    message: `${user.fullName} submitted "${item.title}" for review.`,
    link: '/lecturer/dashboard',
  });

  return NextResponse.json({ request });
}