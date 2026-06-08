import SignupForm from '@/components/auth/SignupForm';

export const metadata = {
  title: 'Sign Up - SkillSphere',
  description: 'Create a new SkillSphere account',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">SkillSphere</h1>
          <p className="text-muted-foreground">Start your skill development journey</p>
        </div>

        {/* Signup Card */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Create Account</h2>
          <SignupForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy.<br />
          Only GCTU email addresses are accepted (@gctu.edu.gh).
        </p>
      </div>
    </div>
  );
}
