import { useState, useEffect } from 'react';
import { trpc } from '../lib/trpc';

// ==================================================
// TYPES
// ==================================================

type TrainingTab = 'datasets' | 'jobs' | 'create' | 'evaluate' | 'statistics';

type DataType = 'text' | 'qa' | 'conversation' | 'instruction';
type JobStatus = 'running' | 'completed' | 'failed' | 'cancelled';

interface DatasetFormData {
  name: string;
  description: string;
  dataType: DataType;
  data: any[];
}

interface TrainingJobFormData {
  modelId: number;
  datasetId: number;
  learningRate: number;
  batchSize: number;
  epochs: number;
  warmupSteps?: number;
  maxSteps?: number;
  loraRank?: number;
  loraAlpha?: number;
  loraDropout?: number;
  validationSplit: number;
  earlyStopping: boolean;
  checkpointInterval: number;
}

// ==================================================
// COMPONENTE PRINCIPAL
// ==================================================

const ModelTraining = () => {
  const [activeTab, setActiveTab] = useState<TrainingTab>('datasets');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');

  // ==================================================
  // MODALS
  // ==================================================

  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);

  // ==================================================
  // FORMULÁRIOS
  // ==================================================

  const [datasetForm, setDatasetForm] = useState<DatasetFormData>({
    name: '',
    description: '',
    dataType: 'text',
    data: [],
  });

  const [jobForm, setJobForm] = useState<TrainingJobFormData>({
    modelId: 0,
    datasetId: 0,
    learningRate: 0.001,
    batchSize: 8,
    epochs: 3,
    warmupSteps: 100,
    maxSteps: undefined,
    loraRank: 8,
    loraAlpha: 16,
    loraDropout: 0.1,
    validationSplit: 0.1,
    earlyStopping: true,
    checkpointInterval: 100,
  });

  const [dataInput, setDataInput] = useState('');

  // ==================================================
  // QUERIES
  // ==================================================

  const { data: datasetsData, refetch: refetchDatasets } = trpc.training.listDatasets.useQuery({
    userId: 1, // TODO: Get from auth
  });

  const { data: jobsData, refetch: refetchJobs } = trpc.training.listTrainingJobs.useQuery({
    userId: 1,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const { data: statsData, refetch: refetchStats } = trpc.training.getStatistics.useQuery({});

  const { data: modelsData } = trpc.models.list.useQuery({ query: '' });

  const { data: metricsData, refetch: refetchMetrics } = trpc.training.getTrainingMetrics.useQuery(
    { jobId: selectedJob?.id || 0 },
    { enabled: !!selectedJob && showMetricsModal }
  );

  const { data: logsData, refetch: refetchLogs } = trpc.training.getTrainingLogs.useQuery(
    { jobId: selectedJob?.id || 0, limit: 100 },
    { enabled: !!selectedJob && showLogsModal }
  );

  // ==================================================
  // MUTATIONS
  // ==================================================

  const createDatasetMutation = trpc.training.createDataset.useMutation({
    onSuccess: () => {
      alert('Dataset criado com sucesso!');
      setShowDatasetModal(false);
      refetchDatasets();
      refetchStats();
      resetDatasetForm();
    },
    onError: (error) => {
      alert(`Erro ao criar dataset: ${error.message}`);
    },
  });

  const deleteDatasetMutation = trpc.training.deleteDataset.useMutation({
    onSuccess: () => {
      alert('Dataset deletado!');
      refetchDatasets();
      refetchStats();
    },
    onError: (error) => {
      alert(`Erro ao deletar dataset: ${error.message}`);
    },
  });

  const startTrainingMutation = trpc.training.startTraining.useMutation({
    onSuccess: () => {
      alert('Treinamento iniciado!');
      setShowJobModal(false);
      refetchJobs();
      refetchStats();
      resetJobForm();
    },
    onError: (error) => {
      alert(`Erro ao iniciar treinamento: ${error.message}`);
    },
  });

  const cancelTrainingMutation = trpc.training.cancelTraining.useMutation({
    onSuccess: () => {
      alert('Treinamento cancelado!');
      refetchJobs();
      refetchStats();
    },
    onError: (error) => {
      alert(`Erro ao cancelar treinamento: ${error.message}`);
    },
  });

  const validateDatasetMutation = trpc.training.validateDataset.useMutation();

  const evaluateModelMutation = trpc.training.evaluateModel.useMutation({
    onSuccess: (data) => {
      alert(`Modelo avaliado! Score: ${data.metrics.accuracy || 'N/A'}`);
      setShowEvaluateModal(false);
    },
    onError: (error) => {
      alert(`Erro na avaliação: ${error.message}`);
    },
  });

  // ==================================================
  // HANDLERS
  // ==================================================

  const resetDatasetForm = () => {
    setDatasetForm({
      name: '',
      description: '',
      dataType: 'text',
      data: [],
    });
    setDataInput('');
  };

  const resetJobForm = () => {
    setJobForm({
      modelId: 0,
      datasetId: 0,
      learningRate: 0.001,
      batchSize: 8,
      epochs: 3,
      warmupSteps: 100,
      maxSteps: undefined,
      loraRank: 8,
      loraAlpha: 16,
      loraDropout: 0.1,
      validationSplit: 0.1,
      earlyStopping: true,
      checkpointInterval: 100,
    });
  };

  const handleSubmitDataset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!datasetForm.name || datasetForm.data.length === 0) {
      alert('Preencha o nome e adicione dados ao dataset');
      return;
    }

    try {
      await createDatasetMutation.mutateAsync({
        userId: 1,
        name: datasetForm.name,
        description: datasetForm.description,
        dataType: datasetForm.dataType,
        data: datasetForm.data,
      });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleSubmitJob = async (e: React.FormEvent) => {
    e.preventDefault();

    if (jobForm.modelId === 0 || jobForm.datasetId === 0) {
      alert('Selecione um modelo e um dataset');
      return;
    }

    try {
      await startTrainingMutation.mutateAsync({
        modelId: jobForm.modelId,
        datasetId: jobForm.datasetId,
        hyperparameters: {
          learningRate: jobForm.learningRate,
          batchSize: jobForm.batchSize,
          epochs: jobForm.epochs,
          warmupSteps: jobForm.warmupSteps,
          maxSteps: jobForm.maxSteps,
          loraRank: jobForm.loraRank,
          loraAlpha: jobForm.loraAlpha,
          loraDropout: jobForm.loraDropout,
        },
        validationSplit: jobForm.validationSplit,
        earlyStopping: jobForm.earlyStopping,
        checkpointInterval: jobForm.checkpointInterval,
      });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  const handleAddData = () => {
    if (!dataInput.trim()) return;

    try {
      const parsed = JSON.parse(dataInput);
      setDatasetForm({
        ...datasetForm,
        data: [...datasetForm.data, parsed],
      });
      setDataInput('');
    } catch (error) {
      alert('JSON inválido. Exemplo: {"text": "exemplo"} ou {"q": "pergunta", "a": "resposta"}');
    }
  };

  const handleRemoveData = (index: number) => {
    setDatasetForm({
      ...datasetForm,
      data: datasetForm.data.filter((_, i) => i !== index),
    });
  };

  const handleDeleteDataset = (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este dataset?')) return;
    deleteDatasetMutation.mutate({ id });
  };

  const handleCancelJob = (jobId: number) => {
    if (!confirm('Tem certeza que deseja cancelar este treinamento?')) return;
    cancelTrainingMutation.mutate({ jobId });
  };

  const handleOpenMetrics = (job: any) => {
    setSelectedJob(job);
    setShowMetricsModal(true);
  };

  const handleOpenLogs = (job: any) => {
    setSelectedJob(job);
    setShowLogsModal(true);
  };

  const handleValidateDataset = async () => {
    if (datasetForm.data.length === 0) {
      alert('Adicione dados ao dataset antes de validar');
      return;
    }

    try {
      const result = await validateDatasetMutation.mutateAsync({
        dataType: datasetForm.dataType,
        data: datasetForm.data.slice(0, 10), // Validar amostra
      });

      if (result.valid) {
        alert('✅ Dataset válido!');
      } else {
        alert(`❌ Dataset inválido: ${result.message}`);
      }
    } catch (error: any) {
      alert(`Erro na validação: ${error.message}`);
    }
  };

  const handleEvaluateModel = async (job: any) => {
    setSelectedDataset(null);
    setSelectedJob(job);
    setShowEvaluateModal(true);
  };

  const handleSubmitEvaluation = async (datasetId: number) => {
    if (!selectedJob) return;

    try {
      await evaluateModelMutation.mutateAsync({
        modelId: selectedJob.modelId,
        datasetId,
      });
    } catch (error) {
      // Handled by mutation callbacks
    }
  };

  // ==================================================
  // FILTROS
  // ==================================================

  const filteredDatasets = datasetsData?.datasets.filter((d: any) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredJobs = jobsData?.jobs || [];

  // ==================================================
  // TABS
  // ==================================================

  const tabs: { id: TrainingTab; label: string; icon: string }[] = [
    { id: 'datasets', label: 'Datasets', icon: '📚' },
    { id: 'jobs', label: 'Training Jobs', icon: '🚀' },
    { id: 'create', label: 'Novo Treinamento', icon: '➕' },
    { id: 'evaluate', label: 'Avaliar', icon: '📊' },
    { id: 'statistics', label: 'Estatísticas', icon: '📈' },
  ];

  // ==================================================
  // ESTATÍSTICAS
  // ==================================================

  const stats = statsData || {
    totalDatasets: 0,
    totalJobs: 0,
    runningJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    avgTrainingTime: 0,
    totalTrainedModels: 0,
    bestModelAccuracy: 0,
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">🧠 Treinamento de Modelos</h1>
            <p className="text-gray-400">
              Gerencie datasets, inicie treinamentos e avalie modelos
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => refetchDatasets()} className="btn-secondary">
              🔄 Atualizar
            </button>
            <button onClick={() => setShowDatasetModal(true)} className="btn-primary">
              + Novo Dataset
            </button>
          </div>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Total de Datasets</div>
            <div className="text-white text-xl font-bold">{stats.totalDatasets}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Training Jobs</div>
            <div className="text-white text-xl font-bold">{stats.totalJobs}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Em Execução</div>
            <div className="text-white text-xl font-bold">{stats.runningJobs}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Completados</div>
            <div className="text-white text-xl font-bold">{stats.completedJobs}</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="card">
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTEÚDO DAS TABS */}
      <div className="space-y-4">
        {/* TAB: DATASETS */}
        {activeTab === 'datasets' && (
          <>
            <div className="card">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar datasets..."
                className="input w-full"
              />
            </div>

            {filteredDatasets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDatasets.map((dataset: any) => (
                  <div key={dataset.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">{dataset.name}</h3>
                        <p className="text-gray-400 text-sm">
                          Tipo: {dataset.dataType || 'N/A'}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                        {dataset.recordCount || 0} registros
                      </span>
                    </div>

                    {dataset.description && (
                      <p className="text-gray-400 text-sm mb-3">{dataset.description}</p>
                    )}

                    <div className="space-y-2 text-sm mb-3">
                      {dataset.fileSize && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tamanho:</span>
                          <span className="text-white">
                            {(dataset.fileSize / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Criado:</span>
                        <span className="text-white">
                          {new Date(dataset.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setJobForm({ ...jobForm, datasetId: dataset.id });
                          setActiveTab('create');
                        }}
                        className="btn-primary text-sm flex-1"
                      >
                        🚀 Treinar
                      </button>
                      <button
                        onClick={() => handleDeleteDataset(dataset.id)}
                        className="btn-danger text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhum dataset encontrado</p>
                <p className="text-sm mb-4">Crie seu primeiro dataset para começar</p>
                <button onClick={() => setShowDatasetModal(true)} className="btn-primary">
                  + Novo Dataset
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB: TRAINING JOBS */}
        {activeTab === 'jobs' && (
          <>
            <div className="card">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar jobs..."
                  className="input flex-1"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="input"
                >
                  <option value="all">Todos os Status</option>
                  <option value="running">Em Execução</option>
                  <option value="completed">Completados</option>
                  <option value="failed">Falhados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="space-y-3">
                {filteredJobs.map((job: any) => (
                  <div key={job.id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">
                          Job #{job.id} - Modelo #{job.modelId}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Dataset #{job.datasetId} • Iniciado em{' '}
                          {job.startedAt
                            ? new Date(job.startedAt).toLocaleString('pt-BR')
                            : 'N/A'}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          job.status === 'running'
                            ? 'bg-blue-600 text-white'
                            : job.status === 'completed'
                            ? 'bg-green-600 text-white'
                            : job.status === 'failed'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {job.status === 'running' && '⏳ Executando'}
                        {job.status === 'completed' && '✅ Completo'}
                        {job.status === 'failed' && '❌ Falhou'}
                        {job.status === 'cancelled' && '🚫 Cancelado'}
                      </span>
                    </div>

                    {/* Progresso */}
                    {job.status === 'running' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>
                            Época {job.currentEpoch || 0}/{job.totalEpochs || 0}
                          </span>
                          <span>{((job.currentEpoch / job.totalEpochs) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                (job.currentEpoch / job.totalEpochs) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Hiperparâmetros */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                      <div className="bg-gray-800 rounded p-2">
                        <div className="text-gray-400 text-xs">Learning Rate</div>
                        <div className="text-white">
                          {job.metadata?.learningRate || 'N/A'}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <div className="text-gray-400 text-xs">Batch Size</div>
                        <div className="text-white">{job.metadata?.batchSize || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <div className="text-gray-400 text-xs">Épocas</div>
                        <div className="text-white">{job.totalEpochs || 'N/A'}</div>
                      </div>
                      <div className="bg-gray-800 rounded p-2">
                        <div className="text-gray-400 text-xs">LoRA Rank</div>
                        <div className="text-white">{job.metadata?.loraRank || 'N/A'}</div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenMetrics(job)}
                        className="btn-secondary text-sm flex-1"
                      >
                        📊 Métricas
                      </button>
                      <button
                        onClick={() => handleOpenLogs(job)}
                        className="btn-secondary text-sm flex-1"
                      >
                        📜 Logs
                      </button>
                      {job.status === 'completed' && (
                        <button
                          onClick={() => handleEvaluateModel(job)}
                          className="btn-primary text-sm flex-1"
                        >
                          🎯 Avaliar
                        </button>
                      )}
                      {job.status === 'running' && (
                        <button
                          onClick={() => handleCancelJob(job.id)}
                          className="btn-danger text-sm"
                        >
                          🚫 Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12 text-gray-400">
                <p className="text-lg mb-2">Nenhum training job encontrado</p>
                <p className="text-sm mb-4">Inicie um novo treinamento</p>
                <button onClick={() => setActiveTab('create')} className="btn-primary">
                  + Novo Treinamento
                </button>
              </div>
            )}
          </>
        )}

        {/* TAB: CRIAR TREINAMENTO */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmitJob} className="card space-y-6">
            <h2 className="text-xl font-bold text-white">🚀 Novo Training Job</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Modelo *</label>
                <select
                  value={jobForm.modelId}
                  onChange={(e) => setJobForm({ ...jobForm, modelId: Number(e.target.value) })}
                  className="input w-full"
                  required
                >
                  <option value="0">Selecione um modelo</option>
                  {modelsData?.items.map((model: any) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Dataset *</label>
                <select
                  value={jobForm.datasetId}
                  onChange={(e) => setJobForm({ ...jobForm, datasetId: Number(e.target.value) })}
                  className="input w-full"
                  required
                >
                  <option value="0">Selecione um dataset</option>
                  {datasetsData?.datasets.map((dataset: any) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name} ({dataset.recordCount || 0} registros)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hiperparâmetros */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-4">⚙️ Hiperparâmetros</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Learning Rate: {jobForm.learningRate}
                  </label>
                  <input
                    type="range"
                    min="0.0001"
                    max="0.1"
                    step="0.0001"
                    value={jobForm.learningRate}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, learningRate: parseFloat(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Batch Size</label>
                  <input
                    type="number"
                    min="1"
                    max="128"
                    value={jobForm.batchSize}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, batchSize: parseInt(e.target.value) })
                    }
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Épocas</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={jobForm.epochs}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, epochs: parseInt(e.target.value) })
                    }
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Warmup Steps</label>
                  <input
                    type="number"
                    min="0"
                    value={jobForm.warmupSteps}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, warmupSteps: parseInt(e.target.value) || undefined })
                    }
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">LoRA Rank</label>
                  <input
                    type="number"
                    min="1"
                    max="128"
                    value={jobForm.loraRank}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, loraRank: parseInt(e.target.value) || undefined })
                    }
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">LoRA Alpha</label>
                  <input
                    type="number"
                    min="1"
                    max="256"
                    value={jobForm.loraAlpha}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, loraAlpha: parseInt(e.target.value) || undefined })
                    }
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    LoRA Dropout: {jobForm.loraDropout}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={jobForm.loraDropout}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, loraDropout: parseFloat(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    Validation Split: {jobForm.validationSplit}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.05"
                    value={jobForm.validationSplit}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, validationSplit: parseFloat(e.target.value) })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Checkpoint Interval</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={jobForm.checkpointInterval}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, checkpointInterval: parseInt(e.target.value) })
                    }
                    className="input w-full"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={jobForm.earlyStopping}
                    onChange={(e) =>
                      setJobForm({ ...jobForm, earlyStopping: e.target.checked })
                    }
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-300">Early Stopping</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                🚀 Iniciar Treinamento
              </button>
              <button
                type="button"
                onClick={resetJobForm}
                className="btn-secondary"
              >
                🔄 Resetar
              </button>
            </div>
          </form>
        )}

        {/* TAB: AVALIAR */}
        {activeTab === 'evaluate' && (
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-4">🎯 Avaliar Modelos Treinados</h2>
            <p className="text-gray-400 mb-6">
              Selecione um training job completado na aba "Training Jobs" e clique em "Avaliar"
            </p>
          </div>
        )}

        {/* TAB: ESTATÍSTICAS */}
        {activeTab === 'statistics' && (
          <div className="space-y-4">
            <div className="card">
              <h2 className="text-xl font-bold text-white mb-4">📈 Estatísticas de Treinamento</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Total de Datasets</div>
                  <div className="text-white text-3xl font-bold">{stats.totalDatasets}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Total de Training Jobs</div>
                  <div className="text-white text-3xl font-bold">{stats.totalJobs}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Jobs em Execução</div>
                  <div className="text-white text-3xl font-bold">{stats.runningJobs}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Jobs Completados</div>
                  <div className="text-white text-3xl font-bold">{stats.completedJobs}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Jobs Falhados</div>
                  <div className="text-white text-3xl font-bold">{stats.failedJobs}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Tempo Médio (min)</div>
                  <div className="text-white text-3xl font-bold">
                    {Math.round(stats.avgTrainingTime / 60) || 0}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Modelos Treinados</div>
                  <div className="text-white text-3xl font-bold">{stats.totalTrainedModels}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Melhor Acurácia</div>
                  <div className="text-white text-3xl font-bold">
                    {(stats.bestModelAccuracy * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Taxa de Sucesso</div>
                  <div className="text-white text-3xl font-bold">
                    {stats.totalJobs > 0
                      ? Math.round((stats.completedJobs / stats.totalJobs) * 100)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: CRIAR DATASET */}
      {showDatasetModal && (
        <div className="modal-overlay" onClick={() => setShowDatasetModal(false)}>
          <div className="modal-content max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">📚 Novo Dataset</h2>

            <form onSubmit={handleSubmitDataset} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Nome *</label>
                  <input
                    type="text"
                    value={datasetForm.name}
                    onChange={(e) => setDatasetForm({ ...datasetForm, name: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Tipo de Dados *</label>
                  <select
                    value={datasetForm.dataType}
                    onChange={(e) =>
                      setDatasetForm({ ...datasetForm, dataType: e.target.value as DataType })
                    }
                    className="input w-full"
                  >
                    <option value="text">Texto</option>
                    <option value="qa">Q&A</option>
                    <option value="conversation">Conversação</option>
                    <option value="instruction">Instrução</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 mb-2">Descrição</label>
                  <textarea
                    value={datasetForm.description}
                    onChange={(e) =>
                      setDatasetForm({ ...datasetForm, description: e.target.value })
                    }
                    rows={3}
                    className="input w-full"
                  />
                </div>
              </div>

              {/* Adicionar Dados */}
              <div>
                <label className="block text-gray-300 mb-2">Adicionar Dados (JSON)</label>
                <div className="flex gap-2 mb-2">
                  <textarea
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                    rows={3}
                    className="input flex-1 font-mono text-sm"
                    placeholder='{"text": "exemplo"} ou {"q": "pergunta", "a": "resposta"}'
                  />
                  <button type="button" onClick={handleAddData} className="btn-secondary">
                    + Add
                  </button>
                </div>

                {/* Lista de Dados */}
                {datasetForm.data.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <p className="text-gray-400 text-sm mb-2">
                      {datasetForm.data.length} registro(s)
                    </p>
                    {datasetForm.data.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 mb-2 bg-gray-700 rounded p-2"
                      >
                        <pre className="text-white text-xs flex-1 overflow-x-auto">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                        <button
                          type="button"
                          onClick={() => handleRemoveData(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  💾 Criar Dataset
                </button>
                <button
                  type="button"
                  onClick={handleValidateDataset}
                  className="btn-secondary"
                >
                  ✓ Validar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDatasetModal(false);
                    resetDatasetForm();
                  }}
                  className="btn-secondary"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MÉTRICAS */}
      {showMetricsModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowMetricsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">
              📊 Métricas - Job #{selectedJob.id}
            </h2>

            {metricsData && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">Época Atual</div>
                  <div className="text-white text-2xl font-bold">
                    {metricsData.metrics.currentEpoch || 0}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-gray-400 text-sm">Status</div>
                  <div className="text-white text-2xl font-bold">{metricsData.metrics.status}</div>
                </div>
                {metricsData.metrics.startTime && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Início</div>
                    <div className="text-white text-sm">
                      {new Date(metricsData.metrics.startTime).toLocaleString('pt-BR')}
                    </div>
                  </div>
                )}
                {metricsData.metrics.endTime && (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="text-gray-400 text-sm">Fim</div>
                    <div className="text-white text-sm">
                      {new Date(metricsData.metrics.endTime).toLocaleString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setShowMetricsModal(false)} className="btn-secondary w-full mt-4">
              ❌ Fechar
            </button>
          </div>
        </div>
      )}

      {/* MODAL: LOGS */}
      {showLogsModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowLogsModal(false)}>
          <div className="modal-content max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">
              📜 Logs - Job #{selectedJob.id}
            </h2>

            <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
              {logsData?.logs && logsData.logs.length > 0 ? (
                logsData.logs.map((log: any, index: number) => (
                  <div key={index} className="mb-2">
                    <span className="text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                    {' '}
                    <span
                      className={
                        log.level === 'error'
                          ? 'text-red-400'
                          : log.level === 'warning'
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }
                    >
                      [{log.level.toUpperCase()}]
                    </span>
                    {' '}
                    <span className="text-white">{log.message}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Nenhum log disponível</p>
              )}
            </div>

            <button onClick={() => setShowLogsModal(false)} className="btn-secondary w-full mt-4">
              ❌ Fechar
            </button>
          </div>
        </div>
      )}

      {/* MODAL: AVALIAR */}
      {showEvaluateModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowEvaluateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">
              🎯 Avaliar Modelo - Job #{selectedJob.id}
            </h2>

            <p className="text-gray-400 mb-4">Selecione um dataset para avaliação:</p>

            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {datasetsData?.datasets.map((dataset: any) => (
                <button
                  key={dataset.id}
                  onClick={() => handleSubmitEvaluation(dataset.id)}
                  className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="text-white font-semibold">{dataset.name}</div>
                  <div className="text-gray-400 text-sm">
                    {dataset.dataType} • {dataset.recordCount || 0} registros
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowEvaluateModal(false)}
              className="btn-secondary w-full"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelTraining;
