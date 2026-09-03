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
  projectDate: string; // ISO date string, from a <input type="date">
  outcome: string;
  projectLink: string; // e.g. GitHub repo or live site
  mediaLinks: PortfolioMediaLink[];
  featured: boolean;
  visibility: PortfolioVisibility;
  status: PortfolioStatus;
  createdAt: string;
}

const STORAGE_KEY = 'skillsphere_portfolio_items';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function getPortfolioItems(): PortfolioItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PortfolioItem[]) : [];
  } catch {
    return [];
  }
}

function saveAll(items: PortfolioItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addPortfolioItem(
  item: Omit<PortfolioItem, 'id' | 'createdAt'>
): PortfolioItem {
  const newItem: PortfolioItem = {
    ...item,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  const items = getPortfolioItems();
  saveAll([newItem, ...items]);
  return newItem;
}

export function updatePortfolioItem(id: string, patch: Partial<PortfolioItem>) {
  const items = getPortfolioItems().map((item) =>
    item.id === id ? { ...item, ...patch } : item
  );
  saveAll(items);
}

export function deletePortfolioItem(id: string) {
  saveAll(getPortfolioItems().filter((item) => item.id !== id));
}

export function toggleFeatured(id: string) {
  const items = getPortfolioItems();
  const item = items.find((i) => i.id === id);
  if (item) updatePortfolioItem(id, { featured: !item.featured });
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