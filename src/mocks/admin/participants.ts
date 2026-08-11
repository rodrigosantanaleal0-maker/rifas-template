import type { AdminParticipant } from '../../types/admin';
import { createSeededRandom } from './_seed';

/**
 * DEMO DATA — participantes fictícios gerados deterministicamente para
 * o PackLP Admin funcionar durante o desenvolvimento. Nenhuma destas
 * pessoas existe; nomes e e-mails usam o domínio reservado `demo.local`
 * de propósito. Em produção, substituir por `participantService`
 * apontando para o backend real (ver src/services/participantService.ts).
 */
const PARTICIPANT_COUNT = 48;
const random = createSeededRandom(7331);

export const mockParticipants: AdminParticipant[] = Array.from({ length: PARTICIPANT_COUNT }, (_, i) => {
  const index = i + 1;
  const participations = 1 + Math.floor(random() * 40);
  const avgTicketCents = 200 + Math.floor(random() * 400);
  const daysAgo = Math.floor(random() * 55);
  const blocked = random() < 0.04;

  return {
    id: `part_demo_${String(index).padStart(3, '0')}`,
    name: `Participante Demo ${String(index).padStart(2, '0')}`,
    email: `participante${String(index).padStart(2, '0')}@demo.local`,
    phone: `(11) 9${String(1000 + index).padStart(4, '0')}-${String(2000 + index).padStart(4, '0')}`,
    participations,
    totalSpentCents: participations * avgTicketCents,
    lastParticipationISO: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
    status: blocked ? 'blocked' : 'active',
  };
});
