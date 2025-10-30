/**
 * Training Router
 * tRPC endpoints for model training and fine-tuning
 */
import { router, publicProcedure } from '../trpc.js';
import { modelTrainingService } from '../services/modelTrainingService.js';
import { z } from 'zod';

const hyperparametersSchema = z.object({
  learningRate: z.number().positive().default(0.0001),
  batchSize: z.number().int().positive().default(8),
  epochs: z.number().int().positive().default(3),
  warmupSteps: z.number().int().positive().optional(),
  maxSteps: z.number().int().positive().optional(),
  loraRank: z.number().int().positive().optional(),
  loraAlpha: z.number().positive().optional(),
  loraDropout: z.number().min(0).max(1).optional(),
});

export const trainingRouter = router({
  // Dataset operations
  createDataset: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      name: z.string().min(1).max(200),
      description: z.string().max(1000),
      dataType: z.enum(['text', 'qa', 'conversation', 'instruction']),
      data: z.array(z.any()).min(1),
    }))
    .mutation(async ({ input }) => {
      return modelTrainingService.createDataset(
        input.userId,
        input.name,
        input.description,
        input.dataType,
        input.data
      );
    }),

  listDatasets: publicProcedure
    .input(z.object({
      userId: z.number().positive().optional(),
    }))
    .query(async ({ input }) => {
      return modelTrainingService.listDatasets(input.userId);
    }),

  deleteDataset: publicProcedure
    .input(z.object({
      datasetId: z.number().positive(),
    }))
    .mutation(async ({ input }) => {
      return modelTrainingService.deleteDataset(input.datasetId);
    }),

  // Training operations
  startTraining: publicProcedure
    .input(z.object({
      modelId: z.number().positive(),
      datasetId: z.number().positive(),
      hyperparameters: hyperparametersSchema,
      validationSplit: z.number().min(0).max(0.5).default(0.1),
      earlyStopping: z.boolean().default(true),
      checkpointInterval: z.number().int().positive().optional(),
    }))
    .mutation(async ({ input }) => {
      return modelTrainingService.startTraining(input);
    }),

  getTrainingStatus: publicProcedure
    .input(z.object({
      jobId: z.number().positive(),
    }))
    .query(async ({ input }) => {
      return modelTrainingService.getTrainingStatus(input.jobId);
    }),

  cancelTraining: publicProcedure
    .input(z.object({
      jobId: z.number().positive(),
    }))
    .mutation(async ({ input }) => {
      return modelTrainingService.cancelTraining(input.jobId);
    }),

  listTrainingJobs: publicProcedure
    .input(z.object({
      userId: z.number().positive().optional(),
      status: z.enum(['running', 'completed', 'failed', 'cancelled']).optional(),
    }))
    .query(async ({ input }) => {
      return modelTrainingService.listTrainingJobs(input.userId, input.status);
    }),

  // Evaluation operations
  evaluateModel: publicProcedure
    .input(z.object({
      modelVersionId: z.number().positive(),
      testDatasetId: z.number().positive(),
    }))
    .mutation(async ({ input }) => {
      return modelTrainingService.evaluateModel(
        input.modelVersionId,
        input.testDatasetId
      );
    }),
});
