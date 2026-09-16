import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            SkillSphere collects only the information needed to run the platform: your name, GCTU email address,
            and the content you create — enrollments, portfolio items, marketplace listings, messages, and reviews.
          </p>
          <p>
            Your data is used to operate your account and is visible to other users only according to the
            visibility settings you choose on your profile and portfolio items. Lecturers and administrators can
            see information necessary to verify submissions and moderate the platform.
          </p>
          <p>
            SkillSphere does not sell user data to third parties. As an academic project, this policy may be
            revised as the platform develops.
          </p>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}