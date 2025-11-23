import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

// ==================================================
// TYPES
// ==================================================

type LMStudioTab = 'models' | 'generate' | 'compare' | 'benchmark' | 'process';

interface ModelInfo {
  id: string;
  name: string;
  size?: number;
  quantization?: string;
  parameters?: string;
  isLoaded?: boolean;
  capabilities?: string[];
}

interface BenchmarkResult {
  modelId: string;
  tokensPerSecond: number;
  latency: number;
  throughput: number;
  memoryUsage?: number;
}

interface ComparisonResult {
  modelId: string;
  response: string;
  tokensPerSecond: number;
  latency: number;
  error?: string;
}

// ==================================================
// COMPONENTE PRINCIPAL
// ==================================================

const LMStudio = () => {
  const [activeTab, setActiveTab] = useState<LMStudioTab>('models');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // ==================================================
  // ESTADO LOCAL
  // ==================================================

  const [generateForm, setGenerateForm] = useState({
    prompt: '',
    temperature: 0.7,
    maxTokens: 2048,
    timeout: 60000,
  });

  const [compareForm, setCompareForm] = useState({
    models: [] as string[],
    prompt: '',
    temperature: 0.7,
    maxTokens: 2048,
  });

  const [processForm, setProcessForm] = useState({
    text: '',
    instruction: '',
  });

  const [generatedText, setGeneratedText] = useState('');
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);
  const [processedText, setProcessedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // ==================================================
  // QUERIES
  // ==================================================

  const { data: statusData, refetch: refetchStatus } = trpc.lmstudio.checkStatus.useQuery();
  const { data: modelsData, refetch: refetchModels } = trpc.lmstudio.listModels.useQuery(
    { forceRefresh: false },
    { enabled: statusData?.isRunning }
  );

  // ==================================================
  // MUTATIONS
  // ==================================================

  const loadModelMutation = trpc.lmstudio.loadModel.useMutation({
    onSuccess: () => {
      alert('Modelo carregado com sucesso!');
      refetchModels();
    },
    onError: (error) => {
      alert(`Erro ao carregar modelo: ${error.message}`);
    },
  });

  const switchModelMutation = trpc.lmstudio.switchModel.useMutation({
    onSuccess: (data) => {
      alert(`Modelo alternado para: ${data.modelId}`);
      refetchModels();
    },
    onError: (error) => {
      alert(`Erro ao alternar modelo: ${error.message}`);
    },
  });

  const generateMutation = trpc.lmstudio.generateCompletion.useMutation({
    onSuccess: (data) => {
      setGeneratedText(data.result.text || JSON.stringify(data.result, null, 2));
      setIsProcessing(false);
    },
    onError: (error) => {
      alert(`Erro ao gerar texto: ${error.message}`);
      setIsProcessing(false);
    },
  });

  const compareMutation = trpc.lmstudio.compareModels.useMutation({
    onSuccess: (data) => {
      setComparisonResults(data.results || []);
      setIsProcessing(false);
    },
    onError: (error) => {
      alert(`Erro ao comparar modelos: ${error.message}`);
      setIsProcessing(false);
    },
  });

  const benchmarkMutation = trpc.lmstudio.benchmarkModel.useMutation({
    onSuccess: (data) => {
      setBenchmarkResult(data as any);
      setIsProcessing(false);
    },
    onError: (error) => {
      alert(`Erro ao realizar benchmark: ${error.message}`);
      setIsProcessing(false);
    },
  });

  const processLongTextMutation = trpc.lmstudio.processLongText.useMutation({
    onSuccess: (data) => {
      setProcessedText(data.result || '');
      setIsProcessing(false);
    },
    onError: (error) => {
      alert(`Erro ao processar texto: ${error.message}`);
      setIsProcessing(false);
    },
  });

  const clearCacheMutation = trpc.lmstudio.clearCache.useMutation({
    onSuccess: () => {
      alert('Cache limpo com sucesso!');
    },
    onError: (error) => {
      alert(`Erro ao limpar cache: ${error.message}`);
    },
  });

  const recommendModelMutation = trpc.lmstudio.recommendModel.useMutation({
    onSuccess: (data) => {
      setSelectedModel(data.recommendedModel || '');
      alert(`Modelo recomendado: ${data.recommendedModel}`);
    },
    onError: (error) => {
      alert(`Erro ao recomendar modelo: ${error.message}`);
    },
  });

  const estimateTokensMutation = trpc.lmstudio.estimateTokens.useMutation({
    onSuccess: (data) => {
      alert(`Estimativa: ${data.tokens} tokens`);
    },
    onError: (error) => {
      alert(`Erro ao estimar tokens: ${error.message}`);
    },
  });

  // ==================================================
  // HANDLERS
  // ==================================================

  const handleLoadModel = async (modelId: string) => {
    if (!confirm(`Carregar modelo ${modelId}?`)) return;
    try {
      await loadModelMutation.mutateAsync({ modelId });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleSwitchModel = async (modelId: string) => {
    try {
      await switchModelMutation.mutateAsync({
        preferredModelId: modelId,
        fallbackModelIds: [],
      });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) {
      alert('Selecione um modelo primeiro');
      return;
    }

    setIsProcessing(true);
    try {
      await generateMutation.mutateAsync({
        modelId: selectedModel,
        prompt: generateForm.prompt,
        temperature: generateForm.temperature,
        maxTokens: generateForm.maxTokens,
        timeout: generateForm.timeout,
      });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (compareForm.models.length < 2) {
      alert('Selecione pelo menos 2 modelos para comparar');
      return;
    }

    setIsProcessing(true);
    try {
      await compareMutation.mutateAsync({
        modelIds: compareForm.models,
        prompt: compareForm.prompt,
        temperature: compareForm.temperature,
        maxTokens: compareForm.maxTokens,
      });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleBenchmark = async () => {
    if (!selectedModel) {
      alert('Selecione um modelo primeiro');
      return;
    }

    setIsProcessing(true);
    try {
      await benchmarkMutation.mutateAsync({ modelId: selectedModel });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleProcessLongText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) {
      alert('Selecione um modelo primeiro');
      return;
    }

    setIsProcessing(true);
    try {
      await processLongTextMutation.mutateAsync({
        modelId: selectedModel,
        text: processForm.text,
        instruction: processForm.instruction,
      });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleToggleCompareModel = (modelId: string) => {
    if (compareForm.models.includes(modelId)) {
      setCompareForm({
        ...compareForm,
        models: compareForm.models.filter((m) => m !== modelId),
      });
    } else {
      if (compareForm.models.length >= 5) {
        alert('Máximo de 5 modelos para comparação');
        return;
      }
      setCompareForm({
        ...compareForm,
        models: [...compareForm.models, modelId],
      });
    }
  };

  const handleEstimateTokens = async (text: string) => {
    try {
      await estimateTokensMutation.mutateAsync({ text });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleRecommendModel = async (taskType: 'code' | 'reasoning' | 'analysis' | 'chat' | 'general') => {
    try {
      await recommendModelMutation.mutateAsync({ taskType });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  // ==================================================
  // FILTROS
  // ==================================================

  const filteredModels = modelsData?.models.filter((model: ModelInfo) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      model.name?.toLowerCase().includes(searchLower) ||
      model.id?.toLowerCase().includes(searchLower) ||
      model.quantization?.toLowerCase().includes(searchLower)
    );
  }) || [];

  // ==================================================
  // TABS
  // ==================================================

  const tabs: { id: LMStudioTab; label: string; icon: string }[] = [
    { id: 'models', label: 'Modelos', icon: '🤖' },
    { id: 'generate', label: 'Gerar', icon: '✨' },
    { id: 'compare', label: 'Comparar', icon: '⚖️' },
    { id: 'benchmark', label: 'Benchmark', icon: '📊' },
    { id: 'process', label: 'Processar', icon: '⚙️' },
  ];

  // ==================================================
  // STATUS
  // ==================================================

  const isRunning = statusData?.isRunning || false;
  const totalModels = modelsData?.models.length || 0;
  const loadedModels = modelsData?.models.filter((m: ModelInfo) => m.isLoaded).length || 0;

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">🤖 LM Studio</h1>
            <p className="text-gray-400">
              Gerencie e interaja com modelos de linguagem locais
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => refetchStatus()} className="btn-secondary">
              🔄 Verificar Status
            </button>
            <button
              onClick={() => refetchModels()}
              disabled={!isRunning}
              className="btn-secondary"
            >
              🔃 Atualizar Modelos
            </button>
            <button
              onClick={() => clearCacheMutation.mutate()}
              className="btn-secondary"
            >
              🗑️ Limpar Cache
            </button>
          </div>
        </div>

        {/* STATUS E ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Status LM Studio</div>
            <div className={`text-xl font-bold ${isRunning ? 'text-green-500' : 'text-red-500'}`}>
              {isRunning ? '✅ Online' : '❌ Offline'}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Total de Modelos</div>
            <div className="text-white text-xl font-bold">{totalModels}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Modelos Carregados</div>
            <div className="text-white text-xl font-bold">{loadedModels}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Modelo Selecionado</div>
            <div className="text-white text-xl font-bold">
              {selectedModel ? '✅' : '❌'}
            </div>
          </div>
        </div>
      </div>

      {!isRunning && (
        <div className="card bg-yellow-900 border-yellow-600">
          <p className="text-white">
            ⚠️ LM Studio não está rodando. Inicie o LM Studio e certifique-se de que o servidor
            local está ativo na porta 1234.
          </p>
        </div>
      )}

      {/* TABS */}
      <div className="card">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={!isRunning}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTEÚDO DAS TABS */}
      <div className="card">
        {/* TAB: MODELOS */}
        {activeTab === 'models' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">🤖 Modelos Disponíveis</h2>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar modelos..."
                className="input w-64"
              />
            </div>

            {/* Recomendações Rápidas */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">🎯 Recomendação Rápida</h3>
              <div className="flex gap-2 flex-wrap">
                {(['code', 'reasoning', 'analysis', 'chat', 'general'] as const).map((taskType) => (
                  <button
                    key={taskType}
                    onClick={() => handleRecommendModel(taskType)}
                    className="btn-secondary text-sm"
                  >
                    {taskType === 'code' && '💻 Código'}
                    {taskType === 'reasoning' && '🧠 Raciocínio'}
                    {taskType === 'analysis' && '📊 Análise'}
                    {taskType === 'chat' && '💬 Chat'}
                    {taskType === 'general' && '🌐 Geral'}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Modelos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredModels.map((model: ModelInfo) => (
                <div
                  key={model.id}
                  className={`bg-gray-800 rounded-lg p-4 border-2 transition-colors ${
                    selectedModel === model.id
                      ? 'border-blue-600'
                      : model.isLoaded
                      ? 'border-green-600'
                      : 'border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{model.name}</h3>
                      <p className="text-gray-400 text-sm break-all">{model.id}</p>
                    </div>
                    {model.isLoaded && (
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                        Carregado
                      </span>
                    )}
                  </div>

                  {(model.quantization || model.parameters || model.size) && (
                    <div className="flex gap-3 text-sm text-gray-400 mb-3">
                      {model.quantization && <span>📊 {model.quantization}</span>}
                      {model.parameters && <span>⚙️ {model.parameters}</span>}
                      {model.size && (
                        <span>💾 {(model.size / (1024 ** 3)).toFixed(2)} GB</span>
                      )}
                    </div>
                  )}

                  {model.capabilities && model.capabilities.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-3">
                      {model.capabilities.map((cap) => (
                        <span key={cap} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {cap}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedModel(model.id)}
                      className={`btn-secondary text-sm flex-1 ${
                        selectedModel === model.id ? 'bg-blue-600 text-white' : ''
                      }`}
                    >
                      {selectedModel === model.id ? '✅ Selecionado' : '📌 Selecionar'}
                    </button>
                    {!model.isLoaded && (
                      <button
                        onClick={() => handleLoadModel(model.id)}
                        disabled={loadModelMutation.isLoading}
                        className="btn-primary text-sm flex-1"
                      >
                        ⬇️ Carregar
                      </button>
                    )}
                    {model.isLoaded && (
                      <button
                        onClick={() => handleSwitchModel(model.id)}
                        disabled={switchModelMutation.isLoading}
                        className="btn-primary text-sm flex-1"
                      >
                        🔄 Usar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredModels.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhum modelo encontrado</p>
                <p className="text-sm">
                  {searchTerm
                    ? 'Tente alterar os filtros de busca'
                    : 'Certifique-se de que o LM Studio está rodando'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB: GERAR */}
        {activeTab === 'generate' && (
          <form onSubmit={handleGenerate} className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">✨ Gerar Texto</h2>

            {!selectedModel && (
              <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                <p className="text-white">⚠️ Selecione um modelo na aba "Modelos" primeiro</p>
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-2">Prompt</label>
              <textarea
                value={generateForm.prompt}
                onChange={(e) => setGenerateForm({ ...generateForm, prompt: e.target.value })}
                rows={6}
                className="input w-full"
                placeholder="Digite seu prompt aqui..."
                required
              />
              <button
                type="button"
                onClick={() => handleEstimateTokens(generateForm.prompt)}
                className="btn-secondary text-sm mt-2"
              >
                🔢 Estimar Tokens
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  Temperatura: {generateForm.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={generateForm.temperature}
                  onChange={(e) =>
                    setGenerateForm({ ...generateForm, temperature: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Max Tokens</label>
                <input
                  type="number"
                  min="1"
                  max="32000"
                  value={generateForm.maxTokens}
                  onChange={(e) =>
                    setGenerateForm({ ...generateForm, maxTokens: parseInt(e.target.value) })
                  }
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Timeout (ms)</label>
                <input
                  type="number"
                  min="1000"
                  max="300000"
                  value={generateForm.timeout}
                  onChange={(e) =>
                    setGenerateForm({ ...generateForm, timeout: parseInt(e.target.value) })
                  }
                  className="input w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedModel || isProcessing}
              className="btn-primary w-full"
            >
              {isProcessing ? '⏳ Gerando...' : '✨ Gerar'}
            </button>

            {generatedText && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Resultado:</h3>
                <pre className="text-gray-300 whitespace-pre-wrap text-sm">{generatedText}</pre>
              </div>
            )}
          </form>
        )}

        {/* TAB: COMPARAR */}
        {activeTab === 'compare' && (
          <form onSubmit={handleCompare} className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">⚖️ Comparar Modelos</h2>

            {/* Seleção de Modelos */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">
                Selecione 2-5 Modelos ({compareForm.models.length}/5)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {modelsData?.models.map((model: ModelInfo) => (
                  <label key={model.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-700">
                    <input
                      type="checkbox"
                      checked={compareForm.models.includes(model.id)}
                      onChange={() => handleToggleCompareModel(model.id)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="text-gray-300">{model.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Prompt</label>
              <textarea
                value={compareForm.prompt}
                onChange={(e) => setCompareForm({ ...compareForm, prompt: e.target.value })}
                rows={4}
                className="input w-full"
                placeholder="Digite o prompt para testar em todos os modelos..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  Temperatura: {compareForm.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={compareForm.temperature}
                  onChange={(e) =>
                    setCompareForm({ ...compareForm, temperature: parseFloat(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Max Tokens</label>
                <input
                  type="number"
                  min="1"
                  max="32000"
                  value={compareForm.maxTokens}
                  onChange={(e) =>
                    setCompareForm({ ...compareForm, maxTokens: parseInt(e.target.value) })
                  }
                  className="input w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={compareForm.models.length < 2 || isProcessing}
              className="btn-primary w-full"
            >
              {isProcessing ? '⏳ Comparando...' : '⚖️ Comparar Modelos'}
            </button>

            {comparisonResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-white font-semibold">Resultados da Comparação:</h3>
                {comparisonResults.map((result, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{result.modelId}</h4>
                      <div className="flex gap-3 text-sm text-gray-400">
                        <span>⚡ {result.tokensPerSecond.toFixed(2)} tok/s</span>
                        <span>⏱️ {result.latency.toFixed(0)}ms</span>
                      </div>
                    </div>
                    {result.error ? (
                      <div className="text-red-400">❌ Erro: {result.error}</div>
                    ) : (
                      <pre className="text-gray-300 whitespace-pre-wrap text-sm">
                        {result.response}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </form>
        )}

        {/* TAB: BENCHMARK */}
        {activeTab === 'benchmark' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">📊 Benchmark de Modelo</h2>

            {!selectedModel && (
              <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                <p className="text-white">⚠️ Selecione um modelo na aba "Modelos" primeiro</p>
              </div>
            )}

            {selectedModel && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Modelo Selecionado:</h3>
                <p className="text-gray-300">{selectedModel}</p>
              </div>
            )}

            <button
              onClick={handleBenchmark}
              disabled={!selectedModel || isProcessing}
              className="btn-primary w-full"
            >
              {isProcessing ? '⏳ Executando Benchmark...' : '🚀 Executar Benchmark'}
            </button>

            {benchmarkResult && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4">Resultados do Benchmark:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-gray-400 text-xs mb-1">Tokens por Segundo</div>
                    <div className="text-white text-2xl font-bold">
                      {benchmarkResult.tokensPerSecond.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-gray-400 text-xs mb-1">Latência (ms)</div>
                    <div className="text-white text-2xl font-bold">
                      {benchmarkResult.latency.toFixed(0)}
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded p-3">
                    <div className="text-gray-400 text-xs mb-1">Throughput</div>
                    <div className="text-white text-2xl font-bold">
                      {benchmarkResult.throughput.toFixed(2)}
                    </div>
                  </div>
                  {benchmarkResult.memoryUsage && (
                    <div className="bg-gray-700 rounded p-3">
                      <div className="text-gray-400 text-xs mb-1">Memória (MB)</div>
                      <div className="text-white text-2xl font-bold">
                        {benchmarkResult.memoryUsage.toFixed(0)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: PROCESSAR */}
        {activeTab === 'process' && (
          <form onSubmit={handleProcessLongText} className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">⚙️ Processar Texto Longo</h2>

            {!selectedModel && (
              <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4">
                <p className="text-white">⚠️ Selecione um modelo na aba "Modelos" primeiro</p>
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-2">Instrução de Processamento</label>
              <textarea
                value={processForm.instruction}
                onChange={(e) => setProcessForm({ ...processForm, instruction: e.target.value })}
                rows={3}
                className="input w-full"
                placeholder="Ex: Resuma o seguinte texto em 3 parágrafos..."
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Texto para Processar</label>
              <textarea
                value={processForm.text}
                onChange={(e) => setProcessForm({ ...processForm, text: e.target.value })}
                rows={10}
                className="input w-full font-mono text-sm"
                placeholder="Cole aqui o texto longo que deseja processar..."
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                O texto será dividido automaticamente em chunks processáveis
              </p>
            </div>

            <button
              type="submit"
              disabled={!selectedModel || isProcessing}
              className="btn-primary w-full"
            >
              {isProcessing ? '⏳ Processando...' : '⚙️ Processar Texto'}
            </button>

            {processedText && (
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">Texto Processado:</h3>
                <pre className="text-gray-300 whitespace-pre-wrap text-sm">{processedText}</pre>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default LMStudio;
