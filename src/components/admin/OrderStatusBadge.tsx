import { Badge } from '../ui/Badge';
import type { OrderStatus } from '../../types/admin';

const META: Record<OrderStatus, { label: string; tone: 'gold' | 'violet' | 'emerald' | 'ruby' | 'neutral' }> = {
  pending: { label: 'Pendente', tone: 'gold' },
  paid: { label: 'Pago', tone: 'emerald' },
  cancelled: { label: 'Cancelado', tone: 'neutral' },
  expired: { label: 'Expirado', tone: 'ruby' },
  refunded: { label: 'Reembolsado', tone: 'violet' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}
