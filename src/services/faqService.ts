import { faqStore } from '../lib/faqStore';
import { recordAudit } from './auditService';
import type { FaqItem } from '../types';

export function getFaqItems(): FaqItem[] {
  return faqStore.getItems();
}

export function subscribeFaq(listener: () => void): () => void {
  return faqStore.subscribe(listener);
}

export function saveFaqItem(input: { id?: string; question: string; answer: string }, actorName: string) {
  const isNew = !input.id;
  const id = input.id ?? `faq_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  faqStore.upsert({ id, question: input.question, answer: input.answer });
  recordAudit({
    actorName,
    field: 'FAQ',
    previousValue: isNew ? '—' : 'Pergunta editada',
    newValue: input.question,
  });
}

export function removeFaqItem(id: string, actorName: string) {
  const item = faqStore.getItems().find((i) => i.id === id);
  faqStore.remove(id);
  recordAudit({ actorName, field: 'FAQ', previousValue: item?.question ?? id, newValue: '(removido)' });
}
