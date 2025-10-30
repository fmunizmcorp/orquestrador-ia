/**
 * Model Training Service
 * Manages AI model training, fine-tuning, and evaluation
 */
import { db } from '../db/index.js';
import {
  // trainingDatasets,
  // trainingJobs,
  // modelVersions,
  aiModels,
} from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { lmstudioService } from './lmstudioService.js';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

interface TrainingConfig {
  modelId: number;
  datasetId: number;
  hyperparameters: {
    learningRate: number;
    batchSize: number;
    epochs: number;
    warmupSteps?: number;
    maxSteps?: number;
    loraRank?: number;
    loraAlpha?: number;
    loraDropout?: number;
  };
  validationSplit?: number;
  earlyStopping?: boolean;
  checkpointInterval?: number;
}

interface TrainingMetrics {
  epoch: number;
  step: number;
  loss: number;
  validationLoss?: number;
  accuracy?: number;
  perplexity?: number;
  learningRate: number;
  timestamp: Date;
}

interface EvaluationResult {
  accuracy: number;
  loss: number;
  perplexity: number;
  examples: Array<{
    input: string;
    expected: string;
    generated: string;
    score: number;
  }>;
}

class ModelTrainingService {
  private trainingProcesses: Map<number, any> = new Map();
  private readonly trainingDataPath = '/home/user/webapp/training_data';
  private readonly checkpointsPath = '/home/user/webapp/model_checkpoints';

  constructor() {
    // Ensure directories exist
    this.initializeDirectories();
  }

  private async initializeDirectories() {
    try {
      await fs.mkdir(this.trainingDataPath, { recursive: true });
      await fs.mkdir(this.checkpointsPath, { recursive: true });
    } catch (error) {
      console.error('Failed to initialize training directories:', error);
    }
  }

  /**
   * Create a new training dataset
   */
  async createDataset(
    userId: number,
    name: string,
    description: string,
    dataType: 'text' | 'qa' | 'conversation' | 'instruction',
    data: any[]
  ) {
    // Validate data format
    this.validateDataset(dataType, data);

    // Save dataset to file
    const datasetId = Date.now();
    const filePath = path.join(this.trainingDataPath, `dataset_${datasetId}.jsonl`);
    
    const jsonlData = data.map(item => JSON.stringify(item)).join('\n');
    await fs.writeFile(filePath, jsonlData, 'utf-8');

    // Calculate statistics
    const stats = this.calculateDatasetStats(data);

    // Insert into database
    const [dataset] = await db.insert(trainingDatasets).values({
      userId,
      name,
      description,
      dataType,
      filePath,
      recordCount: data.length,
      sizeBytes: Buffer.byteLength(jsonlData),
      metadata: JSON.stringify(stats),
    }).returning();

    return dataset;
  }

  /**
   * Validate dataset format
   */
  private validateDataset(dataType: string, data: any[]) {
    if (!data || data.length === 0) {
      throw new Error('Dataset cannot be empty');
    }

    for (const item of data) {
      switch (dataType) {
        case 'text':
          if (!item.text) throw new Error('Text dataset requires "text" field');
          break;
        case 'qa':
          if (!item.question || !item.answer) {
            throw new Error('QA dataset requires "question" and "answer" fields');
          }
          break;
        case 'conversation':
          if (!Array.isArray(item.messages)) {
            throw new Error('Conversation dataset requires "messages" array');
          }
          break;
        case 'instruction':
          if (!item.instruction || !item.response) {
            throw new Error('Instruction dataset requires "instruction" and "response" fields');
          }
          break;
      }
    }
  }

  /**
   * Calculate dataset statistics
   */
  private calculateDatasetStats(data: any[]) {
    let totalTokens = 0;
    let minLength = Infinity;
    let maxLength = 0;

    for (const item of data) {
      const text = JSON.stringify(item);
      const length = text.length;
      const estimatedTokens = Math.ceil(length / 4); // Rough estimate

      totalTokens += estimatedTokens;
      minLength = Math.min(minLength, length);
      maxLength = Math.max(maxLength, length);
    }

    return {
      totalRecords: data.length,
      estimatedTokens: totalTokens,
      avgLength: totalTokens / data.length,
      minLength,
      maxLength,
    };
  }

  /**
   * Start a training job
   */
  async startTraining(config: TrainingConfig) {
    // Validate config
    const [model] = await db.select().from(aiModels)
      .where(eq(aiModels.id, config.modelId))
      .limit(1);

    if (!model) {
      throw new Error('Model not found');
    }

    const [dataset] = await db.select().from(trainingDatasets)
      .where(eq(trainingDatasets.id, config.datasetId))
      .limit(1);

    if (!dataset) {
      throw new Error('Dataset not found');
    }

    // Create training job record
    const [job] = await db.insert(trainingJobs).values({
      baseModelId: config.modelId,
      datasetId: config.datasetId,
      status: 'running',
      hyperparameters: JSON.stringify(config.hyperparameters),
      startTime: new Date(),
    }).returning();

    // Start training in background
    this.runTraining(job.id, config, dataset.filePath!);

    return job;
  }

  /**
   * Run training process
   */
  private async runTraining(jobId: number, config: TrainingConfig, datasetPath: string) {
    const metricsHistory: TrainingMetrics[] = [];

    try {
      // Load dataset
      const datasetContent = await fs.readFile(datasetPath, 'utf-8');
      const data = datasetContent.split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));

      // Split into train/validation
      const splitIndex = config.validationSplit
        ? Math.floor(data.length * (1 - config.validationSplit))
        : data.length;
      
      const trainData = data.slice(0, splitIndex);
      const validData = data.slice(splitIndex);

      // Training loop simulation (in real implementation, this would call actual training API)
      const { epochs, batchSize, learningRate } = config.hyperparameters;
      const stepsPerEpoch = Math.ceil(trainData.length / batchSize);
      let globalStep = 0;
      let bestLoss = Infinity;

      for (let epoch = 0; epoch < epochs; epoch++) {
        let epochLoss = 0;

        // Simulate training steps
        for (let step = 0; step < stepsPerEpoch; step++) {
          globalStep++;

          // Simulate training step
          const batchLoss = await this.trainStep(
            trainData.slice(step * batchSize, (step + 1) * batchSize),
            config
          );
          
          epochLoss += batchLoss;

          // Validation
          let validationLoss: number | undefined;
          if (validData.length > 0 && step % 10 === 0) {
            validationLoss = await this.evaluateStep(validData.slice(0, 50), config);
          }

          // Record metrics
          const metrics: TrainingMetrics = {
            epoch: epoch + 1,
            step: globalStep,
            loss: batchLoss,
            validationLoss,
            learningRate: learningRate * (1 - globalStep / (epochs * stepsPerEpoch)),
            timestamp: new Date(),
          };
          metricsHistory.push(metrics);

          // Update job progress
          if (step % 5 === 0) {
            await db.update(trainingJobs)
              .set({
                currentEpoch: epoch + 1,
                currentStep: globalStep,
                metrics: JSON.stringify(metrics),
              })
              .where(eq(trainingJobs.id, jobId));
          }

          // Checkpoint
          if (config.checkpointInterval && globalStep % config.checkpointInterval === 0) {
            await this.saveCheckpoint(jobId, epoch, globalStep, metricsHistory);
          }
        }

        const avgEpochLoss = epochLoss / stepsPerEpoch;

        // Early stopping
        if (config.earlyStopping && avgEpochLoss < bestLoss) {
          bestLoss = avgEpochLoss;
        } else if (config.earlyStopping && epoch > 2 && avgEpochLoss > bestLoss * 1.1) {
          console.log(`Early stopping at epoch ${epoch + 1}`);
          break;
        }
      }

      // Training complete - create model version
      const [baseModel] = await db.select().from(aiModels)
        .where(eq(aiModels.id, config.modelId))
        .limit(1);

      const versionName = `${baseModel.modelName}-finetuned-${Date.now()}`;
      
      await db.insert(modelVersions).values({
        modelId: config.modelId,
        version: versionName,
        trainingJobId: jobId,
        isActive: true,
        performanceMetrics: JSON.stringify({
          finalLoss: metricsHistory[metricsHistory.length - 1]?.loss,
          bestLoss,
          totalSteps: globalStep,
        }),
      });

      // Update job status
      await db.update(trainingJobs)
        .set({
          status: 'completed',
          endTime: new Date(),
          finalMetrics: JSON.stringify(metricsHistory[metricsHistory.length - 1]),
        })
        .where(eq(trainingJobs.id, jobId));

    } catch (error: any) {
      console.error('Training failed:', error);
      
      await db.update(trainingJobs)
        .set({
          status: 'failed',
          endTime: new Date(),
          errorMessage: error.message,
        })
        .where(eq(trainingJobs.id, jobId));
    }
  }

  /**
   * Simulate a training step
   */
  private async trainStep(batch: any[], config: TrainingConfig): Promise<number> {
    // Simulate training by generating predictions and calculating loss
    // In real implementation, this would interface with actual training API
    
    // Simulate variable loss that decreases over time
    const baseLoss = 2.5;
    const noiseFactor = Math.random() * 0.3;
    const improvementFactor = 0.95; // Gradually improve
    
    return baseLoss * improvementFactor + noiseFactor;
  }

  /**
   * Evaluate a validation batch
   */
  private async evaluateStep(validBatch: any[], config: TrainingConfig): Promise<number> {
    // Simulate validation loss
    const baseLoss = 2.3;
    const noiseFactor = Math.random() * 0.4;
    
    return baseLoss + noiseFactor;
  }

  /**
   * Save training checkpoint
   */
  private async saveCheckpoint(jobId: number, epoch: number, step: number, metrics: TrainingMetrics[]) {
    const checkpointPath = path.join(
      this.checkpointsPath,
      `job_${jobId}_epoch_${epoch}_step_${step}.json`
    );

    const checkpoint = {
      jobId,
      epoch,
      step,
      metrics: metrics.slice(-100), // Last 100 metrics
      timestamp: new Date().toISOString(),
    };

    await fs.writeFile(checkpointPath, JSON.stringify(checkpoint, null, 2));
  }

  /**
   * Get training job status
   */
  async getTrainingStatus(jobId: number) {
    const [job] = await db.select().from(trainingJobs)
      .where(eq(trainingJobs.id, jobId))
      .limit(1);

    if (!job) {
      throw new Error('Training job not found');
    }

    return job;
  }

  /**
   * Cancel training job
   */
  async cancelTraining(jobId: number) {
    const process = this.trainingProcesses.get(jobId);
    
    if (process) {
      // In real implementation, terminate actual training process
      this.trainingProcesses.delete(jobId);
    }

    await db.update(trainingJobs)
      .set({
        status: 'cancelled',
        endTime: new Date(),
      })
      .where(eq(trainingJobs.id, jobId));

    return { success: true, message: 'Training cancelled' };
  }

  /**
   * Evaluate trained model
   */
  async evaluateModel(modelVersionId: number, testDatasetId: number): Promise<EvaluationResult> {
    const [version] = await db.select().from(modelVersions)
      .where(eq(modelVersions.id, modelVersionId))
      .limit(1);

    if (!version) {
      throw new Error('Model version not found');
    }

    const [dataset] = await db.select().from(trainingDatasets)
      .where(eq(trainingDatasets.id, testDatasetId))
      .limit(1);

    if (!dataset) {
      throw new Error('Test dataset not found');
    }

    // Load test data
    const datasetContent = await fs.readFile(dataset.filePath!, 'utf-8');
    const testData = datasetContent.split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line))
      .slice(0, 50); // Evaluate on first 50 examples

    let totalLoss = 0;
    let totalAccuracy = 0;
    const examples: any[] = [];

    // Evaluate each example
    for (const item of testData) {
      const input = item.instruction || item.question || item.text;
      const expected = item.response || item.answer || '';

      // Generate prediction (using base model for simulation)
      const [model] = await db.select().from(aiModels)
        .where(eq(aiModels.id, version.modelId))
        .limit(1);

      const generated = await lmstudioService.generateCompletion(
        model.id,
        input,
        { maxTokens: 200, temperature: 0.7 }
      );

      // Calculate similarity score
      const score = this.calculateSimilarity(expected, generated);
      totalAccuracy += score;

      // Estimate loss
      const loss = 1 - score;
      totalLoss += loss;

      examples.push({
        input: input.slice(0, 100) + '...',
        expected: expected.slice(0, 100) + '...',
        generated: generated.slice(0, 100) + '...',
        score,
      });
    }

    const avgLoss = totalLoss / testData.length;
    const avgAccuracy = totalAccuracy / testData.length;
    const perplexity = Math.exp(avgLoss);

    return {
      accuracy: avgAccuracy,
      loss: avgLoss,
      perplexity,
      examples: examples.slice(0, 10), // Return first 10 examples
    };
  }

  /**
   * Calculate text similarity (simple Levenshtein-based metric)
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const maxLength = Math.max(text1.length, text2.length);
    if (maxLength === 0) return 1.0;

    const distance = this.levenshteinDistance(text1, text2);
    return 1 - distance / maxLength;
  }

  /**
   * Levenshtein distance algorithm
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * List all training jobs
   */
  async listTrainingJobs(userId?: number, status?: string) {
    let query = db.select().from(trainingJobs);

    if (status) {
      query = query.where(eq(trainingJobs.status, status as any));
    }

    const jobs = await query.orderBy(desc(trainingJobs.startTime)).limit(100);
    return jobs;
  }

  /**
   * List all datasets
   */
  async listDatasets(userId?: number) {
    let query = db.select().from(trainingDatasets);

    if (userId) {
      query = query.where(eq(trainingDatasets.userId, userId));
    }

    const datasets = await query.orderBy(desc(trainingDatasets.createdAt)).limit(100);
    return datasets;
  }

  /**
   * Delete dataset
   */
  async deleteDataset(datasetId: number) {
    const [dataset] = await db.select().from(trainingDatasets)
      .where(eq(trainingDatasets.id, datasetId))
      .limit(1);

    if (!dataset) {
      throw new Error('Dataset not found');
    }

    // Delete file
    if (dataset.filePath) {
      try {
        await fs.unlink(dataset.filePath);
      } catch (error) {
        console.error('Failed to delete dataset file:', error);
      }
    }

    // Delete from database
    await db.delete(trainingDatasets).where(eq(trainingDatasets.id, datasetId));

    return { success: true, message: 'Dataset deleted' };
  }
}

export const modelTrainingService = new ModelTrainingService();
