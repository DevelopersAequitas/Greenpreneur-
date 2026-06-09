// =============================================================================
// Greenpreneur Frontend — API Service Layer
// File: src/utils/api.ts
// All HTTP calls to the Greenpreneur backend go through this file
// =============================================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Generic fetch helper ──────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options?: RequestInit
): Promise<{ success: boolean; message?: string; data?: T; total?: number }> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json;
}


// =============================================================================
// NOMINATIONS — ApplyAward.tsx
// =============================================================================
export interface NominationPayload {
  track: 'honorary' | 'rated';
  name: string;
  business: string;
  phone: string;
  email: string;
  city: string;
  category: string;
  description: string;
  link?: string;
  package?: 'standard' | 'premium';
}

export interface NominationResult {
  id: number;
  track: string;
  category: string;
  package: string | null;
  amount: number | null;
  status: string;
}

/** Submit award nomination from the 4-step wizard */
export async function submitNomination(data: NominationPayload) {
  return request<NominationResult>('/nominations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** Get all award categories for the dropdown */
export interface AwardCategory {
  id: number;
  name: string;
  slug: string;
  group_name: string;
}

export async function getAwardCategories() {
  return request<AwardCategory[]>('/nominations/categories');
}

/** Check nomination status */
export async function getNominationStatus(id: number) {
  return request(`/nominations/${id}`);
}


// =============================================================================
// EVENT REGISTRATIONS — Event2026.tsx
// =============================================================================
export interface EventRegistrationPayload {
  name: string;
  email: string;
  phone: string;
  city: string;
  segment: string;
}

export async function registerForEvent(data: EventRegistrationPayload) {
  return request('/events/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


// =============================================================================
// SPONSORSHIPS — Sponsorship.tsx
// =============================================================================
export interface SponsorshipPayload {
  name: string;
  company: string;
  email: string;
  phone: string;
  tier: string;
  message?: string;
}

export async function submitSponsorshipEnquiry(data: SponsorshipPayload) {
  return request('/sponsorships', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


// =============================================================================
// COFFEE TABLE BOOK — CoffeeTableBook.tsx
// =============================================================================
export interface CoffeeBookPayload {
  name: string;
  phone: string;
  email: string;
  company: string;
  package: string;
  quantity?: number;
  message?: string;
}

export async function submitCoffeeBookEnquiry(data: CoffeeBookPayload) {
  return request('/coffee-book', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


// =============================================================================
// CONTACT ENQUIRY — Contact.tsx
// =============================================================================
export interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  interest: string;
  message: string;
}

export async function submitContactEnquiry(data: ContactPayload) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


// =============================================================================
// COMMUNITY APPLICATION — Community.tsx
// =============================================================================
export interface CommunityPayload {
  name: string;
  email: string;
  phone: string;
  city: string;
  company: string;
  sector: string;
  interest: string;
  whyJoin: string;
}

export async function submitCommunityApplication(data: CommunityPayload) {
  return request('/community/apply', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}


// =============================================================================
// WINNERS — Winners.tsx
// =============================================================================
export interface Winner {
  id: number;
  name: string;
  company: string;
  category: string;
  category_slug: string;
  city: string;
  award_year: string;
  track: 'honorary' | 'rated';
  impact_text: string;
  quote: string;
  photo_url: string | null;
  is_featured: number;
}

export async function getWinners(filters?: { year?: string; category?: string }) {
  const params = new URLSearchParams();
  if (filters?.year)     params.set('year', filters.year);
  if (filters?.category) params.set('category', filters.category);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return request<Winner[]>(`/winners${qs}`);
}
