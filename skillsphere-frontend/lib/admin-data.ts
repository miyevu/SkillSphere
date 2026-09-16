'use client';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: 'STUDENT' | 'LECTURER' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED' | 'REJECTED';
}

export async function getAllUsers(): Promise<AdminUser[]> {
  const res = await fetch('/api/admin/users');
  if (!res.ok) return [];
  const data = await res.json();
  return data.users || [];
}

export async function updateAdminUserRole(userId: string, role: string): Promise<void> {
  await fetch(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
}

export async function updateAdminUserStatus(userId: string, status: string): Promise<void> {
  await fetch(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}

export interface AdminPortfolioItem {
  id: string;
  title: string;
  category: string;
  user: { fullName: string; email: string };
}

export async function getAllPortfolioItemsAdmin(): Promise<AdminPortfolioItem[]> {
  const res = await fetch('/api/admin/portfolio');
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

export async function deletePortfolioItemAdmin(id: string): Promise<void> {
  await fetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
}