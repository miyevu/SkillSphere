import { NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/api-auth';

export async function requireAdmin(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}