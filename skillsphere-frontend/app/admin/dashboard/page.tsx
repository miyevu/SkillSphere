'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getAllUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
  getAllPortfolioItemsAdmin,
  deletePortfolioItemAdmin,
  AdminUser,
  AdminPortfolioItem,
} from '@/lib/admin-data';
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
import AppHeader from '@/components/layout/AppHeader';
import {
  Users, ShieldCheck, ShieldOff, Trash2, LayoutDashboard,
  GraduationCap, Briefcase, Award, ClipboardList,
} from 'lucide-react';

type Section = 'overview' | 'users' | 'moderation';
type RoleFilter = 'all' | 'STUDENT' | 'LECTURER' | 'ADMIN';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
  SUSPENDED: 'bg-red-100 text-red-800',
  REJECTED: 'bg-slate-100 text-slate-600',
};

export default function AdminDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [section, setSection] = useState<Section>('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<AdminPortfolioItem[]>([]);
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [userFilter, setUserFilter] = useState<RoleFilter>('all');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  const refresh = async () => {
    setDataLoading(true);
    const [usersData, portfolioData, listingsData, jobsData] = await Promise.all([
      getAllUsers(),
      getAllPortfolioItemsAdmin(),
      getServiceListings(),
      getJobPosts(),
    ]);
    setUsers(usersData);
    setPortfolioItems(portfolioData);
    setListings(listingsData);
    setJobs(jobsData);
    setBadgeCount(getBadges().length);
    setDataLoading(false);
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      refresh();
      const interval = setInterval(refresh, 15000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading || !user || user.role !== 'ADMIN') {
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

  const students = users.filter((u) => u.role === 'STUDENT');
  const lecturers = users.filter((u) => u.role === 'LECTURER');
  const admins = users.filter((u) => u.role === 'ADMIN');
  const pendingLecturers = lecturers.filter((u) => u.status === 'PENDING_APPROVAL');
  const openJobs = jobs.filter((j) => j.status === 'open');

  const filteredUsers = userFilter === 'all' ? users : users.filter((u) => u.role === userFilter);

  const handleApprove = async (targetUser: AdminUser) => {
    await updateAdminUserStatus(targetUser.id, 'ACTIVE');
    addNotification({
      recipientEmail: targetUser.email,
      type: 'account_approved',
      title: 'Your lecturer account was approved',
      message: 'You can now log in to SkillSphere.',
      link: '/auth/login',
    });
    refresh();
  };
  const handleReject = async (targetUser: AdminUser) => {
    await updateAdminUserStatus(targetUser.id, 'REJECTED');
    addNotification({
      recipientEmail: targetUser.email,
      type: 'account_rejected',
      title: 'Your lecturer application was not approved',
      message: 'Contact an administrator for details.',
      link: '/auth/login',
    });
    refresh();
  };
  const handleSuspend = async (targetUser: AdminUser) => {
    await updateAdminUserStatus(targetUser.id, 'SUSPENDED');
    addNotification({
      recipientEmail: targetUser.email,
      type: 'account_suspended',
      title: 'Your account has been suspended',
      message: 'Contact an administrator for details.',
      link: '/auth/login',
    });
    refresh();
  };
  const handleReactivate = async (targetUser: AdminUser) => {
    await updateAdminUserStatus(targetUser.id, 'ACTIVE');
    refresh();
  };
  const handleRoleChange = async (targetUser: AdminUser, role: string) => {
    await updateAdminUserRole(targetUser.id, role);
    refresh();
  };

  const handleDeletePortfolioItem = async (id: string) => {
    await deletePortfolioItemAdmin(id);
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
      <AppHeader fullName={user.fullName} variant="admin" onLogout={handleLogout} />

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

        {dataLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
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

            {section === 'users' && (
              <div className="space-y-4">
                {pendingLecturers.length > 0 && (
                  <div className="bg-white border rounded-lg p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Pending Lecturer Approvals</h3>
                    <div className="space-y-3">
                      {pendingLecturers.map((u) => (
                        <div key={u.id} className="flex items-center justify-between border rounded-lg p-3">
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
                      onChange={(e) => setUserFilter(e.target.value as RoleFilter)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="all">All roles</option>
                      <option value="STUDENT">Students</option>
                      <option value="LECTURER">Lecturers</option>
                      <option value="ADMIN">Admins</option>
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
                          <tr key={u.id} className="border-b last:border-0">
                            <td className="py-2 pr-4 font-medium text-slate-900">{u.fullName}</td>
                            <td className="py-2 pr-4 text-slate-600">{u.email}</td>
                            <td className="py-2 pr-4">
                              <select
                                value={u.role}
                                onChange={(e) => handleRoleChange(u, e.target.value)}
                                disabled={u.id === user.id}
                                className="h-8 rounded-md border border-input bg-background px-2 text-xs disabled:opacity-50"
                              >
                                <option value="STUDENT">Student</option>
                                <option value="LECTURER">Lecturer</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                            </td>
                            <td className="py-2 pr-4">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[u.status]}`}>
                                {u.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-2 pr-4">
                              {u.id === user.id ? (
                                <span className="text-xs text-slate-400">You</span>
                              ) : u.status === 'ACTIVE' ? (
                                <Button size="sm" variant="ghost" onClick={() => handleSuspend(u)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                  Suspend
                                </Button>
                              ) : (u.status === 'SUSPENDED' || u.status === 'REJECTED') ? (
                                <Button size="sm" variant="ghost" onClick={() => handleReactivate(u)}>
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
                            <p className="text-xs text-slate-500">
                              By {item.user.fullName} · {item.category || 'Uncategorized'}
                            </p>
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
          </>
        )}
      </div>
    </div>
  );
}