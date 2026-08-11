import type { Organizer } from '../types';

/** DADOS FICTÍCIOS — substituir pela identificação real do responsável legal pela campanha. */
export const mockOrganizer: Organizer = {
  name: '[Nome do responsável/marca]',
  handle: '@perfil_oficial',
  document: 'CNPJ 00.000.000/0001-00 (placeholder)',
  avatarUrl: null,
  bio: 'Espaço reservado para a descrição do responsável pela organização e condução da campanha promocional, incluindo histórico e informações de contato oficiais.',
  socials: [
    { platform: 'instagram', url: '#', handle: '@perfil_oficial' },
    { platform: 'tiktok', url: '#', handle: '@perfil_oficial' },
    { platform: 'youtube', url: '#', handle: 'Canal Oficial' },
  ],
};
