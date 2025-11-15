/**
 * Model Training Service
 * Manages AI model training, fine-tuning, and evaluation
 */
import { db } from '../db/index.js';
import { trainingDatasets, trainingJobs, modelVersions, aiModels, } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { lmstudioService } from './lmstudioService.js';
import fs from 'fs/promises';
import path from 'path';
class ModelTrainingService {
    constructor() {
        Object.defineProperty(this, "trainingProcesses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "trainingDataPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: '/home/flavio/webapp/training_data'
        });
        Object.defineProperty(this, "checkpointsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: '/home/flavio/webapp/model_checkpoints'
        });
        // Ensure directories exist
        this.initializeDirectories();
    }
    async initializeDirectories() {
        try {
            await fs.mkdir(this.trainingDataPath, { recursive: true });
            await fs.mkdir(this.checkpointsPath, { recursive: true });
        }
        catch (error) {
            console.error('Failed to initialize training directories:', error);
        }
    }
    /**
     * Create a new training dataset
     */
    async createDataset(userId, name, description, dataType, data) {
        // Validate data format
        this.validateDataset(dataType, data);
        // Save dataset to file
        const timestamp = Date.now();
        const filePath = path.join(this.trainingDataPath, `dataset_${timestamp}.jsonl`);
        const jsonlData = data.map(item => JSON.stringify(item)).join('\n');
        await fs.writeFile(filePath, jsonlData, 'utf-8');
        // Calculate statistics
        const stats = this.calculateDatasetStats(data);
        // Insert into database
        const result = await db.insert(trainingDatasets).values({
            userId,
            name,
            description,
            dataType,
            filePath,
            recordCount: data.length,
            sizeBytes: Buffer.byteLength(jsonlData),
            metadata: stats,
        });
        const datasetId = result[0]?.insertId || result.insertId;
        const [dataset] = await db.select().from(trainingDatasets).where(eq(trainingDatasets.id, datasetId)).limit(1);
        return dataset;
    }
    /**
     * Validate dataset format
     */
    validateDataset(dataType, data) {
        if (!data || data.length === 0) {
            throw new Error('Dataset cannot be empty');
        }
        for (const item of data) {
            switch (dataType) {
                case 'text':
                    if (!item.text)
                        throw new Error('Text dataset requires "text" field');
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
    calculateDatasetStats(data) {
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
    async startTraining(config) {
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
        const result = await db.insert(trainingJobs).values({
            userId: 1, // TODO: Get from context
            name: `Training ${config.modelId}`,
            baseModelId: config.modelId,
            datasetId: config.datasetId,
            status: 'training',
            hyperparameters: config.hyperparameters,
            startedAt: new Date(),
        });
        const jobId = result[0]?.insertId || result.insertId;
        const [job] = await db.select().from(trainingJobs).where(eq(trainingJobs.id, jobId)).limit(1);
        // Start training in background
        this.runTraining(job.id, config, dataset.filePath);
        return job;
    }
    /**
     * Run training process
     */
    async runTraining(jobId, config, datasetPath) {
        const metricsHistory = [];
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
                    const batchLoss = await this.trainStep(trainData.slice(step * batchSize, (step + 1) * batchSize), config);
                    epochLoss += batchLoss;
                    // Validation
                    let validationLoss;
                    if (validData.length > 0 && step % 10 === 0) {
                        validationLoss = await this.evaluateStep(validData.slice(0, 50), config);
                    }
                    // Record metrics
                    const metrics = {
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
                            progress: ((globalStep / (epochs * stepsPerEpoch)) * 100).toFixed(2),
                            metadata: metrics,
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
                }
                else if (config.earlyStopping && epoch > 2 && avgEpochLoss > bestLoss * 1.1) {
                    console.log(`Early stopping at epoch ${epoch + 1}`);
                    break;
                }
            }
            // Training complete - create model version
            const [baseModel] = await db.select().from(aiModels)
                .where(eq(aiModels.id, config.modelId))
                .limit(1);
            const versionName = `${baseModel.name}-finetuned-${Date.now()}`;
            const versionResult = await db.insert(modelVersions).values({
                userId: 1,
                baseModelId: config.modelId,
                versionName: versionName,
                modelPath: `/models/${versionName}`,
                trainingJobId: jobId,
                isActive: true,
                performanceMetrics: {
                    finalLoss: metricsHistory[metricsHistory.length - 1]?.loss,
                    bestLoss,
                    totalSteps: globalStep,
                },
            });
            // Update job status
            await db.update(trainingJobs)
                .set({
                status: 'completed',
                completedAt: new Date(),
                metadata: metricsHistory[metricsHistory.length - 1],
            })
                .where(eq(trainingJobs.id, jobId));
        }
        catch (error) {
            console.error('Training failed:', error);
            await db.update(trainingJobs)
                .set({
                status: 'failed',
                completedAt: new Date(),
                errorMessage: error.message,
            })
                .where(eq(trainingJobs.id, jobId));
        }
    }
    /**
     * Simulate a training step
     */
    async trainStep(batch, config) {
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
    async evaluateStep(validBatch, config) {
        // Simulate validation loss
        const baseLoss = 2.3;
        const noiseFactor = Math.random() * 0.4;
        return baseLoss + noiseFactor;
    }
    /**
     * Save training checkpoint
     */
    async saveCheckpoint(jobId, epoch, step, metrics) {
        const checkpointPath = path.join(this.checkpointsPath, `job_${jobId}_epoch_${epoch}_step_${step}.json`);
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
    async getTrainingStatus(jobId) {
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
    async cancelTraining(jobId) {
        const process = this.trainingProcesses.get(jobId);
        if (process) {
            // In real implementation, terminate actual training process
            this.trainingProcesses.delete(jobId);
        }
        await db.update(trainingJobs)
            .set({
            status: 'cancelled',
            completedAt: new Date(),
        })
            .where(eq(trainingJobs.id, jobId));
        return { success: true, message: 'Training cancelled' };
    }
    /**
     * Evaluate trained model
     */
    async evaluateModel(modelVersionId, testDatasetId) {
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
        const datasetContent = await fs.readFile(dataset.filePath, 'utf-8');
        const testData = datasetContent.split('\n')
            .filter(line => line.trim())
            .map(line => JSON.parse(line))
            .slice(0, 50); // Evaluate on first 50 examples
        let totalLoss = 0;
        let totalAccuracy = 0;
        const examples = [];
        // Evaluate each example
        for (const item of testData) {
            const input = item.instruction || item.question || item.text;
            const expected = item.response || item.answer || '';
            // Generate prediction (using base model for simulation)
            const [model] = await db.select().from(aiModels)
                .where(eq(aiModels.id, version.baseModelId))
                .limit(1);
            const generated = await lmstudioService.generateCompletion(model.id.toString(), input, { maxTokens: 200, temperature: 0.7 });
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
    calculateSimilarity(text1, text2) {
        const maxLength = Math.max(text1.length, text2.length);
        if (maxLength === 0)
            return 1.0;
        const distance = this.levenshteinDistance(text1, text2);
        return 1 - distance / maxLength;
    }
    /**
     * Levenshtein distance algorithm
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
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
                }
                else {
                    matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
                }
            }
        }
        return matrix[str2.length][str1.length];
    }
    /**
     * List all training jobs
     */
    async listTrainingJobs(userId, status) {
        const query = status
            ? db.select().from(trainingJobs).where(eq(trainingJobs.status, status))
            : db.select().from(trainingJobs);
        const jobs = await query.orderBy(desc(trainingJobs.startedAt)).limit(100);
        return jobs;
    }
    /**
     * List all datasets
     */
    async listDatasets(userId) {
        const query = userId
            ? db.select().from(trainingDatasets).where(eq(trainingDatasets.userId, userId))
            : db.select().from(trainingDatasets);
        const datasets = await query.orderBy(desc(trainingDatasets.createdAt)).limit(100);
        return datasets;
    }
    /**
     * Delete dataset
     */
    async deleteDataset(datasetId) {
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
            }
            catch (error) {
                console.error('Failed to delete dataset file:', error);
            }
        }
        // Delete from database
        await db.delete(trainingDatasets).where(eq(trainingDatasets.id, datasetId));
        return { success: true, message: 'Dataset deleted' };
    }
}
export const modelTrainingService = new ModelTrainingService();
