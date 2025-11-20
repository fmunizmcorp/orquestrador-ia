import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { ArrowLeft, Send, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

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
  const [modelLoadingStatus, setModelLoadingStatus] = useState<string>('');
  const [isCheckingModel, setIsCheckingModel] = useState(false);
  
  // Query para listar modelos com status
  const { data: modelsWithStatus, refetch: refetchModels } = trpc.modelManagement.listWithStatus.useQuery();
  
  // Mutation para carregar modelo
  const loadModelMutation = trpc.modelManagement.load.useMutation();
  
  // Mutation para sugerir alternativa
  const suggestAlternativeMutation = trpc.modelManagement.suggestAlternative.useMutation();
  
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
      setModelLoadingStatus('');
    },
    onError: (error) => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `❌ Erro: ${error.message}`,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
      setModelLoadingStatus('');
    },
  });

  // Adicionar mensagem inicial se houver prompt
  useEffect(() => {
    if (prompt && messages.length === 0) {
      setMessages([
        {
          role: 'system',
          content: `💡 Usando prompt: "${prompt.title}"`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [prompt]);

  // Selecionar primeiro modelo disponível automaticamente
  useEffect(() => {
    if (modelsWithStatus && modelsWithStatus.length > 0 && !selectedModelId) {
      // Priorizar APIs externas (sempre disponíveis)
      const externalAPI = modelsWithStatus.find(m => m.isAPIExternal && m.isActive);
      if (externalAPI) {
        setSelectedModelId(externalAPI.id);
        return;
      }

      // Senão, usar primeiro modelo ativo
      const firstActive = modelsWithStatus.find(m => m.isActive);
      if (firstActive) {
        setSelectedModelId(firstActive.id);
      }
    }
  }, [modelsWithStatus, selectedModelId]);

  /**
   * Verifica e carrega o modelo se necessário antes de enviar mensagem
   */
  const checkAndLoadModel = async (modelId: number): Promise<boolean> => {
    setIsCheckingModel(true);
    setModelLoadingStatus('🔍 Verificando status do modelo...');

    try {
      // Buscar status atualizado do modelo
      const modelStatus = modelsWithStatus?.find(m => m.id === modelId);
      
      if (!modelStatus) {
        setModelLoadingStatus('❌ Modelo não encontrado');
        setIsCheckingModel(false);
        return false;
      }

      // APIs externas estão sempre prontas
      if (modelStatus.isAPIExternal) {
        setModelLoadingStatus('✅ Modelo de API externa pronto');
        setIsCheckingModel(false);
        return true;
      }

      // Se já está carregado no LM Studio, está pronto
      if (modelStatus.isLoaded) {
        setModelLoadingStatus('✅ Modelo já está carregado');
        setIsCheckingModel(false);
        return true;
      }

      // Se está carregando, aguardar
      if (modelStatus.isLoading) {
        setModelLoadingStatus('⏳ Modelo está sendo carregado... aguarde');
        // Aqui poderia implementar polling para aguardar
        setIsCheckingModel(false);
        return false;
      }

      // Tentar carregar o modelo
      setModelLoadingStatus(`🔄 Carregando modelo "${modelStatus.name}"... Isso pode levar alguns minutos`);
      
      const loadResult = await loadModelMutation.mutateAsync({ modelId });

      if (loadResult.success) {
        setModelLoadingStatus('✅ Modelo carregado com sucesso!');
        await refetchModels(); // Atualizar lista de modelos
        setIsCheckingModel(false);
        return true;
      } else {
        // Falha ao carregar - sugerir alternativa
        setModelLoadingStatus(`❌ ${loadResult.message}`);
        
        const alternative = await suggestAlternativeMutation.mutateAsync({ failedModelId: modelId });
        
        if (alternative) {
          setMessages(prev => [
            ...prev,
            {
              role: 'system',
              content: `⚠️ O modelo "${modelStatus.name}" não pode ser carregado. Sugerimos usar "${alternative.name}" como alternativa.`,
              timestamp: new Date(),
            },
          ]);
          setSelectedModelId(alternative.id);
          setModelLoadingStatus(`💡 Modelo alternativo sugerido: ${alternative.name}`);
        } else {
          setMessages(prev => [
            ...prev,
            {
              role: 'system',
              content: `❌ O modelo "${modelStatus.name}" não pode ser carregado e não há alternativas disponíveis. Por favor, escolha outro modelo.`,
              timestamp: new Date(),
            },
          ]);
        }
        
        setIsCheckingModel(false);
        return false;
      }
    } catch (error: any) {
      setModelLoadingStatus(`❌ Erro ao verificar/carregar modelo: ${error.message}`);
      setIsCheckingModel(false);
      return false;
    }
  };

  // SPRINT 51 - BUG #2 FIX: Wrap with useCallback to prevent stale closures
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !selectedModelId || isLoading || isCheckingModel) {
      return;
    }

    // VERIFICAÇÃO INTELIGENTE: Verificar se modelo está carregado antes de enviar
    const isModelReady = await checkAndLoadModel(selectedModelId);
    
    if (!isModelReady) {
      return; // Não enviar mensagem se modelo não está pronto
    }

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Construir contexto da conversa
    const context = messages
      .filter(m => m.role !== 'system')
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n\n');

    const fullPrompt = context
      ? `${context}\n\nUser: ${inputMessage}\n\nAssistant:`
      : inputMessage;

    await executePromptMutation.mutateAsync({
      content: fullPrompt,
      modelId: selectedModelId,
      temperature: 0.7,
      maxTokens: 2000,
    });
  }, [inputMessage, selectedModelId, isLoading, isCheckingModel, checkAndLoadModel, messages, executePromptMutation]);

  const handleModelChange = async (newModelId: number) => {
    setSelectedModelId(newModelId);
    setModelLoadingStatus('');
    
    // Re-verificar status ao trocar de modelo
    await refetchModels();
  };

  if (!prompt) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nenhum prompt selecionado</h2>
          <button
            onClick={() => navigate('/prompts')}
            className="text-blue-600 hover:underline"
          >
            Voltar para Prompts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/prompts')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {`${prompt.title}`}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Conversa com IA
              </p>
            </div>
          </div>

          {/* Seletor de modelo */}
          <div className="flex items-center space-x-3">
            <select
              value={selectedModelId || ''}
              onChange={(e) => handleModelChange(Number(e.target.value))}
              disabled={isLoading || isCheckingModel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Selecione um modelo</option>
              {modelsWithStatus?.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} 
                  {model.isAPIExternal && ' 🌐'}
                  {model.isLoaded && !model.isAPIExternal && ' ✓'}
                  {model.isLoading && ' 🔄'}
                  {!model.isActive && ' ❌'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status de carregamento do modelo */}
        {modelLoadingStatus && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {modelLoadingStatus}
            </p>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.role === 'system'
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  IA está pensando...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
            disabled={isLoading || isCheckingModel || !selectedModelId}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50"
            rows={3}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || !selectedModelId || isLoading || isCheckingModel}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {isLoading || isCheckingModel ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            <span>Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
