'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { categories as skillCategories } from '@/lib/skills-data';
import {
  PortfolioItem,
  PortfolioVisibility,
  PortfolioStatus,
  PortfolioMediaLink,
  getPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  toggleFeatured,
  getEmptyDraft,
} from '@/lib/portfolio-data';
import {
  VerificationRequest,
  getVerificationForItem,
  submitForVerification,
} from '@/lib/badges-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import {
  Plus, Pencil, Trash2, Star, ExternalLink, X, Save,
  Eye, EyeOff, Users, Briefcase, ShieldCheck, Clock, ShieldAlert,
} from 'lucide-react';

const VISIBILITY_LABELS: Record<PortfolioVisibility, { label: string; icon: typeof Eye }> = {
  public: { label: 'Public', icon: Eye },
  institution: { label: 'Institution Only', icon: Users },
  private: { label: 'Private', icon: EyeOff },
};

const STATUS_LABELS: Record<PortfolioStatus, { label: string; color: string }> = {
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function tagsToText(tags: string[]) {
  return tags.join(', ');
}

function textToTags(text: string): string[] {
  return text
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function PortfolioPage() {
  const { user, isLoading } = useAuth();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [verifications, setVerifications] = useState<Record<string, VerificationRequest | undefined>>({});
  const [filterCategory, setFilterCategory] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [draft, setDraft] = useState(getEmptyDraft());
  const [skillsText, setSkillsText] = useState('');
  const [toolsText, setToolsText] = useState('');

  const refresh = async () => {
    const allItems = await getPortfolioItems();
    setItems(allItems);
    const verMap: Record<string, VerificationRequest | undefined> = {};
    allItems.forEach((item) => {
      verMap[item.id] = getVerificationForItem(item.id);
    });
    setVerifications(verMap);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-700 mb-4">Please log in to manage your portfolio.</p>
          <Link href="/auth/login" className="text-primary hover:underline">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  const openAddForm = () => {
    setDraft(getEmptyDraft());
    setSkillsText('');
    setToolsText('');
    setEditingId(null);
    setFormOpen(true);
  };

  const openEditForm = (item: PortfolioItem) => {
    setDraft({
      title: item.title,
      description: item.description,
      category: item.category,
      skillsUsed: item.skillsUsed,
      toolsUsed: item.toolsUsed,
      projectDate: item.projectDate,
      outcome: item.outcome,
      projectLink: item.projectLink,
      mediaLinks: item.mediaLinks,
      featured: item.featured,
      visibility: item.visibility,
      status: item.status,
    });
    setSkillsText(tagsToText(item.skillsUsed));
    setToolsText(tagsToText(item.toolsUsed));
    setEditingId(item.id);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
  };

  const updateDraft = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const addMediaLink = () => {
    updateDraft('mediaLinks', [...draft.mediaLinks, { id: generateId(), label: '', url: '' }]);
  };

  const updateMediaLink = (id: string, patch: Partial<PortfolioMediaLink>) => {
    updateDraft(
      'mediaLinks',
      draft.mediaLinks.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  };

  const removeMediaLink = (id: string) => {
    updateDraft('mediaLinks', draft.mediaLinks.filter((l) => l.id !== id));
  };

  const handleSave = async () => {
    if (!draft.title.trim()) return;

    const finalDraft = {
      ...draft,
      skillsUsed: textToTags(skillsText),
      toolsUsed: textToTags(toolsText),
    };

    if (editingId) {
      await updatePortfolioItem(editingId, finalDraft);
    } else {
      await addPortfolioItem(finalDraft);
    }
    await refresh();
    closeForm();
  };

  const handleDelete = async (id: string) => {
    await deletePortfolioItem(id);
    await refresh();
  };

  const handleToggleFeatured = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await toggleFeatured(id, item.featured);
    await refresh();
  };
  const handleSubmitForVerification = async (item: PortfolioItem) => {
    await submitForVerification({
      portfolioItemId: item.id,
      studentEmail: user.email,
      studentName: user.fullName,
      projectTitle: item.title,
      projectDescription: item.description,
      projectLink: item.projectLink,
    });
    await refresh();
  };

  const filteredItems =
    filterCategory === 'All' ? items : items.filter((i) => i.category === filterCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/profile" className="text-sm text-slate-600 hover:text-primary">
            ← Back to Profile
          </Link>
          <Button onClick={openAddForm} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Portfolio Builder</h1>
          <p className="text-slate-600">
            Showcase your projects as evidence of what you can actually do.
          </p>
        </div>

        {/* Add/Edit form */}
        {formOpen && (
          <div className="bg-white border rounded-lg p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <Button variant="ghost" size="icon" onClick={closeForm}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Project Title</Label>
                <Input
                  value={draft.title}
                  onChange={(e) => updateDraft('title', e.target.value)}
                  placeholder="e.g. Personal Portfolio Website"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <textarea
                  value={draft.description}
                  onChange={(e) => updateDraft('description', e.target.value)}
                  rows={3}
                  placeholder="What is this project and what problem does it solve?"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  value={draft.category}
                  onChange={(e) => updateDraft('category', e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select category</option>
                  {skillCategories
                    .filter((c) => c !== 'All Skills')
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  value={draft.status}
                  onChange={(e) => updateDraft('status', e.target.value as PortfolioStatus)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Project Date</Label>
                <Input
                  type="date"
                  value={draft.projectDate}
                  onChange={(e) => updateDraft('projectDate', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Project Link (GitHub / Live Site)</Label>
                <Input
                  value={draft.projectLink}
                  onChange={(e) => updateDraft('projectLink', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-1.5">
                <Label>Skills Used</Label>
                <Input
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="e.g. HTML, CSS, JavaScript (comma separated)"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Tools Used</Label>
                <Input
                  value={toolsText}
                  onChange={(e) => setToolsText(e.target.value)}
                  placeholder="e.g. VS Code, Figma (comma separated)"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label>Outcome</Label>
                <textarea
                  value={draft.outcome}
                  onChange={(e) => updateDraft('outcome', e.target.value)}
                  rows={2}
                  placeholder="What was the result? What did you learn or achieve?"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="space-y-1.5">
                <Label>Visibility</Label>
                <select
                  value={draft.visibility}
                  onChange={(e) => updateDraft('visibility', e.target.value as PortfolioVisibility)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="public">Public — anyone can view</option>
                  <option value="institution">Institution Only</option>
                  <option value="private">Private — only you</option>
                </select>
              </div>

              <div className="space-y-1.5 flex items-end">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => updateDraft('featured', e.target.checked)}
                    className="w-4 h-4"
                  />
                  Mark as featured
                </label>
              </div>
            </div>

            {/* Media links */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Media / Evidence Links</Label>
                <Button size="sm" variant="outline" onClick={addMediaLink} className="gap-1">
                  <Plus className="w-4 h-4" />
                  Add Link
                </Button>
              </div>
              {draft.mediaLinks.map((link) => (
                <div key={link.id} className="flex gap-2 items-center">
                  <Input
                    value={link.label}
                    onChange={(e) => updateMediaLink(link.id, { label: e.target.value })}
                    placeholder="Label (e.g. Design File, Demo Video)"
                    className="w-48"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => updateMediaLink(link.id, { url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <Button size="icon" variant="ghost" onClick={() => removeMediaLink(link.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {draft.mediaLinks.length === 0 && (
                <p className="text-xs text-slate-500">
                  No file upload yet — link to images, videos, or documents hosted elsewhere (e.g. Google Drive, Imgur).
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2" disabled={!draft.title.trim()}>
                <Save className="w-4 h-4" />
                {editingId ? 'Save Changes' : 'Add Project'}
              </Button>
            </div>
          </div>
        )}

        {/* Filter */}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === 'All' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            {Array.from(new Set(items.map((i) => i.category).filter(Boolean))).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Items grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-dashed rounded-lg p-12 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {items.length === 0 ? 'No projects yet' : 'No projects in this category'}
            </h3>
            <p className="text-slate-600 mb-4">
              Add evidence of what you've built — not just a description, but the real thing.
            </p>
            {items.length === 0 && (
              <Button onClick={openAddForm} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const VisIcon = VISIBILITY_LABELS[item.visibility].icon;
              const verification = verifications[item.id];

              return (
                <div key={item.id} className="bg-white border rounded-lg overflow-hidden flex flex-col">
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_LABELS[item.status].color}`}>
                        {STATUS_LABELS[item.status].label}
                      </span>
                      <button onClick={() => handleToggleFeatured(item.id)} title="Toggle featured">
                        <Star
                          className={`w-5 h-5 ${item.featured ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                        />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-2">{item.title}</h3>
                    {item.category && <p className="text-xs text-slate-500 mb-2">{item.category}</p>}
                    <p className="text-sm text-slate-600 line-clamp-3 mb-3 flex-1">
                      {item.description || 'No description added.'}
                    </p>

                    {item.skillsUsed.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.skillsUsed.slice(0, 4).map((skill) => (
                          <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.projectLink && (
                      <a
                        href={item.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline mb-3"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Project
                      </a>
                    )}

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                      <VisIcon className="w-3.5 h-3.5" />
                      {VISIBILITY_LABELS[item.visibility].label}
                    </div>

                    {/* Verification status */}
                    <div className="mb-4">
                      {!verification && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSubmitForVerification(item)}
                          className="w-full gap-2"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Submit for Verification
                        </Button>
                      )}
                      {verification?.status === 'pending' && (
                        <div className="flex items-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded-md bg-yellow-50 text-yellow-800 border border-yellow-200">
                          <Clock className="w-3.5 h-3.5" />
                          Pending lecturer review
                        </div>
                      )}
                      {verification?.status === 'approved' && (
                        <div className="text-xs font-medium px-2 py-1.5 rounded-md bg-green-50 text-green-800 border border-green-200">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified — badge awarded
                          </div>
                          {verification.lecturerFeedback && (
                            <p className="mt-1 font-normal text-green-700">"{verification.lecturerFeedback}"</p>
                          )}
                        </div>
                      )}
                      {verification?.status === 'rejected' && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium px-2 py-1.5 rounded-md bg-red-50 text-red-800 border border-red-200">
                            <div className="flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Changes requested
                            </div>
                            {verification.lecturerFeedback && (
                              <p className="mt-1 font-normal text-red-700">"{verification.lecturerFeedback}"</p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSubmitForVerification(item)}
                            className="w-full gap-2"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Resubmit for Verification
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto pt-3 border-t">
                      <Button size="sm" variant="outline" onClick={() => openEditForm(item)} className="flex-1 gap-1">
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}