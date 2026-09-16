import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-admin';
import { createNotification } from '@/lib/api-notify';
import type { UserRole, UserStatus } from '@prisma/client';

const STATUS_NOTIFICATIONS: Record<string, { type: string; title: string; message: string }> = {
  ACTIVE: {
    type: 'account_approved',
    title: 'Your lecturer account was approved',
    message: 'You can now log in to SkillSphere.',
  },
  REJECTED: {
    type: 'account_rejected',
    title: 'Your lecturer application was not approved',
    message: 'Contact an administrator for details.',
  },
  SUSPENDED: {
    type: 'account_suspended',
    title: 'Your account has been suspended',
    message: 'Contact an administrator for details.',
  },
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const data: { role?: UserRole; status?: UserStatus } = {};

  if (body.role) {
    if (!['STUDENT', 'LECTURER', 'ADMIN'].includes(body.role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    data.role = body.role as UserRole;
  }
  if (body.status) {
    if (!['ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED', 'REJECTED'].includes(body.status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    data.status = body.status as UserStatus;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, fullName: true, email: true, role: true, status: true },
  });

  if (data.status && STATUS_NOTIFICATIONS[data.status]) {
    const notif = STATUS_NOTIFICATIONS[data.status];
    await createNotification({
      recipientId: user.id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      link: '/auth/login',
    });
  }

  return NextResponse.json({ user });
}