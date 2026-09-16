import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-admin';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const items = await prisma.portfolioItem.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { fullName: true, email: true } } },
  });

  return NextResponse.json({ items });
}