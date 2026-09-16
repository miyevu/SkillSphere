'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { addJobPost } from '@/lib/marketplace-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

export default function NewJobPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [projectType, setProjectType] = useState('');
  const [freelancersRequired, setFreelancersRequired] = useState(1);
  const [remote, setRemote] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (isLoading) return null;
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-700">
          Please <Link href="/auth/login" className="text-primary hover:underline">log in</Link> to post a job.
        </p>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSubmitting(true);

    const job = await addJobPost({
      title,
      description,
      requiredSkills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
      budget,
      deadline,
      projectType,
      freelancersRequired,
      remote,
    });

    setSubmitting(false);
    if (job) router.push(`/marketplace/jobs/${job.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/marketplace" className="text-sm text-slate-600 hover:text-primary">
            ← Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Post a Job</h1>

        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Job Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Need a landing page built" />
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the work, deliverables, and expectations"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Required Skills (comma separated)</Label>
            <Input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="e.g. React, Tailwind CSS" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Budget</Label>
              <Input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. GH₵500 - GH₵800" />
            </div>
            <div className="space-y-1.5">
              <Label>Deadline</Label>
              <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Project Type</Label>
              <Input value={projectType} onChange={(e) => setProjectType(e.target.value)} placeholder="e.g. One-time, Ongoing" />
            </div>
            <div className="space-y-1.5">
              <Label>Freelancers Needed</Label>
              <Input type="number" min={1} value={freelancersRequired} onChange={(e) => setFreelancersRequired(Number(e.target.value))} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} className="w-4 h-4" />
            This job can be done remotely
          </label>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!title.trim() || submitting} className="gap-2">
            <Save className="w-4 h-4" />
            {submitting ? 'Posting...' : 'Post Job'}
          </Button>
        </div>
      </div>
    </div>
  );
}