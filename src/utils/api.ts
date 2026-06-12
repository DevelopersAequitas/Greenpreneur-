// =============================================================================
// Greenpreneur Frontend — API Service Layer
// File: src/utils/api.ts
// All HTTP calls to the Greenpreneur backend go through this file
// =============================================================================

const getBaseUrl = () => {
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  if (isProduction) {
    return '/api';
  }
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  return `http://${window.location.hostname}:5000/api`;
};

export const BASE_URL = getBaseUrl();
export const ASSETS_BASE_URL = BASE_URL.replace('/api', '');

// ── Generic fetch helper ──────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options?: RequestInit
): Promise<{ success: boolean; message?: string; data?: T; total?: number }> {
  const isFormData = options?.body instanceof FormData;
  const headers = isFormData
    ? { ...options?.headers }
    : { 'Content-Type': 'application/json', ...options?.headers };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
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
  voting_url?: string;
}

/** Submit award nomination from the 4-step wizard */
export async function submitNomination(data: FormData) {
  return request<NominationResult>('/nominations', {
    method: 'POST',
    body: data,
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
export async function submitCommunityApplication(data: FormData) {
  return request<{ id: number; amount: number; status: string }>('/community/apply', {
    method: 'POST',
    body: data,
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

export async function getWinners(filters?: { category?: string }, limit = 9, offset = 0) {
  const params = new URLSearchParams();
  if (filters?.category) params.set('category', filters.category);
  params.set('limit', limit.toString());
  params.set('offset', offset.toString());
  const qs = params.toString() ? `?${params.toString()}` : '';
  return request<Winner[]>(`/winners${qs}`);
}

// =============================================================================
// VOTING
// =============================================================================
export interface PublicNominee {
  id: number;
  nominee_name: string;
  business_name: string;
  description: string;
  category: string;
  status: string;
  vote_count: number;
  profile_picture?: string;
  business_logo?: string;
}

export async function getPublicNominee(id: number) {
  return request<PublicNominee>(`/nominations/public/${id}`);
}

export interface VotePayload {
  email: string;
  name: string;
  business?: string;
  designation?: string;
  phone?: string;
  city?: string;
  remarks?: string;
}

export async function voteNominee(id: number, payload: VotePayload) {
  return request(`/nominations/${id}/vote`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// =============================================================================
// PAYMENTS
// =============================================================================
export interface CreateOrderPayload {
  amount: number;
  receipt?: string;
  notes?: Record<string, string>;
}

export async function createPaymentOrder(data: CreateOrderPayload): Promise<{ success: boolean; order: any; key_id: string }> {
  return request<any>('/payment/create-order', {
    method: 'POST',
    body: JSON.stringify(data),
  }) as any;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  module: 'nominations' | 'events' | 'sponsorships' | 'coffee-book' | 'community';
  record_id: number;
}

export async function verifyPayment(data: VerifyPaymentPayload) {
  return request('/payment/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// =============================================================================
// BLOGS
// =============================================================================
export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image: string | null;
  author: string;
  created_at: string;
  updated_at: string;
}

export async function getBlogs() {
  return request<Blog[]>('/blogs');
}

export async function getBlogBySlug(slug: string) {
  return request<Blog>(`/blogs/slug/${slug}`);
}

// =============================================================================
// GALLERY (Hall of Green)
// =============================================================================
export interface GalleryPerson {
  id: number;
  name: string;
  role: string;
  org: string;
  tags: any;
  photo_url: string | null;
  bg_gradient: string | null;
}

export async function getGallerySponsors() {
  return request<GalleryPerson[]>('/gallery/sponsors');
}

export async function getPartners() {
  return request<GalleryPerson[]>('/gallery/partners');
}

export async function getJury() {
  return request<GalleryPerson[]>('/gallery/jury');
}

export async function getNominationCount() {
  return request<{ count: number }>('/nominations/count');
}