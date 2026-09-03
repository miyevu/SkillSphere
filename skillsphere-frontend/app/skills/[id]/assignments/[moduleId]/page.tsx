'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getAssignmentDefinition,
  getSubmissionHistory,
  submitAssignment,
  AssignmentSubmission,
} from '@/lib/assignments-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ClipboardList, Send, CheckCircle, Clock, RotateCcw } from 'lucide-react';

const STATUS_LABELS: Record<AssignmentSubmission['status'], { label: string; color: string; icon: typeof Clock }> = {
  submitted: { label: 'Submitted — awaiting review', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  graded: { label: 'Graded', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  resubmit_requested: { label: 'Resubmission requested', color: 'bg-red-100 text-red-800', icon: RotateCcw },
};

export default function AssignmentPage() {
  const params = useParams();
  const { user, isLoading } = useAuth();
  const skillId = params.id as string;
  const moduleId = params.moduleId as string;

  const assignment = getAssignmentDefinition(skillId, moduleId);
  const [history, setHistory] = useState<AssignmentSubmission[]>([]);
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');

  const refresh = () => {
    if (user && assignment) {
      setHistory(getSubmissionHistory(assignment.id, user.email));
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, assignment?.id]);

  if (isLoading) return null;

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Assignment not found</h1>
          <Link href={`/skills/${skillId}`} className="text-primary hover:underline">Back to course</Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-700">
          Please <Link href="/auth/login" className="text-primary hover:underline">log in</Link> to submit this assignment.
        </p>
      </div>
    );
  }

  const latest = history[0];
  const canSubmit = !latest || latest.status === 'resubmit_requested';

  const handleSubmit = () => {
    if (!link.trim()) return;
    submitAssignment({
      assignmentId: assignment.id,
      skillId: assignment.skillId,
      moduleId: assignment.moduleId,
      assignmentTitle: assignment.title,
      studentEmail: user.email,
      studentName: user.fullName,
      submissionLink: link,
      submissionNote: note,
    });
    setLink('');
    setNote('');
    refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Link href={`/skills/${skillId}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary">
            <ArrowLeft className="w-4 h-4" />
            Back to {assignment.skillTitle}
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div>
          <p className="text-sm text-primary font-medium mb-1">{assignment.moduleTitle}</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{assignment.title}</h1>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-slate-900">Instructions</h2>
          </div>
          <p className="text-slate-700 leading-relaxed">{assignment.instructions}</p>
          <p className="text-xs text-slate-500 mt-3">Max score: {assignment.maxScore}</p>
        </div>

        {latest && (
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-900">Your Latest Submission</h2>
              {(() => {
                const StatusIcon = STATUS_LABELS[latest.status].icon;
                return (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${STATUS_LABELS[latest.status].color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {STATUS_LABELS[latest.status].label}
                  </span>
                );
              })()}
            </div>
            <a href={latest.submissionLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline block mb-2">
              {latest.submissionLink}
            </a>
            {latest.submissionNote && <p className="text-sm text-slate-600 mb-3">{latest.submissionNote}</p>}
            {latest.status === 'graded' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                <p className="font-medium text-green-900">Score: {latest.score} / {assignment.maxScore}</p>
                {latest.feedback && <p className="text-green-800 mt-1">"{latest.feedback}"</p>}
                <p className="text-xs text-green-700 mt-1">Graded by {latest.gradedByName}</p>
              </div>
            )}
            {latest.status === 'resubmit_requested' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                {latest.feedback && <p className="text-red-800">"{latest.feedback}"</p>}
                <p className="text-xs text-red-700 mt-1">Requested by {latest.gradedByName}</p>
              </div>
            )}
          </div>
        )}

        {canSubmit && (
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h2 className="font-bold text-slate-900">
              {latest ? 'Resubmit' : 'Submit Your Work'}
            </h2>
            <div className="space-y-1.5">
              <Label>Link to your work</Label>
              <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Briefly describe your approach or anything the lecturer should know"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button onClick={handleSubmit} disabled={!link.trim()} className="gap-2">
              <Send className="w-4 h-4" />
              {latest ? 'Resubmit' : 'Submit Assignment'}
            </Button>
          </div>
        )}

        {history.length > 1 && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-bold text-slate-900 mb-3">Submission History</h2>
            <div className="space-y-2">
              {history.slice(1).map((s) => (
                <div key={s.id} className="text-sm border-t pt-2 first:border-t-0 first:pt-0">
                  <p className="text-slate-500 text-xs">{new Date(s.submittedAt).toLocaleString()}</p>
                  <a href={s.submissionLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {s.submissionLink}
                  </a>
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${STATUS_LABELS[s.status].color}`}>
                    {STATUS_LABELS[s.status].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}