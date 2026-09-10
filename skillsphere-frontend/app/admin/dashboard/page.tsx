'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getRegistry,
  RegisteredUser,
  UserRole,
  updateUserStatus,
  updateUserRole,
} from '@/lib/users-data';
import { getPortfolioItems, deletePortfolioItem, PortfolioItem } from '@/lib/portfolio-data';
import {
  getServiceListings,
  deleteServiceListing,
  ServiceListing,
  getJobPosts,
  deleteJobPost,
  JobPost,
} from '@/lib/marketplace-data';
import { getBadges } from '@/lib/badges-data';
import { addNotification } from '@/lib/notifications-data';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';
import {
  LogOut, Users, ShieldCheck, ShieldOff, Trash2, LayoutDashboard,
  GraduationCap, Briefcase, Award, ClipboardList,
} from 'lucide-react';

type Section = 'overview' | 'users' | 'moderation';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
  rejected: 'bg-slate-100 text-slate-600',
};

export default function AdminDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [section, setSection] = useState<Section>('overview');
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [userFilter, setUserFilter] = useState<'all' | UserRole>('all');

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.role !== 'admin') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  const refresh = () => {
    setUsers(getRegistry());
    setPortfolioItems(getPortfolioItems());
    setListings(getServiceListings());
    setJobs(getJobPosts());
    setBadgeCount(getBadges().length);
  };

  useEffect(() => {
    refresh();
  }, []);

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const students = users.filter((u) => u.role === 'student');
  const lecturers = users.filter((u) => u.role === 'lecturer');
  const admins = users.filter((u) => u.role === 'admin');
  const pendingLecturers = lecturers.filter((u) => u.status === 'pending_approval');
  const openJobs = jobs.filter((j) => j.status === 'open');

  const filteredUsers = userFilter === 'all' ? users : users.filter((u) => u.role === userFilter);

  const handleApprove = (targetUser: RegisteredUser) => {
    updateUserStatus(targetUser.email, 'active');
    addNotification({
      recipientEmail: targetUser.email,
      type: 'account_approved',
      title: 'Your lecturer account was approved',
      message: 'You can now log in to SkillSphere.',
      link: '/auth/login',
    });
    refresh();
  };
  const handleReject = (targetUser: RegisteredUser) => {
    updateUserStatus(targetUser.email, 'rejected');
    addNotification({
      recipientEmail: targetUser.email,
      type: 'account_rejected',
      title: 'Your lecturer application was not approved',
      message: 'Contact an administrator for details.',
      link: '/auth/login',
    });
    refresh();
  };
  const handleSuspend = (targetUser: RegisteredUser) => {
    updateUserStatus(targetUser.email, 'suspended');
    addNotification({
      recipientEmail: targetUser.email,
      type: 'account_suspended',
      title: 'Your account has been suspended',
      message: 'Contact an administrator for details.',
      link: '/auth/login',
    });
    refresh();
  };
  const handleReactivate = (email: string) => {
    updateUserStatus(email, 'active');
    refresh();
  };
  const handleRoleChange = (email: string, role: UserRole) => {
    updateUserRole(email, role);
    refresh();
  };

  const handleDeletePortfolioItem = (id: string) => {
    deletePortfolioItem(id);
    refresh();
  };
  const handleDeleteListing = (id: string) => {
    deleteServiceListing(id);
    refresh();
  };
  const handleDeleteJob = (id: string) => {
    deleteJobPost(id);
    refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkillSphere — Admin
            </h1>
            <div className="flex items-center gap-3">
              <p className="hidden md:block text-sm text-slate-600">{user.fullName}</p>
              <NotificationBell />
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">Admin Dashboard</h2>
          <p className="text-slate-600">Manage accounts, approvals, and platform content.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSection('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              section === 'overview' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setSection('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              section === 'users' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Users className="w-4 h-4" />
            Users {pendingLecturers.length > 0 && `(${pendingLecturers.length} pending)`}
          </button>
          <button
            onClick={() => setSection('moderation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              section === 'moderation' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Content Moderation
          </button>
        </div>

        {/* ---------- Overview ---------- */}
        {section === 'overview' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-slate-600">Students</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{students.length}</p>
            </div>
            <div className="bg-white border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="text-sm text-slate-600">Lecturers</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{lecturers.length}</p>
              {pendingLecturers.length > 0 && (
                <p className="text-xs text-yellow-700 mt-1">{pendingLecturers.length} pending approval</p>
              )}
            </div>
            <div className="bg-white border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm text-slate-600">Admins</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{admins.length}</p>
            </div>
            <div className="bg-white border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm text-slate-600">Badges Awarded</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{badgeCount}</p>
            </div>
            <div className="bg-white border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="text-sm text-slate-600">Portfolio Items</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{portfolioItems.length}</p>
            </div>
            <div className="bg-white border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-sm text-slate-600">Service Listings</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{listings.length}</p>
            </div>
            <div className="bg-white border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-sm text-slate-600">Open Jobs</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{openJobs.length}</p>
              <p className="text-xs text-slate-500 mt-1">{jobs.length} total posted</p>
            </div>
          </div>
        )}

        {/* ---------- Users ---------- */}
        {section === 'users' && (
          <div className="space-y-4">
            {pendingLecturers.length > 0 && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold text-slate-900 mb-4">Pending Lecturer Approvals</h3>
                <div className="space-y-3">
                  {pendingLecturers.map((u) => (
                    <div key={u.email} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <p className="font-medium text-slate-900">{u.fullName}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleApprove(u)} className="gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(u)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <ShieldOff className="w-3.5 h-3.5" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">All Users ({filteredUsers.length})</h3>
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value as 'all' | UserRole)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">All roles</option>
                  <option value="student">Students</option>
                  <option value="lecturer">Lecturers</option>
                  <option value="admin">Admins</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Role</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.email} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-medium text-slate-900">{u.fullName}</td>
                        <td className="py-2 pr-4 text-slate-600">{u.email}</td>
                        <td className="py-2 pr-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.email, e.target.value as UserRole)}
                            disabled={u.email === user.email}
                            className="h-8 rounded-md border border-input bg-background px-2 text-xs disabled:opacity-50"
                          >
                            <option value="student">Student</option>
                            <option value="lecturer">Lecturer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-2 pr-4">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[u.status]}`}>
                            {u.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          {u.email === user.email ? (
                            <span className="text-xs text-slate-400">You</span>
                          ) : u.status === 'active' ? (
                            <Button size="sm" variant="ghost" onClick={() => handleSuspend(u)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                              Suspend
                            </Button>
                          ) : (u.status === 'suspended' || u.status === 'rejected') ? (
                            <Button size="sm" variant="ghost" onClick={() => handleReactivate(u.email)}>
                              Reactivate
                            </Button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------- Moderation ---------- */}
        {section === 'moderation' && (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold text-slate-900 mb-4">Portfolio Items ({portfolioItems.length})</h3>
              {portfolioItems.length === 0 ? (
                <p className="text-sm text-slate-500">Nothing to moderate.</p>
              ) : (
                <div className="space-y-2">
                  {portfolioItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <p className="font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">{item.category || 'Uncategorized'}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePortfolioItem(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold text-slate-900 mb-4">Service Listings ({listings.length})</h3>
              {listings.length === 0 ? (
                <p className="text-sm text-slate-500">Nothing to moderate.</p>
              ) : (
                <div className="space-y-2">
                  {listings.map((listing) => (
                    <div key={listing.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <p className="font-medium text-slate-900">{listing.title}</p>
                        <p className="text-xs text-slate-500">By {listing.studentName} · {listing.category}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteListing(listing.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold text-slate-900 mb-4">Job Posts ({jobs.length})</h3>
              {jobs.length === 0 ? (
                <p className="text-sm text-slate-500">Nothing to moderate.</p>
              ) : (
                <div className="space-y-2">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <p className="font-medium text-slate-900">{job.title}</p>
                        <p className="text-xs text-slate-500">By {job.clientName} · {job.status}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}