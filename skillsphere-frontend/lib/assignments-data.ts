'use client';

import { skillsData } from './skills-data';

export interface AssignmentDefinition {
  id: string;
  skillId: string;
  moduleId: string;
  skillTitle: string;
  moduleTitle: string;
  title: string;
  instructions: string;
  maxScore: number;
}

export function getAssignmentsForSkill(skillId: string): AssignmentDefinition[] {
  const skill = skillsData.find((s) => s.id === skillId);
  if (!skill) return [];
  return skill.modules.map((module) => ({
    id: `${skill.id}__${module.id}__assignment`,
    skillId: skill.id,
    moduleId: module.id,
    skillTitle: skill.title,
    moduleTitle: module.title,
    title: `${module.title} — Practical Assignment`,
    instructions: `Apply what you learned in "${module.title}" to a small practical task. Submit a link to your work (e.g. GitHub repo, live demo, or document) along with a short note on your approach.`,
    maxScore: 100,
  }));
}

export function getAssignmentDefinition(skillId: string, moduleId: string): AssignmentDefinition | undefined {
  return getAssignmentsForSkill(skillId).find((a) => a.moduleId === moduleId);
}

export function getAllAssignmentDefinitions(): AssignmentDefinition[] {
  return skillsData.flatMap((skill) => getAssignmentsForSkill(skill.id));
}

// ---------- Submissions ----------

export type SubmissionStatus = 'submitted' | 'graded' | 'resubmit_requested';

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  skillId: string;
  moduleId: string;
  assignmentTitle: string;
  studentEmail: string;
  studentName: string;
  submissionLink: string;
  submissionNote: string;
  submittedAt: string;
  status: SubmissionStatus;
  score: number | null;
  feedback: string;
  gradedByEmail: string;
  gradedByName: string;
  gradedAt: string;
}

const SUBMISSIONS_KEY = 'skillsphere_assignment_submissions';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function getSubmissions(): AssignmentSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? (JSON.parse(raw) as AssignmentSubmission[]) : [];
  } catch {
    return [];
  }
}

function saveSubmissions(items: AssignmentSubmission[]) {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(items));
}

export function getSubmissionHistory(assignmentId: string, studentEmail: string): AssignmentSubmission[] {
  return getSubmissions()
    .filter((s) => s.assignmentId === assignmentId && s.studentEmail === studentEmail)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function getLatestSubmission(assignmentId: string, studentEmail: string): AssignmentSubmission | undefined {
  return getSubmissionHistory(assignmentId, studentEmail)[0];
}

export function getSubmissionsForStudent(studentEmail: string): AssignmentSubmission[] {
  return getSubmissions().filter((s) => s.studentEmail === studentEmail);
}

export function submitAssignment(input: {
  assignmentId: string;
  skillId: string;
  moduleId: string;
  assignmentTitle: string;
  studentEmail: string;
  studentName: string;
  submissionLink: string;
  submissionNote: string;
}): AssignmentSubmission {
  const newSubmission: AssignmentSubmission = {
    ...input,
    id: generateId(),
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    score: null,
    feedback: '',
    gradedByEmail: '',
    gradedByName: '',
    gradedAt: '',
  };
  saveSubmissions([newSubmission, ...getSubmissions()]);
  return newSubmission;
}

export function gradeSubmission(
  submissionId: string,
  decision: 'graded' | 'resubmit_requested',
  score: number | null,
  feedback: string,
  gradedByEmail: string,
  gradedByName: string
) {
  const submissions = getSubmissions();
  saveSubmissions(
    submissions.map((s) =>
      s.id === submissionId
        ? { ...s, status: decision, score, feedback, gradedByEmail, gradedByName, gradedAt: new Date().toISOString() }
        : s
    )
  );
}