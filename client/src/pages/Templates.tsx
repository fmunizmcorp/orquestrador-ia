import { useState } from 'react';
import { trpc } from '../lib/trpc';

// ==========================================
// INTERFACES E TYPES
// ==========================================
interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  label: string;
  description?: string;
  defaultValue?: any;
  required?: boolean;
  options?: string[];
}

interface TemplateData {
  systemPrompt?: string;
  userPromptTemplate?: string;
  variables?: TemplateVariable[];
  examples?: Array<{
    input: Record<string, any>;
    output: string;
  }>;
  tags?: string[];
  modelConfig?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
}

interface Template {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  category: string | null;
  templateData: TemplateData;
  isPublic: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface TemplateFormData {
  name: string;
  description: string;
  category: string;
  templateData: TemplateData;
  isPublic: boolean;
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const Templates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewFilter, setViewFilter] = useState<'my' | 'public'>('my');
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);
  const [usingTemplate, setUsingTemplate] = useState<Template | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, any>>({});

  // Form state
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    category: 'general',
    templateData: {
      systemPrompt: '',
      userPromptTemplate: '',
      variables: [],
      modelConfig: {},
    },
    isPublic: false,
  });

  // tRPC queries
  const { data, isLoading, refetch } = trpc.templates.list.useQuery({
    query: searchQuery,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    isPublic: viewFilter === 'public',
  });

  const { data: statsData } = trpc.templates.getStats.useQuery();
  const { data: categoriesData } = trpc.templates.getCategories.useQuery();
  const { data: popularData } = trpc.templates.getPopular.useQuery({ limit: 5 });

  // tRPC mutations
  const createMutation = trpc.templates.create.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
      alert('✅ Template criado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao criar template: ' + error.message);
    },
  });

  const updateMutation = trpc.templates.update.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
      alert('✅ Template atualizado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao atualizar template: ' + error.message);
    },
  });

  const deleteMutation = trpc.templates.delete.useMutation({
    onSuccess: () => {
      refetch();
      alert('✅ Template deletado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao deletar template: ' + error.message);
    },
  });

  const duplicateMutation = trpc.templates.duplicate.useMutation({
    onSuccess: () => {
      refetch();
      alert('✅ Template duplicado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao duplicar template: ' + error.message);
    },
  });

  const useMutation = trpc.templates.use.useMutation({
    onSuccess: (result) => {
      setIsUseModalOpen(false);
      setUsingTemplate(null);
      alert(`✅ Template processado com sucesso!\n\nPrompt gerado:\n${result.processedPrompt.substring(0, 200)}...`);
      // Aqui você pode fazer algo com o prompt gerado, como copiar para área de transferência
      navigator.clipboard.writeText(result.processedPrompt);
    },
    onError: (error) => {
      alert('❌ Erro ao processar template: ' + error.message);
    },
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const openModal = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general',
      templateData: {
        systemPrompt: '',
        userPromptTemplate: '',
        variables: [],
        modelConfig: {},
      },
      isPublic: false,
    });
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const openEditModal = (template: Template) => {
    setFormData({
      name: template.name,
      description: template.description || '',
      category: template.category || 'general',
      templateData: template.templateData,
      isPublic: template.isPublic,
    });
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('❌ Nome é obrigatório');
      return;
    }

    if (!formData.templateData.userPromptTemplate?.trim()) {
      alert('❌ Template de prompt é obrigatório');
      return;
    }

    if (editingTemplate) {
      updateMutation.mutate({
        id: editingTemplate.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja deletar este template?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleDuplicate = (template: Template) => {
    const newName = prompt('Nome para o template duplicado:', `${template.name} (Cópia)`);
    if (newName) {
      duplicateMutation.mutate({
        id: template.id,
        newName,
      });
    }
  };

  const openUseModal = (template: Template) => {
    setUsingTemplate(template);
    // Inicializar variáveis com valores padrão
    const initialVars: Record<string, any> = {};
    template.templateData.variables?.forEach((v) => {
      initialVars[v.name] = v.defaultValue !== undefined ? v.defaultValue : '';
    });
    setTemplateVariables(initialVars);
    setIsUseModalOpen(true);
  };

  const handleUseTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usingTemplate) return;

    useMutation.mutate({
      id: usingTemplate.id,
      variables: templateVariables,
    });
  };

  const addVariable = () => {
    const newVar: TemplateVariable = {
      name: 'variable',
      type: 'text',
      label: 'Nova Variável',
      required: false,
    };
    setFormData({
      ...formData,
      templateData: {
        ...formData.templateData,
        variables: [...(formData.templateData.variables || []), newVar],
      },
    });
  };

  const updateVariable = (index: number, updates: Partial<TemplateVariable>) => {
    const newVars = [...(formData.templateData.variables || [])];
    newVars[index] = { ...newVars[index], ...updates };
    setFormData({
      ...formData,
      templateData: {
        ...formData.templateData,
        variables: newVars,
      },
    });
  };

  const removeVariable = (index: number) => {
    const newVars = (formData.templateData.variables || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      templateData: {
        ...formData.templateData,
        variables: newVars,
      },
    });
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Templates de IA</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie templates reutilizáveis para geração de prompts
          </p>
        </div>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>+</span>
          Novo Template
        </button>
      </div>

      {/* ESTATÍSTICAS */}
      {statsData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statsData.stats.total}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Públicos</div>
            <div className="text-2xl font-bold text-green-600">{statsData.stats.public}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Privados</div>
            <div className="text-2xl font-bold text-blue-600">{statsData.stats.private}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Usos Totais</div>
            <div className="text-2xl font-bold text-purple-600">{statsData.stats.totalUsage}</div>
          </div>
        </div>
      )}

      {/* TEMPLATES POPULARES */}
      {popularData && popularData.templates.length > 0 && viewFilter === 'public' && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            🔥 Templates Mais Usados
          </h2>
          <div className="flex gap-2 flex-wrap">
            {popularData.templates.map((template) => (
              <button
                key={template.id}
                onClick={() => openUseModal(template)}
                className="px-3 py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors text-sm"
              >
                {template.name} ({template.usageCount} usos)
              </button>
            ))}
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
              placeholder="Buscar templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Filtro Meus/Públicos */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewFilter('my')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewFilter === 'my'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Meus
            </button>
            <button
              onClick={() => setViewFilter('public')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewFilter === 'public'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Públicos
            </button>
          </div>

          {/* Filtro de Categoria */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="all">Todas Categorias</option>
            {categoriesData?.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTA DE TEMPLATES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full p-8 text-center text-gray-600 dark:text-gray-400">
            Carregando templates...
          </div>
        ) : !data?.items || data.items.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-600 dark:text-gray-400">
            {searchQuery ? 'Nenhum template encontrado.' : 'Nenhum template cadastrado. Crie seu primeiro template!'}
          </div>
        ) : (
          data.items.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                    {template.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      {template.category}
                    </span>
                    {template.isPublic && (
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded">
                        Público
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {template.usageCount} usos
                </div>
              </div>

              {/* Description */}
              {template.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {template.description}
                </p>
              )}

              {/* Variables */}
              {template.templateData.variables && template.templateData.variables.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Variáveis:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.templateData.variables.slice(0, 3).map((v, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded"
                      >
                        {v.name}
                      </span>
                    ))}
                    {template.templateData.variables.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                        +{template.templateData.variables.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => openUseModal(template)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                  ▶️ Usar
                </button>
                <div className="flex gap-2">
                  {viewFilter === 'my' && (
                    <>
                      <button
                        onClick={() => handleDuplicate(template)}
                        className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400"
                        title="Duplicar"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => openEditModal(template)}
                        className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        title="Deletar"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingTemplate ? 'Editar Template' : 'Novo Template'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
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
                  placeholder="Nome do template"
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
                  placeholder="Descrição do template"
                  rows={3}
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="ex: code, writing, analysis"
                />
              </div>

              {/* System Prompt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System Prompt (Opcional)
                </label>
                <textarea
                  value={formData.templateData.systemPrompt || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      templateData: { ...formData.templateData, systemPrompt: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                  placeholder="System prompt para configurar o modelo"
                  rows={3}
                />
              </div>

              {/* User Prompt Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Template de Prompt * <span className="text-xs text-gray-500">(Use {{variavel}} para variáveis)</span>
                </label>
                <textarea
                  value={formData.templateData.userPromptTemplate || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      templateData: { ...formData.templateData, userPromptTemplate: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
                  placeholder="ex: Escreva um {{tipo}} sobre {{tema}} em {{idioma}}"
                  rows={5}
                  required
                />
              </div>

              {/* Variáveis */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Variáveis
                  </label>
                  <button
                    type="button"
                    onClick={addVariable}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    + Adicionar Variável
                  </button>
                </div>

                {formData.templateData.variables && formData.templateData.variables.length > 0 ? (
                  <div className="space-y-3">
                    {formData.templateData.variables.map((variable, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Variável #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeVariable(index)}
                            className="text-red-600 hover:text-red-800 dark:hover:text-red-400 text-sm"
                          >
                            🗑️
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={variable.name}
                            onChange={(e) => updateVariable(index, { name: e.target.value })}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            placeholder="Nome da variável"
                          />
                          <input
                            type="text"
                            value={variable.label}
                            onChange={(e) => updateVariable(index, { label: e.target.value })}
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            placeholder="Label"
                          />
                          <select
                            value={variable.type}
                            onChange={(e) =>
                              updateVariable(index, { type: e.target.value as TemplateVariable['type'] })
                            }
                            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="boolean">Boolean</option>
                            <option value="select">Select</option>
                          </select>
                          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked={variable.required || false}
                              onChange={(e) => updateVariable(index, { required: e.target.checked })}
                              className="w-4 h-4"
                            />
                            Obrigatória
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center text-gray-600 dark:text-gray-400 text-sm">
                    Nenhuma variável definida
                  </div>
                )}
              </div>

              {/* Status Público */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tornar público (outros usuários poderão usar)
                </label>
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
                    : editingTemplate
                    ? 'Atualizar'
                    : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE USO DE TEMPLATE */}
      {isUseModalOpen && usingTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Usar Template: {usingTemplate.name}
              </h2>
              {usingTemplate.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{usingTemplate.description}</p>
              )}
            </div>

            <form onSubmit={handleUseTemplate} className="p-6 space-y-4">
              {usingTemplate.templateData.variables && usingTemplate.templateData.variables.length > 0 ? (
                <>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                    Preencha as variáveis do template:
                  </div>
                  {usingTemplate.templateData.variables.map((variable, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {variable.label}
                        {variable.required && <span className="text-red-500"> *</span>}
                      </label>
                      {variable.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{variable.description}</p>
                      )}

                      {variable.type === 'text' && (
                        <input
                          type="text"
                          value={templateVariables[variable.name] || ''}
                          onChange={(e) =>
                            setTemplateVariables({ ...templateVariables, [variable.name]: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          required={variable.required}
                        />
                      )}

                      {variable.type === 'number' && (
                        <input
                          type="number"
                          value={templateVariables[variable.name] || ''}
                          onChange={(e) =>
                            setTemplateVariables({ ...templateVariables, [variable.name]: Number(e.target.value) })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          required={variable.required}
                        />
                      )}

                      {variable.type === 'select' && variable.options && (
                        <select
                          value={templateVariables[variable.name] || ''}
                          onChange={(e) =>
                            setTemplateVariables({ ...templateVariables, [variable.name]: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          required={variable.required}
                        >
                          <option value="">Selecione...</option>
                          {variable.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {variable.type === 'boolean' && (
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={templateVariables[variable.name] || false}
                            onChange={(e) =>
                              setTemplateVariables({ ...templateVariables, [variable.name]: e.target.checked })
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">Sim</span>
                        </label>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center text-gray-600 dark:text-gray-400">
                  Este template não requer variáveis
                </div>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsUseModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={useMutation.isLoading}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {useMutation.isLoading ? 'Gerando...' : '▶️ Gerar Prompt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
