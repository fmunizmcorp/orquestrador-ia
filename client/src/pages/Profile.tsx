import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    role: 'user',
    avatarUrl: '',
    bio: '',
    username: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Conectar ao tRPC para dados reais
  const { data: profileData, isLoading: profileLoading } = trpc.users.getProfile.useQuery(
    { userId: user?.id || 1 },
    { enabled: !!user?.id }
  );

  const updateProfileMutation = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
    onError: (error) => {
      setMessage({ type: 'error', text: error.message || 'Erro ao atualizar perfil' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
  });

  // Atualizar dados do usuário quando o profile for carregado
  useEffect(() => {
    if (profileData?.user) {
      setUserData({
        name: profileData.user.name || '',
        email: profileData.user.email || '',
        role: profileData.user.role || 'user',
        avatarUrl: profileData.user.avatarUrl || '',
        bio: profileData.user.bio || '',
        username: profileData.user.username || '',
      });
    }
  }, [profileData]);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600 mt-1">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="relative">
              {userData.avatarUrl ? (
                <img
                  src={userData.avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50">
                <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
              <p className="text-gray-600">{userData.email}</p>
              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {userData.role === 'admin' ? 'Administrador' : 'Usuário'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {message.text && (
            <div
              className={`mb-6 px-4 py-3 rounded ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Conte um pouco sobre você..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={updateProfileMutation.isLoading || profileLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfileMutation.isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (profileData?.user) {
                    setUserData({
                      name: profileData.user.name || '',
                      email: profileData.user.email || '',
                      role: profileData.user.role || 'user',
                      avatarUrl: profileData.user.avatarUrl || '',
                      bio: profileData.user.bio || '',
                      username: profileData.user.username || '',
                    });
                  }
                }}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Seção de Segurança */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Segurança</h2>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie sua senha e configurações de segurança
          </p>
        </div>
        <div className="p-6">
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Alterar Senha →
          </button>
        </div>
      </div>

      {/* Seção de Preferências */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Preferências</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure suas preferências do sistema
          </p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificações por Email</p>
              <p className="text-sm text-gray-600">Receba atualizações por email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Modo Escuro</p>
              <p className="text-sm text-gray-600">Ativar tema escuro</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
