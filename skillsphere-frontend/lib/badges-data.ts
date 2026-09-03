'use client';

export type VerificationStatus = 'pending' | 'approved' | 'rejected';

export interface VerificationRequest {
  id: string;
  portfolioItemId: string;
  studentEmail: string;
  studentName: string;
  projectTitle: string;
  projectDescription: string;
  projectLink: string;
  status: VerificationStatus;
  lecturerFeedback: string;
  lecturerEmail: string;
  reviewedAt: string;
  submittedAt: string;
}

export interface Badge {
  id: string;
  studentEmail: string;
  title: string;
  portfolioItemId: string;
  verificationId: string;
  awardedByEmail: string;
  awardedByName: string;
  awardedAt: string;
}

const REQUESTS_KEY = 'skillsphere_verification_requests';
const BADGES_KEY = 'skillsphere_badges';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function getVerificationRequests(): VerificationRequest[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? (JSON.parse(raw) as VerificationRequest[]) : [];
  } catch {
    return [];
  }
}

function saveRequests(items: VerificationRequest[]) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(items));
}

export function submitForVerification(item: {
  portfolioItemId: string;
  studentEmail: string;
  studentName: string;
  projectTitle: string;
  projectDescription: string;
  projectLink: string;
}): VerificationRequest {
  const newRequest: VerificationRequest = {
    ...item,
    id: generateId(),
    status: 'pending',
    lecturerFeedback: '',
    lecturerEmail: '',
    reviewedAt: '',
    submittedAt: new Date().toISOString(),
  };
  // Remove any older request for the same portfolio item so resubmission replaces it.
  const others = getVerificationRequests().filter((r) => r.portfolioItemId !== item.portfolioItemId);
  saveRequests([newRequest, ...others]);
  return newRequest;
}

export function getVerificationForItem(portfolioItemId: string): VerificationRequest | undefined {
  return getVerificationRequests().find((r) => r.portfolioItemId === portfolioItemId);
}

export function getBadges(): Badge[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    return raw ? (JSON.parse(raw) as Badge[]) : [];
  } catch {
    return [];
  }
}

function saveBadges(items: Badge[]) {
  localStorage.setItem(BADGES_KEY, JSON.stringify(items));
}

export function getBadgesForStudent(studentEmail: string): Badge[] {
  return getBadges().filter((b) => b.studentEmail === studentEmail);
}

export function reviewVerification(
  requestId: string,
  decision: 'approved' | 'rejected',
  feedback: string,
  lecturerEmail: string,
  lecturerName: string
) {
  const requests = getVerificationRequests();
  const request = requests.find((r) => r.id === requestId);
  if (!request) return;

  saveRequests(
    requests.map((r) =>
      r.id === requestId
        ? { ...r, status: decision, lecturerFeedback: feedback, lecturerEmail, reviewedAt: new Date().toISOString() }
        : r
    )
  );

  if (decision === 'approved') {
    const badge: Badge = {
      id: generateId(),
      studentEmail: request.studentEmail,
      title: request.projectTitle,
      portfolioItemId: request.portfolioItemId,
      verificationId: request.id,
      awardedByEmail: lecturerEmail,
      awardedByName: lecturerName,
      awardedAt: new Date().toISOString(),
    };
    saveBadges([badge, ...getBadges()]);
  }
}