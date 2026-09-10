'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  RegisteredUser,
  UserRole,
  findUser,
  addUser,
} from '@/lib/users-data';
import { notifyAllAdmins } from '@/lib/notifications-data';

interface AuthResult {
  success: boolean;
  error?: string;
  user?: RegisteredUser;
  pendingApproval?: boolean;
}

interface AuthContextValue {
  user: RegisteredUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (fullName: string, email: string, password: string, role: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const SESSION_KEY = 'user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      setUser(raw ? (JSON.parse(raw) as RegisteredUser) : null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    if (!password) return { success: false, error: 'Password is required' };

    const existing = findUser(email);
    if (!existing) {
      return { success: false, error: 'No account found with this email. Please sign up first.' };
    }

    if (existing.status === 'pending_approval') {
      return {
        success: false,
        error: 'Your lecturer account is pending admin approval. Please check back later.',
      };
    }
    if (existing.status === 'rejected') {
      return {
        success: false,
        error: 'Your lecturer application was not approved. Contact an administrator for details.',
      };
    }
    if (existing.status === 'suspended') {
      return { success: false, error: 'Your account has been suspended. Contact an administrator.' };
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(existing));
    setUser(existing);
    return { success: true, user: existing };
  };

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    role: string
  ): Promise<AuthResult> => {
    if (!password) return { success: false, error: 'Password is required' };

    if (findUser(email)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const normalizedRole = (['student', 'lecturer', 'admin'].includes(role) ? role : 'student') as UserRole;
    const status = normalizedRole === 'lecturer' ? 'pending_approval' : 'active';

    const newUser: RegisteredUser = { fullName, email, role: normalizedRole, status };
    addUser(newUser);

    if (status === 'pending_approval') {
      notifyAllAdmins({
        type: 'lecturer_signup',
        title: 'New lecturer signup',
        message: `${fullName} (${email}) signed up as a lecturer and needs approval.`,
        link: '/admin/dashboard',
      });
      return { success: true, user: newUser, pendingApproval: true };
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    setUser(newUser);
    return { success: true, user: newUser, pendingApproval: false };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}