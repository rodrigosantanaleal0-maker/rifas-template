import { campaignStore } from '../lib/campaignStore';
import { recordAudit } from './auditService';
import type { Campaign, CampaignStatus } from '../types';

/**
 * GET  /api/admin/campaign
 * PUT  /api/admin/campaign
 *
 * A validação de preço, disponibilidade e permissão para alterar a
 * campanha é responsabilidade do backend — o frontend nunca deve ser
 * a fonte de verdade dessas regras.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = !API_BASE_URL;

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const FIELD_LABELS: Partial<Record<keyof Campaign, string>> = {
  title: 'Nome da campanha',
  tagline: 'Título',
  prizeName: 'Prêmio',
  prizeDescription: 'Descrição do prêmio',
  prizeEstimatedValueCents: 'Valor estimado do prêmio',
  numberPriceCents: 'Preço do número',
  totalNumbers: 'Quantidade de números',
  drawDateISO: 'Data de encerramento',
  startDateISO: 'Data inicial',
  status: 'Status da campanha',
  ctaText: 'Texto do CTA',
  seoTitle: 'Título SEO',
  seoDescription: 'Descrição SEO',
  regulationText: 'Regulamento',
};

function formatValue(key: keyof Campaign, value: unknown): string {
  if (value == null || value === '') return '—';
  if (key === 'numberPriceCents' || key === 'prizeEstimatedValueCents') {
    return (Number(value) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
  return String(value);
}

export async function getCampaign(): Promise<Campaign> {
  if (USE_MOCKS) return delay(campaignStore.getState().campaign, 200);
  const res = await fetch(`${API_BASE_URL}/api/admin/campaign`);
  if (!res.ok) throw new Error('Falha ao carregar campanha.');
  return res.json();
}

export async function updateCampaign(patch: Partial<Campaign>, actorName: string): Promise<Campaign> {
  const previous = campaignStore.getState().campaign;

  if (USE_MOCKS) {
    await delay(null, 500);
    campaignStore.updateCampaign(patch);
  } else {
    const res = await fetch(`${API_BASE_URL}/api/admin/campaign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error('Falha ao salvar a campanha.');
    campaignStore.updateCampaign((await res.json()) as Partial<Campaign>);
  }

  for (const key of Object.keys(patch) as (keyof Campaign)[]) {
    const label = FIELD_LABELS[key];
    if (!label) continue;
    const prevValue = previous[key];
    const nextValue = patch[key];
    if (prevValue === nextValue) continue;
    recordAudit({
      actorName,
      field: label,
      previousValue: formatValue(key, prevValue),
      newValue: formatValue(key, nextValue),
    });
  }

  return campaignStore.getState().campaign;
}

export async function setCampaignStatus(status: CampaignStatus, actorName: string): Promise<Campaign> {
  return updateCampaign({ status }, actorName);
}
