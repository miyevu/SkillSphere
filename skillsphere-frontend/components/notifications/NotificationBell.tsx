'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getNotificationsForUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  Notification,
} from '@/lib/notifications-data';
import { Bell, CheckCheck } from 'lucide-react';

export default function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = () => {
    if (!user) return;
    setNotifications(getNotificationsForUser(user.email).slice(0, 8));
    setUnreadCount(getUnreadCount(user.email));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  const handleToggle = () => {
    if (!open) refresh();
    setOpen((prev) => !prev);
  };

  const handleClickNotification = (n: Notification) => {
    markAsRead(n.id);
    setOpen(false);
    router.push(n.link || '/notifications');
    refresh();
  };

  const handleMarkAllRead = () => {
    markAllAsRead(user.email);
    refresh();
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-md hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <p className="font-semibold text-sm text-slate-900">Notifications</p>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-slate-500 px-4 py-6 text-center">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleClickNotification(n)}
                    className={`w-full text-left px-4 py-3 border-b last:border-0 hover:bg-slate-50 transition-colors ${
                      !n.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900">{n.title}</p>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </button>
                ))
              )}
            </div>
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-sm text-primary hover:underline py-2.5 border-t"
            >
              View all
            </Link>
          </div>
        </>
      )}
    </div>
  );
}