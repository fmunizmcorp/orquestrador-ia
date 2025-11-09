import { useState } from 'react';
import { trpc } from '../lib/trpc';

// ==========================================
// INTERFACES E TYPES
// ==========================================
interface KnowledgeItem {
  id: number;
  userId: number;
  title: string;
  content: string;
  category: string | null;
  tags: string[] | null;
  embedding: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeSource {
  id: number;
  knowledgeBaseId: number;
  sourceType: string | null;
  sourceUrl: string | null;
  sourceData: any;
  lastSync: string | null;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  isActive: boolean;
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const KnowledgeBase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<KnowledgeFormData>({
    title: '',
    content: '',
    category: 'general',
    tags: [],
    isActive: true,
  });

  // tRPC queries
  const { data, isLoading, refetch } = trpc.knowledgebase.list.useQuery({
    query: searchQuery,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
  });

  const { data: statsData } = trpc.knowledgebase.getStats.useQuery();
  const { data: categoriesData } = trpc.knowledgebase.getCategories.useQuery();
  const { data: tagsData } = trpc.knowledgebase.getTags.useQuery();

  // tRPC mutations
  const createMutation = trpc.knowledgebase.create.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
      alert('✅ Item criado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao criar item: ' + error.message);
    },
  });

  const updateMutation = trpc.knowledgebase.update.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
      alert('✅ Item atualizado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao atualizar item: ' + error.message);
    },
  });

  const deleteMutation = trpc.knowledgebase.delete.useMutation({
    onSuccess: () => {
      refetch();
      alert('✅ Item deletado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao deletar item: ' + error.message);
    },
  });

  const duplicateMutation = trpc.knowledgebase.duplicate.useMutation({
    onSuccess: () => {
      refetch();
      alert('✅ Item duplicado com sucesso!');
    },
    onError: (error) => {
      alert('❌ Erro ao duplicar item: ' + error.message);
    },
  });

  // ==========================================
  // HANDLERS
  // ==========================================
  const openModal = () => {
    setFormData({
      title: '',
      content: '',
      category: 'general',
      tags: [],
      isActive: true,
    });
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: KnowledgeItem) => {
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category || 'general',
      tags: item.tags || [],
      isActive: item.isActive,
    });
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('❌ Título é obrigatório');
      return;
    }

    if (!formData.content.trim()) {
      alert('❌ Conteúdo é obrigatório');
      return;
    }

    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja deletar este item?')) {
      deleteMutation.mutate({ id });
    }
  };

  const handleDuplicate = (item: KnowledgeItem) => {
    const newTitle = prompt('Título para o item duplicado:', `${item.title} (Cópia)`);
    if (newTitle) {
      duplicateMutation.mutate({
        id: item.id,
        newTitle,
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const openDetailModal = (item: KnowledgeItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  // Filtrar por tags selecionadas
  const filteredItems = data?.items.filter((item) => {
    if (selectedTags.length === 0) return true;
    const itemTags = item.tags || [];
    return selectedTags.some((tag) => itemTags.includes(tag));
  }) || [];

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">📚 Base de Conhecimento</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie documentos e conhecimento da organização
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            title={viewMode === 'grid' ? 'Ver em lista' : 'Ver em grade'}
          >
            {viewMode === 'grid' ? '📋' : '📊'}
          </button>
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Novo Item
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
            <div className="text-sm text-gray-600 dark:text-gray-400">Categorias</div>
            <div className="text-2xl font-bold text-blue-600">{Object.keys(statsData.stats.categories).length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">Tags</div>
            <div className="text-2xl font-bold text-purple-600">{statsData.stats.totalTags}</div>
          </div>
        </div>
      )}

      {/* FILTROS E BUSCA */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-4">
          {/* Search e Categoria */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar na base de conhecimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
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

          {/* Tags Filter */}
          {tagsData && tagsData.tags.length > 0 && (
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Filtrar por tags:</div>
              <div className="flex flex-wrap gap-2">
                {tagsData.tags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTagFilter(tag)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.length > 0 && (
                  <button
                    onClick={() => setSelectedTags([])}
                    className="px-3 py-1 text-sm rounded-full bg-red-600 text-white hover:bg-red-700"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTEÚDO - Grid ou Lista */}
      {isLoading ? (
        <div className="p-8 text-center text-gray-600 dark:text-gray-400">
          Carregando itens...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-8 text-center text-gray-600 dark:text-gray-400">
          {searchQuery || selectedTags.length > 0
            ? 'Nenhum item encontrado com os filtros aplicados.'
            : 'Nenhum item cadastrado. Crie seu primeiro item!'}
        </div>
      ) : viewMode === 'grid' ? (
        /* VIEW: GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => openDetailModal(item)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">
                  {item.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    item.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400'
                  }`}
                >
                  {item.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                {item.content}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                  {item.category || 'general'}
                </span>
                <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(item);
                  }}
                  className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400"
                  title="Duplicar"
                >
                  📋
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(item);
                  }}
                  className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                  title="Deletar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* VIEW: LIST */
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Data
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => openDetailModal(item)}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                      {item.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      {item.category || 'general'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {item.tags && item.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags && item.tags.length > 2 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          +{item.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        item.isActive
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400'
                      }`}
                    >
                      {item.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(item);
                        }}
                        className="text-purple-600 hover:text-purple-900 dark:hover:text-purple-400"
                        title="Duplicar"
                      >
                        📋
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(item);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:hover:text-indigo-400"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
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

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {editingItem ? 'Editar Item' : 'Novo Item'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Título do documento"
                  required
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
                  placeholder="ex: manual, tutorial, referência"
                />
              </div>

              {/* Conteúdo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Conteúdo *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Conteúdo do documento"
                  rows={10}
                  required
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Digite uma tag e pressione Enter"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
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
                  Item ativo
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
                    : editingItem
                    ? 'Atualizar'
                    : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {selectedItem.title}
                </h2>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                  {selectedItem.category || 'general'}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    selectedItem.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-400'
                  }`}
                >
                  {selectedItem.isActive ? 'Ativo' : 'Inativo'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(selectedItem.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Tags */}
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Conteúdo</h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedItem.content}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openEditModal(selectedItem);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
