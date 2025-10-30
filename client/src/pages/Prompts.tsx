import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';

export default function Prompts() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all'); // all, public, private
  
  const { data: promptsData, isLoading, error, refetch } = trpc.prompts.list.useQuery({
    userId: user?.id,
    isPublic: filter === 'all' ? undefined : filter === 'public',
    limit: 50,
    offset: 0,
  });
  
  const prompts = promptsData?.prompts || [];
  const loading = isLoading;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Prompts</h1>
          <p className="text-gray-600 mt-1">
            Gerencie e reutilize seus prompts
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Novo Prompt
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('private')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'private'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Privados
        </button>
        <button
          onClick={() => setFilter('public')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'public'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Públicos
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando prompts...</p>
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum prompt</h3>
          <p className="mt-1 text-sm text-gray-500">Comece criando um novo prompt reutilizável.</p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Criar Prompt
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt: any) => (
            <div key={prompt.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{prompt.title}</h3>
                {prompt.isPublic && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Público
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{prompt.description}</p>
              {prompt.category && (
                <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {prompt.category}
                </span>
              )}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{prompt.useCount || 0} usos</span>
                <span>v{prompt.currentVersion || 1}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Editar
                </button>
                <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Testar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
