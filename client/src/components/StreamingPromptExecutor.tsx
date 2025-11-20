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

import { useState, useCallback } from 'react';
import { useStreamingPrompt } from '../hooks/useStreamingPrompt';
import { trpc } from '../lib/trpc';

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
  
  // SPRINT 35 - Chat Conversational: Conversation history state
  const [conversationHistory, setConversationHistory] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [followUpMessage, setFollowUpMessage] = useState('');

  // BUGFIX RODADA 35 - BUG 4: Fetch available models dynamically
  // BUGFIX RODADA 36 - SPRINT 30: Add error/loading handling to prevent component crash
  const { 
    data: modelsData, 
    isLoading: modelsLoading, 
    isError: modelsError 
  } = trpc.models.list.useQuery(
    {
      isActive: true,
      limit: 100,
      offset: 0,
    },
    {
      // Retry configuration to handle transient errors
      retry: 2,
      retryDelay: 1000,
      // Prevent query from blocking render
      staleTime: 30000, // 30 seconds
      // Disable background refetching to prevent unnecessary requests
      refetchOnWindowFocus: false,
    }
  );

  const handleExecute = async () => {
    try {
      await execute({
        promptId,
        variables: variablesInput,
        modelId: selectedModelId,
      });

      // SPRINT 35 - Chat Conversational: Add initial prompt to history
      if (promptContent && content) {
        setConversationHistory([
          { role: 'user', content: promptContent },
          { role: 'assistant', content: content }
        ]);
      }

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
    setConversationHistory([]);
    setFollowUpMessage('');
    setIsExecuteModalOpen(false);
  };

  // SPRINT 35 - Chat Conversational: Handle follow-up message
  // SPRINT 48 - Added comprehensive logging for debugging
  // SPRINT 49 - P0-4: Fixed to properly capture response content
  // SPRINT 49 ROUND 3 - CRITICAL FIX: Memoize with useCallback to prevent stale closure
  const handleSendFollowUp = useCallback(async () => {
    console.log('🚀 [SPRINT 49 ROUND 3] handleSendFollowUp called (via useCallback)', {
      followUpMessage: followUpMessage.trim(),
      followUpLength: followUpMessage.trim().length,
      isStreaming,
      conversationHistoryLength: conversationHistory.length,
      currentContentLength: content?.length || 0,
    });
    
    if (!followUpMessage.trim() || isStreaming) {
      console.warn('⚠️ [SPRINT 49] Follow-up blocked:', {
        emptyMessage: !followUpMessage.trim(),
        isStreaming,
      });
      return;
    }

    // Add user message to history
    const userMessage = followUpMessage.trim();
    const newHistory = [
      ...conversationHistory,
      { role: 'user' as const, content: userMessage }
    ];
    
    console.log('📝 [SPRINT 49] Updating conversation history:', {
      oldHistoryLength: conversationHistory.length,
      newHistoryLength: newHistory.length,
      userMessage: userMessage.substring(0, 50),
    });
    
    setConversationHistory(newHistory);
    setFollowUpMessage('');

    try {
      // Build context from conversation history
      const context = newHistory.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');

      console.log('🔄 [SPRINT 49] Executing prompt with context:', {
        promptId,
        modelId: selectedModelId,
        contextLength: context.length,
        variablesCount: Object.keys(variablesInput).length,
      });

      // SPRINT 49 - P0-4: Reset content before execution to get fresh response
      reset();
      
      // Execute with conversation context
      const result = await execute({
        promptId,
        variables: { ...variablesInput, conversationContext: context },
        modelId: selectedModelId,
      });

      console.log('✅ [SPRINT 49] Execute completed successfully');
      
      // SPRINT 49 - P0-4: Wait a bit for content state to update
      // The useStreamingPrompt hook updates content asynchronously
      setTimeout(() => {
        console.log('📥 [SPRINT 49] Content after execute:', {
          contentLength: content?.length || 0,
          contentPreview: content?.substring(0, 100) || 'NO CONTENT',
        });
        
        // Add assistant response to history if available
        if (content && content.trim()) {
          console.log('✅ [SPRINT 49] Adding assistant response to history');
          setConversationHistory(prev => [
            ...prev,
            { role: 'assistant' as const, content: content }
          ]);
          
          if (onComplete) {
            console.log('🎯 [SPRINT 49] Calling onComplete callback');
            onComplete(content, metadata);
          }
        } else {
          console.warn('⚠️ [SPRINT 49] No content available after timeout');
        }
      }, 500); // Wait 500ms for content state to update

    } catch (err: any) {
      console.error('❌ [SPRINT 49] Error in handleSendFollowUp:', err);
      console.error('❌ [SPRINT 49] Error stack:', err.stack);
      if (onError) {
        onError(err.message || 'Execution failed');
      }
    }
  }, [followUpMessage, isStreaming, conversationHistory, content, promptId, selectedModelId, variablesInput, execute, reset, metadata, onComplete, onError]); // CRITICAL: useCallback dependencies

  // SPRINT 35 - Chat Conversational: Clear conversation history
  const handleClearConversation = () => {
    setConversationHistory([]);
    setFollowUpMessage('');
    reset();
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  /**
   * Calculate estimated time remaining based on chunks per second
   * Assumes average response is 1024 tokens (~1024 chunks)
   */
  const calculateETA = () => {
    if (progress.chunks === 0 || progress.duration === 0) return null;
    
    const chunksPerSecond = progress.chunks / (progress.duration / 1000);
    const estimatedTotalChunks = 1024; // Average based on max_tokens default
    const remainingChunks = Math.max(0, estimatedTotalChunks - progress.chunks);
    const etaSeconds = remainingChunks / chunksPerSecond;
    
    if (!isFinite(etaSeconds) || etaSeconds < 0) return null;
    
    return Math.ceil(etaSeconds);
  };

  /**
   * Calculate progress percentage based on estimated total
   */
  const calculateProgress = () => {
    const estimatedTotal = 1024;
    return Math.min(100, Math.round((progress.chunks / estimatedTotal) * 100));
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
                    disabled={modelsLoading || modelsError || !modelsData?.data || modelsData.data.length === 0}
                  >
                    {modelsLoading ? (
                      <option value={selectedModelId}>⏳ Carregando modelos...</option>
                    ) : modelsError ? (
                      <option value={selectedModelId}>❌ Erro ao carregar modelos</option>
                    ) : modelsData && modelsData.data.length > 0 ? (
                      modelsData.data.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} {model.provider ? `(${model.provider})` : ''} - {model.modelId}
                        </option>
                      ))
                    ) : (
                      <option value={selectedModelId}>⚠️ Nenhum modelo disponível</option>
                    )}
                  </select>
                  {/* BUGFIX RODADA 36 - SPRINT 30: Add user feedback for loading/error states */}
                  {modelsError && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      ⚠️ Erro ao buscar modelos. Usando modelo padrão (ID: {selectedModelId}).
                    </p>
                  )}
                  {modelsLoading && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      ⏳ Buscando modelos disponíveis...
                    </p>
                  )}
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
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="animate-pulse h-3 w-3 rounded-full bg-blue-600"></div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                              Streaming em Progresso ({calculateProgress()}%)
                            </h4>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              {progress.chunks} chunks • {formatDuration(progress.duration)} • {progress.outputLength} caracteres
                              {calculateETA() && (
                                <span className="ml-2">• ~{calculateETA()}s restantes</span>
                              )}
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
                      {/* Progress Bar */}
                      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div
                          className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress()}%` }}
                        ></div>
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
                  
                  {/* SPRINT 35 - Chat Conversational: Follow-up input */}
                  {!isStreaming && content && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-start gap-3">
                        <textarea
                          value={followUpMessage}
                          onChange={(e) => {
                            console.log('[SPRINT 49 ROUND 3] Follow-up onChange triggered:', e.target.value);
                            setFollowUpMessage(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            console.log('[SPRINT 49 ROUND 3] Follow-up onKeyDown:', e.key, 'Shift:', e.shiftKey);
                            if (e.key === 'Enter' && !e.shiftKey) {
                              console.log('[SPRINT 49 ROUND 3] Enter detected - calling handleSendFollowUp');
                              e.preventDefault();
                              handleSendFollowUp();
                            }
                          }}
                          placeholder="Continue a conversa... (Enter para enviar, Shift+Enter para nova linha)"
                          className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={2}
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              console.log('[SPRINT 49 ROUND 3] Follow-up BUTTON CLICKED!');
                              handleSendFollowUp();
                            }}
                            disabled={!followUpMessage.trim() || isStreaming}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                            title="Enviar mensagem"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Enviar
                          </button>
                          {conversationHistory.length > 0 && (
                            <button
                              onClick={handleClearConversation}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                              title="Limpar conversa"
                            >
                              🗑️ Limpar
                            </button>
                          )}
                        </div>
                      </div>
                      {conversationHistory.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          💬 {conversationHistory.length} mensagem(ns) no histórico
                        </div>
                      )}
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
