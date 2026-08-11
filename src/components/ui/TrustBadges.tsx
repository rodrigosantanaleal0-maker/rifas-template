import { CreditCard, FileCheck2, Lock, QrCode, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/cn';

const ITEMS = [
  { icon: ShieldCheck, label: 'Pagamento seguro' },
  { icon: Lock, label: 'Dados protegidos (LGPD)' },
  { icon: QrCode, label: 'Pix' },
  { icon: CreditCard, label: 'Cartão de crédito' },
  { icon: FileCheck2, label: 'Regulamento auditável' },
];

export function TrustBadges({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap items-center gap-x-6 gap-y-3', className)}>
      {ITEMS.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5 text-xs text-ink-faint">
          <item.icon size={14} className="text-emerald-400" />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
