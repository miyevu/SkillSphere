'use client';

// ---------- LEGACY (localStorage) — still used by badges-data.ts, assignments-data.ts,
// AuthContext.tsx (lecturer signup), and admin/dashboard/page.tsx (approve/reject/suspend)
// until those modules are migrated to the database in a future round. These notifications
// will NOT appear in the bell/notifications page below, which now reads from the database —
// that's a known, temporary gap until those modules move over too.

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

interface LegacyNotification {
  id: string;
  recipientEmail: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

const LEGACY_NOTIFICATIONS_KEY = 'skillsphere_notifications';

function legacyGenerateId() {
  return Math.random().toString(36).slice(2, 10);
}

function getLegacyNotifications(): LegacyNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LEGACY_NOTIFICATIONS_KEY);
    return raw ? (JSON.parse(raw) as LegacyNotification[]) : [];
  } catch {
    return [];
  }
}

function saveLegacyNotifications(items: LegacyNotification[]) {
  localStorage.setItem(LEGACY_NOTIFICATIONS_KEY, JSON.stringify(items));
}

export function addNotification(input: {
  recipientEmail: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
}) {
  const newNotification: LegacyNotification = {
    ...input,
    id: legacyGenerateId(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  saveLegacyNotifications([newNotification, ...getLegacyNotifications()]);
}

export function notifyAllLecturers(input: { type: NotificationType; title: string; message: string; link: string }) {
  // Reads the legacy user registry — this only reaches lecturers who exist there,
  // which is now stale since real signups go through the database instead.
  try {
    const raw = localStorage.getItem('skillsphere_registered_users');
    const registry: Array<{ email: string; role: string; status: string }> = raw ? JSON.parse(raw) : [];
    registry
      .filter((u) => u.role === 'lecturer' && u.status === 'active')
      .forEach((lecturer) => addNotification({ ...input, recipientEmail: lecturer.email }));
  } catch {
    // no-op
  }
}

export function notifyAllAdmins(input: { type: NotificationType; title: string; message: string; link: string }) {
  try {
    const raw = localStorage.getItem('skillsphere_registered_users');
    const registry: Array<{ email: string; role: string }> = raw ? JSON.parse(raw) : [];
    registry.filter((u) => u.role === 'admin').forEach((admin) => addNotification({ ...input, recipientEmail: admin.email }));
  } catch {
    // no-op
  }
}

// ---------- CURRENT (database-backed) — used by NotificationBell and /notifications ----------

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

async function fetchNotificationsData(): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
  const res = await fetch('/api/notifications');
  if (!res.ok) return { notifications: [], unreadCount: 0 };
  return res.json();
}

export async function getNotificationsForUser(): Promise<NotificationItem[]> {
  const data = await fetchNotificationsData();
  return data.notifications;
}

export async function getUnreadCount(): Promise<number> {
  const data = await fetchNotificationsData();
  return data.unreadCount;
}

export async function markAsRead(id: string): Promise<void> {
  await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
}

export async function markAllAsRead(): Promise<void> {
  await fetch('/api/notifications/read-all', { method: 'POST' });
}