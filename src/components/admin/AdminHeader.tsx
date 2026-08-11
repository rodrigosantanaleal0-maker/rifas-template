import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronDown, ExternalLink, LogOut, Menu, Settings } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';
import { confirmDiscardIfDirty } from '../../lib/unsavedChanges';
import { useAuth } from '../../contexts/AuthContext';
import { useCampaignData } from '../../hooks/useCampaignData';
import * as notificationService from '../../services/notificationService';
import type { AdminNotification } from '../../types/admin';

const STATUS_LABEL: Record<string, { label: string; tone: 'gold' | 'violet' | 'neutral' }> = {
  active: { label: 'Ativa', tone: 'gold' },
  paused: { label: 'Pausada', tone: 'violet' },
  finished: { label: 'Encerrada', tone: 'neutral' },
};

export function AdminHeader({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  const { user, logout } = useAuth();
  const { campaign } = useCampaignData();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    notificationService.getNotifications().then(setNotifications);
    return notificationService.subscribeNotifications(() => {
      setNotifications(notificationService.getSnapshot());
    });
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const unread = notifications.filter((n) => !n.readAtISO).length;
  const status = campaign ? STATUS_LABEL[campaign.status] : null;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border-soft bg-surface/90 px-4 backdrop-blur sm:h-20 sm:px-8">
      <button
        type="button"
        onClick={onOpenMobileMenu}
        aria-label="Abrir menu"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-ink lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink sm:text-base">
          {campaign?.title ?? 'Carregando campanha…'}
        </p>
        {status && (
          <span className="mt-0.5 inline-block">
            <Badge tone={status.tone} className="!px-2.5 !py-1 !text-[10px]">
              {status.label}
            </Badge>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notificações"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink-muted hover:text-ink"
          >
            <Bell size={17} />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ruby-500 px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-surface shadow-2xl">
              <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
                <p className="text-sm font-semibold text-ink">Notificações</p>
                {unread > 0 && (
                  <button
                    type="button"
                    onClick={() => notificationService.markAllAsRead()}
                    className="text-xs font-medium text-gold-400 hover:underline"
                  >
                    Marcar todas como lidas
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-ink-faint">Nenhuma notificação.</p>
                ) : (
                  notifications.slice(0, 8).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => notificationService.markAsRead(n.id)}
                      className={cn(
                        'block w-full border-b border-border-soft px-4 py-3 text-left last:border-0 hover:bg-surface-2',
                        !n.readAtISO && 'bg-gold-500/5',
                      )}
                    >
                      <p className="text-sm font-medium text-ink">{n.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{n.description}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setUserOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-2.5 hover:border-gold-400/40"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-300 to-gold-500 text-xs font-bold text-[#181103]">
              {(user?.name ?? '?').slice(0, 2).toUpperCase()}
            </span>
            <ChevronDown size={14} className="text-ink-faint" />
          </button>
          {userOpen && (
            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-border bg-surface shadow-2xl">
              <div className="border-b border-border-soft px-4 py-3">
                <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
                <p className="truncate text-xs text-ink-faint">{user?.email}</p>
              </div>
              <Link
                to="/admin/settings"
                onClick={(e) => {
                  if (!confirmDiscardIfDirty()) {
                    e.preventDefault();
                    return;
                  }
                  setUserOpen(false);
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-muted hover:bg-surface-2 hover:text-ink"
              >
                <Settings size={15} /> Configurações
              </Link>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-muted hover:bg-surface-2 hover:text-ink"
              >
                <ExternalLink size={15} /> Ver página pública
              </a>
              <button
                type="button"
                onClick={() => {
                  if (!confirmDiscardIfDirty()) return;
                  logout();
                }}
                className="flex w-full items-center gap-2.5 border-t border-border-soft px-4 py-2.5 text-left text-sm text-ruby-400 hover:bg-ruby-500/10"
              >
                <LogOut size={15} /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
