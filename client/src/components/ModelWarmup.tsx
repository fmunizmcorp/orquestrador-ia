/**
 * Model Warmup Component
 * UI for pre-loading LM Studio models into memory
 * Sprint 26 - Frontend Integration
 * 
 * Features:
 * - Model selection
 * - Warmup trigger button
 * - Progress feedback
 * - Duration display
 * - Success/error handling
 */

import { useState } from 'react';

interface ModelWarmupProps {
  modelId?: number;
  modelName?: string;
  lmStudioModelId?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export default function ModelWarmup({
  modelId = 1,
  modelName = 'Modelo Padrão',
  lmStudioModelId,
  onSuccess,
  onError,
}: ModelWarmupProps) {
  const [isWarming, setIsWarming] = useState(false);
  const [warmupStatus, setWarmupStatus] = useState<'idle' | 'warming' | 'success' | 'error'>('idle');
  const [duration, setDuration] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleWarmup = async () => {
    setIsWarming(true);
    setWarmupStatus('warming');
    setErrorMessage('');
    const startTime = Date.now();

    try {
      const response = await fetch('/api/models/warmup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId: lmStudioModelId || `model-${modelId}`,
        }),
      });

      const data = await response.json();
      const elapsed = Date.now() - startTime;
      setDuration(elapsed);

      if (!response.ok) {
        throw new Error(data.error || 'Falha no warmup');
      }

      setWarmupStatus('success');
      
      if (onSuccess) {
        onSuccess(data);
      }

      // Reset status after 5 seconds
      setTimeout(() => {
        setWarmupStatus('idle');
      }, 5000);
    } catch (error: any) {
      const elapsed = Date.now() - startTime;
      setDuration(elapsed);
      setWarmupStatus('error');
      setErrorMessage(error.message || 'Erro desconhecido');
      
      if (onError) {
        onError(error.message);
      }

      // Reset status after 8 seconds
      setTimeout(() => {
        setWarmupStatus('idle');
        setErrorMessage('');
      }, 8000);
    } finally {
      setIsWarming(false);
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Pré-carregar Modelo
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {modelName} {lmStudioModelId && `(${lmStudioModelId.substring(0, 30)}...)`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Carregue o modelo na memória antes de executar para reduzir o tempo de primeira execução.
          </p>
        </div>

        <button
          onClick={handleWarmup}
          disabled={isWarming}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            warmupStatus === 'success'
              ? 'bg-green-600 text-white'
              : warmupStatus === 'error'
              ? 'bg-red-600 text-white'
              : warmupStatus === 'warming'
              ? 'bg-yellow-600 text-white cursor-wait'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap`}
        >
          {warmupStatus === 'warming' && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          {warmupStatus === 'success' && '✓'}
          {warmupStatus === 'error' && '✗'}
          {warmupStatus === 'warming' ? 'Carregando...' : warmupStatus === 'success' ? 'Pronto!' : warmupStatus === 'error' ? 'Erro' : 'Aquecer'}
        </button>
      </div>

      {/* Status Messages */}
      {warmupStatus === 'warming' && (
        <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
          <p className="text-xs text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600"></div>
            Carregando modelo na memória... Isso pode levar até 120 segundos para modelos grandes.
          </p>
        </div>
      )}

      {warmupStatus === 'success' && (
        <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
          <p className="text-xs text-green-800 dark:text-green-200">
            ✅ Modelo carregado com sucesso em {formatDuration(duration)}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Próximas execuções serão mais rápidas.
          </p>
        </div>
      )}

      {warmupStatus === 'error' && (
        <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
          <p className="text-xs text-red-800 dark:text-red-200">
            ❌ Falha no warmup após {formatDuration(duration)}
          </p>
          {errorMessage && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
