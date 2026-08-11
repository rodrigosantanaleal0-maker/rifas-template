import type { FaqItem } from '../types';
import { mockFaq } from '../mocks/faq';

/** Mesmo padrão de src/lib/campaignStore.ts, aplicado ao conteúdo de FAQ. */
const STORAGE_KEY = 'packlp_demo_faq_state_v1';

function loadInitial(): FaqItem[] {
  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as FaqItem[];
    } catch {
      /* ignora e usa o mock padrão */
    }
  }
  return mockFaq;
}

let items: FaqItem[] = loadInitial();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignora falha de storage */
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

export const faqStore = {
  getItems(): FaqItem[] {
    return items;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  upsert(item: FaqItem) {
    const exists = items.some((i) => i.id === item.id);
    items = exists ? items.map((i) => (i.id === item.id ? item : i)) : [...items, item];
    persist();
    emit();
  },
  remove(id: string) {
    items = items.filter((i) => i.id !== id);
    persist();
    emit();
  },
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        items = JSON.parse(event.newValue) as FaqItem[];
        emit();
      } catch {
        /* payload inválido em outra aba — ignora */
      }
    }
  });
}
