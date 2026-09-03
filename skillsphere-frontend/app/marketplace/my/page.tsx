'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  getServiceListings, ServiceListing, deleteServiceListing,
  getJobPosts, JobPost,
  getProposals, Proposal,
  getProjects, Project,
} from '@/lib/marketplace-data';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink } from 'lucide-react';

type Tab = 'services' | 'jobs' | 'proposals' | 'projects';

export default function MyMarketplacePage() {
  const { user, isLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('services');
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setListings(getServiceListings());
    setJobs(getJobPosts());
    setProposals(getProposals());
    setProjects(getProjects());
  }, []);

  if (isLoading) return null;
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-700">
          Please <Link href="/auth/login" className="text-primary hover:underline">log in</Link>.
        </p>
      </div>
    );
  }

  const myListings = listings.filter((l) => l.studentEmail === user.email);
  const myJobs = jobs.filter((j) => j.clientEmail === user.email);
  const myProposals = proposals.filter((p) => p.studentEmail === user.email);
  const myProjects = projects.filter((p) => p.clientEmail === user.email || p.freelancerEmail === user.email);

  const handleDeleteListing = (id: string) => {
    deleteServiceListing(id);
    setListings(getServiceListings());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/marketplace" className="text-sm text-slate-600 hover:text-primary">
            ← Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">My Marketplace</h1>

        <div className="flex gap-2 border-b flex-wrap">
          {([
            ['services', `My Services (${myListings.length})`],
            ['jobs', `My Job Posts (${myJobs.length})`],
            ['proposals', `My Proposals (${myProposals.length})`],
            ['projects', `My Projects (${myProjects.length})`],
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                tab === key ? 'border-primary text-primary' : 'border-transparent text-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'services' && (
          <div className="space-y-3">
            {myListings.length === 0 ? (
              <p className="text-sm text-slate-500">
                You haven't listed any services. <Link href="/marketplace/new-service" className="text-primary hover:underline">Offer one</Link>.
              </p>
            ) : (
              myListings.map((l) => (
                <div key={l.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{l.title}</p>
                    <p className="text-xs text-slate-500">{l.category} · {l.packages.length} package(s)</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/marketplace/services/${l.id}`}>
                      <Button size="sm" variant="outline" className="gap-1"><ExternalLink className="w-3.5 h-3.5" />View</Button>
                    </Link>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteListing(l.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'jobs' && (
          <div className="space-y-3">
            {myJobs.length === 0 ? (
              <p className="text-sm text-slate-500">
                You haven't posted any jobs. <Link href="/marketplace/new-job" className="text-primary hover:underline">Post one</Link>.
              </p>
            ) : (
              myJobs.map((j) => (
                <Link key={j.id} href={`/marketplace/jobs/${j.id}`} className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{j.title}</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${j.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                      {j.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {tab === 'proposals' && (
          <div className="space-y-3">
            {myProposals.length === 0 ? (
              <p className="text-sm text-slate-500">You haven't submitted any proposals yet.</p>
            ) : (
              myProposals.map((p) => {
                const job = jobs.find((j) => j.id === p.jobId);
                return (
                  <Link key={p.id} href={`/marketplace/jobs/${p.jobId}`} className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900">{job?.title || 'Job'}</p>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        p.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">GH₵{p.proposedPrice} · {p.proposedDeliveryDays} days</p>
                  </Link>
                );
              })
            )}
          </div>
        )}

        {tab === 'projects' && (
          <div className="space-y-3">
            {myProjects.length === 0 ? (
              <p className="text-sm text-slate-500">No active projects yet.</p>
            ) : (
              myProjects.map((p) => (
                <Link key={p.id} href={`/marketplace/projects/${p.id}`} className="block bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-slate-900">{p.title}</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      p.status === 'completed' ? 'bg-green-100 text-green-800' :
                      p.status === 'delivered' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {p.clientEmail === user.email ? `Freelancer: ${p.freelancerName}` : `Client: ${p.clientName}`} · GH₵{p.agreedPrice}
                  </p>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}