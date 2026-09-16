'use client';

export interface EnrollmentRecord {
  id: string;
  skillId: string;
  enrolledAt: string;
}

export async function getEnrollments(): Promise<EnrollmentRecord[]> {
  const res = await fetch('/api/enrollments');
  if (!res.ok) return [];
  const data = await res.json();
  return data.enrollments || [];
}

export async function getEnrolledSkillIds(): Promise<string[]> {
  const enrollments = await getEnrollments();
  return enrollments.map((e) => e.skillId);
}

export async function isEnrolled(skillId: string): Promise<boolean> {
  const ids = await getEnrolledSkillIds();
  return ids.includes(skillId);
}

export async function enrollInSkill(skillId: string): Promise<boolean> {
  const res = await fetch('/api/enrollments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillId }),
  });
  return res.ok;
}

export async function getEnrollmentDate(skillId: string): Promise<string | undefined> {
  const enrollments = await getEnrollments();
  return enrollments.find((e) => e.skillId === skillId)?.enrolledAt;
}