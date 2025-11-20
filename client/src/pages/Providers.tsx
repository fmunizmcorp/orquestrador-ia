import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { useToast } from '../components/Toast';
import DataTable from '../components/DataTable';

interface ProviderFormData {
  name: string;
  apiKey: string;
  baseUrl: string;
  type: string;
}

const Providers = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const [formData, setFormData] = useState<ProviderFormData>({
    name: '',
    apiKey: '',
    baseUrl: '',
    type: 'openai',
  });

  // Query
  const { data, isLoading, refetch } = trpc.providers.list.useQuery({ query: searchQuery });

  // Mutations
  const createMutation = trpc.providers.create.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
      showToast({
        type: 'success',
        title: 'Provedor criado!',
        message: 'O provedor foi criado com sucesso.',
        duration: 5000,
      });
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Erro ao criar provedor',
        message: error.message || 'Ocorreu um erro inesperado.',
        duration: 7000,
      });
    },
  });

  const updateMutation = trpc.providers.update.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
      showToast({
        type: 'success',
        title: 'Provedor atualizado!',
        message: 'As alterações foram salvas com sucesso.',
        duration: 5000,
      });
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Erro ao atualizar provedor',
        message: error.message || 'Ocorreu um erro inesperado.',
        duration: 7000,
      });
    },
  });

  const deleteMutation = trpc.providers.delete.useMutation({
    onSuccess: () => {
      refetch();
      showToast({
        type: 'success',
        title: 'Provedor excluído!',
        message: 'O provedor foi removido com sucesso.',
        duration: 5000,
      });
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Erro ao excluir provedor',
        message: error.message || 'Ocorreu um erro inesperado.',
        duration: 7000,
      });
    },
  });

  const openModal = (provider?: any) => {
    if (provider) {
      setEditingProvider(provider);
      setFormData({
        name: provider.name || '',
        apiKey: provider.apiKey || '',
        baseUrl: provider.baseUrl || '',
        type: provider.type || 'openai',
      });
    } else {
      setEditingProvider(null);
      setFormData({
        name: '',
        apiKey: '',
        baseUrl: '',
        type: 'openai',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProvider(null);
    setFormData({
      name: '',
      apiKey: '',
      baseUrl: '',
      type: 'openai',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProvider) {
      await updateMutation.mutateAsync({
        id: editingProvider.id,
        ...formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este provedor?')) {
      await deleteMutation.mutateAsync({ id });
    }
  };

  return (
    <div>
      <DataTable
        title="Provedores de IA"
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nome' },
          { key: 'type', label: 'Tipo' },
          { key: 'baseUrl', label: 'URL Base' },
        ]}
        data={data?.items || []}
        loading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAdd={() => openModal()}
        onEdit={(provider) => openModal(provider)}
        onDelete={(provider) => handleDelete(provider.id)}
      />

      {/* SPRINT 39: Modal de Adicionar/Editar Provedor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingProvider ? 'Editar Provedor' : 'Novo Provedor'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              <div className="space-y-4 p-6 overflow-y-auto flex-1">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Nome do Provedor *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: OpenAI, Anthropic, etc"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Tipo *
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="openai">OpenAI</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="google">Google</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    API Key
                  </label>
                  <input
                    id="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="sk-..."
                  />
                </div>

                <div>
                  <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    URL Base
                  </label>
                  <input
                    id="baseUrl"
                    type="url"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="https://api.openai.com/v1"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isLoading || updateMutation.isLoading
                    ? 'Salvando...'
                    : editingProvider
                    ? 'Salvar'
                    : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Providers;
