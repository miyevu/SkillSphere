import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - SkillSphere',
  description: 'Login to your SkillSphere account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">SkillSphere</h1>
          <p className="text-muted-foreground">Move from theory to practical skills</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Welcome Back</h2>
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Only GCTU students, lecturers, and staff can access this platform.
        </p>
      </div>
    </div>
  );
}
