import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Mail, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-6">Contact</h1>
        <p className="text-muted-foreground mb-8">
          Have a question, found a bug, or want to give feedback? Reach out — this is a student-built platform
          and every report helps.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-foreground">support@live.gctu.edu.gh</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-foreground">Ghana Communication Technology University, Accra</span>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}