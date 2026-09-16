import { prisma } from '@/lib/prisma';

export async function createNotification(input: {
  recipientId: string;
  type: string;
  title: string;
  message: string;
  link: string;
}) {
  await prisma.notification.create({ data: input });
}

export async function notifyAllLecturers(input: { type: string; title: string; message: string; link: string }) {
  const lecturers = await prisma.user.findMany({ where: { role: 'LECTURER', status: 'ACTIVE' } });
  await Promise.all(lecturers.map((l) => createNotification({ ...input, recipientId: l.id })));
}

export async function notifyAllAdmins(input: { type: string; title: string; message: string; link: string }) {
  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  await Promise.all(admins.map((a) => createNotification({ ...input, recipientId: a.id })));
}