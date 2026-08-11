import { clearSession, readSession, writeSession } from '../lib/auth';
import { mockAdminUser } from '../mocks/admin/adminUser';
import type { AdminUser } from '../types/admin';

/**
 * Camada de autenticação administrativa.
 *
 * IMPORTANTE: a proteção de rota no frontend (`ProtectedRoute`) é só UX.
 * A autorização real de qualquer ação administrativa — editar campanha,
 * pausar, publicar resultado, etc. — DEVE ser verificada pelo backend a
 * cada requisição, validando o token e o papel do usuário. Nunca confiar
 * apenas no frontend para proteger dados sensíveis.
 *
 * Endpoints esperados quando o backend existir:
 *   POST /api/admin/auth/login
 *   POST /api/admin/auth/logout
 *   GET  /api/admin/auth/me
 *   POST /api/admin/auth/change-password
 *   GET  /api/admin/auth/sessions
 *   POST /api/admin/auth/sessions/revoke-all
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = !API_BASE_URL;

const DEMO_EMAIL = 'admin@packlp.demo';
const DEMO_PASSWORD = 'demo1234';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function login(email: string, password: string): Promise<AdminUser> {
  if (USE_MOCKS) {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      await delay(null, 400);
      throw new Error('E-mail ou senha inválidos.');
    }
    writeSession({
      token: `demo_${Math.random().toString(36).slice(2)}`,
      expiresAtISO: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    });
    return delay(mockAdminUser);
  }

  const res = await fetch(`${API_BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('E-mail ou senha inválidos.');
  const data = (await res.json()) as { token: string; expiresAtISO: string; user: AdminUser };
  writeSession({ token: data.token, expiresAtISO: data.expiresAtISO });
  return data.user;
}

export async function me(): Promise<AdminUser | null> {
  const session = readSession();
  if (!session) return null;

  if (USE_MOCKS) return delay(mockAdminUser, 150);

  const res = await fetch(`${API_BASE_URL}/api/admin/auth/me`, {
    headers: { Authorization: `Bearer ${session.token}` },
  });
  if (!res.ok) {
    clearSession();
    return null;
  }
  return res.json();
}

export async function updateProfile(patch: Partial<AdminUser>): Promise<AdminUser> {
  if (USE_MOCKS) {
    Object.assign(mockAdminUser, patch);
    return delay({ ...mockAdminUser }, 350);
  }
  const session = readSession();
  const res = await fetch(`${API_BASE_URL}/api/admin/auth/me`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.token ?? ''}` },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Falha ao atualizar perfil.');
  return res.json();
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  if (USE_MOCKS) {
    await delay(null, 400);
    return;
  }
  const session = readSession();
  const res = await fetch(`${API_BASE_URL}/api/admin/auth/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.token ?? ''}` },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) throw new Error('Falha ao alterar senha.');
}

export async function logout(): Promise<void> {
  const session = readSession();
  clearSession();
  if (!USE_MOCKS && session) {
    await fetch(`${API_BASE_URL}/api/admin/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.token}` },
    }).catch(() => {});
  }
}

/** Exposto só para preencher o formulário de login em ambiente de demonstração. */
export const DEMO_CREDENTIALS = USE_MOCKS ? { email: DEMO_EMAIL, password: DEMO_PASSWORD } : null;
