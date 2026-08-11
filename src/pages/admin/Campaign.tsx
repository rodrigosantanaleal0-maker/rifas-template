import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ExternalLink, Eye, Loader2, Save } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CurrencyField, DateField, NumberField, TextAreaField, TextField } from '../../components/admin/form/Field';
import { FaqManager } from '../../components/admin/campaign/FaqManager';
import { AuditHistory } from '../../components/admin/campaign/AuditHistory';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useCampaignData } from '../../hooks/useCampaignData';
import * as campaignService from '../../services/campaignService';
import { setUnsavedChanges } from '../../lib/unsavedChanges';
import { cn } from '../../lib/cn';
import type { Campaign } from '../../types';

const TABS = [
  { id: 'general', label: 'Geral' },
  { id: 'prize', label: 'Prêmio' },
  { id: 'pricing', label: 'Preços' },
  { id: 'images', label: 'Imagens' },
  { id: 'content', label: 'Conteúdo' },
  { id: 'faq', label: 'FAQ' },
  { id: 'regulation', label: 'Regulamento' },
  { id: 'seo', label: 'SEO' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const STATUS_LABEL: Record<Campaign['status'], string> = {
  active: 'Ativa',
  paused: 'Pausada',
  finished: 'Encerrada',
};

export function CampaignEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { campaign, loading } = useCampaignData();

  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [draft, setDraft] = useState<Campaign | null>(null);
  const [original, setOriginal] = useState<Campaign | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (campaign && !draft) {
      setDraft(campaign);
      setOriginal(campaign);
    }
  }, [campaign, draft]);

  const dirty = useMemo(() => draft != null && original != null && JSON.stringify(draft) !== JSON.stringify(original), [draft, original]);

  useEffect(() => {
    setUnsavedChanges(dirty);
    return () => setUnsavedChanges(false);
  }, [dirty]);

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  function update<K extends keyof Campaign>(key: K, value: Campaign[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave() {
    if (!draft || !original || !user) return;
    setSaving(true);
    try {
      const patch: Partial<Campaign> = {};
      (Object.keys(draft) as (keyof Campaign)[]).forEach((key) => {
        if (draft[key] !== original[key]) {
          (patch as Record<string, unknown>)[key] = draft[key];
        }
      });
      await campaignService.updateCampaign(patch, user.name);
      setOriginal(draft);
      toast('Campanha atualizada com sucesso.');
    } catch {
      toast('Não foi possível salvar as alterações.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (original) setDraft(original);
  }

  if (loading || !draft) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-surface-3" />
        <div className="h-96 animate-pulse rounded-2xl bg-surface-3" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Editar campanha</h1>
            <Badge tone="neutral">{STATUS_LABEL[draft.status]}</Badge>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            O status da campanha (ativar/pausar/encerrar) é gerenciado no{' '}
            <a href="/admin/dashboard" className="text-gold-400 hover:underline">
              Dashboard
            </a>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/" target="_blank" rel="noreferrer">
            <Button variant="outline" size="md" icon={<ExternalLink size={14} />} iconPosition="left">
              Visualizar página
            </Button>
          </a>
          <a href="/?preview=1" target="_blank" rel="noreferrer">
            <Button variant="ghost" size="md" icon={<Eye size={14} />} iconPosition="left">
              Visualizar como visitante
            </Button>
          </a>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-2 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
              activeTab === tab.id ? 'bg-gold-500 text-[#181103]' : 'text-ink-muted hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
        {activeTab === 'general' && (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="title" label="Nome da campanha" value={draft.title} onChange={(v) => update('title', v)} className="sm:col-span-2" />
            <DateField id="startDate" label="Data inicial" valueISO={draft.startDateISO} onChange={(v) => update('startDateISO', v)} />
            <DateField id="drawDate" label="Data de encerramento" valueISO={draft.drawDateISO} onChange={(v) => update('drawDateISO', v)} />
          </div>
        )}

        {activeTab === 'prize' && (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="prizeName" label="Prêmio" value={draft.prizeName} onChange={(v) => update('prizeName', v)} className="sm:col-span-2" />
            <TextAreaField
              id="prizeDescription"
              label="Descrição do prêmio"
              value={draft.prizeDescription}
              onChange={(v) => update('prizeDescription', v)}
              rows={5}
              className="sm:col-span-2"
            />
            <CurrencyField
              id="prizeValue"
              label="Valor estimado"
              cents={draft.prizeEstimatedValueCents}
              onChange={(v) => update('prizeEstimatedValueCents', v)}
            />
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="grid gap-5 sm:grid-cols-2">
            <CurrencyField
              id="numberPrice"
              label="Preço por número"
              cents={draft.numberPriceCents}
              onChange={(v) => update('numberPriceCents', v)}
              hint="A validação final do preço no momento da compra é sempre feita pelo backend."
            />
            <NumberField
              id="totalNumbers"
              label="Quantidade de números"
              value={draft.totalNumbers}
              onChange={(v) => update('totalNumbers', v)}
              min={1}
              hint="Alterar este valor não redistribui números já vendidos."
            />
          </div>
        )}

        {activeTab === 'images' && (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="prizeImage"
              label="Imagem principal (URL)"
              value={draft.prizeImageUrl ?? ''}
              onChange={(v) => update('prizeImageUrl', v || null)}
              className="sm:col-span-2"
              placeholder="https://…"
            />
            <TextField
              id="logoUrl"
              label="Logo (URL)"
              value={draft.logoUrl ?? ''}
              onChange={(v) => update('logoUrl', v || null)}
              placeholder="https://…"
            />
            <TextField
              id="bannerUrl"
              label="Banner (URL)"
              value={draft.bannerUrl ?? ''}
              onChange={(v) => update('bannerUrl', v || null)}
              placeholder="https://…"
            />
            <TextAreaField
              id="additionalImages"
              label="Imagens adicionais"
              value={(draft.additionalImageUrls ?? []).join('\n')}
              onChange={(v) =>
                update(
                  'additionalImageUrls',
                  v.split('\n').map((line) => line.trim()).filter(Boolean),
                )
              }
              rows={4}
              hint="Uma URL por linha."
              className="sm:col-span-2"
            />
            <p className="text-xs text-ink-faint sm:col-span-2">
              Upload direto de arquivo depende de um serviço de storage configurado no backend (ver Configurações →
              Integrações). Por enquanto, use URLs já hospedadas.
            </p>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField id="tagline" label="Título" value={draft.tagline} onChange={(v) => update('tagline', v)} className="sm:col-span-2" />
            <TextField
              id="ctaText"
              label="Texto do CTA"
              value={draft.ctaText ?? ''}
              onChange={(v) => update('ctaText', v)}
              placeholder="Ex: Quero participar"
            />
            <TextField
              id="primaryColor"
              label="Cor primária"
              value={draft.primaryColor ?? ''}
              onChange={(v) => update('primaryColor', v)}
              placeholder="#f5b301"
              hint="Cor de destaque usada nos CTAs da página pública."
            />
          </div>
        )}

        {activeTab === 'faq' && <FaqManager />}

        {activeTab === 'regulation' && (
          <TextAreaField
            id="regulationText"
            label="Regulamento / informações legais"
            value={draft.regulationText ?? ''}
            onChange={(v) => update('regulationText', v)}
            rows={12}
            hint="Este conteúdo é exibido na página /regulamento."
          />
        )}

        {activeTab === 'seo' && (
          <div className="grid gap-5">
            <TextField id="seoTitle" label="Título SEO" value={draft.seoTitle ?? ''} onChange={(v) => update('seoTitle', v)} />
            <TextAreaField
              id="seoDescription"
              label="Descrição SEO"
              value={draft.seoDescription ?? ''}
              onChange={(v) => update('seoDescription', v)}
              rows={3}
            />
          </div>
        )}
      </div>

      <AuditHistory />

      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur lg:pl-64">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
            <p className="flex items-center gap-2 text-sm text-ink-muted">
              <AlertTriangle size={16} className="text-gold-400" />
              Você possui alterações não salvas.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={handleCancel} disabled={saving}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                icon={saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                iconPosition="left"
              >
                {saving ? 'Salvando…' : 'Salvar alterações'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
