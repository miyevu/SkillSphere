'use client';

import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotificationBell from '@/components/notifications/NotificationBell';

interface AppHeaderProps {
  fullName: string;
  variant: 'student' | 'lecturer' | 'admin';
  onLogout: () => void;
}

const VARIANT_LABEL: Record<AppHeaderProps['variant'], string> = {
  student: 'SkillSphere',
  lecturer: 'SkillSphere — Lecturer',
  admin: 'SkillSphere — Admin',
};

export default function AppHeader({ fullName, variant, onLogout }: AppHeaderProps) {
  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            {VARIANT_LABEL[variant]}
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-slate-600" />
              <div>
                <p className="text-slate-600 text-xs">Logged in as</p>
                <p className="font-medium text-slate-900">{fullName}</p>
              </div>
            </div>

            {variant === 'student' && (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">View Profile</Button>
                </Link>
                <Link href="/portfolio">
                  <Button variant="ghost" size="sm">Portfolio</Button>
                </Link>
                <Link href="/marketplace">
                  <Button variant="ghost" size="sm">Marketplace</Button>
                </Link>
              </>
            )}

            <NotificationBell />
            <Button
              onClick={onLogout}
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
  );
}