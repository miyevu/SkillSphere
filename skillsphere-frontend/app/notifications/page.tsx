'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getNotificationsForUser, markAsRead, markAllAsRead, NotificationItem } from '@/lib/notifications-data';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-react';

export default function NotificationsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    if (!user) return;
    setLoading(true);
    const items = await getNotificationsForUser();
    setNotifications(items);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-700">
          Please <Link href="/auth/login" className="text-primary hover:underline">log in</Link> to view notifications.
        </p>
      </div>
    );
  }

  const dashboardPath =
    user.role === 'LECTURER' ? '/lecturer/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

  const handleClick = async (n: NotificationItem) => {
    await markAsRead(n.id);
    refresh();
    if (n.link) router.push(n.link);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    refresh();
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href={dashboardPath} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          {notifications.some((n) => !n.read) && (
            <Button size="sm" variant="outline" onClick={handleMarkAllRead} className="gap-2">
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        </div>

        <div className="flex gap-2 border-b">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              filter === 'all' ? 'border-primary text-primary' : 'border-transparent text-slate-500'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              filter === 'unread' ? 'border-primary text-primary' : 'border-transparent text-slate-500'
            }`}
          >
            Unread ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-dashed rounded-lg p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Nothing here</h3>
            <p className="text-slate-600">
              {filter === 'unread' ? "You're all caught up." : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((n) => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  !n.read ? 'border-primary/40 bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{n.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}