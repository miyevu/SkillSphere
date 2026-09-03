'use client';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

// ---------- Service Listings ----------

export interface ServicePackage {
  id: string;
  name: string; // e.g. Basic, Standard, Premium
  price: number;
  deliveryDays: number;
  revisions: number;
  description: string;
}

export interface SampleLink {
  id: string;
  label: string;
  url: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ServiceListing {
  id: string;
  studentEmail: string;
  studentName: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  tools: string[];
  packages: ServicePackage[];
  sampleLinks: SampleLink[];
  faqs: FAQ[];
  availability: 'available' | 'busy' | 'not_available';
  location: string;
  terms: string;
  createdAt: string;
}

const LISTINGS_KEY = 'skillsphere_service_listings';

export function getServiceListings(): ServiceListing[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LISTINGS_KEY);
    return raw ? (JSON.parse(raw) as ServiceListing[]) : [];
  } catch {
    return [];
  }
}

function saveListings(items: ServiceListing[]) {
  localStorage.setItem(LISTINGS_KEY, JSON.stringify(items));
}

export function addServiceListing(item: Omit<ServiceListing, 'id' | 'createdAt'>): ServiceListing {
  const newItem: ServiceListing = { ...item, id: generateId(), createdAt: new Date().toISOString() };
  saveListings([newItem, ...getServiceListings()]);
  return newItem;
}

export function updateServiceListing(id: string, patch: Partial<ServiceListing>) {
  saveListings(getServiceListings().map((i) => (i.id === id ? { ...i, ...patch } : i)));
}

export function deleteServiceListing(id: string) {
  saveListings(getServiceListings().filter((i) => i.id !== id));
}

export function getServiceListing(id: string): ServiceListing | undefined {
  return getServiceListings().find((i) => i.id === id);
}

// ---------- Job Posts ----------

export type JobStatus = 'open' | 'closed';

export interface JobPost {
  id: string;
  clientEmail: string;
  clientName: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget: string;
  deadline: string;
  projectType: string;
  freelancersRequired: number;
  remote: boolean;
  status: JobStatus;
  createdAt: string;
}

const JOBS_KEY = 'skillsphere_job_posts';

export function getJobPosts(): JobPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(JOBS_KEY);
    return raw ? (JSON.parse(raw) as JobPost[]) : [];
  } catch {
    return [];
  }
}

function saveJobs(items: JobPost[]) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(items));
}

export function addJobPost(item: Omit<JobPost, 'id' | 'createdAt' | 'status'>): JobPost {
  const newItem: JobPost = { ...item, id: generateId(), status: 'open', createdAt: new Date().toISOString() };
  saveJobs([newItem, ...getJobPosts()]);
  return newItem;
}

export function deleteJobPost(id: string) {
  saveJobs(getJobPosts().filter((j) => j.id !== id));
}

export function updateJobPost(id: string, patch: Partial<JobPost>) {
  saveJobs(getJobPosts().map((j) => (j.id === id ? { ...j, ...patch } : j)));
}

export function getJobPost(id: string): JobPost | undefined {
  return getJobPosts().find((j) => j.id === id);
}

// ---------- Proposals ----------

export type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export interface Proposal {
  id: string;
  jobId: string;
  studentEmail: string;
  studentName: string;
  coverLetter: string;
  proposedPrice: number;
  proposedDeliveryDays: number;
  status: ProposalStatus;
  createdAt: string;
}

const PROPOSALS_KEY = 'skillsphere_proposals';

export function getProposals(): Proposal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROPOSALS_KEY);
    return raw ? (JSON.parse(raw) as Proposal[]) : [];
  } catch {
    return [];
  }
}

function saveProposals(items: Proposal[]) {
  localStorage.setItem(PROPOSALS_KEY, JSON.stringify(items));
}

export function getProposalsForJob(jobId: string): Proposal[] {
  return getProposals().filter((p) => p.jobId === jobId);
}

export function addProposal(item: Omit<Proposal, 'id' | 'createdAt' | 'status'>): Proposal {
  const newItem: Proposal = { ...item, id: generateId(), status: 'pending', createdAt: new Date().toISOString() };
  saveProposals([newItem, ...getProposals()]);
  return newItem;
}

export function updateProposal(id: string, patch: Partial<Proposal>) {
  saveProposals(getProposals().map((p) => (p.id === id ? { ...p, ...patch } : p)));
}

// ---------- Projects (workspace) ----------

export type MilestoneStatus = 'pending' | 'delivered' | 'approved';

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: MilestoneStatus;
  deliverableLink: string;
}

export interface ProjectMessage {
  id: string;
  senderEmail: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export type ProjectStatus = 'active' | 'delivered' | 'completed';

export interface Project {
  id: string;
  title: string;
  clientEmail: string;
  clientName: string;
  freelancerEmail: string;
  freelancerName: string;
  agreedPrice: number;
  deliveryDate: string;
  scope: string;
  milestones: Milestone[];
  messages: ProjectMessage[];
  status: ProjectStatus;
  sourceType: 'job' | 'service';
  sourceId: string;
  createdAt: string;
}

const PROJECTS_KEY = 'skillsphere_projects';

export function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

function saveProjects(items: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(items));
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function addProject(item: Omit<Project, 'id' | 'createdAt' | 'status' | 'messages'>): Project {
  const newItem: Project = {
    ...item,
    id: generateId(),
    status: 'active',
    messages: [],
    createdAt: new Date().toISOString(),
  };
  saveProjects([newItem, ...getProjects()]);
  return newItem;
}

export function updateProject(id: string, patch: Partial<Project>) {
  saveProjects(getProjects().map((p) => (p.id === id ? { ...p, ...patch } : p)));
}

export function updateMilestoneStatus(projectId: string, milestoneId: string, status: MilestoneStatus, deliverableLink?: string) {
  const project = getProject(projectId);
  if (!project) return;
  const milestones = project.milestones.map((m) =>
    m.id === milestoneId ? { ...m, status, deliverableLink: deliverableLink ?? m.deliverableLink } : m
  );
  updateProject(projectId, { milestones });
}

export function addMilestone(projectId: string, title: string, dueDate: string) {
  const project = getProject(projectId);
  if (!project) return;
  const newMilestone: Milestone = { id: generateId(), title, dueDate, status: 'pending', deliverableLink: '' };
  updateProject(projectId, { milestones: [...project.milestones, newMilestone] });
}

export function addProjectMessage(projectId: string, senderEmail: string, senderName: string, text: string) {
  const project = getProject(projectId);
  if (!project) return;
  const newMessage: ProjectMessage = { id: generateId(), senderEmail, senderName, text, createdAt: new Date().toISOString() };
  updateProject(projectId, { messages: [...project.messages, newMessage] });
}

// ---------- Cross-cutting helpers ----------

export function hireFromListing(
  listing: ServiceListing,
  pkg: ServicePackage,
  clientEmail: string,
  clientName: string
): Project {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + pkg.deliveryDays);

  return addProject({
    title: `${listing.title} (${pkg.name})`,
    clientEmail,
    clientName,
    freelancerEmail: listing.studentEmail,
    freelancerName: listing.studentName,
    agreedPrice: pkg.price,
    deliveryDate: deliveryDate.toISOString().slice(0, 10),
    scope: pkg.description,
    milestones: [{ id: generateId(), title: 'Final Delivery', dueDate: deliveryDate.toISOString().slice(0, 10), status: 'pending', deliverableLink: '' }],
    sourceType: 'service',
    sourceId: listing.id,
  });
}

export function acceptProposal(proposal: Proposal, job: JobPost): Project {
  updateProposal(proposal.id, { status: 'accepted' });
  getProposalsForJob(job.id)
    .filter((p) => p.id !== proposal.id)
    .forEach((p) => updateProposal(p.id, { status: 'rejected' }));
  updateJobPost(job.id, { status: 'closed' });

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + proposal.proposedDeliveryDays);

  return addProject({
    title: job.title,
    clientEmail: job.clientEmail,
    clientName: job.clientName,
    freelancerEmail: proposal.studentEmail,
    freelancerName: proposal.studentName,
    agreedPrice: proposal.proposedPrice,
    deliveryDate: deliveryDate.toISOString().slice(0, 10),
    scope: job.description,
    milestones: [{ id: generateId(), title: 'Final Delivery', dueDate: deliveryDate.toISOString().slice(0, 10), status: 'pending', deliverableLink: '' }],
    sourceType: 'job',
    sourceId: job.id,
  });
}

export function getEmptyPackage(name: string): ServicePackage {
  return { id: generateId(), name, price: 0, deliveryDays: 3, revisions: 1, description: '' };
}