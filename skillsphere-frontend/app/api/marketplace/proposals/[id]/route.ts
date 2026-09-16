import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';
import { createNotification } from '@/lib/api-notify';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const { decision } = await req.json();
  if (decision !== 'accepted') {
    return NextResponse.json({ error: 'Only accept is supported here' }, { status: 400 });
  }

  const proposal = await prisma.proposal.findUnique({ where: { id }, include: { job: true } });
  if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
  if (proposal.job.clientId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.proposal.update({ where: { id: proposal.id }, data: { status: 'accepted' } });
  await prisma.proposal.updateMany({
    where: { jobId: proposal.jobId, id: { not: proposal.id } },
    data: { status: 'rejected' },
  });
  await prisma.jobPost.update({ where: { id: proposal.jobId }, data: { status: 'closed' } });

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + proposal.proposedDeliveryDays);
  const deliveryDateStr = deliveryDate.toISOString().slice(0, 10);

  const project = await prisma.project.create({
    data: {
      title: proposal.job.title,
      clientId: user.id,
      freelancerId: proposal.studentId,
      agreedPrice: proposal.proposedPrice,
      deliveryDate: deliveryDateStr,
      scope: proposal.job.description,
      milestones: [{ id: crypto.randomUUID(), title: 'Final Delivery', dueDate: deliveryDateStr, status: 'pending', deliverableLink: '' }],
      sourceType: 'job',
      sourceJobId: proposal.jobId,
    },
  });

  await createNotification({
    recipientId: proposal.studentId,
    type: 'proposal_accepted',
    title: 'Your proposal was accepted!',
    message: `${user.fullName} accepted your proposal for "${proposal.job.title}".`,
    link: `/marketplace/projects/${project.id}`,
  });

  return NextResponse.json({ project });
}