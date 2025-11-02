/**
 * Training Pipeline Service - Unit Tests
 * Testes para o pipeline completo de treinamento
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { trainingPipelineService } from '../services/trainingPipelineService.js';

describe('TrainingPipelineService', () => {
  describe('prepareData', () => {
    it('deve preparar dados com split correto', async () => {
      const result = await trainingPipelineService.prepareData({
        datasetId: 1,
        validationSplit: 0.2,
        shuffleData: true,
      });

      expect(result).toBeDefined();
      expect(result.trainPath).toBeDefined();
      expect(result.validationPath).toBeDefined();
      expect(result.stats).toBeDefined();
      expect(result.stats.validationSplit).toBe(0.2);
    });

    it('deve calcular amostras de treino corretamente', async () => {
      const result = await trainingPipelineService.prepareData({
        datasetId: 1,
        validationSplit: 0.1,
        shuffleData: false,
      });

      const totalExpected = result.stats.trainSamples + result.stats.validationSamples;
      expect(totalExpected).toBe(result.stats.totalSamples);
    });

    it('deve aplicar max samples quando especificado', async () => {
      const result = await trainingPipelineService.prepareData({
        datasetId: 1,
        validationSplit: 0.1,
        shuffleData: true,
        maxSamples: 500,
      });

      expect(result.stats.maxSamplesApplied).toBe(500);
    });
  });

  describe('validateTrainingConfig', () => {
    it('deve validar configuração ótima sem warnings', async () => {
      const config = {
        modelId: 1,
        datasetId: 1,
        trainingType: 'lora' as const,
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 10,
          loraRank: 16,
          loraAlpha: 32,
          loraDropout: 0.1,
        },
        earlyStopping: {
          enabled: true,
          patience: 3,
          minDelta: 0.001,
        },
        checkpointing: {
          enabled: true,
          interval: 1,
          keepBest: 3,
        },
      };

      const validation = await trainingPipelineService.validateTrainingConfig(config);
      
      expect(validation.valid).toBe(true);
      expect(validation.warnings.length).toBe(0);
    });

    it('deve gerar warning para learning rate alto', async () => {
      const config = {
        modelId: 1,
        datasetId: 1,
        trainingType: 'lora' as const,
        hyperparameters: {
          learningRate: 0.01, // Muito alto
          batchSize: 8,
          epochs: 10,
          loraRank: 16,
        },
        earlyStopping: {
          enabled: true,
          patience: 3,
          minDelta: 0.001,
        },
        checkpointing: {
          enabled: true,
          interval: 1,
          keepBest: 3,
        },
      };

      const validation = await trainingPipelineService.validateTrainingConfig(config);
      
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(w => w.includes('Learning rate'))).toBe(true);
    });

    it('deve gerar warning para batch size alto', async () => {
      const config = {
        modelId: 1,
        datasetId: 1,
        trainingType: 'lora' as const,
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 64, // Alto
          epochs: 10,
        },
        earlyStopping: {
          enabled: true,
          patience: 3,
          minDelta: 0.001,
        },
        checkpointing: {
          enabled: true,
          interval: 1,
          keepBest: 3,
        },
      };

      const validation = await trainingPipelineService.validateTrainingConfig(config);
      
      expect(validation.warnings.length).toBeGreaterThan(0);
      expect(validation.warnings.some(w => w.includes('Batch size'))).toBe(true);
    });

    it('deve recomendar para LoRA sem rank', async () => {
      const config = {
        modelId: 1,
        datasetId: 1,
        trainingType: 'lora' as const,
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 10,
          // loraRank não especificado
        },
        earlyStopping: {
          enabled: true,
          patience: 3,
          minDelta: 0.001,
        },
        checkpointing: {
          enabled: true,
          interval: 1,
          keepBest: 3,
        },
      };

      const validation = await trainingPipelineService.validateTrainingConfig(config);
      
      expect(validation.warnings.some(w => w.includes('LoRA rank'))).toBe(true);
      expect(validation.recommendations.length).toBeGreaterThan(0);
    });

    it('deve avisar sobre patience baixo', async () => {
      const config = {
        modelId: 1,
        datasetId: 1,
        trainingType: 'lora' as const,
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 10,
        },
        earlyStopping: {
          enabled: true,
          patience: 1, // Muito baixo
          minDelta: 0.001,
        },
        checkpointing: {
          enabled: true,
          interval: 1,
          keepBest: 3,
        },
      };

      const validation = await trainingPipelineService.validateTrainingConfig(config);
      
      expect(validation.warnings.some(w => w.includes('Patience'))).toBe(true);
    });
  });

  describe('runTrainingPipeline', () => {
    it('deve executar pipeline completo', async () => {
      const config = {
        modelId: 1,
        datasetId: 1,
        trainingType: 'lora' as const,
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 3,
          loraRank: 16,
          loraAlpha: 32,
        },
        earlyStopping: {
          enabled: true,
          patience: 3,
          minDelta: 0.001,
        },
        checkpointing: {
          enabled: true,
          interval: 1,
          keepBest: 3,
        },
      };

      const result = await trainingPipelineService.runTrainingPipeline(config);
      
      expect(result).toBeDefined();
      expect(result.jobId).toBeDefined();
      expect(result.status).toBe('preparing');
      expect(result.message).toContain('sucesso');
    });

    it('deve iniciar com todas as fases do pipeline', async () => {
      const config = {
        modelId: 1,
        datasetId: 1,
        trainingType: 'qlora' as const,
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 4,
          epochs: 5,
          loraRank: 8,
        },
        earlyStopping: {
          enabled: true,
          patience: 2,
          minDelta: 0.01,
        },
        checkpointing: {
          enabled: true,
          interval: 2,
          keepBest: 2,
        },
      };

      const result = await trainingPipelineService.runTrainingPipeline(config);
      
      expect(result.jobId).toBeGreaterThan(0);
      
      // Aguardar um pouco para pipeline iniciar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pipeline deve estar em uma das fases
      expect(['preparing', 'training', 'validating']).toContain(result.status);
    });
  });

  describe('exportModel', () => {
    it('deve exportar modelo em formato GGUF', async () => {
      const result = await trainingPipelineService.exportModel(1, 'gguf');
      
      expect(result).toBeDefined();
      expect(result.path).toContain('.gguf');
      expect(result.format).toBe('gguf');
      expect(result.size).toBeGreaterThan(0);
    });

    it('deve exportar modelo em formato SafeTensors', async () => {
      const result = await trainingPipelineService.exportModel(1, 'safetensors');
      
      expect(result.path).toContain('.safetensors');
      expect(result.format).toBe('safetensors');
    });

    it('deve exportar modelo em formato PyTorch', async () => {
      const result = await trainingPipelineService.exportModel(1, 'pytorch');
      
      expect(result.path).toContain('.pytorch');
      expect(result.format).toBe('pytorch');
    });

    it('deve exportar modelo em formato ONNX', async () => {
      const result = await trainingPipelineService.exportModel(1, 'onnx');
      
      expect(result.path).toContain('.onnx');
      expect(result.format).toBe('onnx');
    });

    it('deve rejeitar modelo inexistente', async () => {
      await expect(
        trainingPipelineService.exportModel(99999, 'gguf')
      ).rejects.toThrow('Versão do modelo não encontrada');
    });
  });

  describe('cleanupCheckpoints', () => {
    it('deve limpar checkpoints mantendo os melhores', async () => {
      await expect(
        trainingPipelineService.cleanupCheckpoints(1, 3)
      ).resolves.not.toThrow();
    });

    it('deve permitir configurar quantos manter', async () => {
      await expect(
        trainingPipelineService.cleanupCheckpoints(1, 5)
      ).resolves.not.toThrow();
    });
  });
});

describe('TrainingPipelineService - Training Types', () => {
  it('deve suportar treinamento LoRA', async () => {
    const config = {
      modelId: 1,
      datasetId: 1,
      trainingType: 'lora' as const,
      hyperparameters: {
        learningRate: 0.0001,
        batchSize: 8,
        epochs: 2,
        loraRank: 16,
        loraAlpha: 32,
      },
      earlyStopping: {
        enabled: false,
        patience: 3,
        minDelta: 0.001,
      },
      checkpointing: {
        enabled: false,
        interval: 1,
        keepBest: 1,
      },
    };

    const result = await trainingPipelineService.runTrainingPipeline(config);
    expect(result.jobId).toBeDefined();
  });

  it('deve suportar treinamento QLoRA', async () => {
    const config = {
      modelId: 1,
      datasetId: 1,
      trainingType: 'qlora' as const,
      hyperparameters: {
        learningRate: 0.0001,
        batchSize: 4,
        epochs: 2,
        loraRank: 8,
      },
      earlyStopping: {
        enabled: false,
        patience: 3,
        minDelta: 0.001,
      },
      checkpointing: {
        enabled: false,
        interval: 1,
        keepBest: 1,
      },
    };

    const result = await trainingPipelineService.runTrainingPipeline(config);
    expect(result.jobId).toBeDefined();
  });

  it('deve suportar treinamento Full', async () => {
    const config = {
      modelId: 1,
      datasetId: 1,
      trainingType: 'full' as const,
      hyperparameters: {
        learningRate: 0.00001,
        batchSize: 4,
        epochs: 2,
      },
      earlyStopping: {
        enabled: false,
        patience: 3,
        minDelta: 0.001,
      },
      checkpointing: {
        enabled: false,
        interval: 1,
        keepBest: 1,
      },
    };

    const result = await trainingPipelineService.runTrainingPipeline(config);
    expect(result.jobId).toBeDefined();
  });

  it('deve suportar fine-tuning padrão', async () => {
    const config = {
      modelId: 1,
      datasetId: 1,
      trainingType: 'fine-tuning' as const,
      hyperparameters: {
        learningRate: 0.0001,
        batchSize: 8,
        epochs: 2,
      },
      earlyStopping: {
        enabled: false,
        patience: 3,
        minDelta: 0.001,
      },
      checkpointing: {
        enabled: false,
        interval: 1,
        keepBest: 1,
      },
    };

    const result = await trainingPipelineService.runTrainingPipeline(config);
    expect(result.jobId).toBeDefined();
  });
});

describe('TrainingPipelineService - Integration', () => {
  it('pipeline completo com early stopping', async () => {
    const config = {
      modelId: 1,
      datasetId: 1,
      trainingType: 'lora' as const,
      hyperparameters: {
        learningRate: 0.0001,
        batchSize: 8,
        epochs: 20, // Muitos epochs para testar early stopping
        loraRank: 16,
      },
      earlyStopping: {
        enabled: true,
        patience: 2,
        minDelta: 0.001,
      },
      checkpointing: {
        enabled: true,
        interval: 1,
        keepBest: 3,
      },
    };

    const result = await trainingPipelineService.runTrainingPipeline(config);
    expect(result.jobId).toBeDefined();
    
    // Early stopping deve parar antes de completar todos os epochs
  }, 30000); // Timeout de 30s para este teste

  it('pipeline completo com checkpointing', async () => {
    const config = {
      modelId: 1,
      datasetId: 1,
      trainingType: 'lora' as const,
      hyperparameters: {
        learningRate: 0.0001,
        batchSize: 8,
        epochs: 5,
        loraRank: 16,
      },
      earlyStopping: {
        enabled: false,
        patience: 3,
        minDelta: 0.001,
      },
      checkpointing: {
        enabled: true,
        interval: 1,
        keepBest: 5,
      },
    };

    const result = await trainingPipelineService.runTrainingPipeline(config);
    expect(result.jobId).toBeDefined();
    
    // Deve criar checkpoints a cada epoch
  }, 20000);
});
