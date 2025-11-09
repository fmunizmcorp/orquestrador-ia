import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';

// ==================================================
// TYPES
// ==================================================

type ProfileTab = 'profile' | 'security' | 'activity' | 'sessions' | 'preferences' | 'data';

interface UserActivity {
  id: number;
  action: string;
  resourceType: string | null;
  resourceId: number | null;
  timestamp: Date;
  ipAddress: string | null;
  userAgent: string | null;
}

interface UserSession {
  id: number;
  deviceName: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

// ==================================================
// COMPONENTE PRINCIPAL
// ==================================================

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [message, setMessage] = useState({ type: '', text: '' });

  // ==================================================
  // ESTADO LOCAL
  // ==================================================

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'user',
    avatarUrl: '',
    bio: '',
    username: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: true,
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // ==================================================
  // QUERIES
  // ==================================================

  const { data: profileData, isLoading: profileLoading, refetch: refetchProfile } = trpc.users.getProfile.useQuery(
    { userId: user?.id || 1 },
    { enabled: !!user?.id }
  );

  const { data: statsData, refetch: refetchStats } = trpc.users.getStatistics.useQuery(
    { userId: user?.id || 1 },
    { enabled: !!user?.id }
  );

  const { data: activityData, refetch: refetchActivity } = trpc.users.getActivity.useQuery(
    { userId: user?.id || 1, limit: 50 },
    { enabled: !!user?.id && activeTab === 'activity' }
  );

  const { data: sessionsData, refetch: refetchSessions } = trpc.users.getSessions.useQuery(
    { userId: user?.id || 1 },
    { enabled: !!user?.id && activeTab === 'sessions' }
  );

  // ==================================================
  // MUTATIONS
  // ==================================================

  const updateProfileMutation = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      refetchProfile();
      refetchStats();
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Erro ao atualizar perfil' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
  });

  const changePasswordMutation = trpc.users.changePassword.useMutation({
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Erro ao alterar senha' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
  });

  const updatePreferencesMutation = trpc.users.updatePreferences.useMutation({
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Preferências atualizadas!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Erro ao atualizar preferências' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
  });

  const uploadAvatarMutation = trpc.users.uploadAvatar.useMutation({
    onSuccess: (data) => {
      if (data.avatarUrl) {
        setUserData({ ...userData, avatarUrl: data.avatarUrl });
        setMessage({ type: 'success', text: 'Avatar atualizado!' });
        refetchProfile();
      }
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Erro ao fazer upload do avatar' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
  });

  const revokeSessionMutation = trpc.users.revokeSession.useMutation({
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Sessão revogada!' });
      refetchSessions();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Erro ao revogar sessão' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
  });

  const deleteAccountMutation = trpc.users.deleteAccount.useMutation({
    onSuccess: () => {
      alert('Conta deletada com sucesso. Você será redirecionado.');
      window.location.href = '/login';
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Erro ao deletar conta' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
  });

  const exportDataMutation = trpc.users.exportData.useMutation();

  // ==================================================
  // EFFECTS
  // ==================================================

  useEffect(() => {
    if (profileData?.profile) {
      setUserData({
        name: profileData.profile.name || '',
        email: profileData.profile.email || '',
        role: profileData.profile.role || 'user',
        avatarUrl: profileData.profile.avatarUrl || '',
        bio: profileData.profile.bio || '',
        username: profileData.profile.username || '',
      });

      // Carregar preferências se existirem
      if (profileData.profile.preferences) {
        try {
          const prefs = typeof profileData.profile.preferences === 'string'
            ? JSON.parse(profileData.profile.preferences)
            : profileData.profile.preferences;
          setPreferences({ ...preferences, ...prefs });
        } catch (e) {
          console.error('Erro ao parsear preferências:', e);
        }
      }
    }
  }, [profileData]);

  // ==================================================
  // HANDLERS
  // ==================================================

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      await updateProfileMutation.mutateAsync({
        userId: user?.id || 1,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatarUrl || undefined,
        bio: userData.bio || undefined,
        username: userData.username || undefined,
      });
    } catch (error) {
      // Error handled by mutation callbacks
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 8 caracteres' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        userId: user?.id || 1,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
    } catch (error) {
      // Error handled by mutation callbacks
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      await updatePreferencesMutation.mutateAsync({
        userId: user?.id || 1,
        preferences,
      });
    } catch (error) {
      // Error handled by mutation callbacks
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'O arquivo deve ter no máximo 5MB' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    // Converter para base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await uploadAvatarMutation.mutateAsync({
          userId: user?.id || 1,
          avatarData: reader.result as string,
        });
      } catch (error) {
        // Error handled by mutation callbacks
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRevokeSession = async (sessionId: number) => {
    if (!confirm('Tem certeza que deseja revogar esta sessão?')) return;

    try {
      await revokeSessionMutation.mutateAsync({
        userId: user?.id || 1,
        sessionId,
      });
    } catch (error) {
      // Error handled by mutation callbacks
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setMessage({ type: 'error', text: 'Digite sua senha para confirmar' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync({
        userId: user?.id || 1,
        password: deletePassword,
      });
    } catch (error) {
      // Error handled by mutation callbacks
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportDataMutation.mutateAsync({ userId: user?.id || 1 });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user_data_export_${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Dados exportados com sucesso!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao exportar dados' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // ==================================================
  // ESTATÍSTICAS
  // ==================================================

  const stats = statsData?.statistics || {
    totalTasks: 0,
    completedTasks: 0,
    totalProjects: 0,
    totalConversations: 0,
    totalTemplates: 0,
    totalWorkflows: 0,
  };

  // ==================================================
  // TABS
  // ==================================================

  const tabs: { id: ProfileTab; label: string; icon: string }[] = [
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'security', label: 'Segurança', icon: '🔒' },
    { id: 'activity', label: 'Atividade', icon: '📊' },
    { id: 'sessions', label: 'Sessões', icon: '💻' },
    { id: 'preferences', label: 'Preferências', icon: '⚙️' },
    { id: 'data', label: 'Dados', icon: '📁' },
  ];

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="space-y-6">
      {/* HEADER COM AVATAR E ESTATÍSTICAS */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          {/* Avatar e Info */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {userData.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-700"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-700">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-700 cursor-pointer border-2 border-gray-900">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <svg className="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
              <p className="text-gray-400">{userData.email}</p>
              {userData.username && (
                <p className="text-gray-500 text-sm">@{userData.username}</p>
              )}
              <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
                userData.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
              }`}>
                {userData.role === 'admin' ? '👑 Administrador' : '👤 Usuário'}
              </span>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalTasks}</div>
              <div className="text-gray-400 text-xs">Tarefas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalProjects}</div>
              <div className="text-gray-400 text-xs">Projetos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.totalConversations}</div>
              <div className="text-gray-400 text-xs">Conversas</div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {userData.bio && (
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300">{userData.bio}</p>
          </div>
        )}
      </div>

      {/* MENSAGEM DE FEEDBACK */}
      {message.text && (
        <div
          className={`card ${
            message.type === 'success'
              ? 'bg-green-900 border-green-600'
              : 'bg-red-900 border-red-600'
          }`}
        >
          <p className="text-white">{message.text}</p>
        </div>
      )}

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
        {/* TAB: PERFIL */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmitProfile} className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">👤 Informações do Perfil</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Nome de Usuário</label>
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  className="input w-full"
                  placeholder="seu_usuario"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Bio</label>
                <textarea
                  value={userData.bio}
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                  rows={4}
                  className="input w-full"
                  placeholder="Conte um pouco sobre você..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={updateProfileMutation.isLoading || profileLoading}
                className="btn-primary"
              >
                {updateProfileMutation.isLoading ? '⏳ Salvando...' : '💾 Salvar Alterações'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (profileData?.profile) {
                    setUserData({
                      name: profileData.profile.name || '',
                      email: profileData.profile.email || '',
                      role: profileData.profile.role || 'user',
                      avatarUrl: profileData.profile.avatarUrl || '',
                      bio: profileData.profile.bio || '',
                      username: profileData.profile.username || '',
                    });
                  }
                }}
                className="btn-secondary"
              >
                ↩️ Cancelar
              </button>
            </div>
          </form>
        )}

        {/* TAB: SEGURANÇA */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">🔒 Segurança da Conta</h2>

            {/* Alterar Senha */}
            <form onSubmit={handleSubmitPassword} className="bg-gray-800 rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-white">Alterar Senha</h3>

              <div>
                <label className="block text-gray-300 mb-2">Senha Atual</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Nova Senha</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="input w-full"
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Confirmar Nova Senha</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="input w-full"
                  minLength={8}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={changePasswordMutation.isLoading}
                className="btn-primary"
              >
                {changePasswordMutation.isLoading ? '⏳ Alterando...' : '🔑 Alterar Senha'}
              </button>
            </form>

            {/* Zona de Perigo */}
            <div className="bg-red-900 border border-red-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">⚠️ Zona de Perigo</h3>
              <p className="text-gray-300 mb-4">
                Deletar sua conta é permanente e não pode ser desfeito. Todos os seus dados serão removidos.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn-danger"
              >
                🗑️ Deletar Minha Conta
              </button>
            </div>
          </div>
        )}

        {/* TAB: ATIVIDADE */}
        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">📊 Atividade Recente</h2>
              <button onClick={() => refetchActivity()} className="btn-secondary text-sm">
                🔄 Atualizar
              </button>
            </div>

            {activityData?.activities && activityData.activities.length > 0 ? (
              <div className="space-y-2">
                {activityData.activities.map((activity: any) => (
                  <div key={activity.id} className="bg-gray-800 rounded-lg p-4 flex items-start gap-3">
                    <div className="text-2xl">📝</div>
                    <div className="flex-1">
                      <div className="text-white font-semibold">{activity.action}</div>
                      {activity.resourceType && (
                        <div className="text-gray-400 text-sm">
                          {activity.resourceType} #{activity.resourceId}
                        </div>
                      )}
                      <div className="text-gray-500 text-xs mt-1">
                        {new Date(activity.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhuma atividade recente</p>
                <p className="text-sm">Suas ações aparecerão aqui</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: SESSÕES */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">💻 Sessões Ativas</h2>
              <button onClick={() => refetchSessions()} className="btn-secondary text-sm">
                🔄 Atualizar
              </button>
            </div>

            {sessionsData?.sessions && sessionsData.sessions.length > 0 ? (
              <div className="space-y-3">
                {sessionsData.sessions.map((session: UserSession) => (
                  <div key={session.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">
                        {session.deviceName.includes('iPhone') || session.deviceName.includes('Android') ? '📱' : '💻'}
                      </div>
                      <div>
                        <div className="text-white font-semibold flex items-center gap-2">
                          {session.deviceName}
                          {session.isCurrent && (
                            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                              Atual
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm">{session.location}</div>
                        <div className="text-gray-500 text-xs">
                          IP: {session.ipAddress} • Última atividade:{' '}
                          {new Date(session.lastActive).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    {!session.isCurrent && (
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="btn-danger text-sm"
                      >
                        🚫 Revogar
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhuma sessão ativa</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: PREFERÊNCIAS */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">⚙️ Preferências do Sistema</h2>

            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Notificações por Email</p>
                  <p className="text-sm text-gray-400">Receba atualizações por email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Modo Escuro</p>
                  <p className="text-sm text-gray-400">Ativar tema escuro</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.darkMode}
                    onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <label className="block text-white font-semibold mb-2">Idioma</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="input w-full"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <label className="block text-white font-semibold mb-2">Fuso Horário</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                  className="input w-full"
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                  <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleUpdatePreferences}
              disabled={updatePreferencesMutation.isLoading}
              className="btn-primary"
            >
              {updatePreferencesMutation.isLoading ? '⏳ Salvando...' : '💾 Salvar Preferências'}
            </button>
          </div>
        )}

        {/* TAB: DADOS */}
        {activeTab === 'data' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">📁 Gerenciar Dados</h2>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Exportar Dados</h3>
              <p className="text-gray-400 mb-4">
                Baixe uma cópia de todos os seus dados em formato JSON
              </p>
              <button
                onClick={handleExportData}
                disabled={exportDataMutation.isLoading}
                className="btn-primary"
              >
                {exportDataMutation.isLoading ? '⏳ Exportando...' : '📥 Exportar Meus Dados'}
              </button>
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Estatísticas Completas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400 text-xs mb-1">Tarefas Totais</div>
                  <div className="text-white text-2xl font-bold">{stats.totalTasks}</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400 text-xs mb-1">Tarefas Completas</div>
                  <div className="text-white text-2xl font-bold">{stats.completedTasks}</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400 text-xs mb-1">Projetos</div>
                  <div className="text-white text-2xl font-bold">{stats.totalProjects}</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400 text-xs mb-1">Conversas</div>
                  <div className="text-white text-2xl font-bold">{stats.totalConversations}</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400 text-xs mb-1">Templates</div>
                  <div className="text-white text-2xl font-bold">{stats.totalTemplates}</div>
                </div>
                <div className="bg-gray-700 rounded p-3">
                  <div className="text-gray-400 text-xs mb-1">Workflows</div>
                  <div className="text-white text-2xl font-bold">{stats.totalWorkflows}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: DELETAR CONTA */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">⚠️ Deletar Conta</h2>
            <p className="text-gray-300 mb-4">
              Esta ação é <strong>permanente e irreversível</strong>. Todos os seus dados,
              incluindo tarefas, projetos, conversas e templates serão deletados.
            </p>
            <p className="text-gray-300 mb-4">
              Digite sua senha para confirmar:
            </p>

            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="input w-full mb-4"
              placeholder="Digite sua senha"
            />

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteAccountMutation.isLoading}
                className="btn-danger flex-1"
              >
                {deleteAccountMutation.isLoading ? '⏳ Deletando...' : '🗑️ Confirmar Deleção'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                className="btn-secondary flex-1"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
