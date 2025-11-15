/**
 * Streaming Prompt Executor Component
 * Full-featured UI for executing prompts with Server-Sent Events (SSE) streaming
 * Sprint 26 - Frontend Integration
 * 
 * Features:
 * - Real-time streaming display
 * - Model loading detection
 * - Progress indicators
 * - Error handling
 * - Cancellation support
 * - Metadata display
 */

import { useState } from 'react';
import { useStreamingPrompt } from '../hooks/useStreamingPrompt';

interface StreamingPromptExecutorProps {
  promptId: number;
  promptTitle?: string;
  promptContent?: string;
  modelId?: number;
  modelName?: string;
  variables?: Record<string, any>;
  onComplete?: (content: string, metadata: any) => void;
  onError?: (error: string) => void;
}

export default function StreamingPromptExecutor({
  promptId,
  promptTitle,
  promptContent,
  modelId = 1,
  modelName,
  variables = {},
  onComplete,
  onError,
}: StreamingPromptExecutorProps) {
  const {
    content,
    isStreaming,
    isModelLoading,
    error,
    metadata,
    progress,
    execute,
    cancel,
    reset,
  } = useStreamingPrompt();

  const [isExecuteModalOpen, setIsExecuteModalOpen] = useState(false);
  const [variablesInput, setVariablesInput] = useState<Record<string, any>>(variables);
  const [selectedModelId, setSelectedModelId] = useState<number>(modelId);

  const handleExecute = async () => {
    try {
      await execute({
        promptId,
        variables: variablesInput,
        modelId: selectedModelId,
      });

      if (onComplete && content) {
        onComplete(content, metadata);
      }
    } catch (err: any) {
      if (onError) {
        onError(err.message || 'Execution failed');
      }
    }
  };

  const handleCancel = () => {
    cancel();
  };

  const handleReset = () => {
    reset();
    setIsExecuteModalOpen(false);
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const openExecuteModal = () => {
    reset();
    setIsExecuteModalOpen(true);
  };

  const closeExecuteModal = () => {
    if (isStreaming) {
      if (confirm('Execução em andamento. Deseja cancelar?')) {
        cancel();
        setIsExecuteModalOpen(false);
      }
    } else {
      setIsExecuteModalOpen(false);
    }
  };

  return (
    <>
      {/* Execute Button */}
      <button
        onClick={openExecuteModal}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        title="Executar este prompt"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Executar
      </button>

      {/* Execution Modal */}
      {isExecuteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Executar Prompt
                </h2>
                {promptTitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {promptTitle}
                  </p>
                )}
              </div>
              <button
                onClick={closeExecuteModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Prompt Preview */}
              {promptContent && !isStreaming && !content && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Conteúdo do Prompt:
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto">
                    <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                      {promptContent}
                    </pre>
                  </div>
                </div>
              )}

              {/* Model Selection */}
              {!isStreaming && !content && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Modelo:
                  </label>
                  <select
                    value={selectedModelId}
                    onChange={(e) => setSelectedModelId(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Modelo Padrão (ID: 1)</option>
                    <option value={2}>Modelo Alternativo (ID: 2)</option>
                  </select>
                  {modelName && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      LM Studio: {modelName}
                    </p>
                  )}
                </div>
              )}

              {/* Status Display */}
              {(isStreaming || isModelLoading) && (
                <div className="mb-6">
                  {/* Model Loading Banner */}
                  {isModelLoading && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                            Carregando Modelo
                          </h4>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            O modelo está sendo carregado na memória. Isso pode levar 30-120 segundos para modelos grandes. 
                            Aguarde...
                          </p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                            ⏱️ Tempo estimado: 60-90 segundos
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Streaming Progress */}
                  {isStreaming && !isModelLoading && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="animate-pulse h-3 w-3 rounded-full bg-blue-600"></div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                              Streaming em Progresso
                            </h4>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {progress.chunks} chunks • {formatDuration(progress.duration)} • {progress.outputLength} caracteres
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Metadata Display */}
                  {metadata && (
                    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 mb-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Prompt:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-mono">
                            #{metadata.promptId}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Modelo:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-mono">
                            #{metadata.modelId}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">LM Studio:</span>
                          <span className="ml-2 text-gray-900 dark:text-white font-mono text-[10px]">
                            {metadata.lmStudioModelId?.substring(0, 20)}...
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Status:</span>
                          <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                            ● Ativo
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
                        Erro na Execução
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        {error}
                      </p>
                      <button
                        onClick={handleReset}
                        className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Tentar Novamente
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Output Display */}
              {content && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Resposta:
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(content)}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        title="Copiar resposta"
                      >
                        📋 Copiar
                      </button>
                      <button
                        onClick={handleReset}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        title="Executar novamente"
                      >
                        🔄 Novo
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                      {content}
                    </pre>
                  </div>
                  {!isStreaming && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                      <span>
                        ✅ Completo: {progress.chunks} chunks em {formatDuration(progress.duration)}
                      </span>
                      <span>
                        📊 {progress.outputLength} caracteres
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {!isStreaming && !content && !error && (
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={closeExecuteModal}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleExecute}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Iniciar Execução
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
