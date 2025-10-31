/**
 * Advanced Analytics Dashboard
 * Real-time visualization of system performance and AI metrics
 */
import React, { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

interface ChartData {
  labels: string[];
  values: number[];
}

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [refreshInterval, setRefreshInterval] = useState(10000); // 10 seconds

  const { data: metrics, refetch } = trpc.monitoring.getMetrics.useQuery(
    undefined,
    { refetchInterval }
  );

  const { data: tasks } = trpc.tasks.list.useQuery({ limit: 100, offset: 0 });
  // executionLogs router not available in current tRPC setup
  // const { data: executionLogs } = trpc.executionLogs.list.useQuery({ limit: 100 });

  // Auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, refetch]);

  // Calculate statistics
  const calculateStats = () => {
    if (!tasks || !executionLogs) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        successRate: 0,
        avgExecutionTime: 0,
        totalTokensUsed: 0,
      };
    }

    const completed = tasks.filter(t => t.status === 'completed').length;
    const failed = tasks.filter(t => t.status === 'failed').length;
    const successRate = tasks.length > 0 ? (completed / (completed + failed)) * 100 : 0;

    const executionTimes = executionLogs
      .filter(log => log.executionTime)
      .map(log => log.executionTime!);
    
    const avgExecutionTime = executionTimes.length > 0
      ? executionTimes.reduce((a, b) => a + b, 0) / executionTimes.length
      : 0;

    const totalTokensUsed = executionLogs
      .filter(log => log.tokensUsed)
      .reduce((sum, log) => sum + log.tokensUsed!, 0);

    return {
      totalTasks: tasks.length,
      completedTasks: completed,
      successRate: Math.round(successRate),
      avgExecutionTime: Math.round(avgExecutionTime / 1000), // Convert to seconds
      totalTokensUsed,
    };
  };

  const stats = calculateStats();

  // Prepare chart data
  const taskStatusData: ChartData = {
    labels: ['Pending', 'Running', 'Completed', 'Failed'],
    values: [
      tasks?.filter(t => t.status === 'pending').length || 0,
      tasks?.filter(t => t.status === 'running').length || 0,
      tasks?.filter(t => t.status === 'completed').length || 0,
      tasks?.filter(t => t.status === 'failed').length || 0,
    ],
  };

  const taskPriorityData: ChartData = {
    labels: ['Low', 'Medium', 'High', 'Urgent'],
    values: [
      tasks?.filter(t => t.priority === 'low').length || 0,
      tasks?.filter(t => t.priority === 'medium').length || 0,
      tasks?.filter(t => t.priority === 'high').length || 0,
      tasks?.filter(t => t.priority === 'urgent').length || 0,
    ],
  };

  // Simple bar chart component
  const BarChart: React.FC<{ data: ChartData; colors: string[] }> = ({ data, colors }) => {
    const maxValue = Math.max(...data.values, 1);

    return (
      <div className="space-y-3">
        {data.labels.map((label, index) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">{label}</span>
              <span className="font-semibold">{data.values[index]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
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
  }> = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`text-4xl ${color}`}>{icon}</div>
      </div>
    </div>
  );

  // System health indicator
  const getHealthStatus = () => {
    if (!metrics) return { status: 'unknown', color: 'text-gray-500', label: 'Unknown' };
    
    const cpuHealth = metrics.cpu.usage < 80;
    const memoryHealth = metrics.memory.usagePercent < 85;
    const diskHealth = metrics.disk.usagePercent < 90;

    if (cpuHealth && memoryHealth && diskHealth) {
      return { status: 'healthy', color: 'text-green-500', label: 'Healthy' };
    } else if (cpuHealth && memoryHealth) {
      return { status: 'warning', color: 'text-yellow-500', label: 'Warning' };
    } else {
      return { status: 'critical', color: 'text-red-500', label: 'Critical' };
    }
  };

  const health = getHealthStatus();

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Real-time system performance and AI metrics</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Time range selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          {/* Refresh interval */}
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="5000">Refresh: 5s</option>
            <option value="10000">Refresh: 10s</option>
            <option value="30000">Refresh: 30s</option>
            <option value="60000">Refresh: 1m</option>
          </select>

          {/* System health indicator */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200">
            <span className={`text-2xl ${health.color}`}>●</span>
            <span className="font-medium">{health.label}</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <MetricCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon="📊"
          color="text-blue-600"
        />
        <MetricCard
          title="Completed"
          value={stats.completedTasks}
          subtitle={`${stats.successRate}% success rate`}
          icon="✅"
          color="text-green-600"
        />
        <MetricCard
          title="Avg Execution Time"
          value={`${stats.avgExecutionTime}s`}
          icon="⏱️"
          color="text-purple-600"
        />
        <MetricCard
          title="Tokens Used"
          value={stats.totalTokensUsed.toLocaleString()}
          icon="🎯"
          color="text-orange-600"
        />
        <MetricCard
          title="CPU Usage"
          value={`${metrics?.cpu.usage.toFixed(1) || 0}%`}
          subtitle={`${metrics?.cpu.cores || 0} cores`}
          icon="💻"
          color="text-red-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Task Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Task Status Distribution</h2>
          <BarChart
            data={taskStatusData}
            colors={['#f59e0b', '#3b82f6', '#10b981', '#ef4444']}
          />
        </div>

        {/* Task Priority Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Task Priority Distribution</h2>
          <BarChart
            data={taskPriorityData}
            colors={['#6b7280', '#3b82f6', '#f59e0b', '#ef4444']}
          />
        </div>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* CPU */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">CPU Usage</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Current Usage</span>
              <span className="font-bold">{metrics?.cpu.usage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${metrics?.cpu.usage || 0}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300 mt-4">
              <div>Cores: {metrics?.cpu.cores}</div>
              <div>Speed: {metrics?.cpu.speed} MHz</div>
            </div>
          </div>
        </div>

        {/* Memory */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Memory Usage</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Used / Total</span>
              <span className="font-bold">
                {(metrics?.memory.used || 0).toFixed(1)} / {(metrics?.memory.total || 0).toFixed(1)} GB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-green-500 to-emerald-500"
                style={{ width: `${metrics?.memory.usagePercent || 0}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-4">
              Usage: {metrics?.memory.usagePercent.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Disk */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Disk Usage</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Used / Total</span>
              <span className="font-bold">
                {(metrics?.disk.used || 0).toFixed(1)} / {(metrics?.disk.total || 0).toFixed(1)} GB
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-yellow-500 to-orange-500"
                style={{ width: `${metrics?.disk.usagePercent || 0}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-4">
              Usage: {metrics?.disk.usagePercent.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Recent Execution Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Execution Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tokens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200">
              {executionLogs?.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    Task #{log.subtaskId || log.taskId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      log.status === 'success' ? 'bg-green-100 text-green-800' :
                      log.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    Model #{log.modelId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {log.tokensUsed?.toLocaleString() || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                    {log.executionTime ? `${(log.executionTime / 1000).toFixed(2)}s` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
