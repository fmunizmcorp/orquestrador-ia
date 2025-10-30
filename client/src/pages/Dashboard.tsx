import { useEffect, useState } from 'react';
import { trpc } from '../lib/trpc';
import { 
  Activity, Brain, CheckCircle, AlertCircle, Cpu, HardDrive, 
  Server, TrendingUp, AlertTriangle, Zap
} from 'lucide-react';

// Componente de cartão de métrica
const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  subtitle 
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  subtitle?: string;
}) => (
  <div className="card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
      <Icon className={color.replace('text-', 'text-')} size={40} />
    </div>
  </div>
);

// Componente de barra de progresso
const ProgressBar = ({ 
  label, 
  value, 
  max = 100,
  color = 'blue',
  showPercentage = true
}: {
  label: string;
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  showPercentage?: boolean;
}) => {
  const percentage = (value / max) * 100;
  
  const colorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-300">{label}</span>
        {showPercentage && (
          <span className="text-sm text-gray-400">{value.toFixed(1)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div 
          className={`${colorClasses[color]} h-2.5 rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

// Componente de alerta
const AlertBadge = ({ 
  level, 
  message 
}: { 
  level: 'warning' | 'critical'; 
  message: string;
}) => {
  const colors = {
    warning: 'bg-yellow-600/20 text-yellow-400 border-yellow-600',
    critical: 'bg-red-600/20 text-red-400 border-red-600',
  };

  return (
    <div className={`px-3 py-2 rounded-lg border ${colors[level]} flex items-center gap-2 text-sm`}>
      <AlertTriangle size={16} />
      <span>{message}</span>
    </div>
  );
};

const Dashboard = () => {
  // Estados
  const [currentTime, setCurrentTime] = useState(new Date());

  // Queries
  const { data: taskStats } = trpc.tasks.stats.useQuery();
  const { data: systemMetrics, refetch: refetchMetrics } = trpc.systemMonitor.getMetrics.useQuery(
    undefined,
    { refetchInterval: 10000 } // Atualizar a cada 10s
  );
  const { data: alerts } = trpc.systemMonitor.getAlerts.useQuery(
    { includeResolved: false },
    { refetchInterval: 10000 }
  );
  const { data: averages } = trpc.systemMonitor.getAverages.useQuery(
    { minutes: 10 },
    { refetchInterval: 10000 }
  );

  // Atualizar relógio
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determinar cor baseada no uso
  const getUsageColor = (value: number): 'green' | 'yellow' | 'red' => {
    if (value < 60) return 'green';
    if (value < 80) return 'yellow';
    return 'red';
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {currentTime.toLocaleString('pt-BR')}
          </p>
        </div>
        <button
          onClick={() => refetchMetrics()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Activity size={16} />
          Atualizar
        </button>
      </div>

      {/* Alertas */}
      {alerts && alerts.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" />
            Alertas Ativos ({alerts.length})
          </h2>
          <div className="space-y-2">
            {alerts.map(alert => (
              <AlertBadge key={alert.id} level={alert.level} message={alert.message} />
            ))}
          </div>
        </div>
      )}

      {/* Estatísticas de Tarefas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total de Tarefas"
          value={taskStats?.total || 0}
          icon={Activity}
          color="text-blue-400"
        />
        <MetricCard
          title="Em Execução"
          value={taskStats?.executing || 0}
          icon={Brain}
          color="text-yellow-400"
          subtitle="Processando..."
        />
        <MetricCard
          title="Concluídas"
          value={taskStats?.completed || 0}
          icon={CheckCircle}
          color="text-green-400"
          subtitle={`${((taskStats?.completed || 0) / (taskStats?.total || 1) * 100).toFixed(0)}% do total`}
        />
        <MetricCard
          title="Falhadas"
          value={taskStats?.failed || 0}
          icon={AlertCircle}
          color="text-red-400"
        />
      </div>

      {/* Recursos do Sistema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU e RAM */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Cpu className="text-blue-500" />
            Processamento
          </h2>
          
          <ProgressBar
            label="CPU"
            value={systemMetrics?.cpu.usage || 0}
            color={getUsageColor(systemMetrics?.cpu.usage || 0)}
          />
          
          <ProgressBar
            label="RAM"
            value={systemMetrics?.memory.usagePercent || 0}
            color={getUsageColor(systemMetrics?.memory.usagePercent || 0)}
          />

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Cores</p>
              <p className="text-white font-semibold">{systemMetrics?.cpu.cores || 0}</p>
            </div>
            <div>
              <p className="text-gray-400">RAM Total</p>
              <p className="text-white font-semibold">
                {systemMetrics ? (systemMetrics.memory.total / 1024 / 1024 / 1024).toFixed(1) : 0} GB
              </p>
            </div>
          </div>

          {systemMetrics?.cpu.temperature && (
            <div className="mt-4 p-3 bg-blue-600/20 rounded-lg">
              <p className="text-sm text-gray-300">
                🌡️ Temperatura CPU: <span className="font-bold text-white">{systemMetrics.cpu.temperature.toFixed(1)}°C</span>
              </p>
            </div>
          )}
        </div>

        {/* GPU e Disco */}
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Server className="text-purple-500" />
            Armazenamento & GPU
          </h2>

          <ProgressBar
            label="Disco"
            value={systemMetrics?.disk.usagePercent || 0}
            color={getUsageColor(systemMetrics?.disk.usagePercent || 0)}
          />

          {systemMetrics?.gpu && systemMetrics.gpu.length > 0 && (
            <>
              {systemMetrics.gpu.map((gpu, idx) => (
                <div key={idx} className="mb-4">
                  <ProgressBar
                    label={`VRAM GPU ${idx} (${gpu.model.substring(0, 20)}...)`}
                    value={gpu.vramUsagePercent}
                    color={getUsageColor(gpu.vramUsagePercent)}
                  />
                  {gpu.temperature && (
                    <p className="text-xs text-gray-400 mt-1">
                      🌡️ {gpu.temperature}°C
                      {gpu.utilization !== null && ` • Uso: ${gpu.utilization}%`}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Disco Livre</p>
              <p className="text-white font-semibold">
                {systemMetrics ? (systemMetrics.disk.free / 1024 / 1024 / 1024).toFixed(1) : 0} GB
              </p>
            </div>
            <div>
              <p className="text-gray-400">Disco Total</p>
              <p className="text-white font-semibold">
                {systemMetrics ? (systemMetrics.disk.total / 1024 / 1024 / 1024).toFixed(1) : 0} GB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Médias Históricas */}
      {averages && (
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-500" />
            Médias (últimos 10 minutos)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">CPU Média</p>
              <p className="text-2xl font-bold text-white">{averages.cpu.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">RAM Média</p>
              <p className="text-2xl font-bold text-white">{averages.memory.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <p className="text-gray-400 text-sm">Disco Médio</p>
              <p className="text-2xl font-bold text-white">{averages.disk.toFixed(1)}%</p>
            </div>
            {averages.gpu && averages.gpu.length > 0 && (
              <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm">VRAM Média</p>
                <p className="text-2xl font-bold text-white">{averages.gpu[0].toFixed(1)}%</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Processos */}
      {systemMetrics?.processes.lmstudio && (
        <div className="card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-green-500" />
            LM Studio Ativo
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-400">PID</p>
              <p className="text-white font-semibold">{systemMetrics.processes.pid}</p>
            </div>
            <div>
              <p className="text-gray-400">CPU</p>
              <p className="text-white font-semibold">
                {systemMetrics.processes.cpuUsage?.toFixed(1) || 0}%
              </p>
            </div>
            <div>
              <p className="text-gray-400">RAM</p>
              <p className="text-white font-semibold">
                {systemMetrics.processes.memUsage?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
