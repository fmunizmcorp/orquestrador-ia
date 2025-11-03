import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

interface PromptExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: any;
}

export default function PromptExecutionModal({ isOpen, onClose, prompt }: PromptExecutionModalProps) {
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [result, setResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Query para buscar modelos disponíveis
  const { data: modelsData, isLoading: modelsLoading } = trpc.models.list.useQuery({
    limit: 100,
  });

  const models = modelsData?.items || [];

  // Mutation para executar o prompt
  const executePromptMutation = trpc.prompts.execute.useMutation({
    onSuccess: (data) => {
      console.log('✅ Prompt executado com sucesso!', data);
      setResult(data);
      setIsExecuting(false);
      alert('Prompt executado com sucesso!');
    },
    onError: (error) => {
      console.error('❌ Erro ao executar prompt:', error);
      setIsExecuting(false);
      alert(`Erro ao executar prompt: ${error.message}`);
    },
  });

  // Selecionar primeiro modelo ativo automaticamente
  useEffect(() => {
    if (models.length > 0 && !selectedModelId) {
      const activeModel = models.find((m: any) => m.isActive);
      if (activeModel) {
        setSelectedModelId(activeModel.id);
      } else {
        setSelectedModelId(models[0].id);
      }
    }
  }, [models, selectedModelId]);

  // Extrair variáveis do prompt
  useEffect(() => {
    if (prompt?.content) {
      const regex = /\{\{?(\w+)\}?\}/g;
      const matches = prompt.content.matchAll(regex);
      const vars: Record<string, string> = {};
      
      for (const match of matches) {
        const varName = match[1];
        if (!vars[varName]) {
          vars[varName] = '';
        }
      }
      
      setVariables(vars);
    }
  }, [prompt]);

  const handleExecute = async () => {
    if (!selectedModelId) {
      alert('Por favor, selecione um modelo');
      return;
    }

    console.log('🚀 Executando prompt:', {
      promptId: prompt.id,
      modelId: selectedModelId,
      variables,
      temperature,
      maxTokens,
    });

    setIsExecuting(true);
    setResult(null);

    await executePromptMutation.mutateAsync({
      promptId: prompt.id,
      modelId: selectedModelId,
      variables,
      temperature,
      maxTokens,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🚀 Executar Prompt
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Prompt Info */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {prompt?.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-mono whitespace-pre-wrap">
              {prompt?.content}
            </p>
          </div>

          {/* Modelo Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              🤖 Selecionar Modelo de IA
            </label>
            {modelsLoading ? (
              <p className="text-sm text-gray-500">Carregando modelos...</p>
            ) : models.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Nenhum modelo encontrado. Configure modelos em LM Studio ou adicione APIs externas.
                </p>
              </div>
            ) : (
              <select
                value={selectedModelId || ''}
                onChange={(e) => setSelectedModelId(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um modelo...</option>
                {models.map((model: any) => (
                  <option key={model.id} value={model.id}>
                    {model.isActive && '✓ '}
                    {model.name} ({model.providerName || 'Local'})
                    {model.isLoaded && ' - Carregado'}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Variáveis */}
          {Object.keys(variables).length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                📝 Variáveis do Prompt
              </label>
              <div className="space-y-3">
                {Object.keys(variables).map((varName) => (
                  <div key={varName}>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {varName}
                    </label>
                    <input
                      type="text"
                      value={variables[varName]}
                      onChange={(e) => setVariables({ ...variables, [varName]: e.target.value })}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500"
                      placeholder={`Digite o valor para ${varName}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Configurações */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                🌡️ Temperatura: {temperature}
              </label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Controla a criatividade (0 = preciso, 2 = criativo)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                📏 Max Tokens: {maxTokens}
              </label>
              <input
                type="number"
                min="100"
                max="8000"
                step="100"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
          </div>

          {/* Resultado */}
          {result && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resultado da Execução
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap font-mono bg-white dark:bg-gray-800 p-3 rounded">
                {result.output}
              </div>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                ⏱️ Tempo: {result.executionTime}ms
                {result.tokensUsed && ` | 🎯 Tokens: ${result.tokensUsed}`}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleExecute}
              disabled={isExecuting || !selectedModelId}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExecuting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Executando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Executar Agora
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
