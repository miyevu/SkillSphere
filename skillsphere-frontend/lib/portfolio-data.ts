'use client';

export type PortfolioVisibility = 'public' | 'institution' | 'private';
export type PortfolioStatus = 'completed' | 'in_progress';

export interface PortfolioMediaLink {
  id: string;
  label: string;
  url: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  skillsUsed: string[];
  toolsUsed: string[];
  projectDate: string;
  outcome: string;
  projectLink: string;
  mediaLinks: PortfolioMediaLink[];
  featured: boolean;
  visibility: PortfolioVisibility;
  status: PortfolioStatus;
  createdAt: string;
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const res = await fetch('/api/portfolio');
  if (!res.ok) return [];
  const data = await res.json();
  return data.items || [];
}

export async function addPortfolioItem(
  item: Omit<PortfolioItem, 'id' | 'createdAt'>
): Promise<PortfolioItem | null> {
  const res = await fetch('/api/portfolio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.item;
}

export async function updatePortfolioItem(id: string, patch: Partial<PortfolioItem>): Promise<void> {
  await fetch(`/api/portfolio/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

export async function deletePortfolioItem(id: string): Promise<void> {
  await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
}

// Note: now takes the item's current featured value, since there's no
// synchronous localStorage lookup to check it for us anymore.
export async function toggleFeatured(id: string, currentFeatured: boolean): Promise<void> {
  await updatePortfolioItem(id, { featured: !currentFeatured });
}

export function getEmptyDraft(): Omit<PortfolioItem, 'id' | 'createdAt'> {
  return {
    title: '',
    description: '',
    category: '',
    skillsUsed: [],
    toolsUsed: [],
    projectDate: '',
    outcome: '',
    projectLink: '',
    mediaLinks: [],
    featured: false,
    visibility: 'institution',
    status: 'completed',
  };
}