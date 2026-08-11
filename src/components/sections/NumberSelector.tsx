import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Dice5, Search, X } from 'lucide-react';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/Button';
import { getTickets } from '../../lib/api';
import { formatCurrencyBRL } from '../../lib/format';
import type { Campaign, RaffleNumber } from '../../types';
import { cn } from '../../lib/cn';

const PAGE_SIZE = 60;

interface NumberSelectorProps {
  campaign: Campaign | null;
  requestedQuantity: number | null;
  onConsumeRequest: () => void;
}

export function NumberSelector({ campaign, requestedQuantity, onConsumeRequest }: NumberSelectorProps) {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [tickets, setTickets] = useState<RaffleNumber[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);
  const [quantityInput, setQuantityInput] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!campaign) return;
    let active = true;
    setLoadingTickets(true);
    getTickets(campaign.id).then((data) => {
      if (active) {
        setTickets(data);
        setLoadingTickets(false);
      }
    });
    return () => {
      active = false;
    };
  }, [campaign]);

  useEffect(() => {
    if (requestedQuantity == null) return;
    setQuantityInput(requestedQuantity);
    generateNumbers(requestedQuantity);
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    onConsumeRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedQuantity]);

  const availableNumbers = useMemo(() => tickets.filter((t) => t.status === 'available'), [tickets]);
  const pageItems = availableNumbers.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(availableNumbers.length / PAGE_SIZE));

  function generateNumbers(quantity: number) {
    const pool = availableNumbers.map((t) => t.value).filter((v) => !selected.includes(v));
    const picked: number[] = [];
    const poolCopy = [...pool];
    for (let i = 0; i < quantity && poolCopy.length > 0; i++) {
      const idx = Math.floor(Math.random() * poolCopy.length);
      picked.push(poolCopy[idx]);
      poolCopy.splice(idx, 1);
    }
    setSelected((prev) => Array.from(new Set([...prev, ...picked])));
  }

  function toggleNumber(value: number) {
    setSelected((prev) => (prev.includes(value) ? prev.filter((n) => n !== value) : [...prev, value]));
  }

  function removeNumber(value: number) {
    setSelected((prev) => prev.filter((n) => n !== value));
  }

  function handleSearch() {
    const value = Number(searchValue);
    if (!value || !Number.isInteger(value)) {
      setSearchMessage('Digite um número válido.');
      return;
    }
    const found = tickets.find((t) => t.value === value);
    if (!found) {
      setSearchMessage('Número fora do intervalo desta campanha.');
      return;
    }
    if (found.status !== 'available') {
      setSearchMessage(`O número ${value} já está indisponível.`);
      return;
    }
    if (selected.includes(value)) {
      setSearchMessage(`O número ${value} já está na sua seleção.`);
      return;
    }
    setSelected((prev) => [...prev, value]);
    setSearchMessage(`Número ${value} adicionado à seleção.`);
    setSearchValue('');
  }

  const totalCents = campaign ? selected.length * campaign.numberPriceCents : 0;

  function handleContinue() {
    if (selected.length === 0 || !campaign) return;
    navigate('/checkout', {
      state: { numbers: selected, campaignId: campaign.id },
    });
  }

  return (
    <section
      id="escolher-numeros"
      ref={sectionRef}
      className="scroll-mt-24 py-20 sm:py-28"
      aria-labelledby="numeros-heading"
    >
      <Container>
        <SectionHeading
          eyebrow="Seleção"
          title={<span id="numeros-heading">Escolha seus números</span>}
          description="Gere números aleatórios disponíveis ou pesquise um número específico. A disponibilidade final é sempre validada pelo servidor no momento da compra."
        />

        <Reveal className="mx-auto mt-12 max-w-4xl rounded-3xl border border-border bg-surface p-5 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="qty-input" className="mb-1.5 block text-xs font-semibold text-ink-muted">
                Quantidade de números
              </label>
              <input
                id="qty-input"
                type="number"
                min={1}
                max={500}
                value={quantityInput}
                onChange={(e) => setQuantityInput(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-ink outline-none focus:border-gold-400/60"
              />
            </div>
            <Button
              variant="secondary"
              icon={<Dice5 size={17} />}
              iconPosition="left"
              onClick={() => generateNumbers(quantityInput)}
              disabled={loadingTickets}
            >
              Gerar números
            </Button>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="search-input" className="mb-1.5 block text-xs font-semibold text-ink-muted">
                Pesquisar número específico
              </label>
              <input
                id="search-input"
                type="text"
                inputMode="numeric"
                placeholder={`Ex: ${campaign ? Math.floor(campaign.totalNumbers / 2) : 12345}`}
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value.replace(/\D/g, ''));
                  setSearchMessage(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-ink outline-none focus:border-gold-400/60"
              />
            </div>
            <Button variant="outline" icon={<Search size={16} />} iconPosition="left" onClick={handleSearch}>
              Adicionar
            </Button>
          </div>
          {searchMessage && <p className="mt-2 text-sm text-ink-muted">{searchMessage}</p>}

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink-muted">Números disponíveis (amostra)</p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2 text-xs text-ink-faint">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="rounded-md border border-border px-2 py-1 disabled:opacity-30"
                  >
                    Anterior
                  </button>
                  <span>
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="rounded-md border border-border px-2 py-1 disabled:opacity-30"
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>

            <div
              className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10"
              role="group"
              aria-label="Grade de números disponíveis"
            >
              {loadingTickets
                ? Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="h-9 animate-pulse rounded-lg bg-surface-3" />
                  ))
                : pageItems.map((t) => {
                    const isSelected = selected.includes(t.value);
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => toggleNumber(t.value)}
                        aria-pressed={isSelected}
                        className={cn(
                          'rounded-lg border px-1 py-2 text-xs font-medium tabular-nums transition-colors',
                          isSelected
                            ? 'border-gold-500 bg-gold-500/15 text-gold-300'
                            : 'border-border bg-surface-2 text-ink-muted hover:border-gold-400/40 hover:text-ink',
                        )}
                      >
                        {String(t.value).padStart(5, '0')}
                      </button>
                    );
                  })}
            </div>
          </div>

          {selected.length > 0 && (
            <div className="mt-8 border-t border-border-soft pt-6">
              <p className="mb-3 text-sm font-semibold text-ink-muted">Números selecionados</p>
              <div className="flex flex-wrap gap-2">
                {selected.map((n) => (
                  <motion.span
                    key={n}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 py-1 pl-3 pr-1.5 text-sm font-medium text-gold-300"
                  >
                    {String(n).padStart(5, '0')}
                    <button
                      type="button"
                      aria-label={`Remover número ${n}`}
                      onClick={() => removeNumber(n)}
                      className="rounded-full p-0.5 hover:bg-gold-500/20"
                    >
                      <X size={13} />
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col items-stretch justify-between gap-4 rounded-2xl bg-surface-2 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-ink-muted">
                Você selecionou <strong className="text-ink">{selected.length}</strong>{' '}
                {selected.length === 1 ? 'número' : 'números'}
              </p>
              <p className="font-display text-2xl font-bold text-ink">Total: {formatCurrencyBRL(totalCents)}</p>
            </div>
            <Button
              size="lg"
              icon={<ArrowRight size={18} />}
              disabled={selected.length === 0}
              onClick={handleContinue}
              className="disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continuar
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
