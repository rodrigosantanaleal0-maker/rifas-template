import { useSyncExternalStore } from 'react';
import { faqStore } from '../lib/faqStore';
import type { FaqItem } from '../types';

export function useFaqData(): FaqItem[] {
  return useSyncExternalStore(faqStore.subscribe, faqStore.getItems, faqStore.getItems);
}
