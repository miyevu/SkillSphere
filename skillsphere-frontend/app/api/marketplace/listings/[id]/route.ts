import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await prisma.serviceListing.findUnique({
    where: { id },
    include: { user: { select: { fullName: true, email: true } } },
  });
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ listing });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const existing = await prisma.serviceListing.findUnique({ where: { id } });
  if (!existing || (existing.userId !== user.id && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.serviceListing.delete({ where: { id } });
  return NextResponse.json({ success: true });
}