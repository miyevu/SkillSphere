'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { hasAdmin } from '@/lib/users-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminSetupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [alreadySetUp, setAlreadySetUp] = useState<boolean | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAlreadySetUp(hasAdmin());
  }, []);

  if (alreadySetUp === null) return null;

  if (alreadySetUp) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Admin already set up</h1>
          <p className="text-slate-600 mb-4">
            An administrator account already exists for this browser's data. This setup page only works once.
          </p>
          <Link href="/auth/login" className="text-primary hover:underline font-medium">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || password.length < 8) {
      setError('Fill in all fields — password needs at least 8 characters.');
      return;
    }
    setIsLoading(true);
    const result = await signup(fullName, email, password, 'admin');
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Setup failed. Please try again.');
      return;
    }
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-slate-900">Create Admin Account</h1>
          <p className="text-slate-600 text-sm mt-1">
            One-time setup — this creates the first administrator for SkillSphere.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl shadow-lg p-8 space-y-5">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@gctu.edu.gh" />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating...' : 'Create Admin Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}