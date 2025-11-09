import { useState } from 'react';
import { trpc } from '../lib/trpc';

// ==========================================
// INTERFACES E TYPES
// ==========================================
interface WorkflowStep {
  id: string;
  name: string;
  type: 'task' | 'condition' | 'loop' | 'parallel' | 'ai_generation' | 'api_call' | 'notification';
  description?: string;
  config?: Record<string, any>;
  nextStepId?: string | null;
  conditionalSteps?: Array<{
    condition: string;
    nextStepId: string;
  }>;
}

interface Workflow {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkflowFormData {
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const Workflows = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<Workflow | null>(null);
  const [isExecuting, setIsExecuting] = useState<number | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Form state
  const [formData, setFormData] = useState<WorkflowFormData>({
    name: '',
    description: '',
    steps: [],
    isActive: true,
  });

  // tRPC queries
  const { data, isLoading, refetch } = trpc.workflows.list.useQuery({
    query: searchQuery,
    isActive: activeFilter === 'all' ? undefined : activeFilter === 'active',
  });

  const { data: statsData } = trpc.workflows.getStats.useQuery();
  const { data: templatesData } = trpc.workflows.getTemplates.useQuery();

  // tRPC mutations
  const createMutation = trpc.workflows.create.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
      alert('✅ Workflow criado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao criar workflow: ' + error.message);
    },
  });

  const updateMutation = trpc.workflows.update.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
      alert('✅ Workflow atualizado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao atualizar workflow: ' + error.message);
    },
  });

  const deleteMutation = trpc.workflows.delete.useMutation({
    onSuccess: () => {
      refetch();
      alert('✅ Workflow deletado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao deletar workflow: ' + error.message);
    },
  });

  const duplicateMutation = trpc.workflows.duplicate.useMutation({
    onSuccess: () => {
      refetch();
      alert('✅ Workflow duplicado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao duplicar workflow: ' + error.message);
    },
  });

  const toggleActiveMutation = trpc.workflows.toggleActive.useMutation({
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      alert('❌ Erro ao alterar status: ' + error.message);
    },
  });

  const executeMutation = trpc.workflows.execute.useMutation({
    onSuccess: (result) => {
      setIsExecuting(null);
      alert(`✅ Workflow executado com sucesso!\n\nSteps executados: ${result.execution.steps.length}`);
    },
    onError: (error) => {
      setIsExecuting(null);
      alert('❌ Erro ao executar workflow: ' + error.message);
    },
  });

  const createFromTemplateMutation = trpc.workflows.createFromTemplate.useMutation({
    onSuccess: () => {
      refetch();
      setIsTemplateModalOpen(false);
      alert('✅ Workflow criado a partir do template!');
    },
    onError: (error) => {
      alert('❌ Erro ao criar workflow: ' + error.message);
    },
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const openModal = () => {
    setFormData({
      name: '',
      description: '',
      steps: [],
      isActive: true,
    });
    setEditingWorkflow(null);
    setIsModalOpen(true);
  };

  const openEditModal = (workflow: Workflow) => {
    setFormData({
      name: workflow.name,
      description: workflow.description || '',
      steps: workflow.steps,
      isActive: workflow.isActive,
    });
    setEditingWorkflow(workflow);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWorkflow(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('❌ Nome é obrigatório');
      return;
    }

    if (formData.steps.length === 0) {
      alert('❌ O workflow deve ter pelo menos um step');
      return;
    }

    if (editingWorkflow) {
      updateMutation.mutate({
        id: editingWorkflow.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja deletar este workflow?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleDuplicate = (workflow: Workflow) => {
    const newName = prompt('Nome para o workflow duplicado:', `${workflow.name} (Cópia)`);
    if (newName) {
      duplicateMutation.mutate({
        id: workflow.id,
        newName,
      });
    }
  };

  const handleToggleActive = (workflow: Workflow) => {
    toggleActiveMutation.mutate({
      id: workflow.id,
      isActive: !workflow.isActive,
    });
  };

  const handleExecute = (workflow: Workflow) => {
    if (!workflow.isActive) {
      alert('❌ Workflow está inativo. Ative-o antes de executar.');
      return;
    }

    if (confirm(`Executar workflow "${workflow.name}"?`)) {
      setIsExecuting(workflow.id);
      executeMutation.mutate({
        id: workflow.id,
      });
    }
  };

  const handleCreateFromTemplate = (templateId: string, templateName: string) => {
    const name = prompt('Nome para o novo workflow:', templateName);
    if (name) {
      createFromTemplateMutation.mutate({
        templateId,
        name,
      });
    }
  };

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      name: 'Novo Step',
      type: 'task',
      description: '',
    };
    setFormData({
      ...formData,
      steps: [...formData.steps, newStep],
    });
  };

  const updateStep = (index: number, updates: Partial<WorkflowStep>) => {
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    setFormData({
      ...formData,
      steps: newSteps,
    });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      steps: newSteps,
    });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...formData.steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newSteps.length) {
      [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
      setFormData({
        ...formData,
        steps: newSteps,
      });
    }
  };

  // ==========================================
  // UTILITÁRIOS
  // ==========================================
  const getStepTypeColor = (type: WorkflowStep['type']): string => {
    const colors = {
      task: 'bg-blue-500',
      condition: 'bg-yellow-500',
      loop: 'bg-purple-500',
      parallel: 'bg-green-500',
      ai_generation: 'bg-indigo-500',
      api_call: 'bg-orange-500',
      notification: 'bg-pink-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  const getStepTypeLabel = (type: WorkflowStep['type']): string => {
    const labels = {
      task: 'Tarefa',
      condition: 'Condição',
      loop: 'Loop',
      parallel: 'Paralelo',
      ai_generation: 'IA',
      api_call: 'API',
      notification: 'Notificação',
    };
    return labels[type] || type;
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Workflows</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie e execute workflows automatizados
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <span>📋</span>
            Templates
          </button>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Novo Workflow
          </button>
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statsData.stats.total}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Ativos</div>
            <div className="text-2xl font-bold text-green-600">{statsData.stats.active}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Inativos</div>
            <div className="text-2xl font-bold text-gray-600">{statsData.stats.inactive}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Média de Steps</div>
            <div className="text-2xl font-bold text-blue-600">{statsData.stats.averageSteps.toFixed(1)}</div>
          </div>
        </div>
      )}

      {/* FILTROS E BUSCA */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Filtro de Status */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setActiveFilter('inactive')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeFilter === 'inactive'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Inativos
            </button>
          </div>
        </div>
      </div>

      {/* LISTA DE WORKFLOWS */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            Carregando workflows...
          </div>
        ) : !data?.items || data.items.length === 0 ? (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            {searchQuery ? 'Nenhum workflow encontrado.' : 'Nenhum workflow cadastrado. Crie seu primeiro workflow!'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Workflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Steps
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Criado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.items.map((workflow) => (
                  <tr key={workflow.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {workflow.name}
                        </div>
                        {workflow.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {workflow.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          workflow.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400'
                        }`}
                      >
                        {workflow.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {workflow.steps.slice(0, 5).map((step, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-6 rounded ${getStepTypeColor(step.type)}`}
                            title={`${step.name} (${getStepTypeLabel(step.type)})`}
                          />
                        ))}
                        {workflow.steps.length > 5 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            +{workflow.steps.length - 5}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {workflow.steps.length} {workflow.steps.length === 1 ? 'step' : 'steps'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(workflow.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {/* Executar */}
                        <button
                          onClick={() => handleExecute(workflow)}
                          disabled={!workflow.isActive || isExecuting === workflow.id}
                          className={`text-green-600 hover:text-green-900 dark:hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isExecuting === workflow.id ? 'animate-pulse' : ''
                          }`}
                          title="Executar"
                        >
                          ▶️
                        </button>

                        {/* Toggle Ativo/Inativo */}
                        <button
                          onClick={() => handleToggleActive(workflow)}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                          title={workflow.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {workflow.isActive ? '⏸️' : '▶️'}
                        </button>

                        {/* Duplicar */}
                        <button
                          onClick={() => handleDuplicate(workflow)}
                          className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400"
                          title="Duplicar"
                        >
                          📋
                        </button>

                        {/* Editar */}
                        <button
                          onClick={() => openEditModal(workflow)}
                          className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"
                          title="Editar"
                        >
                          ✏️
                        </button>

                        {/* Deletar */}
                        <button
                          onClick={() => handleDelete(workflow.id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                          title="Deletar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingWorkflow ? 'Editar Workflow' : 'Novo Workflow'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Nome do workflow"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Descrição do workflow"
                  rows={3}
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Workflow ativo
                </label>
              </div>

              {/* Steps */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Steps *
                  </label>
                  <button
                    type="button"
                    onClick={addStep}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    + Adicionar Step
                  </button>
                </div>

                {formData.steps.length === 0 ? (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center text-gray-600 dark:text-gray-400">
                    Nenhum step adicionado. Clique em "Adicionar Step" para começar.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              #{index + 1}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded text-white ${getStepTypeColor(step.type)}`}
                            >
                              {getStepTypeLabel(step.type)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => moveStep(index, 'up')}
                              disabled={index === 0}
                              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
                              title="Mover para cima"
                            >
                              ⬆️
                            </button>
                            <button
                              type="button"
                              onClick={() => moveStep(index, 'down')}
                              disabled={index === formData.steps.length - 1}
                              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30"
                              title="Mover para baixo"
                            >
                              ⬇️
                            </button>
                            <button
                              type="button"
                              onClick={() => removeStep(index)}
                              className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                              title="Remover"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <input
                              type="text"
                              value={step.name}
                              onChange={(e) => updateStep(index, { name: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                              placeholder="Nome do step"
                            />
                          </div>
                          <div>
                            <select
                              value={step.type}
                              onChange={(e) =>
                                updateStep(index, { type: e.target.value as WorkflowStep['type'] })
                              }
                              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                              <option value="task">Tarefa</option>
                              <option value="condition">Condição</option>
                              <option value="loop">Loop</option>
                              <option value="parallel">Paralelo</option>
                              <option value="ai_generation">IA</option>
                              <option value="api_call">API</option>
                              <option value="notification">Notificação</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-2">
                          <textarea
                            value={step.description || ''}
                            onChange={(e) => updateStep(index, { description: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            placeholder="Descrição do step"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {createMutation.isLoading || updateMutation.isLoading
                    ? 'Salvando...'
                    : editingWorkflow
                    ? 'Atualizar'
                    : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE TEMPLATES */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Templates de Workflow
                </h2>
                <button
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {templatesData?.templates ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templatesData.templates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-500 transition-colors"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {template.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {template.steps.length} steps
                        </span>
                        <button
                          onClick={() => handleCreateFromTemplate(template.id, template.name)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                        >
                          Usar Template
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-600 dark:text-gray-400">
                  Carregando templates...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflows;
