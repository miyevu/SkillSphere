'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';

function redirectPathForRole(role?: string) {
  if (role === 'lecturer') return '/lecturer/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/dashboard';
}

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    setIsLoading(false);

    if (!result.success) {
      setErrors({ submit: result.error || 'Login failed. Please try again.' });
      return;
    }

    router.push(redirectPathForRole(result.user?.role));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@live.gctu.edu.gh"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
      </div>

      {errors.submit && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm border border-destructive/20">
          {errors.submit}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? 'Logging in...' : 'Log In'}
      </Button>

      <div className="space-y-2 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
        <Link href="#" className="text-sm text-primary hover:underline block">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}