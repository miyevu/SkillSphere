import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const items = await prisma.portfolioItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  if (!body.title?.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const item = await prisma.portfolioItem.create({
    data: {
      userId: user.id,
      title: body.title,
      description: body.description || '',
      category: body.category || '',
      skillsUsed: body.skillsUsed || [],
      toolsUsed: body.toolsUsed || [],
      projectDate: body.projectDate || '',
      outcome: body.outcome || '',
      projectLink: body.projectLink || '',
      mediaLinks: body.mediaLinks || [],
      featured: body.featured || false,
      visibility: body.visibility || 'institution',
      status: body.status || 'completed',
    },
  });

  return NextResponse.json({ item });
}