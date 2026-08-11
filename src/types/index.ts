export type CampaignStatus = 'active' | 'paused' | 'finished';

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  prizeName: string;
  prizeDescription: string;
  prizeImageUrl: string | null;
  prizeEstimatedValueCents: number;
  totalNumbers: number;
  numberPriceCents: number;
  startDateISO: string;
  drawDateISO: string;
  status: CampaignStatus;
  organizerId: string;
  /** Campos administráveis via /admin/campaign. Opcionais para não quebrar dados antigos. */
  additionalImageUrls?: string[];
  bannerUrl?: string | null;
  logoUrl?: string | null;
  ctaText?: string;
  primaryColor?: string;
  regulationText?: string;
  seoTitle?: string;
  seoDescription?: string;
  updatedAtISO?: string;
}

export interface AvailabilitySnapshot {
  campaignId: string;
  totalNumbers: number;
  soldNumbers: number;
  reservedNumbers: number;
  updatedAtISO: string;
}

export interface TicketPackage {
  id: string;
  quantity: number;
  priceCents: number;
  originalPriceCents?: number;
  badge?: string;
  highlighted?: boolean;
  perksLabel: string;
}

export type NumberStatus = 'available' | 'reserved' | 'sold';

export interface RaffleNumber {
  value: number;
  status: NumberStatus;
}

export interface Testimonial {
  id: string;
  name: string;
  avatarUrl: string | null;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  dateISO: string;
}

export interface Organizer {
  name: string;
  handle: string;
  document: string;
  avatarUrl: string | null;
  bio: string;
  socials: { platform: 'instagram' | 'tiktok' | 'youtube' | 'x'; url: string; handle: string }[];
}

export interface RaffleResult {
  id: string;
  campaignTitle: string;
  prizeName: string;
  drawDateISO: string;
  winnerIdentifier: string;
  proofUrl: string | null;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

export type PaymentMethod = 'pix' | 'credit_card';

export interface OrderSummary {
  campaignId: string;
  quantity: number;
  numbers: number[];
  totalCents: number;
  paymentMethod: PaymentMethod;
  buyerName: string;
  buyerEmail: string;
  buyerDocument: string;
  acceptedTerms: boolean;
}

export interface OrderResponse {
  id: string;
  status: 'pending_payment' | 'confirmed' | 'expired' | 'cancelled';
  createdAtISO: string;
}
