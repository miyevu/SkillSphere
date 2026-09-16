import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/api-auth';

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  await prisma.notification.updateMany({ where: { recipientId: user.id, read: false }, data: { read: true } });
  return NextResponse.json({ success: true });
}
