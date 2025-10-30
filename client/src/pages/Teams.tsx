import { useState } from 'react';
import { trpc } from '../lib/trpc';

export default function Teams() {
  const { data: teamsData, isLoading, error, refetch } = trpc.teams.list.useQuery({
    limit: 50,
    offset: 0,
  });
  
  const teams = teamsData?.teams || [];
  const loading = isLoading;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipes</h1>
          <p className="text-gray-600 mt-1">
            Gerencie equipes e membros
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Nova Equipe
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando equipes...</p>
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma equipe</h3>
          <p className="mt-1 text-sm text-gray-500">Comece criando uma nova equipe.</p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Criar Equipe
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team: any) => (
            <div key={team.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {team.memberCount} membros
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{team.description}</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-600 rounded px-3 py-1">
                  Membros
                </button>
                <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-600 rounded px-3 py-1">
                  Configurações
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
