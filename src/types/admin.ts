/**
 * Tipos do domínio administrativo (PackLP Admin).
 * Compartilham os tipos públicos de `./index` sempre que possível para
 * evitar duas fontes de verdade sobre a mesma campanha.
 */
import type { PaymentMethod } from './index';

export type AdminRole = 'owner' | 'manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  role: AdminRole;
}

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'expired' | 'refunded';

export interface OrderHistoryEntry {
  atISO: string;
  label: string;
}

export interface AdminOrder {
  id: string;
  code: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  createdAtISO: string;
  quantity: number;
  numbers: number[];
  totalCents: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  history: OrderHistoryEntry[];
}

export type ParticipantStatus = 'active' | 'blocked';

export interface AdminParticipant {
  id: string;
  name: string;
  email: string;
  phone: string;
  participations: number;
  totalSpentCents: number;
  lastParticipationISO: string | null;
  status: ParticipantStatus;
}

export type AdminTicketStatus = 'available' | 'reserved' | 'sold' | 'blocked';

export interface AdminTicket {
  value: number;
  status: AdminTicketStatus;
  orderId?: string;
}

export interface ResultRecord {
  id: string;
  campaignId: string;
  campaignTitle: string;
  status: 'awaiting' | 'published';
  drawDateISO: string;
  winnerName: string | null;
  winnerDocumentMasked: string | null;
  winningNumber: number | null;
  method: string;
  proofDocumentName: string | null;
  publishedAtISO: string | null;
}

export interface TimeSeriesPoint {
  dateISO: string;
  revenueCents: number;
  participations: number;
  ticketsSold: number;
  ordersPaid: number;
  ordersPending: number;
}

export interface DashboardMetrics {
  revenueCents: number;
  revenueDeltaPct: number | null;
  participations: number;
  participationsDeltaPct: number | null;
  ticketsSoldPct: number;
  ordersPaid: number;
  ordersPending: number;
  participantsCount: number;
}

export type NotificationKind = 'order' | 'payment' | 'milestone' | 'campaign';

export interface AdminNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  description: string;
  createdAtISO: string;
  readAtISO: string | null;
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  field: string;
  previousValue: string;
  newValue: string;
  atISO: string;
}

export type AnalyticsPeriod = 'today' | '7d' | '30d' | 'all';
