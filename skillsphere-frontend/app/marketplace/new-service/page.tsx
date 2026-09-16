'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { categories as skillCategories } from '@/lib/skills-data';
import { addServiceListing, getEmptyPackage, ServicePackage, SampleLink, FAQ } from '@/lib/marketplace-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Save } from 'lucide-react';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function NewServicePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [toolsText, setToolsText] = useState('');
  const [availability, setAvailability] = useState<'available' | 'busy' | 'not_available'>('available');
  const [location, setLocation] = useState('');
  const [terms, setTerms] = useState('');
  const [packages, setPackages] = useState<ServicePackage[]>([
    getEmptyPackage('Basic'),
    getEmptyPackage('Standard'),
    getEmptyPackage('Premium'),
  ]);
  const [sampleLinks, setSampleLinks] = useState<SampleLink[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (isLoading) return null;
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-slate-700">
          Please <Link href="/auth/login" className="text-primary hover:underline">log in</Link> to offer a service.
        </p>
      </div>
    );
  }

  const updatePackage = (id: string, patch: Partial<ServicePackage>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removePackage = (id: string) => setPackages((prev) => prev.filter((p) => p.id !== id));
  const addPackage = () => setPackages((prev) => [...prev, getEmptyPackage('Custom')]);

  const addSample = () => setSampleLinks((prev) => [...prev, { id: generateId(), label: '', url: '' }]);
  const updateSample = (id: string, patch: Partial<SampleLink>) =>
    setSampleLinks((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const removeSample = (id: string) => setSampleLinks((prev) => prev.filter((s) => s.id !== id));

  const addFaq = () => setFaqs((prev) => [...prev, { id: generateId(), question: '', answer: '' }]);
  const updateFaq = (id: string, patch: Partial<FAQ>) =>
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const removeFaq = (id: string) => setFaqs((prev) => prev.filter((f) => f.id !== id));

  // const handleSubmit = async () => {
  //   if (!title.trim() || packages.length === 0) return;
  //   setSubmitting(true);

  //   const listing = await addServiceListing({
  //     title,
  //     category,
  //     description,
  //     skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
  //     tools: toolsText.split(',').map((s) => s.trim()).filter(Boolean),
  //     packages,
  //     sampleLinks,
  //     faqs,
  //     availability,
  //     location,
  //     terms,
  //   });

  //   setSubmitting(false);
  //   if (listing) router.push(`/marketplace/services/${listing.id}`);
  // };

    const handleSubmit = async () => {
    if (!title.trim() || packages.length === 0) return;
    setSubmitting(true);
    setError('');

    const listing = await addServiceListing({
      title,
      category,
      description,
      skills: skillsText.split(',').map((s) => s.trim()).filter(Boolean),
      tools: toolsText.split(',').map((s) => s.trim()).filter(Boolean),
      packages,
      sampleLinks,
      faqs,
      availability,
      location,
      terms,
    });

    setSubmitting(false);
    if (listing) {
      router.push(`/marketplace/services/${listing.id}`);
    } else {
      setError('Failed to publish — please make sure you are logged in, then try again.');
    }
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
        <h1 className="text-2xl font-bold text-slate-900">Offer a Service</h1>

        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Service Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. I will design a professional logo" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Select category</option>
                {skillCategories.filter((c) => c !== 'All Skills').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Availability</Label>
              <select value={availability} onChange={(e) => setAvailability(e.target.value as typeof availability)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="not_available">Not Available</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What do you offer and why should a client choose you?"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Skills (comma separated)</Label>
              <Input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="e.g. Figma, Branding" />
            </div>
            <div className="space-y-1.5">
              <Label>Tools (comma separated)</Label>
              <Input value={toolsText} onChange={(e) => setToolsText(e.target.value)} placeholder="e.g. Canva, Photoshop" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Service Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Remote, or Accra (on-site available)" />
          </div>

          <div className="space-y-1.5">
            <Label>Terms and Conditions</Label>
            <textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={2}
              placeholder="Any conditions clients should know before hiring"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Service Packages</h2>
            <Button size="sm" variant="outline" onClick={addPackage} className="gap-1">
              <Plus className="w-4 h-4" />
              Add Package
            </Button>
          </div>
          {packages.map((pkg) => (
            <div key={pkg.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Input
                  value={pkg.name}
                  onChange={(e) => updatePackage(pkg.id, { name: e.target.value })}
                  className="font-semibold w-40"
                />
                <Button size="icon" variant="ghost" onClick={() => removePackage(pkg.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Price (GH₵)</Label>
                  <Input type="number" value={pkg.price} onChange={(e) => updatePackage(pkg.id, { price: Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Delivery (days)</Label>
                  <Input type="number" value={pkg.deliveryDays} onChange={(e) => updatePackage(pkg.id, { deliveryDays: Number(e.target.value) })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Revisions</Label>
                  <Input type="number" value={pkg.revisions} onChange={(e) => updatePackage(pkg.id, { revisions: Number(e.target.value) })} />
                </div>
              </div>
              <textarea
                value={pkg.description}
                onChange={(e) => updatePackage(pkg.id, { description: e.target.value })}
                rows={2}
                placeholder="What's included in this package"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          ))}
        </div>

        <div className="bg-white border rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Sample Work</h2>
            <Button size="sm" variant="outline" onClick={addSample} className="gap-1">
              <Plus className="w-4 h-4" />
              Add Link
            </Button>
          </div>
          {sampleLinks.map((link) => (
            <div key={link.id} className="flex gap-2 items-center">
              <Input value={link.label} onChange={(e) => updateSample(link.id, { label: e.target.value })} placeholder="Label" className="w-40" />
              <Input value={link.url} onChange={(e) => updateSample(link.id, { url: e.target.value })} placeholder="https://..." className="flex-1" />
              <Button size="icon" variant="ghost" onClick={() => removeSample(link.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
          {sampleLinks.length === 0 && <p className="text-xs text-slate-500">Link to your best relevant portfolio work.</p>}
        </div>

        <div className="bg-white border rounded-lg p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Frequently Asked Questions</h2>
            <Button size="sm" variant="outline" onClick={addFaq} className="gap-1">
              <Plus className="w-4 h-4" />
              Add FAQ
            </Button>
          </div>
          {faqs.map((faq) => (
            <div key={faq.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex gap-2">
                <Input value={faq.question} onChange={(e) => updateFaq(faq.id, { question: e.target.value })} placeholder="Question" className="flex-1" />
                <Button size="icon" variant="ghost" onClick={() => removeFaq(faq.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
              <Input value={faq.answer} onChange={(e) => updateFaq(faq.id, { answer: e.target.value })} placeholder="Answer" />
            </div>
          ))}
        </div>

        {/* <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!title.trim() || submitting} className="gap-2">
            <Save className="w-4 h-4" />
            {submitting ? 'Publishing...' : 'Publish Service'}
          </Button>
        </div> */}
        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm border border-destructive/20">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!title.trim() || submitting} className="gap-2">
            <Save className="w-4 h-4" />
            {submitting ? 'Publishing...' : 'Publish Service'}
          </Button>
        </div>
      </div>
    </div>
  );
}