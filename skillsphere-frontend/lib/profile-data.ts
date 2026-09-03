'use client';

export type WorkType = 'remote' | 'physical' | 'hybrid' | 'internship';
export type Availability = 'available' | 'busy' | 'not_available';
export type ProfileVisibility = 'public' | 'institution' | 'private';

export interface SkillProficiency {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface ExternalLink {
  id: string;
  label: string;
  url: string;
}

export interface StudentProfile {
  fullName: string;
  photo: string;
  programme: string;
  department: string;
  level: string;
  institution: string;
  bio: string;
  skills: SkillProficiency[];
  availability: Availability;
  preferredWorkType: WorkType;
  location: string;
  timezone: string;
  externalLinks: ExternalLink[];
  visibility: ProfileVisibility;
}

const STORAGE_KEY = 'skillsphere_student_profile';

export function getDefaultProfile(fullName: string): StudentProfile {
  return {
    fullName,
    photo: '🧑‍🎓',
    programme: '',
    department: '',
    level: '',
    institution: 'Ghana Communication Technology University (GCTU)',
    bio: '',
    skills: [],
    availability: 'available',
    preferredWorkType: 'remote',
    location: '',
    timezone: '',
    externalLinks: [],
    visibility: 'institution',
  };
}

export function getProfile(fullName: string): StudentProfile {
  if (typeof window === 'undefined') return getDefaultProfile(fullName);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProfile(fullName);
    const parsed = JSON.parse(raw) as StudentProfile;
    return { ...getDefaultProfile(fullName), ...parsed, fullName: parsed.fullName || fullName };
  } catch {
    return getDefaultProfile(fullName);
  }
}

export function saveProfile(profile: StudentProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}