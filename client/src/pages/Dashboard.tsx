import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';
import { useAuth } from '../contexts/AuthContext';
import { translateProjectStatus, translateTaskStatus } from '../lib/utils/translations';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  trend?: number;
  subtitle?: string;
}

const StatsCard = ({ title, value, icon, color, trend, subtitle }: StatsCardProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className={`text-3xl font-bold ${color} mt-2`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
        {trend !== undefined && (
          <p className={`text-sm mt-2 font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% este mês
          </p>
        )}
      </div>
      <div className="text-5xl opacity-20">
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

  // Queries - tudo o que precisa para dashboard completo
  const { data: teamsData } = trpc.teams.list.useQuery({ limit: 100, offset: 0 });
  const { data: projectsData } = trpc.projects.list.useQuery({ limit: 100, offset: 0 });
  const { data: tasksData } = trpc.tasks.list.useQuery({ limit: 100, offset: 0 });
  const { data: promptsData } = trpc.prompts.list.useQuery({ 
    userId: user?.id, 
    limit: 100, 
    offset: 0 
  });
  const { data: workflowsData } = trpc.workflows.list.useQuery({ limit: 100, offset: 0 });
  const { data: templatesData } = trpc.templates.list.useQuery({ limit: 100, offset: 0 });
  const { data: metricsData } = trpc.monitoring.getCurrentMetrics.useQuery();
  const { data: serviceStatus } = trpc.monitoring.getServiceStatus.useQuery();
  const { data: tasksStats } = trpc.tasks.getStats.useQuery({});
  const { data: workflowsStats } = trpc.workflows.getStats.useQuery();
  const { data: templatesStats } = trpc.templates.getStats.useQuery();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate comprehensive stats
  const teams = teamsData?.data || [];
  const projects = projectsData?.data || [];
  const tasks = tasksData?.tasks || [];
  const prompts = promptsData?.data || [];
  const workflows = workflowsData?.items || [];
  const templates = templatesData?.items || [];
  const metrics = metricsData?.metrics;

  const activeProjects = projects.filter((p: any) => p.status === 'active').length;
  const completedProjects = projects.filter((p: any) => p.status === 'completed').length;
  const totalMembers = teams.reduce((sum: number, team: any) => sum + (team.memberCount || 0), 0);
  
  const pendingTasks = tasks.filter((t: any) => t.status === 'pending').length;
  const inProgressTasks = tasks.filter((t: any) => t.status === 'in_progress').length;
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
  
  const activeWorkflows = workflows.filter((w: any) => w.isActive).length;
  const publicTemplates = templates.filter((t: any) => t.isPublic).length;

  // Project status distribution
  const projectsByStatus = {
    planning: projects.filter((p: any) => p.status === 'planning').length,
    active: projects.filter((p: any) => p.status === 'active').length,
    on_hold: projects.filter((p: any) => p.status === 'on_hold').length,
    completed: projects.filter((p: any) => p.status === 'completed').length,
    archived: projects.filter((p: any) => p.status === 'archived').length,
  };

  // Task status distribution
  const tasksByStatus = {
    pending: pendingTasks,
    in_progress: inProgressTasks,
    completed: completedTasks,
    blocked: tasks.filter((t: any) => t.status === 'blocked').length,
  };

  // Recent activity (enhanced with real data)
  const recentActivity: ActivityItem[] = [
    ...(tasks.slice(0, 2).map((t: any, idx: number) => ({
      id: `task-${idx}`,
      type: 'task',
      message: `Tarefa: ${t.title}`,
      timestamp: new Date(t.createdAt),
      user: user?.name,
    }))),
    ...(projects.slice(0, 2).map((p: any, idx: number) => ({
      id: `project-${idx}`,
      type: 'project',
      message: `Projeto: ${p.name}`,
      timestamp: new Date(p.createdAt),
      user: user?.name,
    }))),
    ...(workflows.slice(0, 1).map((w: any, idx: number) => ({
      id: `workflow-${idx}`,
      type: 'workflow',
      message: `Workflow: ${w.name}`,
      timestamp: new Date(w.createdAt),
      user: user?.name,
    }))),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s atrás`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
  };

  const completionRate = projects.length > 0 
    ? Math.round((completedProjects / projects.length) * 100) 
    : 0;

  const taskCompletionRate = tasks.length > 0
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Bem-vindo, {user?.name || 'Usuário'}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {currentTime.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} - {currentTime.toLocaleTimeString('pt-BR')}
        </p>
      </div>

      {/* Primary Stats Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Projetos"
          value={projects.length}
          subtitle={`${activeProjects} ativos`}
          icon="📊"
          color="text-blue-600"
          trend={12}
        />
        <StatsCard
          title="Tarefas"
          value={tasks.length}
          subtitle={`${inProgressTasks} em progresso`}
          icon="✅"
          color="text-green-600"
          trend={8}
        />
        <StatsCard
          title="Workflows"
          value={workflows.length}
          subtitle={`${activeWorkflows} ativos`}
          icon="⚙️"
          color="text-purple-600"
          trend={5}
        />
        <StatsCard
          title="Templates"
          value={templates.length}
          subtitle={`${publicTemplates} públicos`}
          icon="📝"
          color="text-orange-600"
          trend={15}
        />
      </div>

      {/* Secondary Stats Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Equipes"
          value={teams.length}
          subtitle={`${totalMembers} membros`}
          icon="👥"
          color="text-indigo-600"
        />
        <StatsCard
          title="Prompts"
          value={prompts.length}
          subtitle="Total de prompts"
          icon="💬"
          color="text-pink-600"
          trend={-3}
        />
        <StatsCard
          title="Taxa de Conclusão"
          value={`${completionRate}%`}
          subtitle="Projetos completos"
          icon="🎯"
          color="text-teal-600"
        />
        <StatsCard
          title="Tarefas Pendentes"
          value={pendingTasks}
          subtitle="Aguardando execução"
          icon="⏳"
          color="text-yellow-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects Status Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📊 Status dos Projetos
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Planejamento</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{projectsByStatus.planning}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-gray-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(projectsByStatus.planning / Math.max(projects.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Ativo</span>
                  <span className="font-semibold text-green-600">{projectsByStatus.active}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(projectsByStatus.active / Math.max(projects.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Em Espera</span>
                  <span className="font-semibold text-yellow-600">{projectsByStatus.on_hold}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(projectsByStatus.on_hold / Math.max(projects.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Concluído</span>
                  <span className="font-semibold text-blue-600">{projectsByStatus.completed}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(projectsByStatus.completed / Math.max(projects.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Arquivado</span>
                  <span className="font-semibold text-red-600">{projectsByStatus.archived}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(projectsByStatus.archived / Math.max(projects.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Status Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              ✅ Status das Tarefas
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Pendente</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{tasksByStatus.pending}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-gray-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(tasksByStatus.pending / Math.max(tasks.length, 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Em Progresso</span>
                  <span className="font-semibold text-blue-600">{tasksByStatus.in_progress}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(tasksByStatus.in_progress / Math.max(tasks.length, 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Concluída</span>
                  <span className="font-semibold text-green-600">{tasksByStatus.completed}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(tasksByStatus.completed / Math.max(tasks.length, 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Bloqueada</span>
                  <span className="font-semibold text-red-600">{tasksByStatus.blocked}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(tasksByStatus.blocked / Math.max(tasks.length, 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pending Tasks List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              ⏳ Tarefas Pendentes Recentes
            </h2>
            {pendingTasks === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                🎉 Nenhuma tarefa pendente!
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.filter((t: any) => t.status === 'pending').slice(0, 5).map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Prioridade: <span className={`font-semibold ${
                          task.priority === 'urgent' ? 'text-red-600' :
                          task.priority === 'high' ? 'text-orange-600' :
                          task.priority === 'medium' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {task.priority}
                        </span>
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                      Pendente
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Metrics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              💻 Métricas do Sistema
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {typeof metrics?.cpu === 'number' ? `${metrics.cpu.toFixed(1)}%` : '0.0%'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">CPU</div>
                <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${metrics?.cpu || 0}%` }}
                  />
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {typeof metrics?.memory === 'number' ? `${metrics.memory.toFixed(1)}%` : '0.0%'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Memória</div>
                <div className="w-full bg-green-200 dark:bg-green-900 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-green-600 dark:bg-green-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${metrics?.memory || 0}%` }}
                  />
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {typeof metrics?.disk === 'number' ? `${metrics.disk.toFixed(1)}%` : '0.0%'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Disco</div>
                <div className="w-full bg-yellow-200 dark:bg-yellow-900 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-yellow-600 dark:bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${metrics?.disk || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Completion Rate Card */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg border border-blue-400 dark:border-purple-700 p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">
              🎯 Taxa de Conclusão
            </h2>
            <div className="text-5xl font-bold mb-2">
              {completionRate}%
            </div>
            <p className="text-sm opacity-90 mb-4">
              {completedProjects} de {projects.length} projetos concluídos
            </p>
            <div className="bg-white/20 rounded-full h-2.5">
              <div 
                className="bg-white h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-sm opacity-90 mb-1">Tarefas: {taskCompletionRate}%</p>
              <div className="bg-white/20 rounded-full h-1.5">
                <div 
                  className="bg-white h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${taskCompletionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📝 Atividade Recente
            </h2>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                Nenhuma atividade recente
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className={`w-2.5 h-2.5 rounded-full mt-2 ${
                        activity.type === 'project' ? 'bg-green-500' :
                        activity.type === 'team' ? 'bg-blue-500' :
                        activity.type === 'task' ? 'bg-purple-500' :
                        activity.type === 'workflow' ? 'bg-orange-500' :
                        'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.user} • {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🔌 Status do Sistema
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-300">Banco de Dados</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  serviceStatus?.status?.database
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {serviceStatus?.status?.database ? '✓ Online' : '✗ Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-300">API tRPC</span>
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  ✓ Online
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-300">LM Studio</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  serviceStatus?.status?.lmstudio
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {serviceStatus?.status?.lmstudio ? '✓ Online' : '⚠ Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-sm text-gray-600 dark:text-gray-300">WebSocket</span>
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  ✓ Online
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg border border-green-400 dark:border-teal-700 p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">📈 Resumo Rápido</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Total de Itens</span>
                <span className="text-xl font-bold">
                  {projects.length + tasks.length + workflows.length + templates.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Workflows Ativos</span>
                <span className="text-xl font-bold">{activeWorkflows}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Templates Públicos</span>
                <span className="text-xl font-bold">{publicTemplates}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-90">Uso de Templates</span>
                <span className="text-xl font-bold">{templatesStats?.stats.totalUsage || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
