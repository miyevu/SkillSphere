'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    } else if (!formData.email.endsWith('@gctu.edu.gh')) {
      newErrors.email = 'Please use your GCTU email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user session
      localStorage.setItem('user', JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
      }));
      
      router.push('/dashboard');
    } catch (error) {
      setErrors({ submit: 'Sign up failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Your full name"
            value={formData.fullName}
            onChange={handleInputChange}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">GCTU Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your.email@gctu.edu.gh"
            value={formData.email}
            onChange={handleInputChange}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">I am a...</Label>
        <div className="relative">
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={isLoading}
            className="w-full pl-10 pr-3 py-2 h-10 border border-input rounded-md bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleInputChange}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
        <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="pl-10"
            disabled={isLoading}
          />
        </div>
        {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
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
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-primary hover:underline font-medium">
          Log in
        </Link>
      </p>
    </form>
  );
}
