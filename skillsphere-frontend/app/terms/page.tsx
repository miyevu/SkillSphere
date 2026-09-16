import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-6">Terms of Service</h1>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            SkillSphere is available to students, lecturers, and staff with a valid GCTU email address. Accounts
            are personal and should not be shared.
          </p>
          <p>
            Content you submit — portfolio projects, service listings, job posts, and messages — should be your
            own work and accurately represent what you can deliver. Lecturer verification and badges are awarded
            based on genuine review of submitted work.
          </p>
          <p>
            Marketplace transactions arranged through SkillSphere are between students and clients directly;
            the platform provides the workspace for managing milestones and communication but is not a party to
            payment agreements.
          </p>
          <p>
            Administrators may suspend accounts that misuse the platform, including impersonation, plagiarized
            submissions, or harassment.
          </p>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}