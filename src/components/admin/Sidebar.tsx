import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Flag,
  Hash,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingCart,
  Ticket,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { confirmDiscardIfDirty } from '../../lib/unsavedChanges';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/campaign', label: 'Campanha', icon: Flag },
  { to: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  { to: '/admin/participants', label: 'Participantes', icon: Users },
  { to: '/admin/tickets', label: 'Números', icon: Hash },
  { to: '/admin/results', label: 'Resultados', icon: Trophy },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Configurações', icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-6 font-display text-lg font-bold text-ink sm:h-20">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 text-[#181103]">
          <Ticket size={18} strokeWidth={2.5} />
        </span>
        Pack<span className="text-gradient-gold">LP</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2" aria-label="Navegação administrativa">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={(e) => {
              if (!confirmDiscardIfDirty()) {
                e.preventDefault();
                return;
              }
              onNavigate?.();
            }}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-gold-500/10 text-gold-300' : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
              )
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border-soft p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/40 bg-surface-2 text-xs font-bold text-gold-300">
            {(user?.name ?? '?').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
            <p className="truncate text-xs text-ink-faint">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!confirmDiscardIfDirty()) return;
            logout();
          }}
          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-ruby-500/10 hover:text-ruby-400"
        >
          <LogOut size={17} />
          Sair
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ mobileOpen, onCloseMobile }: { mobileOpen: boolean; onCloseMobile: () => void }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border-soft bg-surface lg:block">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border-soft bg-surface lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <button
                type="button"
                aria-label="Fechar menu"
                onClick={onCloseMobile}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-muted"
              >
                <X size={17} />
              </button>
              <SidebarContent onNavigate={onCloseMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
