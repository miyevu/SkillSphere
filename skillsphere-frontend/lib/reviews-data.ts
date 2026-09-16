'use client';

export interface Review {
  id: string;
  projectId: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  revieweeName: string;
  overallRating: number;
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  professionalismRating: number;
  comment: string;
  response: string;
  respondedAt: string | null;
  createdAt: string;
}

interface RawReview {
  id: string;
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  overallRating: number;
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  professionalismRating: number;
  comment: string;
  response: string;
  respondedAt: string | null;
  createdAt: string;
  reviewer: { fullName: string };
  reviewee: { fullName: string };
}

function mapReview(raw: RawReview): Review {
  return {
    id: raw.id,
    projectId: raw.projectId,
    reviewerId: raw.reviewerId,
    reviewerName: raw.reviewer.fullName,
    revieweeId: raw.revieweeId,
    revieweeName: raw.reviewee.fullName,
    overallRating: raw.overallRating,
    qualityRating: raw.qualityRating,
    communicationRating: raw.communicationRating,
    timelinessRating: raw.timelinessRating,
    professionalismRating: raw.professionalismRating,
    comment: raw.comment,
    response: raw.response,
    respondedAt: raw.respondedAt,
    createdAt: raw.createdAt,
  };
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  const res = await fetch(`/api/reviews?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.reviews || []).map(mapReview);
}

export async function getReviewsForProject(projectId: string): Promise<Review[]> {
  const res = await fetch(`/api/reviews?projectId=${encodeURIComponent(projectId)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.reviews || []).map(mapReview);
}

export async function getReviewForProjectByReviewer(
  projectId: string,
  reviewerId: string
): Promise<Review | undefined> {
  const reviews = await getReviewsForProject(projectId);
  return reviews.find((r) => r.reviewerId === reviewerId);
}

export async function addReview(input: {
  projectId: string;
  overallRating: number;
  qualityRating: number;
  communicationRating: number;
  timelinessRating: number;
  professionalismRating: number;
  comment: string;
}): Promise<void> {
  await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function respondToReview(reviewId: string, response: string): Promise<void> {
  await fetch(`/api/reviews/${reviewId}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response }),
  });
}

export function getAverageRating(reviews: Review[]): { average: number; count: number } {
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((total, r) => total + r.overallRating, 0);
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}