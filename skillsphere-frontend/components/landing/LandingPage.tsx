'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Award, 
  Users, 
  TrendingUp, 
  CheckCircle2,
  ArrowRight,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Learning',
      description: 'Access structured learning materials, videos, and interactive resources for practical skill development.'
    },
    {
      icon: Award,
      title: 'Verified Badges',
      description: 'Earn recognized badges upon completing skill areas, verified by lecturers and the institution.'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed progress tracking and insights in each skill area.'
    },
    {
      icon: Users,
      title: 'Mentor Support',
      description: 'Get feedback from experienced lecturers and connect with peers on your skill development path.'
    }
  ];

  const skills = [
    'Web Development',
    'Mobile App Development',
    'Data Analysis',
    'Digital Marketing',
    'UI/UX Design',
    'Cloud Computing'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">SkillSphere</span>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Move from Theory to <span className="text-primary">Practical Skills</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              SkillSphere is a platform for GCTU students to develop practical skills, build portfolios, and earn verified badges through structured learning and real-world projects.
            </p>
            <div className="flex gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/skills">
                <Button size="lg" variant="outline">
                  Browse Skills
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-12 h-96 flex items-center justify-center">
            <div className="text-center">
              <BookOpen className="w-24 h-24 text-primary mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Start your skill development journey today</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose SkillSphere?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to succeed</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills Available */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Skills You Can Learn</h2>
          <p className="text-lg text-muted-foreground">Explore diverse skill areas designed for practical career growth</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-muted/40 rounded-lg border border-border hover:bg-muted transition-colors">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="font-medium text-foreground">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/40 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '1', title: 'Sign Up', description: 'Create your account with your GCTU email' },
              { number: '2', title: 'Choose Skills', description: 'Browse and select skill areas to learn' },
              { number: '3', title: 'Learn & Practice', description: 'Complete materials, videos, and assignments' },
              { number: '4', title: 'Earn Badges', description: 'Get verified badges upon completion' }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-primary text-primary-foreground rounded-lg p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-lg mb-8 opacity-90">Join hundreds of GCTU students developing practical skills and building their portfolios.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary">
                Create Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                I Already Have an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">SkillSphere</h3>
              <p className="text-sm text-muted-foreground">Practical skill development platform for GCTU students.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Skills</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 SkillSphere. Built for Ghana Communication Technology University (GCTU).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
