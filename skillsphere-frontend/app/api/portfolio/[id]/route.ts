import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const existing = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json();
  const item = await prisma.portfolioItem.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      category: body.category ?? existing.category,
      skillsUsed: body.skillsUsed ?? existing.skillsUsed,
      toolsUsed: body.toolsUsed ?? existing.toolsUsed,
      projectDate: body.projectDate ?? existing.projectDate,
      outcome: body.outcome ?? existing.outcome,
      projectLink: body.projectLink ?? existing.projectLink,
      mediaLinks: body.mediaLinks ?? (existing.mediaLinks as object),
      featured: body.featured ?? existing.featured,
      visibility: body.visibility ?? existing.visibility,
      status: body.status ?? existing.status,
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const existing = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.portfolioItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}