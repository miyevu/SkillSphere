'use client';

export interface Review {
  id: string;
  projectId: string;
  reviewerEmail: string;
  reviewerName: string;
  revieweeEmail: string;
  revieweeName: string;
  overallRating: number; // 1-5
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  professionalismRating: number;
  comment: string;
  response: string; // reviewee's reply, empty until they respond
  respondedAt: string;
  createdAt: string;
}

const REVIEWS_KEY = 'skillsphere_reviews';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function getReviews(): Review[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function saveReviews(items: Review[]) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(items));
}

export function getReviewsForUser(email: string): Review[] {
  return getReviews()
    .filter((r) => r.revieweeEmail === email)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getReviewForProjectByReviewer(projectId: string, reviewerEmail: string): Review | undefined {
  return getReviews().find((r) => r.projectId === projectId && r.reviewerEmail === reviewerEmail);
}

export function getReviewsForProject(projectId: string): Review[] {
  return getReviews().filter((r) => r.projectId === projectId);
}

export function addReview(input: {
  projectId: string;
  reviewerEmail: string;
  reviewerName: string;
  revieweeEmail: string;
  revieweeName: string;
  overallRating: number;
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  professionalismRating: number;
  comment: string;
}): Review {
  const newReview: Review = {
    ...input,
    id: generateId(),
    response: '',
    respondedAt: '',
    createdAt: new Date().toISOString(),
  };
  saveReviews([newReview, ...getReviews()]);
  return newReview;
}

export function respondToReview(reviewId: string, response: string) {
  saveReviews(
    getReviews().map((r) =>
      r.id === reviewId ? { ...r, response, respondedAt: new Date().toISOString() } : r
    )
  );
}

export function getAverageRating(email: string): { average: number; count: number } {
  const reviews = getReviewsForUser(email);
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((total, r) => total + r.overallRating, 0);
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}