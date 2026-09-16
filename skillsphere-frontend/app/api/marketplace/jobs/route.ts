import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET() {
  const jobs = await prisma.jobPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { client: { select: { fullName: true, email: true } } },
  });
  return NextResponse.json({ jobs });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  if (!body.title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  const job = await prisma.jobPost.create({
    data: {
      clientId: user.id,
      title: body.title,
      description: body.description || '',
      requiredSkills: body.requiredSkills || [],
      budget: body.budget || '',
      deadline: body.deadline || '',
      projectType: body.projectType || '',
      freelancersRequired: body.freelancersRequired || 1,
      remote: body.remote ?? true,
    },
  });

  return NextResponse.json({ job });
}