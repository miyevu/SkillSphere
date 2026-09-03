'use client';

export type UserRole = 'student' | 'lecturer' | 'admin';
export type UserStatus = 'active' | 'pending_approval' | 'suspended' | 'rejected';

export interface RegisteredUser {
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

const REGISTRY_KEY = 'skillsphere_registered_users';

export function getRegistry(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    return raw ? (JSON.parse(raw) as RegisteredUser[]) : [];
  } catch {
    return [];
  }
}

export function saveRegistry(users: RegisteredUser[]) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(users));
}

export function findUser(email: string): RegisteredUser | undefined {
  return getRegistry().find((u) => u.email === email);
}

export function addUser(user: RegisteredUser) {
  saveRegistry([...getRegistry(), user]);
}

export function updateUserStatus(email: string, status: UserStatus) {
  saveRegistry(getRegistry().map((u) => (u.email === email ? { ...u, status } : u)));
}

export function updateUserRole(email: string, role: UserRole) {
  saveRegistry(getRegistry().map((u) => (u.email === email ? { ...u, role } : u)));
}

export function hasAdmin(): boolean {
  return getRegistry().some((u) => u.role === 'admin');
}