import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const INCLUDED = [
  'Full access to all skill tracks and lessons',
  'Portfolio builder with unlimited projects',
  'Lecturer-verified badges',
  'Freelance marketplace access',
  'Notifications and messaging',
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Pricing</h1>
        <p className="text-lg text-muted-foreground mb-12">
          SkillSphere is free for all GCTU students, lecturers, and staff — no subscription, no hidden costs.
        </p>
        <div className="bg-white border border-border rounded-lg p-10 text-left">
          <p className="text-sm font-medium text-primary mb-1">GCTU Community</p>
          <p className="text-4xl font-bold text-foreground mb-6">Free</p>
          <ul className="space-y-3 mb-8">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <Link href="/auth/signup">
            <Button size="lg" className="w-full">Create Your Account</Button>
          </Link>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}