import type { Testimonial } from '../types';

/**
 * DADOS FICTÍCIOS — estrutura de exemplo apenas.
 * Em produção, utilizar somente depoimentos reais e verificáveis,
 * vindos da API (GET /testimonials ou equivalente).
 */
export const mockTestimonials: Testimonial[] = [
  {
    id: 'dep_1',
    name: 'Participante exemplo',
    avatarUrl: null,
    rating: 5,
    comment:
      'Texto de depoimento placeholder — substituir por avaliação real e verificada antes de publicar em produção.',
    dateISO: '2026-07-28',
  },
  {
    id: 'dep_2',
    name: 'Participante exemplo',
    avatarUrl: null,
    rating: 5,
    comment:
      'Texto de depoimento placeholder — substituir por avaliação real e verificada antes de publicar em produção.',
    dateISO: '2026-07-22',
  },
  {
    id: 'dep_3',
    name: 'Participante exemplo',
    avatarUrl: null,
    rating: 4,
    comment:
      'Texto de depoimento placeholder — substituir por avaliação real e verificada antes de publicar em produção.',
    dateISO: '2026-07-19',
  },
];
