/**
 * Model Training Service
 * Gerenciamento de fine-tuning e treinamento de modelos
 * - Dataset management
 * - Training job orchestration
 * - Model evaluation
 * - Checkpoint management
 * - LoRA/QLoRA support
 */

import { db } from '../db/index.js';
import {
  trainingDatasets,
  trainingJobs,
  modelVersions,
  aiModels,
} from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { withErrorHandling } from '../middleware/errorHandler.js';

interface TrainingHyperparameters {
  learningRate: number;
  batchSize: number;
  epochs: number;
  warmupSteps?: number;
  maxSteps?: number;
  loraRank?: number;
  loraAlpha?: number;
  loraDropout?: number;
}

interface TrainingJobConfig {
  modelId: number;
  datasetId: number;
  hyperparameters: TrainingHyperparameters;
  validationSplit: number;
  earlyStopping: boolean;
  checkpointInterval?: number;
}

class ModelTrainingService {
  /**
   * Criar dataset de treinamento
   */
  async createDataset(
    userId: number,
    name: string,
    description: string,
    dataType: string,
    data: any[]
  ): Promise<any> {
    return withErrorHandling(async () => {
      // Validar dados
      if (!data || data.length === 0) {
        throw new Error('Dataset não pode estar vazio');
      }

      // Estatísticas do dataset
      const stats = {
        totalSamples: data.length,
        dataType,
        createdAt: new Date(),
      };

      // Inserir dataset
      const result: any = await db.insert(trainingDatasets).values({
        userId,
        name,
        description,
        datasetType: dataType as 'text' | 'code' | 'qa' | 'completion' | 'chat',
        format: 'jsonl',
        recordCount: data.length,
        metadata: stats,
      });

      const datasetId = result[0]?.insertId || result.insertId;

      return {
        id: datasetId,
        name,
        description,
        datasetType: dataType,
        metadata: stats,
        isActive: true,
      };
    }, { name: 'createDataset' });
  }

  /**
   * Listar datasets
   */
  async listDatasets(userId?: number): Promise<any[]> {
    return withErrorHandling(async () => {
      const conditions = userId ? eq(trainingDatasets.userId, userId) : undefined;
      
      const datasets = await db
        .select()
        .from(trainingDatasets)
        .where(conditions)
        .orderBy(desc(trainingDatasets.createdAt));

      return datasets.map(ds => ({
        ...ds,
        filePath: undefined, // Não retornar path completo na listagem
      }));
    }, { name: 'listDatasets' });
  }

  /**
   * Deletar dataset
   */
  async deleteDataset(datasetId: number): Promise<{ success: boolean }> {
    return withErrorHandling(async () => {
      // Verificar se tem jobs usando este dataset
      const jobs = await db
        .select()
        .from(trainingJobs)
        .where(and(
          eq(trainingJobs.datasetId, datasetId),
          eq(trainingJobs.status, 'training')
        ));

      if (jobs.length > 0) {
        throw new Error('Não é possível deletar dataset com jobs em execução');
      }

      await db
        .delete(trainingDatasets)
        .where(eq(trainingDatasets.id, datasetId));

      return { success: true };
    }, { name: 'deleteDataset' });
  }

  /**
   * Iniciar treinamento
   */
  async startTraining(config: TrainingJobConfig): Promise<any> {
    return withErrorHandling(async () => {
      // Validar modelo existe
      const [model] = await db
        .select()
        .from(aiModels)
        .where(eq(aiModels.id, config.modelId))
        .limit(1);

      if (!model) {
        throw new Error('Modelo não encontrado');
      }

      // Validar dataset existe
      const [dataset] = await db
        .select()
        .from(trainingDatasets)
        .where(eq(trainingDatasets.id, config.datasetId))
        .limit(1);

      if (!dataset) {
        throw new Error('Dataset não encontrado');
      }

      // Criar job de treinamento
      const jobConfig = {
        hyperparameters: config.hyperparameters,
        validationSplit: config.validationSplit,
        earlyStopping: config.earlyStopping,
        checkpointInterval: config.checkpointInterval,
      };

      const result: any = await db.insert(trainingJobs).values({
        userId: 1, // TODO: usar userId real
        baseModelId: config.modelId,
        datasetId: config.datasetId,
        name: `Training ${model.name} - ${new Date().toISOString()}`,
        description: `Fine-tuning of ${model.name}`,
        status: 'training',
        trainingType: config.hyperparameters.loraRank ? 'lora' : 'fine-tuning',
        hyperparameters: jobConfig,
        progress: '0.00',
        currentEpoch: 0,
        totalEpochs: config.hyperparameters.epochs,
        startedAt: new Date(),
      });

      const jobId = result[0]?.insertId || result.insertId;

      // Simular processo de treinamento assíncrono
      // Em produção, isso seria enviado para um worker queue
      this.simulateTraining(jobId, config).catch(error => {
        console.error(`Erro no treinamento job ${jobId}:`, error);
        this.updateJobStatus(jobId, 'failed', error.message);
      });

      return {
        jobId,
        status: 'running',
        message: 'Treinamento iniciado com sucesso',
      };
    }, { name: 'startTraining' });
  }

  /**
   * Simular processo de treinamento
   * (Em produção, isso seria feito por um worker dedicado)
   */
  private async simulateTraining(
    jobId: number,
    config: TrainingJobConfig
  ): Promise<void> {
    try {
      const epochs = config.hyperparameters.epochs;
      
      for (let epoch = 1; epoch <= epochs; epoch++) {
        // Simular progresso do epoch
        await this.sleep(2000); // 2s por epoch (simulado)
        
        const progress = ((epoch / epochs) * 100).toFixed(2);
        
        // Simular métricas
        const trainingLoss = (2.5 - (epoch * 0.3) + (Math.random() * 0.2)).toFixed(6);
        const trainingAccuracy = ((0.4 + (epoch * 0.15) + (Math.random() * 0.05)) * 100).toFixed(2);
        const validationLoss = (2.6 - (epoch * 0.28) + (Math.random() * 0.25)).toFixed(6);
        const validationAccuracy = ((0.38 + (epoch * 0.14) + (Math.random() * 0.06)) * 100).toFixed(2);

        // Atualizar progresso
        await db.update(trainingJobs)
          .set({
            currentEpoch: epoch,
            progress,
            trainingLoss,
            trainingAccuracy,
            validationLoss,
            validationAccuracy,
          })
          .where(eq(trainingJobs.id, jobId));

        console.log(`Training job ${jobId}: Epoch ${epoch}/${epochs} - ${progress}%`);
      }

      // Criar versão do modelo treinado
      const modelVersionResult: any = await db.insert(modelVersions).values({
        userId: 1, // TODO: usar userId real
        baseModelId: config.modelId,
        versionName: `v1.0-ft-${Date.now()}`,
        description: `Fine-tuned version created from training job ${jobId}`,
        modelPath: `/models/fine-tuned-${jobId}`,
        format: 'safetensors',
        trainingJobId: jobId,
        isActive: false,
        isPublic: false,
      });

      const versionId = modelVersionResult[0]?.insertId || modelVersionResult.insertId;

      // Finalizar job
      await db.update(trainingJobs)
        .set({
          status: 'completed',
          progress: '100.00',
          completedAt: new Date(),
        })
        .where(eq(trainingJobs.id, jobId));

      console.log(`Training job ${jobId}: COMPLETED`);
    } catch (error) {
      console.error(`Training job ${jobId}: FAILED -`, error);
      throw error;
    }
  }

  /**
   * Helper: sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obter status do treinamento
   */
  async getTrainingStatus(jobId: number): Promise<any> {
    return withErrorHandling(async () => {
      const [job] = await db
        .select()
        .from(trainingJobs)
        .where(eq(trainingJobs.id, jobId))
        .limit(1);

      if (!job) {
        throw new Error('Job não encontrado');
      }

      return {
        ...job,
        hyperparameters: job.hyperparameters,
        metadata: job.metadata,
      };
    }, { name: 'getTrainingStatus' });
  }

  /**
   * Cancelar treinamento
   */
  async cancelTraining(jobId: number): Promise<{ success: boolean }> {
    return withErrorHandling(async () => {
      const [job] = await db
        .select()
        .from(trainingJobs)
        .where(eq(trainingJobs.id, jobId))
        .limit(1);

      if (!job) {
        throw new Error('Job não encontrado');
      }

      if (job.status !== 'training' && job.status !== 'preparing' && job.status !== 'validating') {
        throw new Error(`Job não está em execução (status: ${job.status})`);
      }

      await db.update(trainingJobs)
        .set({
          status: 'cancelled',
          completedAt: new Date(),
        })
        .where(eq(trainingJobs.id, jobId));

      return { success: true };
    }, { name: 'cancelTraining' });
  }

  /**
   * Listar jobs de treinamento
   */
  async listTrainingJobs(
    userId?: number,
    status?: string
  ): Promise<any[]> {
    return withErrorHandling(async () => {
      let conditions = [];
      
      if (status) {
        // Cast status to valid enum value
        const validStatus = status as 'pending' | 'preparing' | 'training' | 'validating' | 'completed' | 'failed' | 'cancelled';
        conditions.push(eq(trainingJobs.status, validStatus));
      }

      const jobs = await db
        .select({
          job: trainingJobs,
          model: aiModels,
          dataset: trainingDatasets,
        })
        .from(trainingJobs)
        .leftJoin(aiModels, eq(trainingJobs.baseModelId, aiModels.id))
        .leftJoin(trainingDatasets, eq(trainingJobs.datasetId, trainingDatasets.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(trainingJobs.startedAt));

      return jobs.map(j => ({
        ...j.job,
        hyperparameters: j.job.hyperparameters,
        metadata: j.job.metadata,
        model: j.model ? {
          id: j.model.id,
          name: j.model.name,
          providerId: j.model.providerId,
        } : null,
        dataset: j.dataset ? {
          id: j.dataset.id,
          name: j.dataset.name,
          datasetType: j.dataset.datasetType,
        } : null,
      }));
    }, { name: 'listTrainingJobs', userId });
  }

  /**
   * Avaliar modelo
   */
  async evaluateModel(
    modelVersionId: number,
    testDatasetId: number
  ): Promise<any> {
    return withErrorHandling(async () => {
      // Validar versão do modelo existe
      const [version] = await db
        .select()
        .from(modelVersions)
        .where(eq(modelVersions.id, modelVersionId))
        .limit(1);

      if (!version) {
        throw new Error('Versão do modelo não encontrada');
      }

      // Validar dataset de teste existe
      const [dataset] = await db
        .select()
        .from(trainingDatasets)
        .where(eq(trainingDatasets.id, testDatasetId))
        .limit(1);

      if (!dataset) {
        throw new Error('Dataset de teste não encontrado');
      }

      // Simular avaliação
      await this.sleep(1000);

      const evaluation = {
        modelVersionId,
        testDatasetId,
        metrics: {
          accuracy: 0.85 + (Math.random() * 0.1),
          precision: 0.83 + (Math.random() * 0.12),
          recall: 0.87 + (Math.random() * 0.08),
          f1Score: 0.84 + (Math.random() * 0.1),
          loss: 0.3 + (Math.random() * 0.2),
        },
        evaluatedAt: new Date(),
      };

      // Métricas de avaliação salvas
      // (modelVersions não tem campo metadata, usar notes ou outro campo)

      return evaluation;
    }, { name: 'evaluateModel' });
  }

  /**
   * Helper: atualizar status do job
   */
  private async updateJobStatus(
    jobId: number,
    status: 'pending' | 'preparing' | 'training' | 'validating' | 'completed' | 'failed' | 'cancelled',
    errorMessage?: string
  ): Promise<void> {
    await db.update(trainingJobs)
      .set({
        status,
        errorMessage,
        completedAt: new Date(),
      })
      .where(eq(trainingJobs.id, jobId));
  }
}

export const modelTrainingService = new ModelTrainingService();
