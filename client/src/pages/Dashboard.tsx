import { useEffect, useState } from 'react';
import { trpc } from '../lib/trpc';
import { Activity, Brain, CheckCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { data: stats } = trpc.tasks.stats.useQuery();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Tarefas</p>
              <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
            </div>
            <Activity className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Em Execução</p>
              <p className="text-3xl font-bold text-white">{stats?.executing || 0}</p>
            </div>
            <Brain className="text-yellow-500" size={40} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Concluídas</p>
              <p className="text-3xl font-bold text-white">{stats?.completed || 0}</p>
            </div>
            <CheckCircle className="text-green-500" size={40} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Falhadas</p>
              <p className="text-3xl font-bold text-white">{stats?.failed || 0}</p>
            </div>
            <AlertCircle className="text-red-500" size={40} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
