'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { categories as skillCategories } from '@/lib/skills-data';
import { getServiceListings, getJobPosts, ServiceListing, JobPost } from '@/lib/marketplace-data';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, Search, DollarSign, Calendar, MapPin } from 'lucide-react';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'services' | 'jobs'>('services');
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getServiceListings(), getJobPosts()]).then(([l, j]) => {
      setListings(l);
      setJobs(j);
      setLoading(false);
    });
  }, []);

  const filteredListings = category === 'All' ? listings : listings.filter((l) => l.category === category);
  const openJobs = jobs.filter((j) => j.status === 'open');

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-slate-600 hover:text-primary">
            ← Back to Dashboard
          </Link>
          {user && (
            <div className="flex gap-2">
              <Link href="/marketplace/my">
                <Button variant="outline" size="sm">My Marketplace</Button>
              </Link>
              <Link href="/marketplace/new-service">
                <Button size="sm" variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Offer a Service
                </Button>
              </Link>
              <Link href="/marketplace/new-job">
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Post a Job
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Freelance Marketplace</h1>
          <p className="text-slate-600">Hire students for real work, or find work as a student freelancer.</p>
        </div>

        <div className="flex gap-2 border-b">
          <button
            onClick={() => setTab('services')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === 'services' ? 'border-primary text-primary' : 'border-transparent text-slate-500'
            }`}
          >
            Browse Services ({listings.length})
          </button>
          <button
            onClick={() => setTab('jobs')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === 'jobs' ? 'border-primary text-primary' : 'border-transparent text-slate-500'
            }`}
          >
            Browse Jobs ({openJobs.length})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {tab === 'services' && (
              <>
                <div className="flex flex-wrap gap-2">
                  {skillCategories.filter((c) => c !== 'All Skills').concat('All').map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat === 'All' ? 'All' : cat)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {filteredListings.length === 0 ? (
                  <div className="bg-white border border-dashed rounded-lg p-12 text-center">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No services yet</h3>
                    <p className="text-slate-600">Be the first to offer a service in this category.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => {
                      const cheapest = [...listing.packages].sort((a, b) => a.price - b.price)[0];
                      return (
                        <Link
                          key={listing.id}
                          href={`/marketplace/services/${listing.id}`}
                          className="bg-white border rounded-lg p-5 hover:shadow-lg transition-shadow flex flex-col"
                        >
                          <p className="text-xs text-slate-500 mb-1">{listing.category}</p>
                          <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{listing.title}</h3>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-3 flex-1">{listing.description}</p>
                          <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                            <span>By {listing.studentName}</span>
                          </div>
                          {cheapest && (
                            <div className="flex items-center justify-between pt-3 border-t">
                              <span className="text-xs text-slate-500">Starting at</span>
                              <span className="font-bold text-slate-900">GH₵{cheapest.price}</span>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {tab === 'jobs' && (
              <>
                {openJobs.length === 0 ? (
                  <div className="bg-white border border-dashed rounded-lg p-12 text-center">
                    <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No open jobs</h3>
                    <p className="text-slate-600">Check back later, or post one yourself.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {openJobs.map((job) => (
                      <Link
                        key={job.id}
                        href={`/marketplace/jobs/${job.id}`}
                        className="block bg-white border rounded-lg p-5 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-slate-900">{job.title}</h3>
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">Open</span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{job.budget}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Due {job.deadline}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.remote ? 'Remote' : 'On-site'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}