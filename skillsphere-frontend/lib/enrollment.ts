'use client';

const STORAGE_KEY = 'skillsphere_enrollments';

interface Enrollment {
  skillId: string;
  enrolledDate: string; // ISO string
}

function readEnrollments(): Enrollment[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeEnrollments(data: Enrollment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function isEnrolled(skillId: string): boolean {
  return readEnrollments().some((e) => e.skillId === skillId);
}

export function enrollInSkill(skillId: string) {
  const enrollments = readEnrollments();
  if (!enrollments.some((e) => e.skillId === skillId)) {
    enrollments.push({ skillId, enrolledDate: new Date().toISOString() });
    writeEnrollments(enrollments);
  }
}

export function getEnrollmentDate(skillId: string): string | undefined {
  return readEnrollments().find((e) => e.skillId === skillId)?.enrolledDate;
}

export function getEnrolledSkillIds(): string[] {
  return readEnrollments().map((e) => e.skillId);
}

export function unenrollFromSkill(skillId: string) {
  writeEnrollments(readEnrollments().filter((e) => e.skillId !== skillId));
}