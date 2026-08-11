import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-soft pt-4 text-sm">
      <p className="text-ink-faint">
        Página {page + 1} de {totalPages} · {total.toLocaleString('pt-BR')} {total === 1 ? 'registro' : 'registros'}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="md"
          className="!px-3 !py-1.5 !text-xs"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          icon={<ChevronLeft size={14} />}
          iconPosition="left"
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="md"
          className="!px-3 !py-1.5 !text-xs"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          icon={<ChevronRight size={14} />}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
