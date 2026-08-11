import type { AdminUser } from '../../types/admin';

/**
 * DEMO DATA — usuário administrador fictício usado apenas enquanto não
 * há backend de autenticação real. Credenciais em src/services/authService.ts.
 */
export const mockAdminUser: AdminUser = {
  id: 'admin_demo_01',
  name: 'Organizador Demo',
  email: 'admin@packlp.demo',
  phone: '(11) 90000-0000',
  avatarUrl: null,
  role: 'owner',
};
