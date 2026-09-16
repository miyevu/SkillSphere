import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { BookOpen, Award, Briefcase, Star, Bell, ShieldCheck } from 'lucide-react';

const FEATURES = [
  { icon: BookOpen, title: 'Structured Learning', description: 'Skill tracks broken into modules and lessons, with progress tracked lesson by lesson.' },
  { icon: Award, title: 'Verified Badges', description: 'Submit portfolio projects for lecturer review and earn badges that verify real skill.' },
  { icon: Briefcase, title: 'Portfolio Builder', description: 'Showcase completed projects with skills used, outcomes, and evidence links.' },
  { icon: Star, title: 'Freelance Marketplace', description: 'Offer services or bid on jobs, then manage the work through milestones and messaging.' },
  { icon: Bell, title: 'Real-Time Notifications', description: 'Get notified when a badge is awarded, a proposal is accepted, or feedback arrives.' },
  { icon: ShieldCheck, title: 'Institutional Trust', description: "Lecturer verification and admin oversight keep the platform's activity grounded in GCTU." },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">Features</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
          Everything SkillSphere brings together to take a student from learning a skill to proving it.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="bg-white border border-border rounded-lg p-6">
                <Icon className="w-10 h-10 text-primary mb-4" />
                <h2 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h2>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}