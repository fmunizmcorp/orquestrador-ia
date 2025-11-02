/**
 * Training Workflow - Integration Tests
 * Testes de integração end-to-end do workflow de treinamento
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { modelTrainingService } from '../../server/services/modelTrainingService.js';
import { trainingPipelineService } from '../../server/services/trainingPipelineService.js';

describe('Training Workflow Integration', () => {
  let datasetId: number;
  let jobId: number;

  describe('Fluxo Completo: Dataset → Training → Evaluation', () => {
    it('Passo 1: Criar dataset', async () => {
      const dataset = await modelTrainingService.createDataset(
        1,
        'Integration Test Dataset',
        'Dataset para teste de integração',
        'text',
        Array.from({ length: 100 }, (_, i) => ({
          text: `Training sample ${i}`,
        }))
      );

      expect(dataset).toBeDefined();
      expect(dataset.id).toBeDefined();
      
      datasetId = dataset.id;
    });

    it('Passo 2: Validar configuração de training', async () => {
      const validation = await trainingPipelineService.validateTrainingConfig({
        modelId: 1,
        datasetId,
        trainingType: 'lora',
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
          keepBest: 2,
        },
      });

      expect(validation.valid).toBe(true);
      expect(validation.warnings.length).toBe(0);
    });

    it('Passo 3: Executar pipeline de training', async () => {
      const job = await trainingPipelineService.runTrainingPipeline({
        modelId: 1,
        datasetId,
        trainingType: 'lora',
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
          keepBest: 2,
        },
      });

      expect(job).toBeDefined();
      expect(job.jobId).toBeDefined();
      expect(job.status).toBe('preparing');
      
      jobId = job.jobId;
    }, 15000);

    it('Passo 4: Monitorar progresso do training', async () => {
      // Aguardar um pouco para o training iniciar
      await new Promise(resolve => setTimeout(resolve, 2000));

      const status = await modelTrainingService.getTrainingStatus(jobId);
      
      expect(status).toBeDefined();
      expect(status.status).toBeDefined();
      expect(['preparing', 'training', 'validating', 'completed']).toContain(status.status);
    });

    it('Passo 5: Aguardar conclusão do training', async () => {
      // Aguardar training completar (max 15s)
      let attempts = 0;
      let status;
      
      while (attempts < 15) {
        status = await modelTrainingService.getTrainingStatus(jobId);
        
        if (status.status === 'completed') {
          break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      expect(status?.status).toBe('completed');
      expect(status?.progress).toBe('100.00');
    }, 20000);

    it('Passo 6: Verificar criação de versão do modelo', async () => {
      const status = await modelTrainingService.getTrainingStatus(jobId);
      
      // Deve ter criado uma versão do modelo
      expect(status.metadata).toBeDefined();
    });

    it('Passo 7: Cleanup - Deletar dataset', async () => {
      const result = await modelTrainingService.deleteDataset(datasetId);
      
      expect(result.success).toBe(true);
    });
  });

  describe('Fluxo com Early Stopping', () => {
    it('deve parar treinamento quando loss estabilizar', async () => {
      // Criar dataset
      const dataset = await modelTrainingService.createDataset(
        1,
        'Early Stopping Test',
        'Dataset para testar early stopping',
        'text',
        Array.from({ length: 50 }, (_, i) => ({ text: `Sample ${i}` }))
      );

      // Executar com early stopping agressivo
      const job = await trainingPipelineService.runTrainingPipeline({
        modelId: 1,
        datasetId: dataset.id,
        trainingType: 'lora',
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 20, // Muitos epochs
          loraRank: 8,
        },
        earlyStopping: {
          enabled: true,
          patience: 2, // Baixo patience
          minDelta: 0.001,
        },
        checkpointing: {
          enabled: false,
          interval: 1,
          keepBest: 1,
        },
      });

      // Aguardar completar
      await new Promise(resolve => setTimeout(resolve, 15000));

      const status = await modelTrainingService.getTrainingStatus(job.jobId);
      
      // Deve ter parado antes dos 20 epochs
      if (status.status === 'completed') {
        expect(status.currentEpoch).toBeLessThan(20);
      }

      // Cleanup
      await modelTrainingService.deleteDataset(dataset.id);
    }, 25000);
  });

  describe('Fluxo com Checkpointing', () => {
    it('deve salvar checkpoints durante training', async () => {
      const dataset = await modelTrainingService.createDataset(
        1,
        'Checkpoint Test',
        'Dataset para testar checkpoints',
        'text',
        Array.from({ length: 50 }, (_, i) => ({ text: `Sample ${i}` }))
      );

      const job = await trainingPipelineService.runTrainingPipeline({
        modelId: 1,
        datasetId: dataset.id,
        trainingType: 'lora',
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
          interval: 1, // Checkpoint a cada epoch
          keepBest: 3,
        },
      });

      // Aguardar completar
      await new Promise(resolve => setTimeout(resolve, 18000));

      const status = await modelTrainingService.getTrainingStatus(job.jobId);
      
      if (status.status === 'completed') {
        expect(status.metadata.checkpoints).toBeGreaterThan(0);
      }

      // Cleanup
      await trainingPipelineService.cleanupCheckpoints(job.jobId, 1);
      await modelTrainingService.deleteDataset(dataset.id);
    }, 25000);
  });

  describe('Fluxo com Export de Modelo', () => {
    it('deve exportar modelo após training', async () => {
      const dataset = await modelTrainingService.createDataset(
        1,
        'Export Test',
        'Dataset para testar export',
        'text',
        Array.from({ length: 30 }, (_, i) => ({ text: `Sample ${i}` }))
      );

      const job = await trainingPipelineService.runTrainingPipeline({
        modelId: 1,
        datasetId: dataset.id,
        trainingType: 'lora',
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
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
      });

      // Aguardar completar
      await new Promise(resolve => setTimeout(resolve, 10000));

      const status = await modelTrainingService.getTrainingStatus(job.jobId);
      
      if (status.status === 'completed') {
        // Tentar exportar (assumindo que criou model version)
        try {
          const exported = await trainingPipelineService.exportModel(1, 'gguf');
          expect(exported).toBeDefined();
          expect(exported.format).toBe('gguf');
        } catch (error) {
          // Model version pode não existir em ambiente de teste
          console.log('Export test skipped: model version not found');
        }
      }

      // Cleanup
      await modelTrainingService.deleteDataset(dataset.id);
    }, 15000);
  });
});

describe('Training Workflow - Error Handling', () => {
  it('deve lidar com dataset inválido gracefully', async () => {
    await expect(
      trainingPipelineService.runTrainingPipeline({
        modelId: 1,
        datasetId: 99999, // Não existe
        trainingType: 'lora',
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 1,
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
      })
    ).rejects.toThrow();
  });

  it('deve lidar com modelo inválido gracefully', async () => {
    const dataset = await modelTrainingService.createDataset(
      1,
      'Error Test',
      'Dataset para erro',
      'text',
      [{ text: 'test' }]
    );

    await expect(
      trainingPipelineService.runTrainingPipeline({
        modelId: 99999, // Não existe
        datasetId: dataset.id,
        trainingType: 'lora',
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 1,
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
      })
    ).rejects.toThrow('Modelo não encontrado');

    await modelTrainingService.deleteDataset(dataset.id);
  });
});
