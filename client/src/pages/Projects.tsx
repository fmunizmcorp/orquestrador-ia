import { useState } from 'react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';

interface ProjectFormData {
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
  teamId?: number;
}

const statusColors = {
  planning: 'bg-gray-100 text-gray-800',
  active: 'bg-green-100 text-green-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  archived: 'bg-red-100 text-red-800',
};

const statusLabels = {
  planning: 'Planejamento',
  active: 'Ativo',
  on_hold: 'Em Espera',
  completed: 'Concluído',
  archived: 'Arquivado',
};

export default function Projects() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    status: 'planning',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Queries
  const { data: projectsData, isLoading, refetch } = trpc.projects.list.useQuery({
    limit: 50,
    offset: 0,
  });

  const { data: teamsData } = trpc.teams.list.useQuery({
    limit: 100,
    offset: 0,
  });

  // Mutations
  const createProjectMutation = trpc.projects.create.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
  });

  const updateProjectMutation = trpc.projects.update.useMutation({
    onSuccess: () => {
      refetch();
      closeModal();
    },
  });

  const deleteProjectMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const projects = projectsData?.projects || [];
  const teams = teamsData?.teams || [];
  
  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const openModal = (project?: any) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description || '',
        status: project.status,
        teamId: project.teamId,
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        status: 'planning',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      status: 'planning',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      await updateProjectMutation.mutateAsync({
        id: editingProject.id,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        teamId: formData.teamId,
      });
    } else {
      await createProjectMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        status: formData.status,
        teamId: formData.teamId,
        createdBy: user?.id || 1,
      });
    }
  };

  const handleDelete = async (projectId: number) => {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
      await deleteProjectMutation.mutateAsync({ id: projectId });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projetos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus projetos e tarefas
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Novo Projeto
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Todos os Status</option>
          <option value="planning">Planejamento</option>
          <option value="active">Ativo</option>
          <option value="on_hold">Em Espera</option>
          <option value="completed">Concluído</option>
          <option value="archived">Arquivado</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando projetos...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm || filterStatus !== 'all' ? 'Nenhum projeto encontrado' : 'Nenhum projeto'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' ? 'Tente uma busca diferente.' : 'Comece criando um novo projeto.'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <div className="mt-6">
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Criar Projeto
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: any) => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">{project.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[project.status as keyof typeof statusColors]}`}>
                  {statusLabels[project.status as keyof typeof statusLabels]}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {project.description || 'Sem descrição'}
              </p>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(project.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(project)}
                  className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-600 rounded px-3 py-1 hover:bg-blue-50 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deleteProjectMutation.isLoading}
                  className="flex-1 text-red-600 hover:text-red-700 text-sm font-medium border border-red-600 rounded px-3 py-1 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Projeto *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descreva o objetivo do projeto..."
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="planning">Planejamento</option>
                    <option value="active">Ativo</option>
                    <option value="on_hold">Em Espera</option>
                    <option value="completed">Concluído</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="teamId" className="block text-sm font-medium text-gray-700 mb-1">
                    Equipe (opcional)
                  </label>
                  <select
                    id="teamId"
                    value={formData.teamId || ''}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sem equipe</option>
                    {teams.map((team: any) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createProjectMutation.isLoading || updateProjectMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {createProjectMutation.isLoading || updateProjectMutation.isLoading
                    ? 'Salvando...'
                    : editingProject
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
