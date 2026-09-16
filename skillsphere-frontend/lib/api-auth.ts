import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifySession, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function getSessionUser(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySession(token);
  if (!payload) return null;

  return prisma.user.findUnique({ where: { id: payload.userId } });
}