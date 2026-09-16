'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LandingPage from '@/components/landing/LandingPage';

function redirectPathForRole(role?: string) {
  if (role === 'LECTURER') return '/lecturer/dashboard';
  if (role === 'ADMIN') return '/admin/dashboard';
  return '/dashboard';
}

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push(redirectPathForRole(user.role));
      } else {
        setShowContent(true);
      }
    }
  }, [user, isLoading, router]);

  if (!showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <LandingPage />;
}