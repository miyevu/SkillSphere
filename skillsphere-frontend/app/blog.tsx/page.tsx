import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { Newspaper } from 'lucide-react';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Newspaper className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Nothing published yet — check back soon for updates, student spotlights, and platform news.
        </p>
      </div>
      <PublicFooter />
    </div>
  );
}