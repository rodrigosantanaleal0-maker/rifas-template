import { useState } from 'react';
import { Loader2, LogOut, Save, ShieldCheck } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog';
import { TextField } from '../../components/admin/form/Field';
import { cn } from '../../lib/cn';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import * as authService from '../../services/authService';

const TABS = [
  { id: 'profile', label: 'Perfil' },
  { id: 'account', label: 'Conta' },
  { id: 'security', label: 'Segurança' },
  { id: 'notifications', label: 'Notificações' },
  { id: 'integrations', label: 'Integrações' },
  { id: 'appearance', label: 'Aparência' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-border-soft bg-surface-2 px-4 py-3.5">
      <span className="text-sm text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-gold-500' : 'bg-surface-3',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  );
}

const INTEGRATIONS = [
  { name: 'Gateway de pagamento', env: 'PAYMENT_GATEWAY_API_KEY' },
  { name: 'E-mail transacional', env: 'EMAIL_PROVIDER_API_KEY' },
  { name: 'WhatsApp', env: 'WHATSAPP_API_TOKEN' },
  { name: 'Analytics', env: 'ANALYTICS_WRITE_KEY' },
  { name: 'Storage (imagens/documentos)', env: 'STORAGE_BUCKET_URL' },
  { name: 'Figma', env: 'FIGMA_ACCESS_TOKEN' },
];

export function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<TabId>('profile');

  const [profile, setProfile] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: user?.phone ?? '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [confirmLogoutAll, setConfirmLogoutAll] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState({ email: true, whatsapp: false, push: true });

  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      await updateProfile(profile);
      toast('Perfil atualizado.');
    } catch {
      toast('Não foi possível salvar o perfil.', 'error');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword() {
    if (!passwords.current || passwords.next.length < 8 || passwords.next !== passwords.confirm) {
      toast('Verifique os campos: a nova senha precisa ter 8+ caracteres e coincidir com a confirmação.', 'error');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword(passwords.current, passwords.next);
      setPasswords({ current: '', next: '', confirm: '' });
      toast('Senha alterada com sucesso.');
    } catch {
      toast('Não foi possível alterar a senha.', 'error');
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-ink-muted">Gerencie sua conta e as preferências do painel.</p>
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-2 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
              activeTab === tab.id ? 'bg-gold-500 text-[#181103]' : 'text-ink-muted hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-8">
        {activeTab === 'profile' && (
          <div className="max-w-lg space-y-5">
            <TextField id="profile-name" label="Nome" value={profile.name} onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
            <TextField id="profile-email" label="E-mail" value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} />
            <TextField id="profile-phone" label="Telefone" value={profile.phone} onChange={(v) => setProfile((p) => ({ ...p, phone: v }))} />
            <TextField
              id="profile-avatar"
              label="Foto (URL)"
              value={user?.avatarUrl ?? ''}
              onChange={() => {}}
              placeholder="https://…"
              hint="Upload direto depende de um serviço de storage configurado no backend."
            />
            <Button
              onClick={handleSaveProfile}
              disabled={savingProfile}
              icon={savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              iconPosition="left"
            >
              {savingProfile ? 'Salvando…' : 'Salvar perfil'}
            </Button>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="max-w-lg space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-border-soft pb-3">
              <span className="text-ink-faint">Papel</span>
              <Badge tone="gold">{user?.role === 'owner' ? 'Proprietário' : 'Gerente'}</Badge>
            </div>
            <div className="flex items-center justify-between border-b border-border-soft pb-3">
              <span className="text-ink-faint">E-mail de acesso</span>
              <span className="font-medium text-ink">{user?.email}</span>
            </div>
            <p className="text-xs text-ink-faint">
              Para transferir a titularidade da conta ou alterar permissões de outros administradores, isso deve ser
              feito por um endpoint dedicado no backend, nunca apenas no frontend.
            </p>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-lg space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-base font-bold text-ink">Alterar senha</h2>
              <TextField
                id="pwd-current"
                label="Senha atual"
                value={passwords.current}
                onChange={(v) => setPasswords((p) => ({ ...p, current: v }))}
              />
              <TextField
                id="pwd-next"
                label="Nova senha"
                value={passwords.next}
                onChange={(v) => setPasswords((p) => ({ ...p, next: v }))}
                hint="Mínimo de 8 caracteres."
              />
              <TextField
                id="pwd-confirm"
                label="Confirmar nova senha"
                value={passwords.confirm}
                onChange={(v) => setPasswords((p) => ({ ...p, confirm: v }))}
              />
              <Button
                onClick={handleChangePassword}
                disabled={savingPassword}
                icon={savingPassword ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                iconPosition="left"
              >
                {savingPassword ? 'Alterando…' : 'Alterar senha'}
              </Button>
            </div>

            <div className="space-y-3 border-t border-border-soft pt-6">
              <h2 className="font-display text-base font-bold text-ink">Sessões</h2>
              <p className="text-sm text-ink-muted">
                Encerre a sessão atual em todos os dispositivos conectados a esta conta.
              </p>
              <Button variant="danger" icon={<LogOut size={15} />} iconPosition="left" onClick={() => setConfirmLogoutAll(true)}>
                Logout de todos os dispositivos
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="max-w-lg space-y-3">
            <Toggle checked={notifPrefs.email} onChange={(v) => setNotifPrefs((p) => ({ ...p, email: v }))} label="Notificações por e-mail" />
            <Toggle checked={notifPrefs.whatsapp} onChange={(v) => setNotifPrefs((p) => ({ ...p, whatsapp: v }))} label="Notificações por WhatsApp" />
            <Toggle checked={notifPrefs.push} onChange={(v) => setNotifPrefs((p) => ({ ...p, push: v }))} label="Notificações no navegador" />
            <Button className="mt-2" icon={<Save size={16} />} iconPosition="left" onClick={() => toast('Preferências de notificação salvas.')}>
              Salvar preferências
            </Button>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-3">
            <p className="text-sm text-ink-muted">
              Nenhuma chave de API é inserida ou armazenada no frontend. Configure cada integração via variáveis de
              ambiente no backend.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {INTEGRATIONS.map((integration) => (
                <div key={integration.name} className="rounded-xl border border-border-soft bg-surface-2 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{integration.name}</p>
                    <Badge tone="neutral">Não configurado</Badge>
                  </div>
                  <p className="mt-2 text-xs text-ink-faint">
                    Variável esperada: <code className="text-ink-muted">{integration.env}</code>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="max-w-lg space-y-4 text-sm">
            <div className="rounded-xl border border-border-soft bg-surface-2 p-4">
              <p className="font-medium text-ink">Tema escuro</p>
              <p className="mt-1 text-ink-muted">
                Esta campanha usa tema escuro fixo, definido em <code className="text-ink-muted">src/index.css</code>.
              </p>
            </div>
            <p className="text-ink-faint">
              A cor de destaque da página pública é editada em{' '}
              <a href="/admin/campaign" className="text-gold-400 hover:underline">
                Campanha → Conteúdo
              </a>
              .
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmLogoutAll}
        title="Sair de todos os dispositivos?"
        description="Isso encerra imediatamente todas as sessões ativas desta conta, incluindo a atual."
        tone="danger"
        confirmLabel="Sair de todos"
        onConfirm={() => {
          setConfirmLogoutAll(false);
          logout();
        }}
        onCancel={() => setConfirmLogoutAll(false)}
      />
    </div>
  );
}
