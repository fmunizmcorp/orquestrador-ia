import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';

interface PromptFormData {
  title: string;
  content: string;
  category: string;
  tags: string;
  isPublic: boolean;
}

export default function Prompts() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<any>(null);
  const [formData, setFormData] = useState<PromptFormData>({
    title: '',
    content: '',
    category: '',
    tags: '',
    isPublic: false,
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Queries
  const { data: promptsData, isLoading, refetch } = trpc.prompts.list.useQuery({
    userId: user?.id,
    isPublic: filter === 'all' ? undefined : filter === 'public',
    limit: 50,
    offset: 0,
  });

  // Mutations
  const createPromptMutation = trpc.prompts.create.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
  });

  const updatePromptMutation = trpc.prompts.update.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
  });

  const deletePromptMutation = trpc.prompts.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const prompts = promptsData?.prompts || [];
  
  const filteredPrompts = prompts.filter((prompt: any) => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'mine') {
      return matchesSearch && prompt.userId === user?.id;
    }
    if (filter === 'public') {
      return matchesSearch && prompt.isPublic;
    }
    return matchesSearch;
  });

  const openModal = (prompt?: any) => {
    if (prompt) {
      setEditingPrompt(prompt);
      setFormData({
        title: prompt.title,
        content: prompt.content || '',
        category: prompt.category || '',
        tags: prompt.tags || '',
        isPublic: prompt.isPublic || false,
      });
    } else {
      setEditingPrompt(null);
      setFormData({
        title: '',
        content: '',
        category: '',
        tags: '',
        isPublic: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPrompt(null);
    setFormData({
      title: '',
      content: '',
      category: '',
      tags: '',
      isPublic: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPrompt) {
      await updatePromptMutation.mutateAsync({
        id: editingPrompt.id,
        title: formData.title,
        content: formData.content,
        category: formData.category || undefined,
        tags: formData.tags || undefined,
        isPublic: formData.isPublic,
      });
    } else {
      await createPromptMutation.mutateAsync({
        title: formData.title,
        content: formData.content,
        category: formData.category || undefined,
        tags: formData.tags || undefined,
        isPublic: formData.isPublic,
        userId: user?.id || 1,
      });
    }
  };

  const handleDelete = async (promptId: number) => {
    if (confirm('Tem certeza que deseja excluir este prompt?')) {
      await deletePromptMutation.mutateAsync({ id: promptId });
    }
  };

  const handleDuplicate = async (prompt: any) => {
    await createPromptMutation.mutateAsync({
      title: `${prompt.title} (cópia)`,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags,
      isPublic: false,
      userId: user?.id || 1,
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Biblioteca de Prompts</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Gerencie seus prompts para IAs
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Prompt
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('mine')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'mine'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Meus Prompts
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'public'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Públicos
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Carregando prompts...</p>
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {searchTerm ? 'Nenhum prompt encontrado' : 'Nenhum prompt'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Tente uma busca diferente.' : 'Comece criando um novo prompt.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Criar Prompt
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt: any) => (
            <div key={prompt.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1 line-clamp-1">
                  {prompt.title}
                </h3>
                {prompt.isPublic && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
                    Público
                  </span>
                )}
              </div>
              
              {prompt.category && (
                <span className="inline-block text-xs bg-gray-100 text-gray-700 dark:text-gray-200 px-2 py-1 rounded mb-3">
                  {prompt.category}
                </span>
              )}
              
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                {prompt.content || 'Sem conteúdo'}
              </p>
              
              {prompt.tags && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {prompt.tags.split(',').slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                {prompt.userId === user?.id && (
                  <>
                    <button
                      onClick={() => openModal(prompt)}
                      className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-600 rounded px-3 py-1 hover:bg-blue-50 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(prompt.id)}
                      disabled={deletePromptMutation.isLoading}
                      className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium border border-red-600 rounded px-3 py-1 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Excluir
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDuplicate(prompt)}
                  disabled={createPromptMutation.isLoading}
                  className="flex-1 text-gray-600 hover:text-gray-700 dark:text-gray-200 text-sm font-medium border border-gray-600 rounded px-3 py-1 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Duplicar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingPrompt ? 'Editar Prompt' : 'Novo Prompt'}
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

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Título do Prompt *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Conteúdo do Prompt *
                  </label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder="Escreva seu prompt aqui..."
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Dica: Use variáveis como {'{'}nome{'}'} para personalizar seu prompt
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Categoria
                    </label>
                    <input
                      id="category"
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: Marketing, Código, Criativo"
                    />
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Tags
                    </label>
                    <input
                      id="tags"
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="isPublic"
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                    Tornar este prompt público (outros usuários poderão vê-lo)
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createPromptMutation.isLoading || updatePromptMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createPromptMutation.isLoading || updatePromptMutation.isLoading
                    ? 'Salvando...'
                    : editingPrompt
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
}
