'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  getVerificationRequests,
  VerificationRequest,
  reviewVerification,
} from '@/lib/badges-data';
import {
  getSubmissions,
  AssignmentSubmission,
  gradeSubmission,
} from '@/lib/assignments-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { LogOut, CheckCircle, XCircle, ClipboardList, User, GraduationCap, ShieldCheck } from 'lucide-react';

type Section = 'verification' | 'assignments';

export default function LecturerDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [section, setSection] = useState<Section>('verification');

  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [verTab, setVerTab] = useState<'pending' | 'reviewed'>('pending');
  const [verFeedbackDrafts, setVerFeedbackDrafts] = useState<Record<string, string>>({});

  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [subTab, setSubTab] = useState<'pending' | 'graded'>('pending');
  const [scoreDrafts, setScoreDrafts] = useState<Record<string, string>>({});
  const [subFeedbackDrafts, setSubFeedbackDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/auth/login');
      } else if (user.role !== 'lecturer') {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  const refresh = () => {
    setRequests(getVerificationRequests());
    setSubmissions(getSubmissions());
  };

  useEffect(() => {
    refresh();
  }, []);

  if (isLoading || !user || user.role !== 'lecturer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const pendingVer = requests.filter((r) => r.status === 'pending');
  const reviewedVer = requests.filter((r) => r.status !== 'pending');

  const handleReviewVerification = (request: VerificationRequest, decision: 'approved' | 'rejected') => {
    const feedback = verFeedbackDrafts[request.id] || '';
    reviewVerification(request.id, decision, feedback, user.email, user.fullName);
    refresh();
  };

  const pendingSubs = submissions.filter((s) => s.status === 'submitted');
  const gradedSubs = submissions.filter((s) => s.status !== 'submitted');

  const handleGradeSubmission = (submission: AssignmentSubmission, decision: 'graded' | 'resubmit_requested') => {
    const feedback = subFeedbackDrafts[submission.id] || '';
    const scoreRaw = scoreDrafts[submission.id];
    const score = decision === 'graded' && scoreRaw ? Number(scoreRaw) : null;
    gradeSubmission(submission.id, decision, score, feedback, user.email, user.fullName);
    refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkillSphere — Lecturer
            </h1>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-slate-600" />
                <div>
                  <p className="text-slate-600 text-xs">Logged in as</p>
                  <p className="font-medium text-slate-900">{user.fullName}</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">Lecturer Dashboard</h2>
          <p className="text-slate-600">Review student work and provide feedback.</p>
        </div>

        {/* Top-level section switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setSection('verification')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              section === 'verification' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Portfolio Verification ({pendingVer.length})
          </button>
          <button
            onClick={() => setSection('assignments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              section === 'assignments' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Assignment Grading ({pendingSubs.length})
          </button>
        </div>

        {/* ---------- Portfolio Verification ---------- */}
        {section === 'verification' && (
          <>
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setVerTab('pending')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  verTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-slate-500'
                }`}
              >
                Pending ({pendingVer.length})
              </button>
              <button
                onClick={() => setVerTab('reviewed')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  verTab === 'reviewed' ? 'border-primary text-primary' : 'border-transparent text-slate-500'
                }`}
              >
                Reviewed ({reviewedVer.length})
              </button>
            </div>

            {verTab === 'pending' &&
              (pendingVer.length === 0 ? (
                <div className="bg-white border border-dashed rounded-lg p-12 text-center">
                  <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No pending requests</h3>
                  <p className="text-slate-600">Nothing to review right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingVer.map((req) => (
                    <div key={req.id} className="bg-white border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-slate-900">{req.projectTitle}</h3>
                          <p className="text-sm text-slate-500">By {req.studentName}</p>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">
                        {req.projectDescription || 'No description provided.'}
                      </p>
                      {req.projectLink && (
                        <a href={req.projectLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline block mb-4">
                          View project
                        </a>
                      )}
                      <textarea
                        value={verFeedbackDrafts[req.id] || ''}
                        onChange={(e) =>
                          setVerFeedbackDrafts((prev) => ({ ...prev, [req.id]: e.target.value }))
                        }
                        rows={2}
                        placeholder="Feedback for the student (optional)"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleReviewVerification(req, 'approved')} className="gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Approve & Award Badge
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReviewVerification(req, 'rejected')}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <XCircle className="w-4 h-4" />
                          Request Changes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {verTab === 'reviewed' &&
              (reviewedVer.length === 0 ? (
                <p className="text-sm text-slate-500">No reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {reviewedVer.map((req) => (
                    <div key={req.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-slate-900">{req.projectTitle}</p>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            req.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">By {req.studentName}</p>
                      {req.lecturerFeedback && (
                        <p className="text-sm text-slate-600 mt-2">"{req.lecturerFeedback}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
          </>
        )}

        {/* ---------- Assignment Grading ---------- */}
        {section === 'assignments' && (
          <>
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setSubTab('pending')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  subTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-slate-500'
                }`}
              >
                Pending ({pendingSubs.length})
              </button>
              <button
                onClick={() => setSubTab('graded')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                  subTab === 'graded' ? 'border-primary text-primary' : 'border-transparent text-slate-500'
                }`}
              >
                Graded ({gradedSubs.length})
              </button>
            </div>

            {subTab === 'pending' &&
              (pendingSubs.length === 0 ? (
                <div className="bg-white border border-dashed rounded-lg p-12 text-center">
                  <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No submissions to grade</h3>
                  <p className="text-slate-600">Nothing pending right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingSubs.map((sub) => (
                    <div key={sub.id} className="bg-white border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-slate-900">{sub.assignmentTitle}</h3>
                          <p className="text-sm text-slate-500">By {sub.studentName}</p>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                      <a href={sub.submissionLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline block mb-2">
                        {sub.submissionLink}
                      </a>
                      {sub.submissionNote && <p className="text-sm text-slate-700 mb-3">{sub.submissionNote}</p>}

                      <div className="flex gap-2 mb-3">
                        <Input
                          type="number"
                          placeholder="Score (0-100)"
                          value={scoreDrafts[sub.id] || ''}
                          onChange={(e) => setScoreDrafts((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                          className="w-40"
                        />
                      </div>
                      <textarea
                        value={subFeedbackDrafts[sub.id] || ''}
                        onChange={(e) => setSubFeedbackDrafts((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                        rows={2}
                        placeholder="Feedback for the student"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleGradeSubmission(sub, 'graded')} className="gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Submit Grade
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGradeSubmission(sub, 'resubmit_requested')}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <XCircle className="w-4 h-4" />
                          Request Resubmission
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {subTab === 'graded' &&
              (gradedSubs.length === 0 ? (
                <p className="text-sm text-slate-500">No graded submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {gradedSubs.map((sub) => (
                    <div key={sub.id} className="bg-white border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-slate-900">{sub.assignmentTitle}</p>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            sub.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {sub.status === 'graded' ? `Score: ${sub.score}` : 'Resubmission requested'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">By {sub.studentName}</p>
                      {sub.feedback && <p className="text-sm text-slate-600 mt-2">"{sub.feedback}"</p>}
                    </div>
                  ))}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}