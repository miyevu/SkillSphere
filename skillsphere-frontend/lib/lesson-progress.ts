'use client';

const STORAGE_KEY = 'skillsphere_lesson_progress';

type ProgressMap = Record<string, string[]>; // skillId -> completed lessonIds

function readProgress(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeProgress(data: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function isLessonComplete(skillId: string, lessonId: string): boolean {
  const progress = readProgress();
  return progress[skillId]?.includes(lessonId) ?? false;
}

export function getCompletedLessonIds(skillId: string): string[] {
  return readProgress()[skillId] ?? [];
}

export function markLessonComplete(skillId: string, lessonId: string) {
  const progress = readProgress();
  const existing = progress[skillId] ?? [];
  if (!existing.includes(lessonId)) {
    progress[skillId] = [...existing, lessonId];
    writeProgress(progress);
  }
}

export function markLessonIncomplete(skillId: string, lessonId: string) {
  const progress = readProgress();
  const existing = progress[skillId] ?? [];
  progress[skillId] = existing.filter((id) => id !== lessonId);
  writeProgress(progress);
}