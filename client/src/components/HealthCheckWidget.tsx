/**
 * Health Check Dashboard Widget
 * Real-time system health monitoring widget
 * Sprint 26 - Frontend Integration
 * 
 * Features:
 * - Overall system status
 * - Database connectivity
 * - LM Studio status
 * - Models loaded count
 * - Auto-refresh
 * - Expandable details
 */

import { useState, useEffect } from 'react';

interface HealthData {
  status: 'ok' | 'degraded' | 'error' | 'loading';
  database: 'connected' | 'error' | 'unknown';
  system: 'healthy' | 'issues' | 'unknown';
  lmStudio: {
    status: 'ok' | 'no_models' | 'unreachable' | 'unknown';
    modelsLoaded: number;
  };
  timestamp: string;
}

interface HealthCheckWidgetProps {
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
  compact?: boolean;
}

export default function HealthCheckWidget({
  autoRefresh = true,
  refreshInterval = 30,
  compact = false,
}: HealthCheckWidgetProps) {
  const [health, setHealth] = useState<HealthData>({
    status: 'loading',
    database: 'unknown',
    system: 'unknown',
    lmStudio: {
      status: 'unknown',
      modelsLoaded: 0,
    },
    timestamp: new Date().toISOString(),
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchHealth = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/health');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setHealth(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao buscar status');
      setHealth(prev => ({
        ...prev,
        status: 'error',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchHealth();

    // Auto-refresh
    if (autoRefresh) {
      const interval = setInterval(fetchHealth, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
      case 'connected':
      case 'healthy':
        return 'text-green-600 dark:text-green-400';
      case 'degraded':
      case 'issues':
      case 'no_models':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
      case 'unreachable':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
      case 'connected':
      case 'healthy':
        return '✓';
      case 'degraded':
      case 'issues':
      case 'no_models':
        return '⚠';
      case 'error':
      case 'unreachable':
        return '✗';
      case 'loading':
        return '⏳';
      default:
        return '?';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('pt-BR');
    } catch {
      return '-';
    }
  };

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className={`text-lg ${getStatusColor(health.status)}`}>
          {getStatusIcon(health.status)}
        </div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Sistema: {health.status === 'ok' ? 'OK' : health.status === 'error' ? 'Erro' : health.status === 'loading' ? 'Carregando...' : 'Degradado'}
        </span>
        <button
          onClick={fetchHealth}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
          title="Atualizar status"
        >
          <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${getStatusColor(health.status)}`}>
              {getStatusIcon(health.status)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Status do Sistema
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Última atualização: {formatTimestamp(health.timestamp)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchHealth}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
              title="Atualizar"
            >
              <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              title={isExpanded ? 'Recolher' : 'Expandir'}
            >
              <svg className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Overall Status */}
      <div className="p-4">
        <div className={`text-center py-3 rounded-lg border-2 ${
          health.status === 'ok' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : health.status === 'error'
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : health.status === 'loading'
            ? 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        }`}>
          <p className={`text-lg font-bold ${getStatusColor(health.status)}`}>
            {health.status === 'ok' ? 'Sistema Operacional' : health.status === 'error' ? 'Sistema com Erro' : health.status === 'loading' ? 'Verificando...' : 'Sistema Degradado'}
          </p>
        </div>

        {error && (
          <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
            <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Detailed Status - Expandable */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-3">
          {/* Database */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div className="flex items-center gap-2">
              <span className={`text-lg ${getStatusColor(health.database)}`}>
                {getStatusIcon(health.database)}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Banco de Dados
              </span>
            </div>
            <span className={`text-xs font-semibold ${getStatusColor(health.database)}`}>
              {health.database === 'connected' ? 'Conectado' : 'Erro'}
            </span>
          </div>

          {/* System */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div className="flex items-center gap-2">
              <span className={`text-lg ${getStatusColor(health.system)}`}>
                {getStatusIcon(health.system)}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Monitoramento
              </span>
            </div>
            <span className={`text-xs font-semibold ${getStatusColor(health.system)}`}>
              {health.system === 'healthy' ? 'Saudável' : 'Com Problemas'}
            </span>
          </div>

          {/* LM Studio */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <div className="flex items-center gap-2">
              <span className={`text-lg ${getStatusColor(health.lmStudio.status)}`}>
                {getStatusIcon(health.lmStudio.status)}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                LM Studio
              </span>
            </div>
            <div className="text-right">
              <span className={`text-xs font-semibold ${getStatusColor(health.lmStudio.status)} block`}>
                {health.lmStudio.status === 'ok' ? 'Conectado' : health.lmStudio.status === 'no_models' ? 'Sem Modelos' : 'Inacessível'}
              </span>
              {health.lmStudio.modelsLoaded > 0 && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {health.lmStudio.modelsLoaded} modelo{health.lmStudio.modelsLoaded !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
