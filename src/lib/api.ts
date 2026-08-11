import type {
  AvailabilitySnapshot,
  Campaign,
  FaqItem,
  OrderResponse,
  OrderSummary,
  RaffleNumber,
  RaffleResult,
  Testimonial,
} from '../types';
import { campaignStore } from './campaignStore';
import { faqStore } from './faqStore';
import { mockResults } from '../mocks/winners';
import { mockTestimonials } from '../mocks/testimonials';

/**
 * Camada de acesso a dados do template.
 *
 * Enquanto não houver backend real integrado, `USE_MOCKS` mantém o
 * frontend funcionando com dados de demonstração claramente isolados
 * em `src/mocks`. Para conectar a API real, defina VITE_API_BASE_URL
 * e ajuste USE_MOCKS para false — as assinaturas das funções abaixo
 * já refletem os endpoints esperados do backend:
 *
 *   GET  /campaign
 *   GET  /campaigns
 *   GET  /tickets
 *   GET  /availability
 *   POST /orders
 *   GET  /orders/:id
 *   GET  /results
 *
 * Preço, disponibilidade, status de pagamento e resultado NUNCA devem
 * ser tratados como confiáveis quando vêm apenas do frontend — este
 * arquivo é o único ponto de entrada para esses dados na aplicação.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = !API_BASE_URL;

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T, ms = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`Falha na requisição para ${path}: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getCampaign(slug: string): Promise<Campaign> {
  if (USE_MOCKS) return delay({ ...campaignStore.getState().campaign, slug });
  return http<Campaign>(`/campaign?slug=${encodeURIComponent(slug)}`);
}

export async function getCampaigns(): Promise<Campaign[]> {
  if (USE_MOCKS) return delay([campaignStore.getState().campaign]);
  return http<Campaign[]>('/campaigns');
}

export async function getAvailability(campaignId: string): Promise<AvailabilitySnapshot> {
  if (USE_MOCKS) return delay({ ...campaignStore.getState().availability, campaignId });
  return http<AvailabilitySnapshot>(`/availability?campaignId=${encodeURIComponent(campaignId)}`);
}

export async function getTickets(campaignId: string): Promise<RaffleNumber[]> {
  if (USE_MOCKS) {
    const { totalNumbers, soldNumbers } = campaignStore.getState().availability;
    const numbers: RaffleNumber[] = Array.from({ length: totalNumbers }, (_, i) => ({
      value: i + 1,
      status: i < soldNumbers ? 'sold' : 'available',
    }));
    return delay(numbers, 150);
  }
  return http<RaffleNumber[]>(`/tickets?campaignId=${encodeURIComponent(campaignId)}`);
}

export async function getFaq(): Promise<FaqItem[]> {
  if (USE_MOCKS) return delay(faqStore.getItems(), 120);
  return http<FaqItem[]>('/faq');
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (USE_MOCKS) return delay(mockTestimonials, 120);
  return http<Testimonial[]>('/testimonials');
}

export async function getResults(): Promise<RaffleResult[]> {
  if (USE_MOCKS) return delay(mockResults, 120);
  return http<RaffleResult[]>('/results');
}

export async function createOrder(summary: OrderSummary): Promise<OrderResponse> {
  if (USE_MOCKS) {
    return delay({
      id: `demo_${Math.random().toString(36).slice(2, 10)}`,
      status: 'pending_payment',
      createdAtISO: new Date().toISOString(),
    });
  }
  return http<OrderResponse>('/orders', { method: 'POST', body: JSON.stringify(summary) });
}

export async function getOrder(orderId: string): Promise<OrderResponse> {
  if (USE_MOCKS) {
    return delay({ id: orderId, status: 'pending_payment', createdAtISO: new Date().toISOString() });
  }
  return http<OrderResponse>(`/orders/${encodeURIComponent(orderId)}`);
}
