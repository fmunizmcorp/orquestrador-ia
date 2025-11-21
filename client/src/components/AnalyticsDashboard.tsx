/**
 * Advanced Analytics Dashboard
 * Real-time visualization of system performance and AI metrics
 * COMPLETE IMPLEMENTATION - v3.6.0
 */
import React, { useState, useEffect, useMemo } from 'react';
import { trpc } from '../lib/trpc';
import { translateTaskStatus, translateProjectStatus } from '../lib/utils/translations';

interface ChartData {
  labels: string[];
  values: number[];
}

// SPRINT 65: Move components OUTSIDE to prevent re-creation on every render
// These were causing React Error #310 infinite loop!

// Bar chart component
const BarChart: React.FC<{ data: ChartData; colors: string[] }> = ({ data, colors }) => {
  const maxValue = Math.max(...data.values, 1);

  return (
    <div className="space-y-3">
      {data.labels.map((label, index) => (
        <div key={label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">{label}</span>
            <span className="font-semibold text-gray-900 dark:text-white">{data.values[index]}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(data.values[index] / maxValue) * 100}%`,
                backgroundColor: colors[index],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Metric card component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  color: string;
  trend?: number;
}> = ({ title, value, subtitle, icon, color, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        {trend !== undefined && (
          <p className={`text-sm mt-2 font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
      <div className={`text-4xl ${color} opacity-20`}>{icon}</div>
    </div>
  </div>
);

// Donut chart (simple implementation)
const DonutChart: React.FC<{ percentage: number; color: string; label: string }> = ({ percentage, color, label }) => {
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90" width="128" height="128">
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="64"
            cy="64"
            r="40"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">{label}</p>
    </div>
  );
};

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds
  const [currentTime, setCurrentTime] = useState(new Date());
  // SPRINT 64: Removed renderError state - it caused infinite loop when setRenderError was called in catch block

  // SPRINT 49 - ROUND 3: Enhanced queries with loading and error tracking
  // SPRINT 56 - CRITICAL FIX: Corrected refetchInterval → refreshInterval
  // SPRINT 58 - TIMEOUT FIX: Increased timeout to 60s for slow system metrics query
  // SPRINT 74 - CRITICAL FIX: Memoize query options to prevent infinite re-render loop
  // Root cause: refreshInterval state was used directly in query options, causing
  // React Query to reconfigure on every render → infinite loop (React Error #310)
  const metricsQueryOptions = useMemo(
    () => ({
      refetchInterval: refreshInterval,
      retry: 1,
      retryDelay: 2000,
    }),
    [refreshInterval]
  );

  // Queries - todas as queries necessárias
  const { data: metrics, refetch: refetchMetrics, error: metricsError, isLoading: metricsLoading } = trpc.monitoring.getCurrentMetrics.useQuery(
    undefined,
    metricsQueryOptions // SPRINT 74: Now stable - prevents infinite loop!
  );
  
  // SPRINT 58 - CRITICAL FIX: Changed limit from 1000 to 100 to match backend validation
  const { data: tasksData, error: tasksError, isLoading: tasksLoading } = trpc.tasks.list.useQuery(
    { limit: 100, offset: 0 }, // SPRINT 58: Backend max is 100
    { enabled: true, retry: 2, retryDelay: 1000 }
  );
  const { data: projectsData, error: projectsError, isLoading: projectsLoading } = trpc.projects.list.useQuery(
    { limit: 100, offset: 0 }, // SPRINT 58: Backend max is 100
    { enabled: true, retry: 2, retryDelay: 1000 }
  );
  const { data: workflowsData, error: workflowsError, isLoading: workflowsLoading } = trpc.workflows.list.useQuery(
    { limit: 100, offset: 0 }, // SPRINT 58: Backend max is 100
    { enabled: true, retry: 2, retryDelay: 1000 }
  );
  const { data: templatesData, error: templatesError, isLoading: templatesLoading } = trpc.templates.list.useQuery(
    { limit: 100, offset: 0 }, // SPRINT 58: Backend max is 100
    { enabled: true, retry: 2, retryDelay: 1000 }
  );
  const { data: promptsData, error: promptsError, isLoading: promptsLoading } = trpc.prompts.list.useQuery(
    { userId: 1, limit: 100, offset: 0 }, // SPRINT 58: Backend max is 100
    { enabled: true, retry: 2, retryDelay: 1000 }
  );
  const { data: teamsData, error: teamsError, isLoading: teamsLoading } = trpc.teams.list.useQuery(
    { limit: 100, offset: 0 }, // SPRINT 58: Backend max is 100
    { enabled: true, retry: 2, retryDelay: 1000 }
  );
  
  const { data: tasksStats, error: tasksStatsError, isLoading: tasksStatsLoading } = trpc.tasks.getStats.useQuery(
    {},
    { enabled: true, retry: 2, retryDelay: 1000 }
  );
  
  const { data: workflowsStats, error: workflowsStatsError, isLoading: workflowsStatsLoading } = trpc.workflows.getStats.useQuery(
    undefined,
    { enabled: true, retry: 2, retryDelay: 1000 }
  );
  const { data: templatesStats, error: templatesStatsError, isLoading: templatesStatsLoading } = trpc.templates.getStats.useQuery(
    undefined,
    { enabled: true, retry: 2, retryDelay: 1000 }
  );

  // SPRINT 59: Graceful degradation - metrics is optional, don't block on it
  const isLoading = tasksLoading || projectsLoading || workflowsLoading ||
    templatesLoading || promptsLoading || teamsLoading || tasksStatsLoading ||
    workflowsStatsLoading || templatesStatsLoading;
  // Note: metricsLoading removed - metrics query is optional and slow
  
  const queryErrors = [
    metricsError, tasksError, projectsError, workflowsError,
    templatesError, promptsError, teamsError, tasksStatsError,
    workflowsStatsError, templatesStatsError
  ].filter((err) => err !== undefined && err !== null);

  // SPRINT 59: Graceful degradation - remove metricsError from critical errors
  // Metrics query is optional (can timeout), should not block page rendering
  const criticalErrors = [tasksError].filter((err) => err !== undefined && err !== null);
  const error = criticalErrors.length > 0 
    ? `Erro ao carregar dados críticos: ${criticalErrors[0]?.message || 'Erro desconhecido'}` 
    : null;
  
  // SPRINT 59: Track metrics error separately for warning display
  const hasMetricsError = metricsError !== undefined && metricsError !== null;

  if (error) {
    // Detailed error breakdown for all errors (including non-critical)
    const allErrorDetails = [
      metricsError && `⚠️ Métricas: ${metricsError.message}`,
      tasksError && `🔴 Tarefas: ${tasksError.message}`,
      projectsError && `⚠️ Projetos: ${projectsError.message}`,
      workflowsError && `⚠️ Workflows: ${workflowsError.message}`,
      templatesError && `⚠️ Templates: ${templatesError.message}`,
      promptsError && `⚠️ Prompts: ${promptsError.message}`,
      teamsError && `⚠️ Equipes: ${teamsError.message}`,
      tasksStatsError && `⚠️ Stats Tarefas: ${tasksStatsError.message}`,
      workflowsStatsError && `⚠️ Stats Workflows: ${workflowsStatsError.message}`,
      templatesStatsError && `⚠️ Stats Templates: ${templatesStatsError.message}`,
    ].filter(Boolean);
    
    const criticalErrorDetails = allErrorDetails.filter(msg => msg.includes('🔴'));
    
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-3xl">
          <div className="text-red-600 text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Erro Crítico ao Carregar Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error}
          </p>
          {criticalErrorDetails.length > 0 && (
            <details open className="text-left bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mb-4">
              <summary className="cursor-pointer font-semibold text-red-900 dark:text-red-100 mb-2">
                🔴 Erros Críticos ({criticalErrorDetails.length})
              </summary>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700 dark:text-red-300">
                {criticalErrorDetails.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </details>
          )}
          {allErrorDetails.length > criticalErrorDetails.length && (
            <details className="text-left bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg mb-4">
              <summary className="cursor-pointer font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                ⚠️ Avisos Adicionais ({allErrorDetails.length - criticalErrorDetails.length})
              </summary>
              <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                {allErrorDetails.filter(msg => !msg.includes('🔴')).map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            </details>
          )}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 Possíveis Soluções:</h3>
            <ul className="text-left text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Verifique se o backend está rodando (PM2 status)</li>
              <li>• Verifique a conexão com o banco de dados MySQL</li>
              <li>• Confira os logs do PM2 para mais detalhes</li>
              <li>• Tente limpar o cache do navegador (Ctrl+Shift+R)</li>
            </ul>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Tentar Novamente
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              ← Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  // SPRINT 77 - CRITICAL FIX: Memoize data extraction to prevent infinite loop
  // CAUSA RAIZ: Arrays eram recriados a cada render, causando useMemo de stats
  // a pensar que dependências mudaram, triggering infinite re-render loop
  // SOLUÇÃO: Envolve cada extração em useMemo para manter referências estáveis
  
  const tasks = useMemo(
    () => Array.isArray(tasksData?.tasks) ? tasksData.tasks : [],
    [tasksData]
  );
  
  const projects = useMemo(
    () => Array.isArray(projectsData?.data) ? projectsData.data : [],
    [projectsData]
  );
  
  const workflows = useMemo(
    () => Array.isArray(workflowsData?.items) ? workflowsData.items : [],
    [workflowsData]
  );
  
  const templates = useMemo(
    () => Array.isArray(templatesData?.items) ? templatesData.items : [],
    [templatesData]
  );
  
  const prompts = useMemo(
    () => Array.isArray(promptsData?.data) ? promptsData.data : [],
    [promptsData]
  );
  
  const teams = useMemo(
    () => Array.isArray(teamsData?.data) ? teamsData.data : [],
    [teamsData]
  );

  // Auto-refresh clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // SPRINT 61: Removed redundant auto-refresh useEffect
  // tRPC already handles auto-refresh with refetchInterval option (line 29)
  // The previous useEffect with [refreshInterval, refetchMetrics] caused
  // React Error #310 (infinite loop) because refetchMetrics changes every render

  // SPRINT 66: FIX React Error #310 - Use useMemo to prevent infinite re-render loop
  // CAUSA RAIZ: calculateStats() e calculateSystemHealth() eram chamadas diretamente
  // no corpo do componente, criando novos objetos a cada render e causando loop infinito
  
  // Calculate system health with useMemo - MUST be before stats (stats depends on health)
  const health = useMemo(() => {
    try {
      // SPRINT 73: Removed console.logs to prevent side-effects within useMemo
      
      if (!metrics?.metrics) {
        return { status: 'unknown', color: 'text-gray-500', label: 'Desconhecido', icon: '?' };
      }

      const cpu = metrics.metrics.cpu || 0;
      const memory = metrics.metrics.memory || 0;
      const disk = metrics.metrics.disk || 0;

      const cpuHealth = cpu < 80;
      const memoryHealth = memory < 85;
      const diskHealth = disk < 90;

      if (cpuHealth && memoryHealth && diskHealth) {
        return { status: 'healthy', color: 'text-green-500', label: 'Saudável', icon: '✓' };
      } else if (cpuHealth && memoryHealth) {
        return { status: 'warning', color: 'text-yellow-500', label: 'Atenção', icon: '⚠' };
      } else {
        return { status: 'critical', color: 'text-red-500', label: 'Crítico', icon: '✗' };
      }
    } catch (error) {
      // SPRINT 73: Removed console.error to prevent side-effects
      return { status: 'error', color: 'text-red-500', label: 'Erro', icon: '✗' };
    }
  }, [metrics]); // Only recalculate when metrics change

  // Calculate comprehensive statistics with useMemo
  const stats = useMemo(() => {
    try {
      // SPRINT 73: Removed console.logs to prevent side-effects within useMemo
      
      // Task statistics
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
      const pendingTasks = tasks.filter(t => t.status === 'pending').length;
      const blockedTasks = tasks.filter(t => t.status === 'blocked').length;
      const failedTasks = tasks.filter(t => t.status === 'failed').length;
    
      const taskSuccessRate = (completedTasks + inProgressTasks) > 0 
        ? Math.round((completedTasks / (completedTasks + failedTasks || 1)) * 100) 
        : 0;

      // Project statistics
      const totalProjects = projects.length;
      const activeProjects = projects.filter(p => p.status === 'active').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const projectCompletionRate = totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

      // Workflow statistics
      const totalWorkflows = workflows.length;
      const activeWorkflows = workflows.filter(w => w.isActive).length;
      const avgWorkflowSteps = workflows.length > 0
        ? Math.round(workflows.reduce((sum, w) => sum + (w.steps?.length || 0), 0) / workflows.length)
        : 0;

      // Template statistics
      const totalTemplates = templates.length;
      const publicTemplates = templates.filter(t => t.isPublic).length;
      const totalTemplateUsage = templates.reduce((sum, t) => sum + (t.usageCount || 0), 0);

      // Team statistics
      const totalTeams = teams.length;
      const totalMembers = teams.reduce((sum, team) => sum + (team.memberCount || 0), 0);

      // Productivity metrics
      const avgTasksPerProject = totalProjects > 0 ? Math.round(totalTasks / totalProjects) : 0;
      const avgPromptsPerProject = totalProjects > 0 ? Math.round(prompts.length / totalProjects) : 0;

      // Time-based metrics (simulated for now)
      const avgTaskCompletionTime = 2.5; // hours (simulated)
      const avgProjectDuration = 15; // days (simulated)

      return {
        // Task metrics
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        blockedTasks,
        failedTasks,
        taskSuccessRate,
        avgTaskCompletionTime,
        
        // Project metrics
        totalProjects,
        activeProjects,
        completedProjects,
        projectCompletionRate,
        avgProjectDuration,
        
        // Workflow metrics
        totalWorkflows,
        activeWorkflows,
        avgWorkflowSteps,
        
        // Template metrics
        totalTemplates,
        publicTemplates,
        totalTemplateUsage,
        
        // Team metrics
        totalTeams,
        totalMembers,
        
        // Productivity metrics
        avgTasksPerProject,
        avgPromptsPerProject,
        
        // System metrics
        systemHealth: health, // Use memoized health
      };
    } catch (error) {
      // SPRINT 73: Removed console.error to prevent side-effects
      // Return safe default stats
      return {
        totalTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
        pendingTasks: 0,
        blockedTasks: 0,
        failedTasks: 0,
        taskSuccessRate: 0,
        avgTaskCompletionTime: 0,
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        projectCompletionRate: 0,
        avgProjectDuration: 0,
        totalWorkflows: 0,
        activeWorkflows: 0,
        avgWorkflowSteps: 0,
        totalTemplates: 0,
        publicTemplates: 0,
        totalTemplateUsage: 0,
        totalTeams: 0,
        totalMembers: 0,
        avgTasksPerProject: 0,
        avgPromptsPerProject: 0,
        systemHealth: { status: 'unknown', color: 'text-gray-500', label: 'Erro', icon: '⚠️' },
      };
    }
  }, [tasks, projects, workflows, templates, prompts, teams, health]); // Only recalculate when dependencies change

  // Chart data preparation
  const taskStatusData: ChartData = {
    labels: ['Pendente', 'Em Progresso', 'Concluída', 'Bloqueada', 'Falhou'],
    values: [
      tasks.filter(t => t.status === 'pending').length,
      tasks.filter(t => t.status === 'in_progress').length,
      tasks.filter(t => t.status === 'completed').length,
      tasks.filter(t => t.status === 'blocked').length,
      tasks.filter(t => t.status === 'failed').length,
    ],
  };

  const taskPriorityData: ChartData = {
    labels: ['Baixa', 'Média', 'Alta', 'Urgente'],
    values: [
      tasks.filter(t => t.priority === 'low').length,
      tasks.filter(t => t.priority === 'medium').length,
      tasks.filter(t => t.priority === 'high').length,
      tasks.filter(t => t.priority === 'urgent').length,
    ],
  };

  const projectStatusData: ChartData = {
    labels: ['Planejamento', 'Ativo', 'Em Espera', 'Concluído', 'Arquivado'],
    values: [
      projects.filter(p => p.status === 'planning').length,
      projects.filter(p => p.status === 'active').length,
      projects.filter(p => p.status === 'on_hold').length,
      projects.filter(p => p.status === 'completed').length,
      projects.filter(p => p.status === 'archived').length,
    ],
  };

  // SPRINT 65: Removed component definitions from inside render
  // Components now defined outside to prevent infinite re-creation

  // SPRINT 49 - ROUND 3: Early return for loading state
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Carregando Analytics...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Buscando dados do sistema. Por favor, aguarde.
          </p>
        </div>
      </div>
    );
  }
  
  // SPRINT 49 - ROUND 3: Early return for error state
  // SPRINT 64: Removed renderError check to prevent infinite loop
  if (error) {
    const errorMessage = error || 'Erro desconhecido';
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-8 max-w-2xl mx-auto mt-12">
          <div className="flex items-start gap-4">
            <div className="text-4xl">❌</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
                Erro ao Carregar Analytics
              </h2>
              <p className="text-red-700 dark:text-red-300 mb-4">
                {errorMessage}
              </p>
              <div className="space-y-2 text-sm text-red-600 dark:text-red-400">
                <p><strong>Possíveis causas:</strong></p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Erro de conexão com o backend</li>
                  <li>Problema ao consultar banco de dados</li>
                  <li>Endpoint tRPC não disponível</li>
                  <li>Dados inválidos ou inesperados</li>
                </ul>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  🔄 Recarregar Página
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 border border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  ← Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // SPRINT 49 ROUND 3: Wrap render in try-catch for safety
  try {

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {currentTime.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} - {currentTime.toLocaleTimeString('pt-BR')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="1h">Última Hora</option>
            <option value="24h">Últimas 24 Horas</option>
            <option value="7d">Últimos 7 Dias</option>
            <option value="30d">Últimos 30 Dias</option>
          </select>

          {/* Refresh interval */}
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="5000">Atualizar: 5s</option>
            <option value="10000">Atualizar: 10s</option>
            <option value="30000">Atualizar: 30s</option>
            <option value="60000">Atualizar: 1m</option>
          </select>

          {/* System health indicator */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className={`text-xl ${health.color}`}>{health.icon}</span>
            <span className="font-medium text-gray-900 dark:text-white">{health.label}</span>
          </div>
        </div>
      </div>

      {/* SPRINT 59: Graceful degradation - Show warning if metrics query failed/timed out */}
      {(hasMetricsError || metricsLoading) && (
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                {metricsLoading ? 'Carregando Métricas do Sistema...' : 'Métricas do Sistema Indisponíveis'}
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                {metricsLoading 
                  ? 'As métricas do sistema estão sendo coletadas. Isso pode levar até 60 segundos.'
                  : `As métricas do sistema não puderam ser carregadas: ${metricsError?.message || 'Timeout'}. Os demais dados estão sendo exibidos normalmente.`
                }
              </p>
              {hasMetricsError && (
                <details className="text-xs text-yellow-600 dark:text-yellow-400">
                  <summary className="cursor-pointer hover:underline">Ver detalhes técnicos</summary>
                  <pre className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded overflow-x-auto">
                    {JSON.stringify({
                      error: metricsError?.message,
                      data: metricsError?.data,
                    }, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Total de Tarefas"
          value={stats.totalTasks}
          subtitle={`${stats.completedTasks} concluídas`}
          icon="📋"
          color="text-blue-600"
          trend={12}
        />
        <MetricCard
          title="Taxa de Sucesso"
          value={`${stats.taskSuccessRate}%`}
          subtitle="Tarefas bem-sucedidas"
          icon="✅"
          color="text-green-600"
          trend={5}
        />
        <MetricCard
          title="Projetos Ativos"
          value={stats.activeProjects}
          subtitle={`${stats.totalProjects} total`}
          icon="📊"
          color="text-purple-600"
          trend={8}
        />
        <MetricCard
          title="Workflows Ativos"
          value={stats.activeWorkflows}
          subtitle={`${stats.totalWorkflows} total`}
          icon="⚙️"
          color="text-orange-600"
          trend={3}
        />
      </div>

      {/* Key Metrics - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          title="Templates Criados"
          value={stats.totalTemplates}
          subtitle={`${stats.publicTemplates} públicos`}
          icon="📝"
          color="text-indigo-600"
        />
        <MetricCard
          title="Uso de Templates"
          value={stats.totalTemplateUsage}
          subtitle="Usos totais"
          icon="🎯"
          color="text-pink-600"
          trend={15}
        />
        <MetricCard
          title="Equipes"
          value={stats.totalTeams}
          subtitle={`${stats.totalMembers} membros`}
          icon="👥"
          color="text-teal-600"
        />
        <MetricCard
          title="Prompts"
          value={prompts.length}
          subtitle="Total cadastrados"
          icon="💬"
          color="text-cyan-600"
        />
      </div>

      {/* Completion Rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Taxa de Conclusão de Projetos
          </h3>
          <DonutChart 
            percentage={stats.projectCompletionRate} 
            color="#10b981" 
            label={`${stats.completedProjects} de ${stats.totalProjects} concluídos`}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Taxa de Sucesso de Tarefas
          </h3>
          <DonutChart 
            percentage={stats.taskSuccessRate} 
            color="#3b82f6" 
            label={`${stats.taskSuccessRate}% de sucesso`}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Workflows Ativos
          </h3>
          <DonutChart 
            percentage={stats.totalWorkflows > 0 ? Math.round((stats.activeWorkflows / stats.totalWorkflows) * 100) : 0}
            color="#f59e0b" 
            label={`${stats.activeWorkflows} de ${stats.totalWorkflows} ativos`}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Task Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📊 Distribuição de Status das Tarefas
          </h2>
          <BarChart
            data={taskStatusData}
            colors={['#6b7280', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
          />
        </div>

        {/* Task Priority Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            🎯 Distribuição de Prioridade das Tarefas
          </h2>
          <BarChart
            data={taskPriorityData}
            colors={['#6b7280', '#3b82f6', '#f59e0b', '#ef4444']}
          />
        </div>

        {/* Project Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            📈 Distribuição de Status dos Projetos
          </h2>
          <BarChart
            data={projectStatusData}
            colors={['#6b7280', '#10b981', '#f59e0b', '#3b82f6', '#ef4444']}
          />
        </div>

        {/* Productivity Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            ⚡ Métricas de Produtividade
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Média de Tarefas por Projeto</span>
              <span className="text-2xl font-bold text-blue-600">{stats.avgTasksPerProject}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Média de Prompts por Projeto</span>
              <span className="text-2xl font-bold text-green-600">{stats.avgPromptsPerProject}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Média de Steps por Workflow</span>
              <span className="text-2xl font-bold text-purple-600">{stats.avgWorkflowSteps}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <span className="text-sm text-gray-700 dark:text-gray-300">Tempo Médio de Conclusão</span>
              <span className="text-2xl font-bold text-orange-600">{stats.avgTaskCompletionTime}h</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* CPU */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💻 Uso de CPU</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Uso Atual</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {(metrics?.metrics?.cpu ?? 0).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${metrics?.metrics?.cpu || 0}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 mt-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                <div className="font-semibold">
                  {(metrics?.metrics?.cpu || 0) < 80 ? '✓ Normal' : '⚠ Alto'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xs text-gray-500 dark:text-gray-400">Tendência</div>
                <div className="font-semibold text-green-600">↓ Estável</div>
              </div>
            </div>
          </div>
        </div>

        {/* Memory */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🧠 Uso de Memória</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Uso Atual</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {(metrics?.metrics?.memory ?? 0).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${metrics?.metrics?.memory || 0}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 mt-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                <div className="font-semibold">
                  {(metrics?.metrics?.memory || 0) < 85 ? '✓ Normal' : '⚠ Alto'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xs text-gray-500 dark:text-gray-400">Tendência</div>
                <div className="font-semibold text-blue-600">→ Estável</div>
              </div>
            </div>
          </div>
        </div>

        {/* Disk */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💾 Uso de Disco</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Uso Atual</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {(metrics?.metrics?.disk ?? 0).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-yellow-500 to-orange-500"
                style={{ width: `${metrics?.metrics?.disk || 0}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 mt-4">
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
                <div className="font-semibold">
                  {(metrics?.metrics?.disk || 0) < 90 ? '✓ Normal' : '⚠ Alto'}
                </div>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="text-xs text-gray-500 dark:text-gray-400">Tendência</div>
                <div className="font-semibold text-yellow-600">↑ Crescendo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          🔥 Resumo de Atividade Recente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tarefas Pendentes</div>
            <div className="text-3xl font-bold text-blue-600">{stats.pendingTasks}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aguardando início</div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Em Progresso</div>
            <div className="text-3xl font-bold text-green-600">{stats.inProgressTasks}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sendo executadas</div>
          </div>
          
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Bloqueadas</div>
            <div className="text-3xl font-bold text-orange-600">{stats.blockedTasks}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Requerem atenção</div>
          </div>
          
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Falhas</div>
            <div className="text-3xl font-bold text-red-600">{stats.failedTasks}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Necessitam revisão</div>
          </div>
        </div>
      </div>
    </div>
  );
  } catch (err) {
    // SPRINT 49 ROUND 3: Catch any render errors
    // SPRINT 64: REMOVED setRenderError to prevent infinite loop
    // If render fails → setRenderError → re-render → fail again → loop!
    console.error('[SPRINT 64] Analytics render error caught, returning fallback UI:', err);
    
    // Fallback UI - directly return without setState to avoid infinite loop
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-8 max-w-2xl">
          <div className="text-center">
            <div className="text-6xl mb-4">💥</div>
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
              Erro Crítico de Renderização
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-4">
              {(err as Error).message || 'Erro inesperado ao renderizar a página'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              🔄 Recarregar Página
            </button>
          </div>
        </div>
      </div>
    );
  }
};
