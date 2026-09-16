'use client';

export interface LessonProgressRecord {
  id: string;
  skillId: string;
  lessonId: string;
  completedAt: string;
}

export async function getAllLessonProgress(skillId?: string): Promise<LessonProgressRecord[]> {
  const url = skillId ? `/api/lesson-progress?skillId=${encodeURIComponent(skillId)}` : '/api/lesson-progress';
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.progress || [];
}

export async function getCompletedLessonIds(skillId: string): Promise<string[]> {
  const progress = await getAllLessonProgress(skillId);
  return progress.map((p) => p.lessonId);
}

export async function isLessonComplete(skillId: string, lessonId: string): Promise<boolean> {
  const ids = await getCompletedLessonIds(skillId);
  return ids.includes(lessonId);
}

export async function markLessonComplete(skillId: string, lessonId: string): Promise<boolean> {
  const res = await fetch('/api/lesson-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillId, lessonId, completed: true }),
  });
  return res.ok;
}

export async function markLessonIncomplete(skillId: string, lessonId: string): Promise<boolean> {
  const res = await fetch('/api/lesson-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillId, lessonId, completed: false }),
  });
  return res.ok;
}