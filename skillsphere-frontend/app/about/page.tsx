import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-6">About SkillSphere</h1>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            SkillSphere was built for students at Ghana Communication Technology University who want to move
            beyond coursework and build skills they can actually show for it — a real portfolio, a
            lecturer-verified badge, a piece of freelance work completed start to finish.
          </p>
          <p>
            The platform brings together structured learning, a portfolio builder, lecturer verification, and a
            student freelance marketplace in one place, so the path from "I learned this" to "I can prove it" and
            "I got paid to do it" doesn't require five different tools.
          </p>
          <p>
            SkillSphere is a student-built academic project, developed as part of an MPhil thesis at GCTU.
          </p>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
}