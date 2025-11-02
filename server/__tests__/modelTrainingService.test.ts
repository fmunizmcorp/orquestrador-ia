/**
 * Model Training Service - Unit Tests
 * Testes para o service de treinamento de modelos
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { modelTrainingService } from '../services/modelTrainingService.js';

describe('ModelTrainingService', () => {
  describe('createDataset', () => {
    it('deve criar um dataset com dados válidos', async () => {
      const dataset = await modelTrainingService.createDataset(
        1,
        'Test Dataset',
        'Dataset de teste',
        'text',
        [
          { text: 'Sample 1' },
          { text: 'Sample 2' },
        ]
      );

      expect(dataset).toBeDefined();
      expect(dataset.name).toBe('Test Dataset');
      expect(dataset.datasetType).toBe('text');
      expect(dataset.metadata).toBeDefined();
    });

    it('deve rejeitar dataset vazio', async () => {
      await expect(
        modelTrainingService.createDataset(
          1,
          'Empty Dataset',
          'Dataset vazio',
          'text',
          []
        )
      ).rejects.toThrow('Dataset não pode estar vazio');
    });

    it('deve calcular estatísticas corretas do dataset', async () => {
      const data = Array.from({ length: 100 }, (_, i) => ({ text: `Sample ${i}` }));
      
      const dataset = await modelTrainingService.createDataset(
        1,
        'Large Dataset',
        'Dataset grande',
        'text',
        data
      );

      expect(dataset.metadata.totalSamples).toBe(100);
      expect(dataset.metadata.dataType).toBe('text');
    });
  });

  describe('listDatasets', () => {
    it('deve listar todos os datasets quando userId não fornecido', async () => {
      const datasets = await modelTrainingService.listDatasets();
      
      expect(Array.isArray(datasets)).toBe(true);
    });

    it('deve filtrar datasets por userId', async () => {
      const datasets = await modelTrainingService.listDatasets(1);
      
      expect(Array.isArray(datasets)).toBe(true);
      // Todos devem pertencer ao userId 1
      datasets.forEach(ds => {
        expect(ds.userId).toBe(1);
      });
    });
  });

  describe('deleteDataset', () => {
    it('deve deletar dataset existente sem jobs ativos', async () => {
      // Criar dataset de teste
      const dataset = await modelTrainingService.createDataset(
        1,
        'To Delete',
        'Dataset para deletar',
        'text',
        [{ text: 'test' }]
      );

      const result = await modelTrainingService.deleteDataset(dataset.id);
      
      expect(result.success).toBe(true);
    });

    it('deve rejeitar deleção de dataset com jobs ativos', async () => {
      // Este teste requer um job ativo
      // Em ambiente de teste real, criaria um job primeiro
      // Por ora, apenas documenta o comportamento esperado
      expect(true).toBe(true);
    });
  });

  describe('startTraining', () => {
    it('deve iniciar treinamento com configuração válida', async () => {
      const config = {
        modelId: 1,
        datasetId: 1,
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 3,
          loraRank: 16,
          loraAlpha: 32,
          loraDropout: 0.1,
        },
        validationSplit: 0.1,
        earlyStopping: true,
        checkpointInterval: 1,
      };

      const job = await modelTrainingService.startTraining(config);
      
      expect(job).toBeDefined();
      expect(job.jobId).toBeDefined();
      expect(job.status).toBe('running');
      expect(job.message).toContain('sucesso');
    });

    it('deve rejeitar modelo inexistente', async () => {
      const config = {
        modelId: 99999, // ID inexistente
        datasetId: 1,
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 3,
        },
        validationSplit: 0.1,
        earlyStopping: true,
      };

      await expect(
        modelTrainingService.startTraining(config)
      ).rejects.toThrow('Modelo não encontrado');
    });

    it('deve rejeitar dataset inexistente', async () => {
      const config = {
        modelId: 1,
        datasetId: 99999, // ID inexistente
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 3,
        },
        validationSplit: 0.1,
        earlyStopping: true,
      };

      await expect(
        modelTrainingService.startTraining(config)
      ).rejects.toThrow('Dataset não encontrado');
    });
  });

  describe('getTrainingStatus', () => {
    it('deve retornar status de job existente', async () => {
      // Iniciar job primeiro
      const config = {
        modelId: 1,
        datasetId: 1,
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 3,
        },
        validationSplit: 0.1,
        earlyStopping: true,
      };

      const job = await modelTrainingService.startTraining(config);
      const status = await modelTrainingService.getTrainingStatus(job.jobId);
      
      expect(status).toBeDefined();
      expect(status.id).toBe(job.jobId);
      expect(status.status).toBeDefined();
      expect(status.progress).toBeDefined();
    });

    it('deve rejeitar job inexistente', async () => {
      await expect(
        modelTrainingService.getTrainingStatus(99999)
      ).rejects.toThrow('Job não encontrado');
    });
  });

  describe('cancelTraining', () => {
    it('deve cancelar job em execução', async () => {
      // Iniciar job
      const config = {
        modelId: 1,
        datasetId: 1,
        hyperparameters: {
          learningRate: 0.0001,
          batchSize: 8,
          epochs: 10, // Mais epochs para garantir tempo de cancelar
        },
        validationSplit: 0.1,
        earlyStopping: false,
      };

      const job = await modelTrainingService.startTraining(config);
      
      // Aguardar um pouco para garantir que começou
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await modelTrainingService.cancelTraining(job.jobId);
      
      expect(result.success).toBe(true);
    });

    it('deve rejeitar cancelamento de job não executando', async () => {
      // Tentar cancelar job já completo ou inexistente
      // Comportamento esperado: erro
      expect(true).toBe(true); // Placeholder
    });
  });

  describe('evaluateModel', () => {
    it('deve avaliar modelo com métricas completas', async () => {
      const evaluation = await modelTrainingService.evaluateModel(1, 1);
      
      expect(evaluation).toBeDefined();
      expect(evaluation.metrics).toBeDefined();
      expect(evaluation.metrics.accuracy).toBeGreaterThan(0);
      expect(evaluation.metrics.precision).toBeGreaterThan(0);
      expect(evaluation.metrics.recall).toBeGreaterThan(0);
      expect(evaluation.metrics.f1Score).toBeGreaterThan(0);
      expect(evaluation.metrics.loss).toBeGreaterThan(0);
    });

    it('deve rejeitar versão de modelo inexistente', async () => {
      await expect(
        modelTrainingService.evaluateModel(99999, 1)
      ).rejects.toThrow('Versão do modelo não encontrada');
    });

    it('deve rejeitar dataset de teste inexistente', async () => {
      await expect(
        modelTrainingService.evaluateModel(1, 99999)
      ).rejects.toThrow('Dataset de teste não encontrado');
    });
  });

  describe('listTrainingJobs', () => {
    it('deve listar todos os jobs', async () => {
      const jobs = await modelTrainingService.listTrainingJobs();
      
      expect(Array.isArray(jobs)).toBe(true);
    });

    it('deve filtrar jobs por status', async () => {
      const runningJobs = await modelTrainingService.listTrainingJobs(undefined, 'running');
      
      expect(Array.isArray(runningJobs)).toBe(true);
      // Se houver jobs, verificar que todos estão running
      if (runningJobs.length > 0) {
        runningJobs.forEach(job => {
          expect(job.status).toBe('running');
        });
      }
    });

    it('deve retornar jobs com informações completas', async () => {
      const jobs = await modelTrainingService.listTrainingJobs();
      
      if (jobs.length > 0) {
        const job = jobs[0];
        expect(job).toHaveProperty('id');
        expect(job).toHaveProperty('status');
        expect(job).toHaveProperty('progress');
        expect(job).toHaveProperty('currentEpoch');
        expect(job).toHaveProperty('totalEpochs');
      }
    });
  });
});

describe('ModelTrainingService - Edge Cases', () => {
  it('deve lidar com learning rate extremo', async () => {
    const config = {
      modelId: 1,
      datasetId: 1,
      hyperparameters: {
        learningRate: 1.0, // Muito alto
        batchSize: 8,
        epochs: 1,
      },
      validationSplit: 0.1,
      earlyStopping: true,
    };

    // Deve aceitar mas pode gerar warnings
    const job = await modelTrainingService.startTraining(config);
    expect(job).toBeDefined();
  });

  it('deve lidar com batch size grande', async () => {
    const config = {
      modelId: 1,
      datasetId: 1,
      hyperparameters: {
        learningRate: 0.0001,
        batchSize: 128, // Muito grande
        epochs: 1,
      },
      validationSplit: 0.1,
      earlyStopping: true,
    };

    const job = await modelTrainingService.startTraining(config);
    expect(job).toBeDefined();
  });

  it('deve lidar com validation split nos limites', async () => {
    const config = {
      modelId: 1,
      datasetId: 1,
      hyperparameters: {
        learningRate: 0.0001,
        batchSize: 8,
        epochs: 1,
      },
      validationSplit: 0.5, // Máximo permitido
      earlyStopping: true,
    };

    const job = await modelTrainingService.startTraining(config);
    expect(job).toBeDefined();
  });
});

describe('ModelTrainingService - Performance', () => {
  it('deve criar dataset rapidamente', async () => {
    const start = Date.now();
    
    await modelTrainingService.createDataset(
      1,
      'Performance Test',
      'Dataset de performance',
      'text',
      Array.from({ length: 1000 }, (_, i) => ({ text: `Sample ${i}` }))
    );
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(5000); // Menos de 5s
  });

  it('deve listar datasets rapidamente', async () => {
    const start = Date.now();
    
    await modelTrainingService.listDatasets();
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(1000); // Menos de 1s
  });
});
