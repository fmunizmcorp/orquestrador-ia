import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

// ==================================================
// TYPES
// ==================================================

type ModelsTab = 'models' | 'specialized' | 'discovery' | 'statistics';

interface ModelFormData {
  providerId: number;
  name: string;
  modelId: string;
  capabilities: string[];
  contextWindow: number;
  isLoaded: boolean;
  priority: number;
  isActive: boolean;
  modelPath?: string;
  quantization?: string;
  parameters?: string;
  sizeBytes?: number;
}

interface SpecializedAIFormData {
  name: string;
  description: string;
  category: string;
  defaultModelId?: number;
  fallbackModelIds: number[];
  systemPrompt: string;
  capabilities: string[];
  isActive: boolean;
}

// ==================================================
// COMPONENTE PRINCIPAL
// ==================================================

const Models = () => {
  const [activeTab, setActiveTab] = useState<ModelsTab>('models');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [showSpecializedModal, setShowSpecializedModal] = useState(false);
  const [editingSpecialized, setEditingSpecialized] = useState<any>(null);
  const [selectedModels, setSelectedModels] = useState<number[]>([]);

  // ==================================================
  // ESTADO DE FORMULÁRIOS
  // ==================================================

  const [modelForm, setModelForm] = useState<ModelFormData>({
    providerId: 0,
    name: '',
    modelId: '',
    capabilities: [],
    contextWindow: 4096,
    isLoaded: false,
    priority: 50,
    isActive: true,
    modelPath: '',
    quantization: '',
    parameters: '',
    sizeBytes: 0,
  });

  const [specializedForm, setSpecializedForm] = useState<SpecializedAIFormData>({
    name: '',
    description: '',
    category: '',
    defaultModelId: undefined,
    fallbackModelIds: [],
    systemPrompt: '',
    capabilities: [],
    isActive: true,
  });

  const [capabilityInput, setCapabilityInput] = useState('');
  const [specializedCapabilityInput, setSpecializedCapabilityInput] = useState('');

  // ==================================================
  // QUERIES
  // ==================================================

  const { data: modelsData, isLoading: modelsLoading, refetch: refetchModels } = trpc.models.list.useQuery({ 
    query: searchQuery 
  });

  const { data: providersData } = trpc.models.listProviders.useQuery({});

  const { data: specializedData, refetch: refetchSpecialized } = trpc.models.listSpecializedAIs.useQuery({
    query: searchQuery,
  });

  const { data: statsData, refetch: refetchStats } = trpc.models.getStatistics.useQuery({});

  const { data: discoveryData, refetch: refetchDiscovery } = trpc.models.discoverModels.useQuery({}, {
    enabled: activeTab === 'discovery',
  });

  // ==================================================
  // MUTATIONS
  // ==================================================

  const createModelMutation = trpc.models.create.useMutation({
    onSuccess: () => {
      alert('Modelo criado com sucesso!');
      setShowAddModal(false);
      refetchModels();
      refetchStats();
      resetModelForm();
    },
    onError: (error) => {
      alert(`Erro ao criar modelo: ${error.message}`);
    },
  });

  const updateModelMutation = trpc.models.update.useMutation({
    onSuccess: () => {
      alert('Modelo atualizado com sucesso!');
      setShowEditModal(false);
      setEditingModel(null);
      refetchModels();
      refetchStats();
    },
    onError: (error) => {
      alert(`Erro ao atualizar modelo: ${error.message}`);
    },
  });

  const deleteModelMutation = trpc.models.delete.useMutation({
    onSuccess: () => {
      alert('Modelo excluído com sucesso!');
      refetchModels();
      refetchStats();
    },
    onError: (error) => {
      alert(`Erro ao excluir modelo: ${error.message}`);
    },
  });

  const bulkUpdateMutation = trpc.models.bulkUpdate.useMutation({
    onSuccess: () => {
      alert('Modelos atualizados em massa!');
      setSelectedModels([]);
      refetchModels();
      refetchStats();
    },
    onError: (error) => {
      alert(`Erro na atualização em massa: ${error.message}`);
    },
  });

  const createSpecializedMutation = trpc.models.createSpecializedAI.useMutation({
    onSuccess: () => {
      alert('IA Especializada criada com sucesso!');
      setShowSpecializedModal(false);
      refetchSpecialized();
      refetchStats();
      resetSpecializedForm();
    },
    onError: (error) => {
      alert(`Erro ao criar IA: ${error.message}`);
    },
  });

  const updateSpecializedMutation = trpc.models.updateSpecializedAI.useMutation({
    onSuccess: () => {
      alert('IA Especializada atualizada!');
      setShowSpecializedModal(false);
      setEditingSpecialized(null);
      refetchSpecialized();
    },
    onError: (error) => {
      alert(`Erro ao atualizar IA: ${error.message}`);
    },
  });

  const deleteSpecializedMutation = trpc.models.deleteSpecializedAI.useMutation({
    onSuccess: () => {
      alert('IA Especializada excluída!');
      refetchSpecialized();
      refetchStats();
    },
    onError: (error) => {
      alert(`Erro ao excluir IA: ${error.message}`);
    },
  });

  const importDiscoveredMutation = trpc.models.importDiscovered.useMutation({
    onSuccess: () => {
      alert('Modelo importado com sucesso!');
      refetchModels();
      refetchDiscovery();
      refetchStats();
    },
    onError: (error) => {
      alert(`Erro ao importar modelo: ${error.message}`);
    },
  });

  // ==================================================
  // HANDLERS
  // ==================================================

  const resetModelForm = () => {
    setModelForm({
      providerId: 0,
      name: '',
      modelId: '',
      capabilities: [],
      contextWindow: 4096,
      isLoaded: false,
      priority: 50,
      isActive: true,
      modelPath: '',
      quantization: '',
      parameters: '',
      sizeBytes: 0,
    });
  };

  const resetSpecializedForm = () => {
    setSpecializedForm({
      name: '',
      description: '',
      category: '',
      defaultModelId: undefined,
      fallbackModelIds: [],
      systemPrompt: '',
      capabilities: [],
      isActive: true,
    });
  };

  const handleOpenEditModal = (model: any) => {
    setEditingModel(model);
    setModelForm({
      providerId: model.providerId,
      name: model.name,
      modelId: model.modelId,
      capabilities: model.capabilities || [],
      contextWindow: model.contextWindow || 4096,
      isLoaded: model.isLoaded || false,
      priority: model.priority || 50,
      isActive: model.isActive,
      modelPath: model.modelPath || '',
      quantization: model.quantization || '',
      parameters: model.parameters || '',
      sizeBytes: model.sizeBytes || 0,
    });
    setShowEditModal(true);
  };

  const handleOpenSpecializedModal = (specialized?: any) => {
    if (specialized) {
      setEditingSpecialized(specialized);
      setSpecializedForm({
        name: specialized.name,
        description: specialized.description || '',
        category: specialized.category || '',
        defaultModelId: specialized.defaultModelId,
        fallbackModelIds: specialized.fallbackModelIds || [],
        systemPrompt: specialized.systemPrompt,
        capabilities: specialized.capabilities || [],
        isActive: specialized.isActive,
      });
    } else {
      resetSpecializedForm();
    }
    setShowSpecializedModal(true);
  };

  const handleDeleteModel = (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este modelo?')) return;
    deleteModelMutation.mutate({ id });
  };

  const handleDeleteSpecialized = (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta IA Especializada?')) return;
    deleteSpecializedMutation.mutate({ id });
  };

  const handleToggleActive = (model: any) => {
    updateModelMutation.mutate({
      id: model.id,
      isActive: !model.isActive,
    });
  };

  const handleSubmitModel = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modelForm.name || !modelForm.modelId || modelForm.providerId === 0) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingModel) {
        await updateModelMutation.mutateAsync({
          id: editingModel.id,
          ...modelForm,
        });
      } else {
        await createModelMutation.mutateAsync(modelForm);
      }
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleSubmitSpecialized = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!specializedForm.name || !specializedForm.systemPrompt) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingSpecialized) {
        await updateSpecializedMutation.mutateAsync({
          id: editingSpecialized.id,
          ...specializedForm,
        });
      } else {
        await createSpecializedMutation.mutateAsync({
          ...specializedForm,
          userId: 1, // TODO: Get from auth context
        });
      }
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleAddCapability = () => {
    if (capabilityInput.trim() && !modelForm.capabilities.includes(capabilityInput.trim())) {
      setModelForm({
        ...modelForm,
        capabilities: [...modelForm.capabilities, capabilityInput.trim()],
      });
      setCapabilityInput('');
    }
  };

  const handleRemoveCapability = (cap: string) => {
    setModelForm({
      ...modelForm,
      capabilities: modelForm.capabilities.filter((c) => c !== cap),
    });
  };

  const handleAddSpecializedCapability = () => {
    if (specializedCapabilityInput.trim() && !specializedForm.capabilities.includes(specializedCapabilityInput.trim())) {
      setSpecializedForm({
        ...specializedForm,
        capabilities: [...specializedForm.capabilities, specializedCapabilityInput.trim()],
      });
      setSpecializedCapabilityInput('');
    }
  };

  const handleRemoveSpecializedCapability = (cap: string) => {
    setSpecializedForm({
      ...specializedForm,
      capabilities: specializedForm.capabilities.filter((c) => c !== cap),
    });
  };

  const handleToggleModelSelection = (modelId: number) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter((id) => id !== modelId));
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const handleBulkActivate = () => {
    if (selectedModels.length === 0) {
      alert('Selecione pelo menos um modelo');
      return;
    }
    bulkUpdateMutation.mutate({
      ids: selectedModels,
      isActive: true,
    });
  };

  const handleBulkDeactivate = () => {
    if (selectedModels.length === 0) {
      alert('Selecione pelo menos um modelo');
      return;
    }
    bulkUpdateMutation.mutate({
      ids: selectedModels,
      isActive: false,
    });
  };

  const handleImportDiscovered = (discoveredId: number) => {
    if (!confirm('Importar este modelo descoberto?')) return;
    importDiscoveredMutation.mutate({ discoveredId });
  };

  // ==================================================
  // FILTROS
  // ==================================================

  const filteredModels = selectedProvider
    ? modelsData?.items.filter((m: any) => m.providerId === selectedProvider)
    : modelsData?.items || [];

  // ==================================================
  // TABS
  // ==================================================

  const tabs: { id: ModelsTab; label: string; icon: string }[] = [
    { id: 'models', label: 'Modelos', icon: '🤖' },
    { id: 'specialized', label: 'IAs Especializadas', icon: '⭐' },
    { id: 'discovery', label: 'Descoberta', icon: '🔍' },
    { id: 'statistics', label: 'Estatísticas', icon: '📊' },
  ];

  // ==================================================
  // ESTATÍSTICAS
  // ==================================================

  const stats = statsData || {
    totalModels: 0,
    activeModels: 0,
    loadedModels: 0,
    totalProviders: 0,
    totalSpecializedAIs: 0,
    activeSpecializedAIs: 0,
    avgContextWindow: 0,
    totalCapabilities: 0,
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">🤖 Modelos de IA</h1>
            <p className="text-gray-400">
              Gerencie modelos, IAs especializadas e descubra novos recursos
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => refetchModels()} className="btn-secondary">
              🔄 Atualizar
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              + Adicionar Modelo
            </button>
          </div>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Total de Modelos</div>
            <div className="text-white text-xl font-bold">{stats.totalModels}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Modelos Ativos</div>
            <div className="text-white text-xl font-bold">{stats.activeModels}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">IAs Especializadas</div>
            <div className="text-white text-xl font-bold">{stats.totalSpecializedAIs}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Providers</div>
            <div className="text-white text-xl font-bold">{stats.totalProviders}</div>
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

      {/* FILTROS */}
      {(activeTab === 'models' || activeTab === 'specialized') && (
        <div className="card">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="input flex-1 min-w-[250px]"
            />
            {activeTab === 'models' && (
              <select
                value={selectedProvider || ''}
                onChange={(e) => setSelectedProvider(e.target.value ? Number(e.target.value) : null)}
                className="input"
              >
                <option value="">Todos os Providers</option>
                {providersData?.providers.map((provider: any) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}

      {/* AÇÕES EM MASSA */}
      {activeTab === 'models' && selectedModels.length > 0 && (
        <div className="card bg-blue-900 border-blue-600">
          <div className="flex items-center justify-between">
            <p className="text-white">
              {selectedModels.length} modelo(s) selecionado(s)
            </p>
            <div className="flex gap-2">
              <button onClick={handleBulkActivate} className="btn-primary text-sm">
                ✅ Ativar Todos
              </button>
              <button onClick={handleBulkDeactivate} className="btn-secondary text-sm">
                ❌ Desativar Todos
              </button>
              <button
                onClick={() => setSelectedModels([])}
                className="btn-secondary text-sm"
              >
                🔄 Limpar Seleção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DAS TABS */}
      <div className="space-y-4">
        {/* TAB: MODELOS */}
        {activeTab === 'models' && (
          <>
            {modelsLoading ? (
              <div className="card text-center py-12 text-gray-400">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p>Carregando modelos...</p>
              </div>
            ) : filteredModels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModels.map((model: any) => {
                  const provider = providersData?.providers.find((p: any) => p.id === model.providerId);

                  return (
                    <div
                      key={model.id}
                      className={`card ${
                        selectedModels.includes(model.id) ? 'border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedModels.includes(model.id)}
                            onChange={() => handleToggleModelSelection(model.id)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                          />
                          <div>
                            <h3 className="text-white font-semibold">{model.name}</h3>
                            <p className="text-gray-400 text-sm">{provider?.name}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            model.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                          }`}
                        >
                          {model.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Model ID:</span>
                          <span className="text-white font-mono text-xs">{model.modelId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Context:</span>
                          <span className="text-white">{model.contextWindow?.toLocaleString()}</span>
                        </div>
                        {model.parameters && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Parâmetros:</span>
                            <span className="text-white">{model.parameters}</span>
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
                          <span className="text-white">{model.priority}/100</span>
                        </div>
                      </div>

                      {model.capabilities && model.capabilities.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-400 mb-1">Capacidades:</p>
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

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(model)}
                          className="btn-secondary text-sm flex-1"
                        >
                          {model.isActive ? '❌ Desativar' : '✅ Ativar'}
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(model)}
                          className="btn-primary text-sm flex-1"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteModel(model.id)}
                          className="btn-danger text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="card text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhum modelo encontrado</p>
                <p className="text-sm mb-4">
                  {searchQuery
                    ? 'Tente ajustar sua busca'
                    : 'Adicione seu primeiro modelo de IA'}
                </p>
                <button onClick={() => setShowAddModal(true)} className="btn-primary">
                  + Adicionar Primeiro Modelo
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB: IAS ESPECIALIZADAS */}
        {activeTab === 'specialized' && (
          <>
            <div className="card">
              <button
                onClick={() => handleOpenSpecializedModal()}
                className="btn-primary w-full"
              >
                + Nova IA Especializada
              </button>
            </div>

            {specializedData?.specializedAIs && specializedData.specializedAIs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specializedData.specializedAIs.map((ai: any) => (
                  <div key={ai.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{ai.name}</h3>
                        {ai.category && (
                          <p className="text-gray-400 text-sm">{ai.category}</p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          ai.isActive ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {ai.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    {ai.description && (
                      <p className="text-gray-400 text-sm mb-3">{ai.description}</p>
                    )}

                    <div className="space-y-2 text-sm mb-3">
                      {ai.defaultModelId && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Modelo Padrão:</span>
                          <span className="text-white">#{ai.defaultModelId}</span>
                        </div>
                      )}
                      {ai.fallbackModelIds && ai.fallbackModelIds.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fallbacks:</span>
                          <span className="text-white">{ai.fallbackModelIds.length}</span>
                        </div>
                      )}
                    </div>

                    {ai.capabilities && ai.capabilities.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-1">Capacidades:</p>
                        <div className="flex flex-wrap gap-1">
                          {ai.capabilities.map((cap: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-600/20 text-purple-400 text-xs rounded"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenSpecializedModal(ai)}
                        className="btn-primary text-sm flex-1"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteSpecialized(ai.id)}
                        className="btn-danger text-sm flex-1"
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhuma IA Especializada</p>
                <p className="text-sm mb-4">Crie sua primeira IA especializada</p>
                <button
                  onClick={() => handleOpenSpecializedModal()}
                  className="btn-primary"
                >
                  + Nova IA Especializada
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB: DESCOBERTA */}
        {activeTab === 'discovery' && (
          <>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">🔍 Descoberta Automática</h2>
                  <p className="text-gray-400 text-sm">
                    Modelos descobertos automaticamente no sistema
                  </p>
                </div>
                <button onClick={() => refetchDiscovery()} className="btn-secondary">
                  🔄 Escanear Novamente
                </button>
              </div>
            </div>

            {discoveryData?.discovered && discoveryData.discovered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {discoveryData.discovered.map((discovered: any) => (
                  <div key={discovered.id} className="card">
                    <h3 className="text-white font-semibold mb-2">{discovered.modelName}</h3>
                    <p className="text-gray-400 text-sm mb-3 break-all">{discovered.modelPath}</p>

                    <div className="space-y-2 text-sm mb-3">
                      {discovered.sizeBytes && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tamanho:</span>
                          <span className="text-white">
                            {(discovered.sizeBytes / 1024 / 1024 / 1024).toFixed(2)} GB
                          </span>
                        </div>
                      )}
                      {discovered.quantization && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Quantização:</span>
                          <span className="text-white">{discovered.quantization}</span>
                        </div>
                      )}
                      {discovered.parameters && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Parâmetros:</span>
                          <span className="text-white">{discovered.parameters}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Descoberto:</span>
                        <span className="text-white">
                          {new Date(discovered.discoveredAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleImportDiscovered(discovered.id)}
                      disabled={discovered.isImported}
                      className={`w-full ${
                        discovered.isImported ? 'btn-secondary' : 'btn-primary'
                      }`}
                    >
                      {discovered.isImported ? '✅ Já Importado' : '📥 Importar Modelo'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhum modelo descoberto</p>
                <p className="text-sm">Execute o scan para descobrir modelos no sistema</p>
              </div>
            )}
          </>
        )}

        {/* TAB: ESTATÍSTICAS */}
        {activeTab === 'statistics' && (
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">📊 Estatísticas Detalhadas</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Total de Modelos</div>
                  <div className="text-white text-3xl font-bold">{stats.totalModels}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Modelos Ativos</div>
                  <div className="text-white text-3xl font-bold">{stats.activeModels}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Modelos Carregados</div>
                  <div className="text-white text-3xl font-bold">{stats.loadedModels}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Total de Providers</div>
                  <div className="text-white text-3xl font-bold">{stats.totalProviders}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">IAs Especializadas</div>
                  <div className="text-white text-3xl font-bold">{stats.totalSpecializedAIs}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">IAs Ativas</div>
                  <div className="text-white text-3xl font-bold">{stats.activeSpecializedAIs}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Context Window Médio</div>
                  <div className="text-white text-3xl font-bold">
                    {stats.avgContextWindow?.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Capacidades Únicas</div>
                  <div className="text-white text-3xl font-bold">{stats.totalCapabilities}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Taxa de Ativação</div>
                  <div className="text-white text-3xl font-bold">
                    {stats.totalModels > 0
                      ? Math.round((stats.activeModels / stats.totalModels) * 100)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADICIONAR/EDITAR MODELO */}
      {(showAddModal || showEditModal) && (
        <div className="modal-overlay" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
          <div className="modal-content max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">
              {editingModel ? 'Editar Modelo' : 'Adicionar Modelo'}
            </h2>

            <form onSubmit={handleSubmitModel} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nome *</label>
                  <input
                    type="text"
                    value={modelForm.name}
                    onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Provider *</label>
                  <select
                    value={modelForm.providerId}
                    onChange={(e) => setModelForm({ ...modelForm, providerId: Number(e.target.value) })}
                    className="input w-full"
                    required
                  >
                    <option value="0">Selecione um provider</option>
                    {providersData?.providers.map((provider: any) => (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Model ID *</label>
                  <input
                    type="text"
                    value={modelForm.modelId}
                    onChange={(e) => setModelForm({ ...modelForm, modelId: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Context Window</label>
                  <input
                    type="number"
                    value={modelForm.contextWindow}
                    onChange={(e) => setModelForm({ ...modelForm, contextWindow: Number(e.target.value) })}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Prioridade (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={modelForm.priority}
                    onChange={(e) => setModelForm({ ...modelForm, priority: Number(e.target.value) })}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Quantização</label>
                  <input
                    type="text"
                    value={modelForm.quantization}
                    onChange={(e) => setModelForm({ ...modelForm, quantization: e.target.value })}
                    className="input w-full"
                    placeholder="Q4_K_M, Q8_0, etc"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Parâmetros</label>
                  <input
                    type="text"
                    value={modelForm.parameters}
                    onChange={(e) => setModelForm({ ...modelForm, parameters: e.target.value })}
                    className="input w-full"
                    placeholder="7B, 13B, 70B, etc"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Caminho do Modelo</label>
                  <input
                    type="text"
                    value={modelForm.modelPath}
                    onChange={(e) => setModelForm({ ...modelForm, modelPath: e.target.value })}
                    className="input w-full"
                    placeholder="/path/to/model.gguf"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Tamanho (bytes)</label>
                  <input
                    type="number"
                    value={modelForm.sizeBytes}
                    onChange={(e) => setModelForm({ ...modelForm, sizeBytes: Number(e.target.value) })}
                    className="input w-full"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modelForm.isLoaded}
                      onChange={(e) => setModelForm({ ...modelForm, isLoaded: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-300">Carregado</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={modelForm.isActive}
                      onChange={(e) => setModelForm({ ...modelForm, isActive: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-300">Ativo</span>
                  </label>
                </div>
              </div>

              {/* Capacidades */}
              <div>
                <label className="block text-gray-300 mb-2">Capacidades</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={capabilityInput}
                    onChange={(e) => setCapabilityInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCapability())}
                    className="input flex-1"
                    placeholder="Digite e pressione Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddCapability}
                    className="btn-secondary"
                  >
                    + Adicionar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {modelForm.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-3 py-1 bg-blue-600 text-white rounded flex items-center gap-2"
                    >
                      {cap}
                      <button
                        type="button"
                        onClick={() => handleRemoveCapability(cap)}
                        className="text-white hover:text-red-300"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  💾 {editingModel ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setEditingModel(null);
                    resetModelForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IA ESPECIALIZADA */}
      {showSpecializedModal && (
        <div className="modal-overlay" onClick={() => setShowSpecializedModal(false)}>
          <div className="modal-content max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">
              {editingSpecialized ? 'Editar IA Especializada' : 'Nova IA Especializada'}
            </h2>

            <form onSubmit={handleSubmitSpecialized} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nome *</label>
                  <input
                    type="text"
                    value={specializedForm.name}
                    onChange={(e) => setSpecializedForm({ ...specializedForm, name: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Categoria</label>
                  <input
                    type="text"
                    value={specializedForm.category}
                    onChange={(e) => setSpecializedForm({ ...specializedForm, category: e.target.value })}
                    className="input w-full"
                    placeholder="code, analysis, writing, etc"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Descrição</label>
                  <textarea
                    value={specializedForm.description}
                    onChange={(e) => setSpecializedForm({ ...specializedForm, description: e.target.value })}
                    rows={3}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Modelo Padrão</label>
                  <select
                    value={specializedForm.defaultModelId || ''}
                    onChange={(e) =>
                      setSpecializedForm({
                        ...specializedForm,
                        defaultModelId: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="input w-full"
                  >
                    <option value="">Nenhum</option>
                    {modelsData?.items.map((model: any) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={specializedForm.isActive}
                      onChange={(e) =>
                        setSpecializedForm({ ...specializedForm, isActive: e.target.checked })
                      }
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-300">Ativo</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">System Prompt *</label>
                  <textarea
                    value={specializedForm.systemPrompt}
                    onChange={(e) =>
                      setSpecializedForm({ ...specializedForm, systemPrompt: e.target.value })
                    }
                    rows={6}
                    className="input w-full"
                    required
                    placeholder="Você é um assistente especializado em..."
                  />
                </div>
              </div>

              {/* Capacidades */}
              <div>
                <label className="block text-gray-300 mb-2">Capacidades</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={specializedCapabilityInput}
                    onChange={(e) => setSpecializedCapabilityInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === 'Enter' && (e.preventDefault(), handleAddSpecializedCapability())
                    }
                    className="input flex-1"
                    placeholder="Digite e pressione Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddSpecializedCapability}
                    className="btn-secondary"
                  >
                    + Adicionar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specializedForm.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-3 py-1 bg-purple-600 text-white rounded flex items-center gap-2"
                    >
                      {cap}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecializedCapability(cap)}
                        className="text-white hover:text-red-300"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  💾 {editingSpecialized ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSpecializedModal(false);
                    setEditingSpecialized(null);
                    resetSpecializedForm();
                  }}
                  className="btn-secondary flex-1"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Models;
