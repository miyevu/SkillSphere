'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getJobPost, JobPost, getProposalsForJob, Proposal, addProposal, acceptProposal,
} from '@/lib/marketplace-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { DollarSign, Calendar, MapPin, Users, CheckCircle } from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<JobPost | null | undefined>(undefined);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const [coverLetter, setCoverLetter] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [proposedDeliveryDays, setProposedDeliveryDays] = useState('');

  const refresh = () => {
    const j = getJobPost(params.id as string);
    setJob(j);
    if (j) setProposals(getProposalsForJob(j.id));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (job === undefined) return null;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Job not found</h1>
          <Link href="/marketplace" className="text-primary hover:underline">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.email === job.clientEmail;
  const myProposal = user ? proposals.find((p) => p.studentEmail === user.email) : undefined;

  const handleSubmitProposal = () => {
    if (!user || !coverLetter.trim() || !proposedPrice || !proposedDeliveryDays) return;
    addProposal({
      jobId: job.id,
      studentEmail: user.email,
      studentName: user.fullName,
      coverLetter,
      proposedPrice: Number(proposedPrice),
      proposedDeliveryDays: Number(proposedDeliveryDays),
    });
    refresh();
    setCoverLetter('');
    setProposedPrice('');
    setProposedDeliveryDays('');
  };

  const handleAccept = (proposal: Proposal) => {
    const project = acceptProposal(proposal, job);
    router.push(`/marketplace/projects/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/marketplace" className="text-sm text-slate-600 hover:text-primary">
            ← Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
              {job.status === 'open' ? 'Open' : 'Closed'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-4">Posted by {job.clientName}</p>
          <p className="text-slate-700 leading-relaxed mb-4">{job.description}</p>

          {job.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {job.requiredSkills.map((s) => (
                <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{s}</span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-slate-600 pt-4 border-t">
            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{job.budget || 'Not specified'}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Due {job.deadline || 'Not specified'}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.remote ? 'Remote' : 'On-site'}</span>
            <span className="flex items-center gap-1"><Users className="w-4 h-4" />{job.freelancersRequired} needed</span>
          </div>
        </div>

        {/* Owner view: proposals list */}
        {isOwner && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-bold text-slate-900 mb-4">Proposals ({proposals.length})</h2>
            {proposals.length === 0 ? (
              <p className="text-sm text-slate-500">No proposals yet.</p>
            ) : (
              <div className="space-y-4">
                {proposals.map((p) => (
                  <div key={p.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{p.studentName}</p>
                        <p className="text-xs text-slate-500">GH₵{p.proposedPrice} · {p.proposedDeliveryDays} days</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        p.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{p.coverLetter}</p>
                    {job.status === 'open' && p.status === 'pending' && (
                      <Button size="sm" onClick={() => handleAccept(p)} className="gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Accept & Hire
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Non-owner view: submit proposal */}
        {!isOwner && user && job.status === 'open' && !myProposal && (
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h2 className="font-bold text-slate-900">Submit a Proposal</h2>
            <div className="space-y-1.5">
              <Label>Cover Letter</Label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                placeholder="Why are you a good fit for this job?"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Your Price (GH₵)</Label>
                <Input type="number" value={proposedPrice} onChange={(e) => setProposedPrice(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Delivery Time (days)</Label>
                <Input type="number" value={proposedDeliveryDays} onChange={(e) => setProposedDeliveryDays(e.target.value)} />
              </div>
            </div>
            <Button onClick={handleSubmitProposal} disabled={!coverLetter.trim() || !proposedPrice || !proposedDeliveryDays}>
              Submit Proposal
            </Button>
          </div>
        )}

        {!isOwner && myProposal && (
          <div className="bg-white border rounded-lg p-6">
            <p className="text-sm text-slate-700">
              You submitted a proposal — status: <span className="font-medium">{myProposal.status}</span>
            </p>
          </div>
        )}

        {!user && (
          <div className="bg-white border rounded-lg p-6 text-center">
            <p className="text-slate-700 mb-2">
              <Link href="/auth/login" className="text-primary hover:underline">Log in</Link> to submit a proposal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}