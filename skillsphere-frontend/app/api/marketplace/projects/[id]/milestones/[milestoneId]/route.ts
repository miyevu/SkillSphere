import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';
import { createNotification } from '@/lib/api-notify';

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'delivered' | 'approved';
  deliverableLink: string;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  const { id, milestoneId } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || (project.clientId !== user.id && project.freelancerId !== user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { status, deliverableLink } = await req.json();
  const milestones = project.milestones as unknown as Milestone[];
  const milestone = milestones.find((m) => m.id === milestoneId);
  if (!milestone) return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });

  milestone.status = status;
  if (deliverableLink !== undefined) milestone.deliverableLink = deliverableLink;

  const allApproved = milestones.every((m) => m.status === 'approved');
  await prisma.project.update({
    where: { id: project.id },
    data: { milestones: milestones as unknown as object, status: allApproved ? 'completed' : project.status },
  });

  if (status === 'delivered') {
    await createNotification({
      recipientId: project.clientId,
      type: 'milestone_delivered',
      title: 'Milestone delivered',
      message: `"${milestone.title}" was delivered for "${project.title}".`,
      link: `/marketplace/projects/${project.id}`,
    });
  }
  if (status === 'approved') {
    await createNotification({
      recipientId: project.freelancerId,
      type: 'milestone_approved',
      title: 'Milestone approved',
      message: `"${milestone.title}" was approved for "${project.title}".`,
      link: `/marketplace/projects/${project.id}`,
    });
  }
  if (allApproved) {
    await Promise.all([
      createNotification({
        recipientId: project.clientId,
        type: 'project_completed',
        title: 'Project completed',
        message: `"${project.title}" is now complete. You can leave a review.`,
        link: `/marketplace/projects/${project.id}`,
      }),
      createNotification({
        recipientId: project.freelancerId,
        type: 'project_completed',
        title: 'Project completed',
        message: `"${project.title}" is now complete. You can leave a review.`,
        link: `/marketplace/projects/${project.id}`,
      }),
    ]);
  }

  return NextResponse.json({ success: true });
}