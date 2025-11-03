import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export default function PromptChat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { prompt } = location.state || {};

  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingModel, setIsCheckingModel] = useState(false);
  const [modelLoadingStatus, setModelLoadingStatus] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Query para buscar modelos com status
  const { data: modelsWithStatus, refetch: refetchModels } = trpc.modelManagement.listWithStatus.useQuery();
  const models = modelsWithStatus || [];

  // Mutation para executar prompt
  const executePromptMutation = trpc.prompts.executeDirect.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.output,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('❌ Erro:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Erro: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    },
  });

  // Auto scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mutation para carregar modelo
  const loadModelMutation = trpc.modelManagement.load.useMutation();
  const suggestAlternativeMutation = trpc.modelManagement.suggestAlternative.useQuery(
    { failedModelId: selectedModelId || 0 },
    { enabled: false }
  );

  // Selecionar primeiro modelo ativo/disponível automaticamente
  useEffect(() => {
    if (models.length > 0 && !selectedModelId) {
      // Priorizar APIs externas (sempre disponíveis)
      const externalAPI = models.find((m: any) => m.isAPIExternal && m.isActive);
      if (externalAPI) {
        setSelectedModelId(externalAPI.id);
        return;
      }

      // Depois modelos LM Studio já carregados
      const loadedModel = models.find((m: any) => m.isLMStudio && m.isLoaded && m.isActive);
      if (loadedModel) {
        setSelectedModelId(loadedModel.id);
        return;
      }

      // Por último qualquer modelo ativo
      const firstActive = models.find((m: any) => m.isActive);
      if (firstActive) {
        setSelectedModelId(firstActive.id);
      }
    }
  }, [models, selectedModelId]);

  // Função para verificar e carregar modelo
  const checkAndLoadModel = async (modelId: number): Promise<boolean> => {
    const model = models.find((m: any) => m.id === modelId);
    if (!model) {
      setModelLoadingStatus('❌ Modelo não encontrado');
      return false;
    }

    setIsCheckingModel(true);
    setModelLoadingStatus('🔍 Verificando status do modelo...');

    try {
      // APIs externas estão sempre prontas
      if (model.isAPIExternal) {
        setModelLoadingStatus('✅ Modelo de API externa pronto');
        setIsCheckingModel(false);
        return true;
      }

      // Para LM Studio, verificar se está carregado
      if (model.isLoaded) {
        setModelLoadingStatus('✅ Modelo já está carregado');
        setIsCheckingModel(false);
        return true;
      }

      // Tentar carregar o modelo
      if (model.isLoading) {
        setModelLoadingStatus('⏳ Modelo está sendo carregado... aguarde');
        setIsCheckingModel(false);
        return false;
      }

      setModelLoadingStatus(`🔄 Carregando modelo "${model.name}"... Isso pode levar alguns minutos`);
      
      const loadResult = await loadModelMutation.mutateAsync({ modelId });

      if (loadResult.success) {
        setModelLoadingStatus(`✅ ${loadResult.message}`);
        await refetchModels();
        setIsCheckingModel(false);
        return true;
      } else {
        setModelLoadingStatus(`❌ ${loadResult.message}`);
        
        // Tentar sugerir alternativa
        const alternative = await suggestAlternativeMutation.refetch();
        if (alternative.data) {
          const altModel = alternative.data;
          setModelLoadingStatus(
            `❌ ${loadResult.message}\n\n💡 Sugestão: Usar modelo "${altModel.name}" (${altModel.isAPIExternal ? 'API' : 'LM Studio'})`
          );
          
          // Adicionar mensagem no chat
          setMessages((prev) => [
            ...prev,
            {
              role: 'system',
              content: `⚠️ Modelo "${model.name}" não está disponível.\n\n${loadResult.message}\n\n💡 Recomendação: Selecione o modelo "${altModel.name}" que está disponível.`,
              timestamp: new Date(),
            },
          ]);
        }

        setIsCheckingModel(false);
        return false;
      }
    } catch (error: any) {
      console.error('Erro ao verificar/carregar modelo:', error);
      setModelLoadingStatus(`❌ Erro: ${error.message}`);
      setIsCheckingModel(false);
      return false;
    }
  };

  // Adicionar mensagem inicial do prompt
  useEffect(() => {
    if (prompt && messages.length === 0) {
      setMessages([
        {
          role: 'user',
          content: `Usando prompt: "${prompt.title}"\n\n${prompt.content}`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [prompt, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedModelId || isLoading || isCheckingModel) return;

    // Verificar e carregar modelo antes de enviar
    const modelReady = await checkAndLoadModel(selectedModelId);
    if (!modelReady) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Não foi possível usar o modelo selecionado. Por favor, selecione outro modelo ou verifique se o LM Studio está rodando.',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setModelLoadingStatus('');

    // Criar contexto com histórico (filtrar mensagens de sistema)
    const context = messages
      .filter((m) => m.role !== 'system')
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const fullPrompt = context
      ? `${context}\n\nUser: ${inputMessage}\n\nAssistant:`
      : inputMessage;

    console.log('💬 Enviando mensagem:', {
      modelId: selectedModelId,
      message: inputMessage,
      context: context.length > 0,
    });

    // Executar
    await executePromptMutation.mutateAsync({
      content: fullPrompt,
      modelId: selectedModelId,
      temperature: 0.7,
      maxTokens: 2000,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!prompt) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            Nenhum prompt selecionado. Volte e selecione um prompt para conversar.
          </p>
          <button
            onClick={() => navigate('/prompts')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar para Prompts
          </button>
        </div>
      </div>
    );
  }

  const selectedModel = models.find((m: any) => m.id === selectedModelId);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/prompts')}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                💬 {prompt.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chat interativo com IA
              </p>
            </div>
          </div>

          {/* Seletor de Modelo */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">🤖 Modelo:</span>
            <select
              value={selectedModelId || ''}
              onChange={(e) => setSelectedModelId(Number(e.target.value))}
              className="px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md text-sm"
              disabled={isCheckingModel}
            >
              {models.map((model: any) => {
                let indicator = '';
                if (model.isAPIExternal) {
                  indicator = '🌐';
                } else if (model.isLoaded) {
                  indicator = '✓';
                } else if (model.isLoading) {
                  indicator = '🔄';
                } else if (!model.isActive) {
                  indicator = '❌';
                }

                return (
                  <option key={model.id} value={model.id}>
                    {indicator} {model.name} {model.error ? `(${model.error})` : ''}
                  </option>
                );
              })}
            </select>
            {selectedModel && (
              <span className={`text-xs px-2 py-1 rounded ${
                selectedModel.isAPIExternal
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : selectedModel.isLoaded
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
              }`}>
                {selectedModel.isAPIExternal ? 'API Externa' : selectedModel.isLoaded ? 'Carregado' : 'Não Carregado'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Model Loading Status */}
      {(isCheckingModel || modelLoadingStatus) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 p-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            {isCheckingModel && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
            )}
            <p className="text-sm text-yellow-800 dark:text-yellow-200 whitespace-pre-wrap">
              {modelLoadingStatus}
            </p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : message.role === 'system' ? 'justify-center' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'max-w-[70%] bg-blue-600 text-white'
                    : message.role === 'system'
                    ? 'max-w-[90%] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-700'
                    : 'max-w-[70%] bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-xs opacity-75">
                    {message.role === 'user' ? '👤 Você' : message.role === 'system' ? '⚙️ Sistema' : '🤖 IA'}
                  </span>
                  <span className="text-xs opacity-50">
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">IA está digitando...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para quebrar linha)"
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !selectedModelId || isLoading || isCheckingModel}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-fit"
          >
            {isLoading || isCheckingModel ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {isCheckingModel ? 'Verificando' : 'Enviando'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Enviar
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-4xl mx-auto">
          💡 Dica: O histórico da conversa é mantido automaticamente para contexto contínuo
        </p>
      </div>
    </div>
  );
}
