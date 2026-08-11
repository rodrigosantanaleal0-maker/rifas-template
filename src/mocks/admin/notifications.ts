import type { AdminNotification } from '../../types/admin';
import { mockOrders } from './orders';

/**
 * DEMO DATA — notificações derivadas dos pedidos fictícios recentes,
 * apenas para exercitar a interface. Em produção estas notificações
 * devem ser disparadas por eventos reais do backend (novo pedido,
 * pagamento confirmado, marcos da campanha) via
 * `notificationService`/WebSocket — nunca geradas no frontend.
 */
const recentPaid = mockOrders.filter((o) => o.status === 'paid').slice(0, 4);
const recentPending = mockOrders.filter((o) => o.status === 'pending').slice(0, 2);

export const mockNotifications: AdminNotification[] = [
  ...recentPaid.map(
    (order, i): AdminNotification => ({
      id: `notif_paid_${order.id}`,
      kind: 'payment',
      title: 'Pagamento confirmado',
      description: `${order.participantName} — pedido ${order.code} (${order.quantity} números).`,
      createdAtISO: order.createdAtISO,
      readAtISO: i < 2 ? null : order.createdAtISO,
    }),
  ),
  ...recentPending.map(
    (order): AdminNotification => ({
      id: `notif_new_${order.id}`,
      kind: 'order',
      title: 'Novo pedido recebido',
      description: `${order.participantName} solicitou ${order.quantity} números — aguardando pagamento.`,
      createdAtISO: order.createdAtISO,
      readAtISO: null,
    }),
  ),
  {
    id: 'notif_milestone_50',
    kind: 'milestone',
    title: 'Campanha atingiu 50%',
    description: 'Mais da metade dos números já foram vendidos.',
    createdAtISO: new Date(Date.now() - 6 * 86_400_000).toISOString(),
    readAtISO: new Date(Date.now() - 6 * 86_400_000).toISOString(),
  } satisfies AdminNotification,
  {
    id: 'notif_milestone_70',
    kind: 'milestone',
    title: 'Campanha atingiu 70% dos números vendidos',
    description: 'A campanha está avançando bem — considere reforçar a divulgação.',
    createdAtISO: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    readAtISO: null,
  } satisfies AdminNotification,
].sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO));
