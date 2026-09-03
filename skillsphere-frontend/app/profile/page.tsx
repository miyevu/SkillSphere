'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  StudentProfile,
  SkillProficiency,
  ExternalLink as ProfileLink,
  WorkType,
  Availability,
  ProfileVisibility,
  getProfile,
  saveProfile,
} from '@/lib/profile-data';
import { getBadgesForStudent, Badge } from '@/lib/badges-data';
import { getStudentProgress, calculateProgress } from '@/lib/student-data';
import { getPortfolioItems, PortfolioItem } from '@/lib/portfolio-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import {
  Pencil, Save, X, Plus, Trash2, Download, MapPin, Clock, Globe,
  Award, BookOpen, Briefcase, Star, Eye, EyeOff, Users,
} from 'lucide-react';

const WORK_TYPE_LABELS: Record<WorkType, string> = {
  remote: 'Remote',
  physical: 'Physical / On-site',
  hybrid: 'Hybrid',
  internship: 'Internship',
};

const AVAILABILITY_LABELS: Record<Availability, { label: string; color: string }> = {
  available: { label: 'Available', color: 'bg-green-100 text-green-800' },
  busy: { label: 'Busy', color: 'bg-yellow-100 text-yellow-800' },
  not_available: { label: 'Not Available', color: 'bg-gray-100 text-gray-800' },
};

const VISIBILITY_LABELS: Record<ProfileVisibility, { label: string; icon: typeof Eye }> = {
  public: { label: 'Public', icon: Eye },
  institution: { label: 'Institution Only', icon: Users },
  private: { label: 'Private', icon: EyeOff },
};

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [draft, setDraft] = useState<StudentProfile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    if (user) setProfile(getProfile(user.fullName));
    setPortfolioItems(getPortfolioItems());
  }, [user]);

  if (isLoading || !user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const progress = getStudentProgress(user.email);
  const completedCourses = progress.enrolledCourses.filter(
    (c) => c.totalLessons > 0 && c.completedLessons === c.totalLessons
  );
  const featuredPortfolioItems = portfolioItems.filter((p) => p.featured);
  const displayedPortfolioItems = featuredPortfolioItems.length > 0 ? featuredPortfolioItems : portfolioItems.slice(0, 3);

  const startEditing = () => {
    setDraft(profile);
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(null);
    setEditing(false);
  };

  const saveEditing = () => {
    if (!draft) return;
    saveProfile(draft);
    setProfile(draft);
    setDraft(null);
    setEditing(false);
  };

  const updateDraft = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const addSkill = () => {
    if (!draft) return;
    updateDraft('skills', [...draft.skills, { id: generateId(), name: '', level: 'beginner' }]);
  };

  const updateSkill = (id: string, patch: Partial<SkillProficiency>) => {
    if (!draft) return;
    updateDraft('skills', draft.skills.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeSkill = (id: string) => {
    if (!draft) return;
    updateDraft('skills', draft.skills.filter((s) => s.id !== id));
  };

  const addLink = () => {
    if (!draft) return;
    updateDraft('externalLinks', [...draft.externalLinks, { id: generateId(), label: '', url: '' }]);
  };

  const updateLink = (id: string, patch: Partial<ProfileLink>) => {
    if (!draft) return;
    updateDraft('externalLinks', draft.externalLinks.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const removeLink = (id: string) => {
    if (!draft) return;
    updateDraft('externalLinks', draft.externalLinks.filter((l) => l.id !== id));
  };

  const downloadCv = () => {
    const lines = [
      profile.fullName,
      user.email,
      '',
      `${profile.programme || 'Programme not set'} — ${profile.department || 'Department not set'}`,
      `${profile.level ? `Level ${profile.level}, ` : ''}${profile.institution}`,
      '',
      'SUMMARY',
      profile.bio || '(No summary added yet)',
      '',
      'SKILLS',
      profile.skills.length
        ? profile.skills.map((s) => `- ${s.name} (${s.level})`).join('\n')
        : '(No skills added yet)',
      '',
      'LEARNING TRACKS',
      progress.enrolledCourses.length
        ? progress.enrolledCourses
            .map((c) => `- ${c.skillTitle} — ${calculateProgress(c.completedLessons, c.totalLessons)}% complete`)
            .join('\n')
        : '(Not enrolled in any tracks yet)',
      '',
      'COMPLETED COURSES',
      completedCourses.length ? completedCourses.map((c) => `- ${c.skillTitle}`).join('\n') : '(None completed yet)',
      '',
      'PORTFOLIO PROJECTS',
      portfolioItems.length
        ? portfolioItems.map((p) => `- ${p.title}${p.category ? ` (${p.category})` : ''}`).join('\n')
        : '(No portfolio projects yet)',
      '',
      'AVAILABILITY',
      `${AVAILABILITY_LABELS[profile.availability].label} — ${WORK_TYPE_LABELS[profile.preferredWorkType]}`,
      [profile.location, profile.timezone].filter(Boolean).join(' · ') || '(Location not set)',
      '',
      'LINKS',
      profile.externalLinks.length
        ? profile.externalLinks.map((l) => `- ${l.label}: ${l.url}`).join('\n')
        : '(No links added)',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.fullName.replace(/\s+/g, '_')}_CV.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const view = editing ? draft! : profile;
  const VisibilityIcon = VISIBILITY_LABELS[view.visibility].icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b bg-white sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-slate-600 hover:text-primary">
            ← Back to Dashboard
          </Link>
          {!editing ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadCv} className="gap-2">
                <Download className="w-4 h-4" />
                Download CV
              </Button>
              <Button size="sm" onClick={startEditing} className="gap-2">
                <Pencil className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={cancelEditing} className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button size="sm" onClick={saveEditing} className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Header */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="text-6xl">{view.photo}</div>
            <div className="flex-1 space-y-3">
              {editing ? (
                <Input
                  value={draft!.fullName}
                  onChange={(e) => updateDraft('fullName', e.target.value)}
                  placeholder="Full name"
                  className="text-xl font-bold max-w-sm"
                />
              ) : (
                <h1 className="text-2xl font-bold text-slate-900">{view.fullName}</h1>
              )}
              <p className="text-sm text-slate-500">{user.email}</p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${AVAILABILITY_LABELS[view.availability].color}`}>
                  {AVAILABILITY_LABELS[view.availability].label}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                  <VisibilityIcon className="w-3 h-3" />
                  {VISIBILITY_LABELS[view.visibility].label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic info */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Academic Information</h2>
          {editing ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Programme</Label>
                <Input value={draft!.programme} onChange={(e) => updateDraft('programme', e.target.value)} placeholder="e.g. BSc Computer Science" />
              </div>
              <div className="space-y-1.5">
                <Label>Department</Label>
                <Input value={draft!.department} onChange={(e) => updateDraft('department', e.target.value)} placeholder="e.g. Computing" />
              </div>
              <div className="space-y-1.5">
                <Label>Level</Label>
                <Input value={draft!.level} onChange={(e) => updateDraft('level', e.target.value)} placeholder="e.g. 300" />
              </div>
              <div className="space-y-1.5">
                <Label>Institution</Label>
                <Input value={draft!.institution} onChange={(e) => updateDraft('institution', e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-500 mb-0.5">Programme</p><p className="font-medium text-slate-900">{view.programme || '—'}</p></div>
              <div><p className="text-slate-500 mb-0.5">Department</p><p className="font-medium text-slate-900">{view.department || '—'}</p></div>
              <div><p className="text-slate-500 mb-0.5">Level</p><p className="font-medium text-slate-900">{view.level || '—'}</p></div>
              <div><p className="text-slate-500 mb-0.5">Institution</p><p className="font-medium text-slate-900">{view.institution}</p></div>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">About</h2>
          {editing ? (
            <textarea
              value={draft!.bio}
              onChange={(e) => updateDraft('bio', e.target.value)}
              rows={4}
              placeholder="A short professional summary..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          ) : (
            <p className="text-slate-700 leading-relaxed">{view.bio || 'No bio added yet.'}</p>
          )}
        </div>

        {/* Skills */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Skills</h2>
            {editing && (
              <Button size="sm" variant="outline" onClick={addSkill} className="gap-1">
                <Plus className="w-4 h-4" />
                Add Skill
              </Button>
            )}
          </div>
          {editing ? (
            <div className="space-y-3">
              {draft!.skills.map((skill) => (
                <div key={skill.id} className="flex gap-2 items-center">
                  <Input value={skill.name} onChange={(e) => updateSkill(skill.id, { name: e.target.value })} placeholder="Skill name" className="flex-1" />
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, { level: e.target.value as SkillProficiency['level'] })}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <Button size="icon" variant="ghost" onClick={() => removeSkill(skill.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {draft!.skills.length === 0 && <p className="text-sm text-slate-500">No skills yet — add one above.</p>}
            </div>
          ) : view.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {view.skills.map((skill) => (
                <span key={skill.id} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                  {skill.name} <span className="text-primary/60 capitalize">· {skill.level}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No skills added yet.</p>
          )}
        </div>

        {/* Learning tracks — real data */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">Learning Tracks</h2>
          </div>
          {progress.enrolledCourses.length > 0 ? (
            <div className="space-y-3">
              {progress.enrolledCourses.map((course) => {
                const pct = calculateProgress(course.completedLessons, course.totalLessons);
                return (
                  <div key={course.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{course.skillImage}</span>
                      <span className="font-medium text-slate-900">{course.skillTitle}</span>
                    </div>
                    <span className="text-slate-500">{pct}% complete</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Not enrolled in any tracks yet. <Link href="/skills" className="text-primary hover:underline">Browse skills</Link>
            </p>
          )}
        </div>

        {/* Completed courses */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">Completed Courses & Certificates</h2>
          </div>
          {completedCourses.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-3">
              {completedCourses.map((course) => (
                <div key={course.id} className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                  <span>{course.skillImage}</span>
                  <span className="font-medium text-slate-900">{course.skillTitle}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No courses completed yet.</p>
          )}
        </div>

        {/* Badges — still not built */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Verified Badges</h2>
          <p className="text-sm text-slate-500">
            No badges yet. Badges are earned once a lecturer verifies a completed practical project — this workflow isn't built yet.
          </p>
        </div>

        {/* Portfolio Projects — now wired to real data */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Portfolio Projects</h2>
            <Link href="/portfolio">
              <Button size="sm" variant="outline" className="gap-2">
                <Briefcase className="w-4 h-4" />
                Manage Portfolio
              </Button>
            </Link>
          </div>
          {portfolioItems.length === 0 ? (
            <p className="text-sm text-slate-500">
              No portfolio items yet. <Link href="/portfolio" className="text-primary hover:underline">Add your first project</Link>
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedPortfolioItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                    {item.featured && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />}
                  </div>
                  {item.category && <p className="text-xs text-slate-500 mb-2">{item.category}</p>}
                  <p className="text-sm text-slate-600 line-clamp-2">{item.description || 'No description.'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Marketplace — still not built */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">Freelance Services</h2>
          </div>
          <p className="text-sm text-slate-500">No services listed yet — the marketplace module isn't built yet.</p>
        </div>

        {/* Reviews — still not built */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-slate-900">Reviews & Ratings</h2>
          </div>
          <p className="text-sm text-slate-500">No reviews yet — reviews unlock after your first completed engagement.</p>
        </div>

        {/* Availability & work preferences */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Availability & Work Preferences</h2>
          {editing ? (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Availability</Label>
                <select value={draft!.availability} onChange={(e) => updateDraft('availability', e.target.value as Availability)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="not_available">Not Available</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Preferred Work Type</Label>
                <select value={draft!.preferredWorkType} onChange={(e) => updateDraft('preferredWorkType', e.target.value as WorkType)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                  <option value="remote">Remote</option>
                  <option value="physical">Physical / On-site</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input value={draft!.location} onChange={(e) => updateDraft('location', e.target.value)} placeholder="e.g. Accra, Ghana" />
              </div>
              <div className="space-y-1.5">
                <Label>Timezone</Label>
                <Input value={draft!.timezone} onChange={(e) => updateDraft('timezone', e.target.value)} placeholder="e.g. GMT" />
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><p className="text-slate-500 mb-0.5">Work Type</p><p className="font-medium text-slate-900">{WORK_TYPE_LABELS[view.preferredWorkType]}</p></div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div><p className="text-slate-500 mb-0.5">Location</p><p className="font-medium text-slate-900">{view.location || '—'}</p></div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                <div><p className="text-slate-500 mb-0.5">Timezone</p><p className="font-medium text-slate-900">{view.timezone || '—'}</p></div>
              </div>
            </div>
          )}
        </div>

        {/* External links */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-slate-900">External Links</h2>
            </div>
            {editing && (
              <Button size="sm" variant="outline" onClick={addLink} className="gap-1">
                <Plus className="w-4 h-4" />
                Add Link
              </Button>
            )}
          </div>
          {editing ? (
            <div className="space-y-3">
              {draft!.externalLinks.map((link) => (
                <div key={link.id} className="flex gap-2 items-center">
                  <Input value={link.label} onChange={(e) => updateLink(link.id, { label: e.target.value })} placeholder="Label (e.g. GitHub)" className="w-40" />
                  <Input value={link.url} onChange={(e) => updateLink(link.id, { url: e.target.value })} placeholder="https://..." className="flex-1" />
                  <Button size="icon" variant="ghost" onClick={() => removeLink(link.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {draft!.externalLinks.length === 0 && <p className="text-sm text-slate-500">No links yet — add one above.</p>}
            </div>
          ) : view.externalLinks.length > 0 ? (
            <div className="space-y-2">
              {view.externalLinks.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  {link.label || link.url}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No external links added yet.</p>
          )}
        </div>

        {/* Visibility */}
        <div className="bg-white border rounded-lg p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Profile Visibility</h2>
          {editing ? (
            <select value={draft!.visibility} onChange={(e) => updateDraft('visibility', e.target.value as ProfileVisibility)} className="w-full sm:w-64 h-10 rounded-md border border-input bg-background px-3 text-sm">
              <option value="public">Public — anyone can view</option>
              <option value="institution">Institution Only — GCTU members only</option>
              <option value="private">Private — only you can view</option>
            </select>
          ) : (
            <p className="text-sm text-slate-700 flex items-center gap-2">
              <VisibilityIcon className="w-4 h-4 text-primary" />
              {VISIBILITY_LABELS[view.visibility].label}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}