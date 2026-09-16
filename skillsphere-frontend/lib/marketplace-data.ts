'use client';

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export interface ServicePackage {
  id: string;
  name: string;
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

interface RawListing {
  id: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  tools: string[];
  packages: ServicePackage[];
  sampleLinks: SampleLink[];
  faqs: FAQ[];
  availability: string;
  location: string;
  terms: string;
  createdAt: string;
  user: { fullName: string; email: string };
}

function mapListing(raw: RawListing): ServiceListing {
  return {
    id: raw.id,
    studentEmail: raw.user.email,
    studentName: raw.user.fullName,
    title: raw.title,
    category: raw.category,
    description: raw.description,
    skills: raw.skills,
    tools: raw.tools,
    packages: raw.packages,
    sampleLinks: raw.sampleLinks,
    faqs: raw.faqs,
    availability: raw.availability as ServiceListing['availability'],
    location: raw.location,
    terms: raw.terms,
    createdAt: raw.createdAt,
  };
}

export async function getServiceListings(): Promise<ServiceListing[]> {
  const res = await fetch('/api/marketplace/listings');
  if (!res.ok) return [];
  const data = await res.json();
  return (data.listings || []).map(mapListing);
}

export async function getServiceListing(id: string): Promise<ServiceListing | undefined> {
  const res = await fetch(`/api/marketplace/listings/${id}`);
  if (!res.ok) return undefined;
  const data = await res.json();
  return mapListing(data.listing);
}

export async function addServiceListing(
  item: Omit<ServiceListing, 'id' | 'createdAt' | 'studentEmail' | 'studentName'>
): Promise<ServiceListing | null> {
  const res = await fetch('/api/marketplace/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (await getServiceListing(data.listing.id)) ?? null;
}

export async function deleteServiceListing(id: string): Promise<void> {
  await fetch(`/api/marketplace/listings/${id}`, { method: 'DELETE' });
}

export async function hireFromListing(
  listing: ServiceListing,
  pkg: ServicePackage
): Promise<Project | null> {
  const res = await fetch(`/api/marketplace/listings/${listing.id}/hire`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packageId: pkg.id }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (await getProject(data.project.id)) ?? null;
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

interface RawJob {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget: string;
  deadline: string;
  projectType: string;
  freelancersRequired: number;
  remote: boolean;
  status: string;
  createdAt: string;
  client: { fullName: string; email: string };
}

function mapJob(raw: RawJob): JobPost {
  return {
    id: raw.id,
    clientEmail: raw.client.email,
    clientName: raw.client.fullName,
    title: raw.title,
    description: raw.description,
    requiredSkills: raw.requiredSkills,
    budget: raw.budget,
    deadline: raw.deadline,
    projectType: raw.projectType,
    freelancersRequired: raw.freelancersRequired,
    remote: raw.remote,
    status: raw.status as JobStatus,
    createdAt: raw.createdAt,
  };
}

export async function getJobPosts(): Promise<JobPost[]> {
  const res = await fetch('/api/marketplace/jobs');
  if (!res.ok) return [];
  const data = await res.json();
  return (data.jobs || []).map(mapJob);
}

export async function getJobPost(id: string): Promise<JobPost | undefined> {
  const res = await fetch(`/api/marketplace/jobs/${id}`);
  if (!res.ok) return undefined;
  const data = await res.json();
  return mapJob(data.job);
}

export async function addJobPost(
  item: Omit<JobPost, 'id' | 'createdAt' | 'status' | 'clientEmail' | 'clientName'>
): Promise<JobPost | null> {
  const res = await fetch('/api/marketplace/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (await getJobPost(data.job.id)) ?? null;
}

export async function deleteJobPost(id: string): Promise<void> {
  await fetch(`/api/marketplace/jobs/${id}`, { method: 'DELETE' });
}

// ---------- Proposals ----------

export type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export interface Proposal {
  id: string;
  jobId: string;
  jobTitle?: string;
  studentEmail: string;
  studentName: string;
  coverLetter: string;
  proposedPrice: number;
  proposedDeliveryDays: number;
  status: ProposalStatus;
  createdAt: string;
}

interface RawProposal {
  id: string;
  jobId: string;
  coverLetter: string;
  proposedPrice: number;
  proposedDeliveryDays: number;
  status: string;
  createdAt: string;
  student: { fullName: string; email: string };
  job?: { id: string; title: string };
}

function mapProposal(raw: RawProposal): Proposal {
  return {
    id: raw.id,
    jobId: raw.jobId,
    jobTitle: raw.job?.title,
    studentEmail: raw.student.email,
    studentName: raw.student.fullName,
    coverLetter: raw.coverLetter,
    proposedPrice: raw.proposedPrice,
    proposedDeliveryDays: raw.proposedDeliveryDays,
    status: raw.status as ProposalStatus,
    createdAt: raw.createdAt,
  };
}

export async function getProposalsForJob(jobId: string): Promise<Proposal[]> {
  const res = await fetch(`/api/marketplace/jobs/${jobId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.job.proposals || []).map(mapProposal);
}

export async function getMyProposals(): Promise<Proposal[]> {
  const res = await fetch('/api/marketplace/proposals');
  if (!res.ok) return [];
  const data = await res.json();
  return (data.proposals || []).map(mapProposal);
}

export async function addProposal(input: {
  jobId: string;
  coverLetter: string;
  proposedPrice: number;
  proposedDeliveryDays: number;
}): Promise<void> {
  await fetch(`/api/marketplace/jobs/${input.jobId}/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export async function acceptProposal(proposal: Proposal): Promise<Project | null> {
  const res = await fetch(`/api/marketplace/proposals/${proposal.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ decision: 'accepted' }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (await getProject(data.project.id)) ?? null;
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
  createdAt: string;
}

interface RawProject {
  id: string;
  title: string;
  agreedPrice: number;
  deliveryDate: string;
  scope: string;
  milestones: Milestone[];
  status: string;
  createdAt: string;
  client: { fullName: string; email: string };
  freelancer: { fullName: string; email: string };
  messages?: Array<{
    id: string;
    text: string;
    createdAt: string;
    sender: { fullName: string; email: string };
  }>;
}

function mapProject(raw: RawProject): Project {
  return {
    id: raw.id,
    title: raw.title,
    clientEmail: raw.client.email,
    clientName: raw.client.fullName,
    freelancerEmail: raw.freelancer.email,
    freelancerName: raw.freelancer.fullName,
    agreedPrice: raw.agreedPrice,
    deliveryDate: raw.deliveryDate,
    scope: raw.scope,
    milestones: raw.milestones,
    messages: (raw.messages || []).map((m) => ({
      id: m.id,
      senderEmail: m.sender.email,
      senderName: m.sender.fullName,
      text: m.text,
      createdAt: m.createdAt,
    })),
    status: raw.status as ProjectStatus,
    createdAt: raw.createdAt,
  };
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch('/api/marketplace/projects');
  if (!res.ok) return [];
  const data = await res.json();
  return (data.projects || []).map(mapProject);
}

export async function getProject(id: string): Promise<Project | undefined> {
  const res = await fetch(`/api/marketplace/projects/${id}`);
  if (!res.ok) return undefined;
  const data = await res.json();
  return mapProject(data.project);
}

export async function addMilestone(projectId: string, title: string, dueDate: string): Promise<void> {
  await fetch(`/api/marketplace/projects/${projectId}/milestones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, dueDate }),
  });
}

export async function updateMilestoneStatus(
  projectId: string,
  milestoneId: string,
  status: MilestoneStatus,
  deliverableLink?: string
): Promise<void> {
  await fetch(`/api/marketplace/projects/${projectId}/milestones/${milestoneId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, deliverableLink }),
  });
}

export async function addProjectMessage(projectId: string, text: string): Promise<void> {
  await fetch(`/api/marketplace/projects/${projectId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
}

export function getEmptyPackage(name: string): ServicePackage {
  return { id: generateId(), name, price: 0, deliveryDays: 3, revisions: 1, description: '' };
}