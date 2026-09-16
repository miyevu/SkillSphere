import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

const FAQS = [
  { q: 'Who can sign up?', a: 'Anyone with a valid @live.gctu.edu.gh email address — students and lecturers.' },
  { q: 'How does lecturer approval work?', a: 'Lecturer accounts require admin approval before they can log in, to keep verification meaningful.' },
  { q: 'How do I earn a badge?', a: 'Add a project to your portfolio and submit it for verification. A lecturer reviews it and awards a badge if approved.' },
  { q: 'Is the marketplace real money?', a: 'The marketplace tracks agreed prices and milestones, but payment is arranged directly between the student and client — SkillSphere does not process payments.' },
  { q: 'Can I delete my account?', a: 'Contact an administrator to have your account and data removed.' },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-10">Frequently Asked Questions</h1>
        <div className="space-y-6">
          {FAQS.map((item) => (
            <div key={item.q} className="border-b border-border pb-6 last:border-0">
              <h2 className="text-lg font-semibold text-foreground mb-2">{item.q}</h2>
              <p className="text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}