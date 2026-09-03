'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getServiceListing, hireFromListing, ServiceListing, ServicePackage } from '@/lib/marketplace-data';
import { Button } from '@/components/ui/button';
import { CheckCircle, MapPin, Clock, RotateCcw } from 'lucide-react';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<ServiceListing | null | undefined>(undefined);
  const [hiring, setHiring] = useState(false);

  useEffect(() => {
    setListing(getServiceListing(params.id as string));
  }, [params.id]);

  if (listing === undefined) return null;

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Service not found</h1>
          <Link href="/marketplace" className="text-primary hover:underline">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.email === listing.studentEmail;

  const handleHire = (pkg: ServicePackage) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setHiring(true);
    const project = hireFromListing(listing, pkg, user.email, user.fullName);
    router.push(`/marketplace/projects/${project.id}`);
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <p className="text-sm text-primary font-medium mb-1">{listing.category}</p>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{listing.title}</h1>
            <p className="text-slate-600">By {listing.studentName}</p>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-bold text-slate-900 mb-3">Description</h2>
            <p className="text-slate-700 leading-relaxed">{listing.description || 'No description provided.'}</p>
          </div>

          {listing.skills.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-bold text-slate-900 mb-3">Skills & Tools</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {listing.skills.map((s) => (
                  <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{s}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {listing.tools.map((t) => (
                  <span key={t} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{t}</span>
                ))}
              </div>
            </div>
          )}

          {listing.sampleLinks.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-bold text-slate-900 mb-3">Sample Work</h2>
              <div className="space-y-1">
                {listing.sampleLinks.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-primary hover:underline">
                    {link.label || link.url}
                  </a>
                ))}
              </div>
            </div>
          )}

          {listing.faqs.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-bold text-slate-900 mb-3">FAQ</h2>
              <div className="space-y-3">
                {listing.faqs.map((faq) => (
                  <div key={faq.id}>
                    <p className="font-medium text-slate-900 text-sm">{faq.question}</p>
                    <p className="text-sm text-slate-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {listing.terms && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="font-bold text-slate-900 mb-3">Terms and Conditions</h2>
              <p className="text-sm text-slate-600">{listing.terms}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-4 sticky top-24 self-start">
          {listing.location && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              {listing.location}
            </div>
          )}

          {listing.packages.map((pkg) => (
            <div key={pkg.id} className="bg-white border rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-900">{pkg.name}</h3>
                <span className="text-xl font-bold text-primary">GH₵{pkg.price}</span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{pkg.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{pkg.deliveryDays} days</span>
                <span className="flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" />{pkg.revisions} revisions</span>
              </div>
              {isOwner ? (
                <p className="text-xs text-slate-400 text-center">This is your listing</p>
              ) : (
                <Button onClick={() => handleHire(pkg)} disabled={hiring} className="w-full gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Hire — {pkg.name}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}