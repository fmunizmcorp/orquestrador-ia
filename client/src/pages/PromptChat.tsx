import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';

interface Message {
  role: 'user' | 'assistant';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Query para buscar modelos
  const { data: modelsData } = trpc.models.list.useQuery({ limit: 100 });
  const models = modelsData?.items || [];

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

  // Selecionar primeiro modelo ativo automaticamente
  useEffect(() => {
    if (models.length > 0 && !selectedModelId) {
      const activeModel = models.find((m: any) => m.isActive && m.isLoaded);
      if (activeModel) {
        setSelectedModelId(activeModel.id);
      } else {
        const firstActive = models.find((m: any) => m.isActive);
        setSelectedModelId(firstActive?.id || models[0].id);
      }
    }
  }, [models, selectedModelId]);

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
    if (!inputMessage.trim() || !selectedModelId || isLoading) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Criar contexto com histórico
    const context = messages
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
            >
              {models.map((model: any) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                  {model.isLoaded && ' ✓'}
                  {!model.isActive && ' (Inativo)'}
                </option>
              ))}
            </select>
            {selectedModel && (
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                {selectedModel.providerName || 'Local'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-xs opacity-75">
                    {message.role === 'user' ? '👤 Você' : '🤖 IA'}
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
            disabled={!inputMessage.trim() || !selectedModelId || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-fit"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Enviando
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
