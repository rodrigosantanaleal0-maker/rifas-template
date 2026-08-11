/**
 * Armazenamento local da sessão administrativa. Isto NÃO autoriza nada
 * por si só — é apenas o que a UI usa para decidir se mostra a tela de
 * login. Qualquer chamada sensível deve enviar o token e o backend deve
 * validá-lo e checar o papel do usuário a cada requisição.
 */
const SESSION_KEY = 'packlp_admin_session_v1';

export interface StoredSession {
  token: string;
  expiresAtISO: string;
}

export function readSession(): StoredSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as StoredSession;
    if (new Date(session.expiresAtISO).getTime() < Date.now()) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function writeSession(session: StoredSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
