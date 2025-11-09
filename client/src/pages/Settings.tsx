import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

// ==================================================
// TYPES
// ==================================================

type SettingTab = 'general' | 'notifications' | 'providers' | 'security' | 'integrations' | 'system';

interface NotificationPreference {
  id?: number;
  channel: 'email' | 'push' | 'slack' | 'discord' | 'telegram';
  eventType: string;
  isEnabled: boolean;
  config?: Record<string, any>;
}

interface AIProviderForm {
  name: string;
  type: 'local' | 'api';
  endpoint: string;
  apiKey?: string;
  isActive: boolean;
}

interface IntegrationForm {
  serviceName: string;
  config?: Record<string, any>;
  isActive: boolean;
}

// ==================================================
// COMPONENTE PRINCIPAL
// ==================================================

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>('general');
  const [searchTerm, setSearchTerm] = useState('');

  // ==================================================
  // QUERIES
  // ==================================================

  const { data: statsData, refetch: refetchStats } = trpc.settings.getStatistics.useQuery();
  const { data: settingsData, refetch: refetchSettings } = trpc.settings.list.useQuery({ limit: 1000 });
  const { data: notificationsData, refetch: refetchNotifications } = trpc.settings.listNotifications.useQuery({});
  const { data: providersData, refetch: refetchProviders } = trpc.settings.listProviders.useQuery({});
  const { data: securityData, refetch: refetchSecurity } = trpc.settings.getSecurity.useQuery();
  const { data: integrationsData, refetch: refetchIntegrations } = trpc.settings.listIntegrations.useQuery({});
  const { data: backupsData, refetch: refetchBackups } = trpc.settings.listBackups.useQuery({ limit: 20 });

  // ==================================================
  // MUTATIONS
  // ==================================================

  const upsertSettingMutation = trpc.settings.upsert.useMutation();
  const deleteSettingMutation = trpc.settings.delete.useMutation();
  const resetSettingsMutation = trpc.settings.reset.useMutation();
  const upsertNotificationMutation = trpc.settings.upsertNotification.useMutation();
  const deleteNotificationMutation = trpc.settings.deleteNotification.useMutation();
  const updateSecurityMutation = trpc.settings.updateSecurity.useMutation();
  const generateBackupCodesMutation = trpc.settings.generateBackupCodes.useMutation();
  const createProviderMutation = trpc.settings.createProvider.useMutation();
  const updateProviderMutation = trpc.settings.updateProvider.useMutation();
  const deleteProviderMutation = trpc.settings.deleteProvider.useMutation();
  const testProviderMutation = trpc.settings.testProvider.useMutation();
  const createIntegrationMutation = trpc.settings.createIntegration.useMutation();
  const updateIntegrationMutation = trpc.settings.updateIntegration.useMutation();
  const deleteIntegrationMutation = trpc.settings.deleteIntegration.useMutation();
  const createBackupMutation = trpc.settings.createBackup.useMutation();
  const deleteBackupMutation = trpc.settings.deleteBackup.useMutation();
  const restoreBackupMutation = trpc.settings.restoreBackup.useMutation();
  const exportSettingsMutation = trpc.settings.exportSettings.useMutation();

  // ==================================================
  // ESTADO LOCAL
  // ==================================================

  const [generalSettings, setGeneralSettings] = useState({
    theme: 'dark',
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  });

  const [showProviderModal, setShowProviderModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const [providerForm, setProviderForm] = useState<AIProviderForm>({
    name: '',
    type: 'local',
    endpoint: '',
    apiKey: '',
    isActive: true,
  });

  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<any>(null);
  const [integrationForm, setIntegrationForm] = useState<IntegrationForm>({
    serviceName: '',
    config: {},
    isActive: true,
  });

  const [showBackupCodesModal, setShowBackupCodesModal] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // ==================================================
  // HANDLERS - GERAL
  // ==================================================

  const handleSaveGeneralSettings = async () => {
    try {
      await upsertSettingMutation.mutateAsync({
        settingKey: 'general_preferences',
        settingValue: generalSettings,
        settingType: 'user',
        description: 'Preferências gerais do usuário',
      });
      alert('Configurações gerais salvas com sucesso!');
      refetchSettings();
      refetchStats();
    } catch (error) {
      console.error('Erro ao salvar configurações gerais:', error);
      alert('Erro ao salvar configurações gerais');
    }
  };

  const handleResetSettings = async (type?: any) => {
    if (!confirm('Tem certeza que deseja resetar estas configurações?')) return;

    try {
      await resetSettingsMutation.mutateAsync({ settingType: type });
      alert('Configurações resetadas com sucesso!');
      refetchSettings();
      refetchStats();
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      alert('Erro ao resetar configurações');
    }
  };

  const handleExportSettings = async () => {
    try {
      const data = await exportSettingsMutation.mutateAsync();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings_export_${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar configurações:', error);
      alert('Erro ao exportar configurações');
    }
  };

  // ==================================================
  // HANDLERS - NOTIFICAÇÕES
  // ==================================================

  const handleToggleNotification = async (channel: string, eventType: string, currentEnabled: boolean) => {
    try {
      await upsertNotificationMutation.mutateAsync({
        channel: channel as any,
        eventType,
        isEnabled: !currentEnabled,
      });
      refetchNotifications();
      refetchStats();
    } catch (error) {
      console.error('Erro ao atualizar notificação:', error);
      alert('Erro ao atualizar notificação');
    }
  };

  // ==================================================
  // HANDLERS - PROVIDERS
  // ==================================================

  const handleOpenProviderModal = (provider?: any) => {
    if (provider) {
      setEditingProvider(provider);
      setProviderForm({
        name: provider.name,
        type: provider.type,
        endpoint: provider.endpoint,
        apiKey: provider.apiKey || '',
        isActive: provider.isActive,
      });
    } else {
      setEditingProvider(null);
      setProviderForm({
        name: '',
        type: 'local',
        endpoint: '',
        apiKey: '',
        isActive: true,
      });
    }
    setShowProviderModal(true);
  };

  const handleSaveProvider = async () => {
    try {
      if (editingProvider) {
        await updateProviderMutation.mutateAsync({
          id: editingProvider.id,
          data: providerForm,
        });
      } else {
        await createProviderMutation.mutateAsync(providerForm);
      }
      setShowProviderModal(false);
      refetchProviders();
      refetchStats();
      alert('Provider salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar provider:', error);
      alert('Erro ao salvar provider');
    }
  };

  const handleDeleteProvider = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este provider?')) return;

    try {
      await deleteProviderMutation.mutateAsync({ id });
      refetchProviders();
      refetchStats();
      alert('Provider deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar provider:', error);
      alert('Erro ao deletar provider');
    }
  };

  const handleTestProvider = async (id: number) => {
    try {
      const result = await testProviderMutation.mutateAsync({ id });
      if (result.success) {
        alert(`✅ ${result.message}\nLatência: ${result.latency}ms`);
      } else {
        alert(`❌ ${result.error}`);
      }
    } catch (error) {
      console.error('Erro ao testar provider:', error);
      alert('Erro ao testar provider');
    }
  };

  // ==================================================
  // HANDLERS - SEGURANÇA
  // ==================================================

  const handleUpdateSecurity = async (updates: any) => {
    try {
      await updateSecurityMutation.mutateAsync(updates);
      refetchSecurity();
      refetchStats();
      alert('Configurações de segurança atualizadas!');
    } catch (error) {
      console.error('Erro ao atualizar segurança:', error);
      alert('Erro ao atualizar segurança');
    }
  };

  const handleGenerateBackupCodes = async () => {
    try {
      const result = await generateBackupCodesMutation.mutateAsync();
      if (result.success && result.backupCodes) {
        setBackupCodes(result.backupCodes);
        setShowBackupCodesModal(true);
      }
    } catch (error) {
      console.error('Erro ao gerar códigos de backup:', error);
      alert('Erro ao gerar códigos de backup');
    }
  };

  // ==================================================
  // HANDLERS - INTEGRAÇÕES
  // ==================================================

  const handleOpenIntegrationModal = (integration?: any) => {
    if (integration) {
      setEditingIntegration(integration);
      setIntegrationForm({
        serviceName: integration.serviceName,
        config: integration.config || {},
        isActive: integration.isActive,
      });
    } else {
      setEditingIntegration(null);
      setIntegrationForm({
        serviceName: '',
        config: {},
        isActive: true,
      });
    }
    setShowIntegrationModal(true);
  };

  const handleSaveIntegration = async () => {
    try {
      if (editingIntegration) {
        await updateIntegrationMutation.mutateAsync({
          id: editingIntegration.id,
          ...integrationForm,
        });
      } else {
        await createIntegrationMutation.mutateAsync(integrationForm);
      }
      setShowIntegrationModal(false);
      refetchIntegrations();
      refetchStats();
      alert('Integração salva com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar integração:', error);
      alert('Erro ao salvar integração');
    }
  };

  const handleDeleteIntegration = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta integração?')) return;

    try {
      await deleteIntegrationMutation.mutateAsync({ id });
      refetchIntegrations();
      refetchStats();
      alert('Integração deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar integração:', error);
      alert('Erro ao deletar integração');
    }
  };

  // ==================================================
  // HANDLERS - BACKUPS
  // ==================================================

  const handleCreateBackup = async (type: 'full' | 'incremental' | 'differential' | 'database' | 'files') => {
    try {
      const result = await createBackupMutation.mutateAsync({ backupType: type });
      alert(result.message);
      refetchBackups();
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      alert('Erro ao criar backup');
    }
  };

  const handleRestoreBackup = async (id: number) => {
    if (!confirm('Tem certeza que deseja restaurar este backup? Esta ação não pode ser desfeita.')) return;

    try {
      const result = await restoreBackupMutation.mutateAsync({ id });
      if (result.success) {
        alert(result.message);
      } else {
        alert(`Erro: ${result.error}`);
      }
      refetchBackups();
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      alert('Erro ao restaurar backup');
    }
  };

  const handleDeleteBackup = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este backup?')) return;

    try {
      await deleteBackupMutation.mutateAsync({ id });
      refetchBackups();
      alert('Backup deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar backup:', error);
      alert('Erro ao deletar backup');
    }
  };

  // ==================================================
  // CARREGAR CONFIGURAÇÕES GERAIS DO BACKEND
  // ==================================================

  useEffect(() => {
    const loadGeneralSettings = async () => {
      if (settingsData?.settings) {
        const generalSetting = settingsData.settings.find(
          (s: any) => s.settingKey === 'general_preferences'
        );
        if (generalSetting && typeof generalSetting.settingValue === 'object') {
          setGeneralSettings({ ...generalSettings, ...generalSetting.settingValue });
        }
      }
    };
    loadGeneralSettings();
  }, [settingsData]);

  // ==================================================
  // ESTATÍSTICAS
  // ==================================================

  const stats = statsData || {
    settings: { total: 0, byType: [] },
    notifications: { enabled: 0 },
    providers: { active: 0 },
    integrations: { active: 0 },
    backup: { lastBackup: null },
    security: { twoFactorEnabled: false, loginNotifications: false },
  };

  // ==================================================
  // RENDER - TABS
  // ==================================================

  const tabs: { id: SettingTab; label: string; icon: string }[] = [
    { id: 'general', label: 'Geral', icon: '⚙️' },
    { id: 'notifications', label: 'Notificações', icon: '🔔' },
    { id: 'providers', label: 'AI Providers', icon: '🤖' },
    { id: 'security', label: 'Segurança', icon: '🔒' },
    { id: 'integrations', label: 'Integrações', icon: '🔌' },
    { id: 'system', label: 'Sistema', icon: '💾' },
  ];

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">⚙️ Configurações do Sistema</h1>
            <p className="text-gray-400">
              Gerencie todas as configurações, integrações e preferências do sistema
            </p>
          </div>
          <button
            onClick={handleExportSettings}
            className="btn-secondary"
          >
            📥 Exportar Configurações
          </button>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Configurações</div>
            <div className="text-white text-xl font-bold">{stats.settings.total}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Notificações</div>
            <div className="text-white text-xl font-bold">{stats.notifications.enabled}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Providers Ativos</div>
            <div className="text-white text-xl font-bold">{stats.providers.active}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Integrações</div>
            <div className="text-white text-xl font-bold">{stats.integrations.active}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">2FA</div>
            <div className="text-white text-xl font-bold">{stats.security.twoFactorEnabled ? '✅' : '❌'}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Último Backup</div>
            <div className="text-white text-xl font-bold">
              {stats.backup.lastBackup ? '✅' : '❌'}
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="card">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTEÚDO DAS TABS */}
      <div className="card">
        {/* TAB: GERAL */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">⚙️ Configurações Gerais</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Tema</label>
                <select
                  className="input w-full"
                  value={generalSettings.theme}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, theme: e.target.value })}
                >
                  <option value="dark">Escuro</option>
                  <option value="light">Claro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Idioma</label>
                <select
                  className="input w-full"
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Fuso Horário</label>
                <select
                  className="input w-full"
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                  <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Formato de Data</label>
                <select
                  className="input w-full"
                  value={generalSettings.dateFormat}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, dateFormat: e.target.value })}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Formato de Hora</label>
                <select
                  className="input w-full"
                  value={generalSettings.timeFormat}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, timeFormat: e.target.value })}
                >
                  <option value="24h">24 horas</option>
                  <option value="12h">12 horas (AM/PM)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveGeneralSettings} className="btn-primary">
                💾 Salvar Configurações
              </button>
              <button
                onClick={() => handleResetSettings('user')}
                className="btn-secondary"
              >
                🔄 Resetar para Padrão
              </button>
            </div>
          </div>
        )}

        {/* TAB: NOTIFICAÇÕES */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">🔔 Preferências de Notificações</h2>
            </div>

            <div className="space-y-4">
              {['task_completed', 'task_failed', 'backup_completed', 'security_alert', 'new_message'].map(
                (eventType) => (
                  <div key={eventType} className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3 capitalize">
                      {eventType.replace('_', ' ')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {['email', 'push', 'slack', 'discord', 'telegram'].map((channel) => {
                        const pref = notificationsData?.preferences.find(
                          (p: any) => p.channel === channel && p.eventType === eventType
                        );
                        const isEnabled = pref?.isEnabled ?? false;

                        return (
                          <label key={channel} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={() => handleToggleNotification(channel, eventType, isEnabled)}
                              className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <span className="text-gray-300 capitalize">{channel}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* TAB: PROVIDERS */}
        {activeTab === 'providers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">🤖 AI Providers</h2>
              <button onClick={() => handleOpenProviderModal()} className="btn-primary">
                + Novo Provider
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providersData?.providers.map((provider: any) => (
                <div key={provider.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{provider.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {provider.type === 'local' ? '🏠 Local' : '☁️ API'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        provider.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {provider.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 break-all">{provider.endpoint}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestProvider(provider.id)}
                      className="btn-secondary text-sm flex-1"
                    >
                      🔍 Testar
                    </button>
                    <button
                      onClick={() => handleOpenProviderModal(provider)}
                      className="btn-secondary text-sm flex-1"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProvider(provider.id)}
                      className="btn-danger text-sm flex-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(!providersData?.providers || providersData.providers.length === 0) && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhum provider configurado</p>
                <p className="text-sm">Adicione um provider para começar a usar modelos de IA</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: SEGURANÇA */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">🔒 Configurações de Segurança</h2>

            <div className="space-y-4">
              {/* 2FA */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Autenticação de Dois Fatores (2FA)</h3>
                    <p className="text-gray-400 text-sm">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityData?.twoFactorEnabled || false}
                      onChange={(e) =>
                        handleUpdateSecurity({ twoFactorEnabled: e.target.checked })
                      }
                      className="form-checkbox h-6 w-6 text-blue-600"
                    />
                  </label>
                </div>

                {securityData?.twoFactorEnabled && (
                  <button
                    onClick={handleGenerateBackupCodes}
                    className="btn-secondary mt-3"
                  >
                    🔑 Gerar Códigos de Backup
                  </button>
                )}
              </div>

              {/* Timeout de Sessão */}
              <div className="bg-gray-800 rounded-lg p-4">
                <label className="block text-white font-semibold mb-2">
                  Timeout de Sessão (segundos)
                </label>
                <input
                  type="number"
                  min="300"
                  max="86400"
                  value={securityData?.sessionTimeout || 3600}
                  onChange={(e) =>
                    handleUpdateSecurity({ sessionTimeout: parseInt(e.target.value) })
                  }
                  className="input w-full"
                />
                <p className="text-gray-400 text-sm mt-2">
                  Tempo de inatividade antes da sessão expirar (300-86400 segundos)
                </p>
              </div>

              {/* Notificações de Login */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Notificações de Login</h3>
                    <p className="text-gray-400 text-sm">
                      Receba alertas quando houver login na sua conta
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityData?.loginNotifications || false}
                      onChange={(e) =>
                        handleUpdateSecurity({ loginNotifications: e.target.checked })
                      }
                      className="form-checkbox h-6 w-6 text-blue-600"
                    />
                  </label>
                </div>
              </div>

              {/* Alertas de Atividade Suspeita */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">Alertas de Atividade Suspeita</h3>
                    <p className="text-gray-400 text-sm">
                      Seja notificado sobre atividades incomuns na sua conta
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securityData?.suspiciousActivityAlerts || false}
                      onChange={(e) =>
                        handleUpdateSecurity({ suspiciousActivityAlerts: e.target.checked })
                      }
                      className="form-checkbox h-6 w-6 text-blue-600"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: INTEGRAÇÕES */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">🔌 Integrações Externas</h2>
              <button onClick={() => handleOpenIntegrationModal()} className="btn-primary">
                + Nova Integração
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {integrationsData?.services.map((service: any) => (
                <div key={service.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{service.serviceName}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(service.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        service.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {service.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenIntegrationModal(service)}
                      className="btn-secondary text-sm flex-1"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDeleteIntegration(service.id)}
                      className="btn-danger text-sm flex-1"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(!integrationsData?.services || integrationsData.services.length === 0) && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhuma integração configurada</p>
                <p className="text-sm">Conecte serviços externos para expandir funcionalidades</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: SISTEMA */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">💾 Backups e Sistema</h2>
            </div>

            {/* Ações de Backup */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
              <button
                onClick={() => handleCreateBackup('full')}
                className="btn-primary"
              >
                🔄 Backup Completo
              </button>
              <button
                onClick={() => handleCreateBackup('incremental')}
                className="btn-secondary"
              >
                📦 Incremental
              </button>
              <button
                onClick={() => handleCreateBackup('differential')}
                className="btn-secondary"
              >
                📊 Diferencial
              </button>
              <button
                onClick={() => handleCreateBackup('database')}
                className="btn-secondary"
              >
                💾 Database
              </button>
              <button
                onClick={() => handleCreateBackup('files')}
                className="btn-secondary"
              >
                📁 Arquivos
              </button>
            </div>

            {/* Lista de Backups */}
            <div className="space-y-3">
              {backupsData?.backups.map((backup: any) => (
                <div key={backup.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {backup.backupType === 'full' && '🔄'}
                        {backup.backupType === 'incremental' && '📦'}
                        {backup.backupType === 'differential' && '📊'}
                        {backup.backupType === 'database' && '💾'}
                        {backup.backupType === 'files' && '📁'}
                      </span>
                      <div>
                        <h3 className="text-white font-semibold capitalize">
                          Backup {backup.backupType}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(backup.createdAt).toLocaleString('pt-BR')}
                          {backup.fileSize && ` • ${(backup.fileSize / 1024 / 1024).toFixed(2)} MB`}
                          {backup.duration && ` • ${(backup.duration / 1000).toFixed(1)}s`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        backup.status === 'completed'
                          ? 'bg-green-600 text-white'
                          : backup.status === 'failed'
                          ? 'bg-red-600 text-white'
                          : backup.status === 'in_progress'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {backup.status === 'completed' && '✅ Completo'}
                      {backup.status === 'failed' && '❌ Falhou'}
                      {backup.status === 'in_progress' && '⏳ Em Progresso'}
                      {backup.status === 'pending' && '⏸️ Pendente'}
                    </span>

                    {backup.status === 'completed' && (
                      <button
                        onClick={() => handleRestoreBackup(backup.id)}
                        className="btn-secondary text-sm"
                      >
                        ♻️ Restaurar
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="btn-danger text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {(!backupsData?.backups || backupsData.backups.length === 0) && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhum backup encontrado</p>
                <p className="text-sm">Crie um backup para proteger seus dados</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: PROVIDER */}
      {showProviderModal && (
        <div className="modal-overlay" onClick={() => setShowProviderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">
              {editingProvider ? 'Editar Provider' : 'Novo Provider'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  className="input w-full"
                  value={providerForm.name}
                  onChange={(e) => setProviderForm({ ...providerForm, name: e.target.value })}
                  placeholder="Ex: OpenAI GPT-4"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Tipo</label>
                <select
                  className="input w-full"
                  value={providerForm.type}
                  onChange={(e) => setProviderForm({ ...providerForm, type: e.target.value as any })}
                >
                  <option value="local">Local</option>
                  <option value="api">API</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Endpoint</label>
                <input
                  type="url"
                  className="input w-full"
                  value={providerForm.endpoint}
                  onChange={(e) => setProviderForm({ ...providerForm, endpoint: e.target.value })}
                  placeholder="https://api.example.com/v1"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">API Key (opcional)</label>
                <input
                  type="password"
                  className="input w-full"
                  value={providerForm.apiKey}
                  onChange={(e) => setProviderForm({ ...providerForm, apiKey: e.target.value })}
                  placeholder="sk-..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="provider-active"
                  checked={providerForm.isActive}
                  onChange={(e) => setProviderForm({ ...providerForm, isActive: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label htmlFor="provider-active" className="text-gray-300">
                  Ativo
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveProvider} className="btn-primary flex-1">
                💾 Salvar
              </button>
              <button onClick={() => setShowProviderModal(false)} className="btn-secondary flex-1">
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INTEGRAÇÃO */}
      {showIntegrationModal && (
        <div className="modal-overlay" onClick={() => setShowIntegrationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">
              {editingIntegration ? 'Editar Integração' : 'Nova Integração'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Nome do Serviço</label>
                <input
                  type="text"
                  className="input w-full"
                  value={integrationForm.serviceName}
                  onChange={(e) =>
                    setIntegrationForm({ ...integrationForm, serviceName: e.target.value })
                  }
                  placeholder="Ex: GitHub, Slack, Discord"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="integration-active"
                  checked={integrationForm.isActive}
                  onChange={(e) =>
                    setIntegrationForm({ ...integrationForm, isActive: e.target.checked })
                  }
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <label htmlFor="integration-active" className="text-gray-300">
                  Ativo
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveIntegration} className="btn-primary flex-1">
                💾 Salvar
              </button>
              <button onClick={() => setShowIntegrationModal(false)} className="btn-secondary flex-1">
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CÓDIGOS DE BACKUP */}
      {showBackupCodesModal && (
        <div className="modal-overlay" onClick={() => setShowBackupCodesModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">🔑 Códigos de Backup 2FA</h2>
            <p className="text-gray-400 mb-4">
              Guarde estes códigos em um local seguro. Cada código pode ser usado apenas uma vez.
            </p>

            <div className="bg-gray-900 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <div key={index} className="font-mono text-white bg-gray-800 rounded px-3 py-2 text-center">
                    {code}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const text = backupCodes.join('\n');
                  navigator.clipboard.writeText(text);
                  alert('Códigos copiados para a área de transferência!');
                }}
                className="btn-primary flex-1"
              >
                📋 Copiar Códigos
              </button>
              <button onClick={() => setShowBackupCodesModal(false)} className="btn-secondary flex-1">
                ✅ Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
