import type { AvailabilitySnapshot, Campaign } from '../types';
import { mockAvailability, mockCampaign } from '../mocks/campaign';

/**
 * Fonte única da campanha, compartilhada entre a Home pública e o
 * PackLP Admin. Enquanto não há backend, o estado vive em memória e é
 * persistido em localStorage (sincronizado entre abas via evento
 * `storage`), o que já entrega "tempo real" cross-tab sem exigir
 * infraestrutura extra.
 *
 * Quando o backend existir: troque `persist`/`loadInitial` por chamadas
 * reais em `src/services/campaignService.ts` (GET/PUT /api/admin/campaign)
 * e substitua o evento `storage` por um cliente WebSocket/SSE que chama
 * `campaignStore.hydrate()` a cada evento remoto — o restante da árvore
 * de componentes não precisa mudar, pois todos leem via `subscribe`.
 */

const STORAGE_KEY = 'packlp_demo_campaign_state_v1';

interface CampaignState {
  campaign: Campaign;
  availability: AvailabilitySnapshot;
}

function loadInitial(): CampaignState {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as CampaignState;
    } catch {
      /* localStorage indisponível (SSR/privado) — segue com o mock padrão */
    }
  }
  return { campaign: mockCampaign, availability: mockAvailability };
}

let state: CampaignState = loadInitial();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota excedida ou indisponível — estado segue válido em memória */
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export const campaignStore = {
  getState(): CampaignState {
    return state;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  updateCampaign(patch: Partial<Campaign>) {
    state = {
      ...state,
      campaign: { ...state.campaign, ...patch, updatedAtISO: new Date().toISOString() },
    };
    persist();
    emit();
  },
  updateAvailability(patch: Partial<AvailabilitySnapshot>) {
    state = { ...state, availability: { ...state.availability, ...patch } };
    persist();
    emit();
  },
  reset() {
    state = { campaign: mockCampaign, availability: mockAvailability };
    persist();
    emit();
  },
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        state = JSON.parse(event.newValue) as CampaignState;
        emit();
      } catch {
        /* payload inválido em outra aba — ignora */
      }
    }
  });
}
