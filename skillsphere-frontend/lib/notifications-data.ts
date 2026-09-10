'use client';

import { getRegistry } from './users-data';

export type NotificationType =
  | 'verification_submitted'
  | 'verification_reviewed'
  | 'assignment_submitted'
  | 'assignment_graded'
  | 'proposal_received'
  | 'proposal_accepted'
  | 'hired'
  | 'milestone_delivered'
  | 'milestone_approved'
  | 'project_completed'
  | 'new_message'
  | 'review_received'
  | 'review_response'
  | 'lecturer_signup'
  | 'account_approved'
  | 'account_rejected'
  | 'account_suspended';

export interface Notification {
  id: string;
  recipientEmail: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

const NOTIFICATIONS_KEY = 'skillsphere_notifications';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function getNotifications(): Notification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? (JSON.parse(raw) as Notification[]) : [];
  } catch {
    return [];
  }
}

function saveNotifications(items: Notification[]) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
}

export function getNotificationsForUser(email: string): Notification[] {
  return getNotifications()
    .filter((n) => n.recipientEmail === email)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getUnreadCount(email: string): number {
  return getNotifications().filter((n) => n.recipientEmail === email && !n.read).length;
}

export function addNotification(input: {
  recipientEmail: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
}) {
  const newNotification: Notification = {
    ...input,
    id: generateId(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  saveNotifications([newNotification, ...getNotifications()]);
}

export function markAsRead(id: string) {
  saveNotifications(getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllAsRead(email: string) {
  saveNotifications(
    getNotifications().map((n) => (n.recipientEmail === email ? { ...n, read: true } : n))
  );
}

export function notifyAllLecturers(input: {
  type: NotificationType;
  title: string;
  message: string;
  link: string;
}) {
  const lecturers = getRegistry().filter((u) => u.role === 'lecturer' && u.status === 'active');
  lecturers.forEach((lecturer) => {
    addNotification({ ...input, recipientEmail: lecturer.email });
  });
}

export function notifyAllAdmins(input: {
  type: NotificationType;
  title: string;
  message: string;
  link: string;
}) {
  const admins = getRegistry().filter((u) => u.role === 'admin');
  admins.forEach((admin) => {
    addNotification({ ...input, recipientEmail: admin.email });
  });
}