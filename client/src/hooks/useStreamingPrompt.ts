/**
 * Streaming Prompt Hook
 * Custom hook for consuming Server-Sent Events (SSE) from streaming endpoint
 * Sprint 26 - Frontend Integration
 */

import { useState, useCallback, useRef } from 'react';

interface StreamingState {
  content: string;
  isStreaming: boolean;
  isModelLoading: boolean;
  error: string | null;
  metadata: {
    promptId?: number;
    promptTitle?: string;
    modelId?: number;
    modelName?: string;
    lmStudioModelId?: string;
  } | null;
  progress: {
    chunks: number;
    duration: number;
    outputLength: number;
  };
}

interface ExecuteOptions {
  promptId: number;
  variables?: Record<string, any>;
  modelId?: number;
}

export const useStreamingPrompt = () => {
  const [state, setState] = useState<StreamingState>({
    content: '',
    isStreaming: false,
    isModelLoading: false,
    error: null,
    metadata: null,
    progress: {
      chunks: 0,
      duration: 0,
      outputLength: 0,
    },
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);

  const execute = useCallback(async (options: ExecuteOptions) => {
    const { promptId, variables, modelId } = options;

    // Reset state
    setState({
      content: '',
      isStreaming: true,
      isModelLoading: false,
      error: null,
      metadata: null,
      progress: {
        chunks: 0,
        duration: 0,
        outputLength: 0,
      },
    });

    // Create new AbortController for cancellation
    abortControllerRef.current = new AbortController();
    startTimeRef.current = Date.now();

    try {
      const response = await fetch('/api/prompts/execute/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promptId,
          variables: variables || {},
          modelId: modelId || 1,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('✅ Stream completed');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep last incomplete line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();

          // Skip empty lines
          if (!trimmed) continue;

          // Skip SSE comments (keep-alive)
          if (trimmed.startsWith(':')) {
            console.log('💓 Keep-alive received');
            continue;
          }

          // Process data lines
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);

            try {
              const data = JSON.parse(dataStr);

              switch (data.type) {
                case 'start':
                  console.log('🎬 Stream started:', data);
                  setState(prev => ({
                    ...prev,
                    metadata: {
                      promptId: data.promptId,
                      promptTitle: data.promptTitle,
                      modelId: data.modelId,
                      modelName: data.modelName,
                      lmStudioModelId: data.lmStudioModelId,
                    },
                  }));
                  break;

                case 'model_loading':
                  console.log('⏳ Model loading:', data.message);
                  setState(prev => ({
                    ...prev,
                    isModelLoading: true,
                  }));
                  break;

                case 'chunk':
                  setState(prev => {
                    const newContent = prev.content + data.content;
                    return {
                      ...prev,
                      content: newContent,
                      isModelLoading: false,
                      progress: {
                        chunks: data.chunkNumber || prev.progress.chunks + 1,
                        duration: Date.now() - startTimeRef.current,
                        outputLength: newContent.length,
                      },
                    };
                  });
                  break;

                case 'done':
                  console.log('🏁 Stream done:', data);
                  setState(prev => ({
                    ...prev,
                    isStreaming: false,
                    progress: {
                      chunks: data.totalChunks || prev.progress.chunks,
                      duration: data.duration || (Date.now() - startTimeRef.current),
                      outputLength: data.outputLength || prev.content.length,
                    },
                  }));
                  break;

                case 'error':
                  console.error('❌ Stream error:', data);
                  setState(prev => ({
                    ...prev,
                    error: data.message || 'Unknown error',
                    isStreaming: false,
                    isModelLoading: false,
                  }));
                  break;

                default:
                  console.warn('Unknown event type:', data.type);
              }
            } catch (parseError) {
              console.error('Failed to parse SSE data:', dataStr, parseError);
            }
          }
        }
      }
    } catch (error: any) {
      // Don't set error if it was an abort
      if (error.name === 'AbortError') {
        console.log('🛑 Stream cancelled');
        setState(prev => ({
          ...prev,
          isStreaming: false,
          isModelLoading: false,
        }));
      } else {
        console.error('💥 Stream error:', error);
        setState(prev => ({
          ...prev,
          error: error.message || 'Connection error',
          isStreaming: false,
          isModelLoading: false,
        }));
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('🛑 Cancelling stream...');
      abortControllerRef.current.abort();
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      content: '',
      isStreaming: false,
      isModelLoading: false,
      error: null,
      metadata: null,
      progress: {
        chunks: 0,
        duration: 0,
        outputLength: 0,
      },
    });
  }, []);

  return {
    ...state,
    execute,
    cancel,
    reset,
  };
};
