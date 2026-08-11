import { useEffect, useState } from 'react';
import { CheckCircle2, FileText, Trophy, Upload } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { TextField } from '../../components/admin/form/Field';
import { EmptyState } from '../../components/admin/EmptyState';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import * as resultService from '../../services/resultService';
import { formatDateLong } from '../../lib/format';
import type { ResultRecord } from '../../types/admin';

export function Results() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [results, setResults] = useState<ResultRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    winnerName: '',
    winnerDocumentMasked: '',
    winningNumber: '',
    proofDocumentName: null as string | null,
  });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    resultService.getResults().then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, []);

  function startPublish(record: ResultRecord) {
    setEditingId(record.id);
    setForm({ winnerName: '', winnerDocumentMasked: '', winningNumber: '', proofDocumentName: null });
  }

  async function confirmPublish() {
    if (!confirmId || !user) return;
    const winningNumber = Number(form.winningNumber);
    if (!form.winnerName.trim() || !form.winnerDocumentMasked.trim() || !winningNumber) return;
    setPublishing(true);
    try {
      const updated = await resultService.publishResult(
        confirmId,
        {
          winnerName: form.winnerName.trim(),
          winnerDocumentMasked: form.winnerDocumentMasked.trim(),
          winningNumber,
          proofDocumentName: form.proofDocumentName,
        },
        user.name,
      );
      setResults((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast('Resultado publicado.');
      setEditingId(null);
    } catch {
      toast('Não foi possível publicar o resultado.', 'error');
    } finally {
      setPublishing(false);
      setConfirmId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-3" />
        <div className="h-64 animate-pulse rounded-2xl bg-surface-3" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Resultados</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Registre o resultado apurado conforme o mecanismo legal aplicável. Nenhum vencedor é definido pela
          interface.
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyState icon={<Trophy size={20} />} title="Nenhuma campanha para apurar ainda" />
      ) : (
        <div className="space-y-4">
          {results.map((record) => (
            <div key={record.id} className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-bold text-ink">{record.campaignTitle}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    Apuração: {formatDateLong(record.drawDateISO)} · Método: {record.method}
                  </p>
                </div>
                <Badge tone={record.status === 'published' ? 'emerald' : 'gold'}>
                  {record.status === 'published' ? 'Publicado' : 'Aguardando apuração'}
                </Badge>
              </div>

              {record.status === 'published' ? (
                <div className="mt-4 grid gap-3 rounded-xl border border-border-soft bg-surface-2 p-4 text-sm sm:grid-cols-2">
                  <Row label="Número sorteado" value={String(record.winningNumber).padStart(5, '0')} />
                  <Row label="Vencedor" value={record.winnerName ?? '—'} />
                  <Row label="Documento" value={record.winnerDocumentMasked ?? '—'} />
                  <Row
                    label="Publicado em"
                    value={record.publishedAtISO ? formatDateLong(record.publishedAtISO) : '—'}
                  />
                  {record.proofDocumentName && (
                    <div className="flex items-center gap-2 text-ink-muted sm:col-span-2">
                      <FileText size={14} /> {record.proofDocumentName}
                    </div>
                  )}
                </div>
              ) : editingId === record.id ? (
                <div className="mt-4 space-y-4 rounded-xl border border-border-soft bg-surface-2 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                      id={`winner-${record.id}`}
                      label="Nome do vencedor"
                      value={form.winnerName}
                      onChange={(v) => setForm((f) => ({ ...f, winnerName: v }))}
                    />
                    <TextField
                      id={`doc-${record.id}`}
                      label="Documento (mascarado)"
                      value={form.winnerDocumentMasked}
                      onChange={(v) => setForm((f) => ({ ...f, winnerDocumentMasked: v }))}
                      placeholder="CPF ***.***.***-00"
                    />
                    <TextField
                      id={`num-${record.id}`}
                      label="Número sorteado"
                      value={form.winningNumber}
                      onChange={(v) => setForm((f) => ({ ...f, winningNumber: v.replace(/\D/g, '') }))}
                    />
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-ink-muted">Comprovante</label>
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-4 py-2.5 text-sm text-ink-muted hover:border-gold-400/50">
                        <Upload size={15} />
                        {form.proofDocumentName ?? 'Anexar documento'}
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => setForm((f) => ({ ...f, proofDocumentName: e.target.files?.[0]?.name ?? null }))}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => setEditingId(null)}>
                      Cancelar
                    </Button>
                    <Button
                      icon={<CheckCircle2 size={15} />}
                      iconPosition="left"
                      disabled={!form.winnerName.trim() || !form.winnerDocumentMasked.trim() || !form.winningNumber}
                      onClick={() => setConfirmId(record.id)}
                    >
                      Publicar resultado
                    </Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" className="mt-4" onClick={() => startPublish(record)}>
                  Registrar resultado
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmId != null}
        title="Publicar resultado?"
        description="Depois de publicado, o resultado fica visível na página pública de resultados. Confirme se os dados da apuração estão corretos."
        confirmLabel="Publicar"
        loading={publishing}
        onConfirm={confirmPublish}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink-faint">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
