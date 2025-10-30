import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { 
  Server, Plus, Trash2, Edit, CheckCircle, XCircle, 
  RefreshCw, Activity, Database, Zap, AlertCircle 
} from 'lucide-react';

const Models = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Queries
  const { data: models, isLoading, refetch } = trpc.models.list.useQuery({ 
    query: searchQuery 
  });
  const { data: providers } = trpc.providers.list.useQuery({});
  
  // Mutations
  const deleteMutation = trpc.models.delete.useMutation({
    onSuccess: () => {
      refetch();
      alert('Modelo excluído com sucesso!');
    },
  });

  const toggleActiveMutation = trpc.models.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleToggleActive = (model: any) => {
    toggleActiveMutation.mutate({
      id: model.id,
      isActive: !model.isActive,
    });
  };

  // Filtrar por provider se selecionado
  const filteredModels = selectedProvider
    ? models?.items.filter(m => m.providerId === selectedProvider)
    : models?.items;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Modelos de IA</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie os modelos disponíveis para execução
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Atualizar
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Adicionar Modelo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar modelos..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Provider Filter */}
          <select
            value={selectedProvider || ''}
            onChange={(e) => setSelectedProvider(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os Providers</option>
            {providers?.items.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Modelos</p>
              <p className="text-3xl font-bold text-white">{filteredModels?.length || 0}</p>
            </div>
            <Database className="text-blue-400" size={40} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Modelos Ativos</p>
              <p className="text-3xl font-bold text-green-400">
                {filteredModels?.filter(m => m.isActive).length || 0}
              </p>
            </div>
            <CheckCircle className="text-green-400" size={40} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Modelos Inativos</p>
              <p className="text-3xl font-bold text-gray-400">
                {filteredModels?.filter(m => !m.isActive).length || 0}
              </p>
            </div>
            <XCircle className="text-gray-400" size={40} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Providers</p>
              <p className="text-3xl font-bold text-purple-400">
                {providers?.items.length || 0}
              </p>
            </div>
            <Server className="text-purple-400" size={40} />
          </div>
        </div>
      </div>

      {/* Models Grid */}
      {isLoading ? (
        <div className="card text-center py-12">
          <Activity className="animate-spin mx-auto mb-4 text-blue-500" size={40} />
          <p className="text-gray-400">Carregando modelos...</p>
        </div>
      ) : filteredModels && filteredModels.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredModels.map(model => {
            const provider = providers?.items.find(p => p.id === model.providerId);
            
            return (
              <div key={model.id} className="card hover:border-blue-500 transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{model.name}</h3>
                      {model.isActive ? (
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                          Ativo
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {provider?.name || 'Provider desconhecido'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleActive(model)}
                    className={`p-2 rounded-lg transition-colors ${
                      model.isActive
                        ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400'
                        : 'bg-gray-600/20 hover:bg-gray-600/30 text-gray-400'
                    }`}
                    title={model.isActive ? 'Desativar' : 'Ativar'}
                  >
                    <Zap size={16} />
                  </button>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model ID:</span>
                    <span className="text-white font-mono text-xs">{model.modelId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Context Window:</span>
                    <span className="text-white">{model.contextWindow?.toLocaleString() || 'N/A'}</span>
                  </div>

                  {model.parameters && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Parâmetros:</span>
                      <span className="text-white">{model.parameters}</span>
                    </div>
                  )}

                  {model.quantization && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quantização:</span>
                      <span className="text-white">{model.quantization}</span>
                    </div>
                  )}

                  {model.sizeBytes && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tamanho:</span>
                      <span className="text-white">
                        {(model.sizeBytes / 1024 / 1024 / 1024).toFixed(2)} GB
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-400">Prioridade:</span>
                    <span className="text-white">{model.priority || 50}/100</span>
                  </div>
                </div>

                {/* Capabilities */}
                {model.capabilities && model.capabilities.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Capacidades:</p>
                    <div className="flex flex-wrap gap-1">
                      {model.capabilities.map((cap: string, idx: number) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => alert('Editar modelo em desenvolvimento')}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Edit size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(model.id)}
                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 size={14} />
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <AlertCircle className="mx-auto mb-4 text-gray-500" size={48} />
          <p className="text-gray-400 text-lg mb-2">Nenhum modelo encontrado</p>
          <p className="text-gray-500 text-sm mb-6">
            {searchQuery 
              ? 'Tente ajustar sua busca ou filtros' 
              : 'Comece adicionando seu primeiro modelo de IA'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Adicionar Primeiro Modelo
          </button>
        </div>
      )}

      {/* TODO: Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Adicionar Modelo</h2>
            <p className="text-gray-400 mb-6">
              Formulário de adição de modelo em desenvolvimento...
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Models;
