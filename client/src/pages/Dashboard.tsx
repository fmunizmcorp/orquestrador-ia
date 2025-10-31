import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  trend?: number;
}

const StatsCard = ({ title, value, icon, color, trend }: StatsCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
        <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
        {trend !== undefined && (
          <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% este mês
          </p>
        )}
      </div>
      <div className={`text-4xl ${color.replace('text-', 'opacity-20 ')}`}>
        {icon}
      </div>
    </div>
  </div>
);

interface ActivityItem {
  id: number;
  type: string;
  message: string;
  timestamp: Date;
  user?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Queries
  const { data: teamsData } = trpc.teams.list.useQuery({ limit: 100, offset: 0 });
  const { data: projectsData } = trpc.projects.list.useQuery({ limit: 100, offset: 0 });
  const { data: promptsData } = trpc.prompts.list.useQuery({ 
    userId: user?.id, 
    limit: 100, 
    offset: 0 
  });
  const { data: metricsData } = trpc.monitoring.getCurrentMetrics.useQuery();
  const { data: serviceStatus } = trpc.monitoring.getServiceStatus.useQuery();

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate stats
  const teams = teamsData?.teams || [];
  const projects = projectsData?.projects || [];
  const prompts = promptsData?.prompts || [];
  const metrics = metricsData?.metrics;

  const activeProjects = projects.filter((p: any) => p.status === 'active').length;
  const completedProjects = projects.filter((p: any) => p.status === 'completed').length;
  const totalMembers = teams.reduce((sum: number, team: any) => sum + (team.memberCount || 0), 0);

  // Project status distribution
  const projectsByStatus = {
    planning: projects.filter((p: any) => p.status === 'planning').length,
    active: projects.filter((p: any) => p.status === 'active').length,
    on_hold: projects.filter((p: any) => p.status === 'on_hold').length,
    completed: projects.filter((p: any) => p.status === 'completed').length,
    archived: projects.filter((p: any) => p.status === 'archived').length,
  };

  // Recent activity (simulated for now)
  const recentActivity: ActivityItem[] = [
    { id: 1, type: 'project', message: 'Novo projeto criado', timestamp: new Date(Date.now() - 1000 * 60 * 5), user: user?.name },
    { id: 2, type: 'team', message: 'Equipe atualizada', timestamp: new Date(Date.now() - 1000 * 60 * 15), user: user?.name },
    { id: 3, type: 'prompt', message: 'Novo prompt adicionado', timestamp: new Date(Date.now() - 1000 * 60 * 30), user: user?.name },
    { id: 4, type: 'system', message: 'Sistema iniciado', timestamp: new Date(Date.now() - 1000 * 60 * 60), user: 'Sistema' },
  ];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s atrás`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bem-vindo, {user?.name || 'Usuário'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {currentTime.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} - {currentTime.toLocaleTimeString('pt-BR')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Equipes"
          value={teams.length}
          icon="👥"
          color="text-blue-600"
          trend={12}
        />
        <StatsCard
          title="Projetos Ativos"
          value={activeProjects}
          icon="📊"
          color="text-green-600"
          trend={8}
        />
        <StatsCard
          title="Prompts"
          value={prompts.length}
          icon="💬"
          color="text-purple-600"
          trend={-3}
        />
        <StatsCard
          title="Membros"
          value={totalMembers}
          icon="🎯"
          color="text-orange-600"
          trend={15}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Status dos Projetos
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Planejamento</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{projectsByStatus.planning}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(projectsByStatus.planning / Math.max(projects.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Ativo</span>
                  <span className="font-semibold text-green-600">{projectsByStatus.active}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(projectsByStatus.active / Math.max(projects.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Em Espera</span>
                  <span className="font-semibold text-yellow-600">{projectsByStatus.on_hold}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(projectsByStatus.on_hold / Math.max(projects.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Concluído</span>
                  <span className="font-semibold text-blue-600">{projectsByStatus.completed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(projectsByStatus.completed / Math.max(projects.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Arquivado</span>
                  <span className="font-semibold text-red-600">{projectsByStatus.archived}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(projectsByStatus.archived / Math.max(projects.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Métricas do Sistema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {metrics?.cpu ? `${metrics.cpu.toFixed(1)}%` : '0%'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">CPU</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {metrics?.memory ? `${metrics.memory.toFixed(1)}%` : '0%'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Memória</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">
                  {metrics?.disk ? `${metrics.disk.toFixed(1)}%` : '0%'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Disco</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ações Rápidas
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-300">Novo Projeto</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-300">Nova Equipe</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-300">Novo Prompt</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-300">Ver Análises</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Atividade Recente
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'project' ? 'bg-green-500' :
                      activity.type === 'team' ? 'bg-blue-500' :
                      activity.type === 'prompt' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.user} • {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Status do Sistema
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Banco de Dados</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  serviceStatus?.status?.database
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {serviceStatus?.status?.database ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">API tRPC</span>
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">LM Studio</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  serviceStatus?.status?.lmstudio
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {serviceStatus?.status?.lmstudio ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">
              Taxa de Conclusão
            </h2>
            <div className="text-4xl font-bold mb-2">
              {projects.length > 0 
                ? `${Math.round((completedProjects / projects.length) * 100)}%`
                : '0%'
              }
            </div>
            <p className="text-sm opacity-90">
              {completedProjects} de {projects.length} projetos concluídos
            </p>
            <div className="mt-4 bg-white dark:bg-gray-800/20 rounded-full h-2">
              <div 
                className="bg-white dark:bg-gray-800 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: projects.length > 0 
                    ? `${(completedProjects / projects.length) * 100}%` 
                    : '0%' 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
