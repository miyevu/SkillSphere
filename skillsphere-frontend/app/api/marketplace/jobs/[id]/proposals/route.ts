import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';
import { createNotification } from '@/lib/api-notify';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const job = await prisma.jobPost.findUnique({ where: { id } });
  if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

  const body = await req.json();
  if (!body.coverLetter?.trim()) return NextResponse.json({ error: 'Cover letter is required' }, { status: 400 });

  const proposal = await prisma.proposal.create({
    data: {
      jobId: job.id,
      studentId: user.id,
      coverLetter: body.coverLetter,
      proposedPrice: body.proposedPrice || 0,
      proposedDeliveryDays: body.proposedDeliveryDays || 0,
    },
  });

  await createNotification({
    recipientId: job.clientId,
    type: 'proposal_received',
    title: 'New proposal received',
    message: `${user.fullName} submitted a proposal for "${job.title}".`,
    link: `/marketplace/jobs/${job.id}`,
  });

  return NextResponse.json({ proposal });
}