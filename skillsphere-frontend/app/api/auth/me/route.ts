import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ user: null });

  const payload = await verifySession(token);
  if (!payload) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, status: user.status },
  });
}