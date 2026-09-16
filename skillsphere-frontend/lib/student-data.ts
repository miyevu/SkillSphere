'use client';

import { skillsData, Skill } from './skills-data';
import { getEnrollmentDate, getEnrolledSkillIds } from './enrollment';
import { getCompletedLessonIds } from './lesson-progress';

export interface EnrolledCourse {
  id: string;
  skillId: string;
  skillTitle: string;
  skillImage: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalLessons: number;
  completedLessons: number;
  completedProjects: number;
  totalProjects: number;
  enrolledDate: string;
  lastAccessedDate: string;
  instructorName: string;
  rating: number;
  totalModules: number;
  completedModules: number;
}

export interface StudentProgress {
  enrolledCourses: EnrolledCourse[];
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  averageProgress: number;
}

async function buildEnrolledCourse(skill: Skill): Promise<EnrolledCourse> {
  const completedLessonIds = await getCompletedLessonIds(skill.id);
  const totalLessons = skill.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = completedLessonIds.length;
  const completedModules = skill.modules.filter((m) =>
    m.lessons.every((l) => completedLessonIds.includes(l.id))
  ).length;
  const enrolledDate = (await getEnrollmentDate(skill.id)) ?? new Date().toISOString();

  return {
    id: `enrollment-${skill.id}`,
    skillId: skill.id,
    skillTitle: skill.title,
    skillImage: skill.image,
    category: skill.category,
    difficulty: skill.difficulty,
    totalLessons,
    completedLessons,
    completedProjects: 0,
    totalProjects: skill.projects,
    enrolledDate,
    lastAccessedDate: enrolledDate,
    instructorName: skill.instructor.name,
    rating: skill.rating,
    totalModules: skill.modules.length,
    completedModules,
  };
}

export async function getStudentProgress(): Promise<StudentProgress> {
  const enrolledSkillIds = await getEnrolledSkillIds();
  const enrolledCourses = await Promise.all(
    enrolledSkillIds
      .map((id) => skillsData.find((s) => s.id === id))
      .filter((s): s is Skill => Boolean(s))
      .map(buildEnrolledCourse)
  );

  const totalCompletedLessons = enrolledCourses.reduce((sum, c) => sum + c.completedLessons, 0);
  const totalLessonsAcrossCourses = enrolledCourses.reduce((sum, c) => sum + c.totalLessons, 0);
  const totalCoursesCompleted = enrolledCourses.filter(
    (c) => c.totalLessons > 0 && c.completedLessons === c.totalLessons
  ).length;

  return {
    enrolledCourses,
    totalCoursesEnrolled: enrolledCourses.length,
    totalCoursesCompleted,
    averageProgress:
      totalLessonsAcrossCourses === 0 ? 0 : (totalCompletedLessons / totalLessonsAcrossCourses) * 100,
  };
}

export const calculateProgress = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  const diffDays = Math.ceil(Math.abs(today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getCompletionStatus = (progress: number): { status: string; color: string } => {
  if (progress === 100) return { status: 'Completed', color: 'bg-green-100 text-green-800' };
  if (progress >= 50) return { status: 'In Progress', color: 'bg-blue-100 text-blue-800' };
  if (progress > 0) return { status: 'Started', color: 'bg-yellow-100 text-yellow-800' };
  return { status: 'Not Started', color: 'bg-gray-100 text-gray-800' };
};