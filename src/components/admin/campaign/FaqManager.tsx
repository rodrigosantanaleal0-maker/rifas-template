import { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { TextAreaField, TextField } from '../form/Field';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import * as faqService from '../../../services/faqService';
import type { FaqItem } from '../../../types';

const EMPTY_DRAFT = { question: '', answer: '' };

export function FaqManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<FaqItem[]>(faqService.getFaqItems());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { question: string; answer: string }>>({});
  const [newDraft, setNewDraft] = useState(EMPTY_DRAFT);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => faqService.subscribeFaq(() => setItems(faqService.getFaqItems())), []);

  function startEdit(item: FaqItem) {
    setEditingId(item.id);
    setDrafts((prev) => ({ ...prev, [item.id]: { question: item.question, answer: item.answer } }));
  }

  function saveEdit(id: string) {
    const draft = drafts[id];
    if (!draft?.question.trim() || !draft.answer.trim() || !user) return;
    faqService.saveFaqItem({ id, question: draft.question.trim(), answer: draft.answer.trim() }, user.name);
    setEditingId(null);
    toast('Pergunta atualizada.');
  }

  function remove(id: string) {
    if (!user) return;
    faqService.removeFaqItem(id, user.name);
    toast('Pergunta removida.');
  }

  function addNew() {
    if (!newDraft.question.trim() || !newDraft.answer.trim() || !user) return;
    faqService.saveFaqItem({ question: newDraft.question.trim(), answer: newDraft.answer.trim() }, user.name);
    setNewDraft(EMPTY_DRAFT);
    setShowNew(false);
    toast('Pergunta adicionada ao FAQ.');
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">
        Alterações no FAQ são salvas imediatamente e refletem na página pública em seguida.
      </p>

      {items.map((item) => {
        const isEditing = editingId === item.id;
        const draft = drafts[item.id] ?? { question: item.question, answer: item.answer };
        return (
          <div key={item.id} className="rounded-xl border border-border bg-surface-2 p-4">
            {isEditing ? (
              <div className="space-y-3">
                <TextField
                  id={`faq-q-${item.id}`}
                  label="Pergunta"
                  value={draft.question}
                  onChange={(v) => setDrafts((prev) => ({ ...prev, [item.id]: { ...draft, question: v } }))}
                />
                <TextAreaField
                  id={`faq-a-${item.id}`}
                  label="Resposta"
                  value={draft.answer}
                  rows={3}
                  onChange={(v) => setDrafts((prev) => ({ ...prev, [item.id]: { ...draft, answer: v } }))}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="md" onClick={() => setEditingId(null)}>
                    Cancelar
                  </Button>
                  <Button size="md" icon={<Save size={14} />} iconPosition="left" onClick={() => saveEdit(item.id)}>
                    Salvar pergunta
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{item.question}</p>
                  <p className="mt-1 text-sm text-ink-muted">{item.answer}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-ink-muted hover:text-ink"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label="Remover pergunta"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-faint hover:border-ruby-500/40 hover:text-ruby-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {showNew ? (
        <div className="rounded-xl border border-dashed border-border p-4">
          <div className="space-y-3">
            <TextField
              id="faq-new-q"
              label="Pergunta"
              value={newDraft.question}
              onChange={(v) => setNewDraft((prev) => ({ ...prev, question: v }))}
              placeholder="Ex: Como recebo meus números?"
            />
            <TextAreaField
              id="faq-new-a"
              label="Resposta"
              value={newDraft.answer}
              rows={3}
              onChange={(v) => setNewDraft((prev) => ({ ...prev, answer: v }))}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setShowNew(false);
                  setNewDraft(EMPTY_DRAFT);
                }}
              >
                Cancelar
              </Button>
              <Button size="md" icon={<Plus size={14} />} iconPosition="left" onClick={addNew}>
                Adicionar pergunta
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="md" icon={<Plus size={14} />} iconPosition="left" onClick={() => setShowNew(true)}>
          Adicionar pergunta
        </Button>
      )}
    </div>
  );
}
