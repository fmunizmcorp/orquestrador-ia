import { trpc } from '../lib/trpc';

export default function Monitoring() {
  // Conectar ao tRPC para dados reais
  const { data: metricsData, isLoading: metricsLoading } = trpc.monitoring.getCurrentMetrics.useQuery();
  const { data: serviceStatus, isLoading: statusLoading } = trpc.monitoring.getServiceStatus.useQuery();
  const { data: errorLogs, isLoading: logsLoading } = trpc.monitoring.getErrorLogs.useQuery({
    limit: 10,
    hours: 1,
  });

  const loading = metricsLoading || statusLoading || logsLoading;
  const metrics = metricsData?.metrics;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Monitoramento do Sistema</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Acompanhe métricas, logs e performance em tempo real
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Carregando métricas...</p>
        </div>
      ) : (
        <>
          {/* Métricas do Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">CPU</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof metrics?.cpu === 'number' ? `${metrics.cpu.toFixed(1)}%` : '0.0%'}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${metrics?.cpu || 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Memória</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof metrics?.memory === 'number' ? `${metrics.memory.toFixed(1)}%` : '0.0%'}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${metrics?.memory || 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Disco</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {typeof metrics?.disk === 'number' ? `${metrics.disk.toFixed(1)}%` : '0.0%'}
                  </p>
                </div>
                <div className="bg-yellow-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${metrics?.disk || 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Conexões</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metrics?.connections || 0}
                  </p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Ativas no momento</p>
            </div>
          </div>

          {/* Logs e Alertas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Logs Recentes</h2>
              </div>
              <div className="p-6">
                {errorLogs?.logs && errorLogs.logs.length > 0 ? (
                  <div className="space-y-3">
                    {errorLogs.logs.slice(0, 5).map((log: any, index: number) => (
                      <div key={log.id || index} className="flex items-start gap-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          log.level === 'error' ? 'bg-red-100 text-red-800' :
                          log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {log.level?.toUpperCase() || 'INFO'}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">{log.message || 'Sem mensagem'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {log.timestamp ? new Date(log.timestamp).toLocaleString('pt-BR') : 'Sem data'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">Nenhum log recente</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Status dos Serviços</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-white">Banco de Dados</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      serviceStatus?.status?.database ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {serviceStatus?.status?.database ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-white">LM Studio</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      serviceStatus?.status?.lmstudio ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {serviceStatus?.status?.lmstudio ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-white">API tRPC</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-white">Redis</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      serviceStatus?.status?.redis ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {serviceStatus?.status?.redis ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
