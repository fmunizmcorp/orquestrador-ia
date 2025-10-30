/**
 * LM Studio tRPC Router
 * SPRINT 5 - LM Studio Integration
 * 10 endpoints para integração completa com LM Studio
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { lmstudioService } from '../../services/lmstudioService.js';

export const lmstudioRouter = router({
  /**
   * 1. Listar modelos disponíveis
   */
  listModels: publicProcedure
    .input(z.object({
      forceRefresh: z.boolean().optional().default(false),
    }))
    .query(async ({ input }) => {
      const models = await lmstudioService.listModels(input.forceRefresh);
      return { success: true, models };
    }),

  /**
   * 2. Verificar status do LM Studio
   */
  checkStatus: publicProcedure
    .query(async () => {
      const isRunning = await lmstudioService.isRunning();
      return { success: true, isRunning };
    }),

  /**
   * 3. Obter informações de modelo específico
   */
  getModelInfo: publicProcedure
    .input(z.object({
      modelId: z.string(),
    }))
    .query(async ({ input }) => {
      const modelInfo = await lmstudioService.getModelInfo(input.modelId);
      return { success: true, model: modelInfo };
    }),

  /**
   * 4. Gerar completion (sem streaming)
   */
  generateCompletion: publicProcedure
    .input(z.object({
      modelId: z.string(),
      prompt: z.string(),
      temperature: z.number().min(0).max(2).optional().default(0.7),
      maxTokens: z.number().min(1).max(32000).optional().default(2048),
      timeout: z.number().optional().default(60000),
    }))
    .mutation(async ({ input }) => {
      const result = await lmstudioService.generateCompletion(
        input.modelId,
        input.prompt,
        {
          temperature: input.temperature,
          maxTokens: input.maxTokens,
          timeout: input.timeout,
        }
      );
      return { success: true, result };
    }),

  /**
   * 5. Carregar modelo específico
   */
  loadModel: publicProcedure
    .input(z.object({
      modelId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const loaded = await lmstudioService.loadModel(input.modelId);
      return { success: loaded, message: loaded ? 'Modelo carregado' : 'Falha ao carregar' };
    }),

  /**
   * 6. Trocar modelo com fallback
   */
  switchModel: publicProcedure
    .input(z.object({
      preferredModelId: z.string(),
      fallbackModelIds: z.array(z.string()).optional().default([]),
    }))
    .mutation(async ({ input }) => {
      const result = await lmstudioService.switchModel(
        input.preferredModelId,
        input.fallbackModelIds
      );
      return { success: result.success, modelId: result.modelId };
    }),

  /**
   * 7. Benchmark de modelo
   */
  benchmarkModel: publicProcedure
    .input(z.object({
      modelId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const benchmark = await lmstudioService.benchmarkModel(input.modelId);
      return { success: benchmark.success, ...benchmark };
    }),

  /**
   * 8. Estimar tokens de texto
   */
  estimateTokens: publicProcedure
    .input(z.object({
      text: z.string(),
    }))
    .query(({ input }) => {
      const tokens = lmstudioService.estimateTokens(input.text);
      return { success: true, tokens };
    }),

  /**
   * 9. Comparar múltiplos modelos
   */
  compareModels: publicProcedure
    .input(z.object({
      modelIds: z.array(z.string()).min(2).max(5),
      prompt: z.string(),
      temperature: z.number().optional().default(0.7),
      maxTokens: z.number().optional().default(2048),
    }))
    .mutation(async ({ input }) => {
      const results = await lmstudioService.compareModels(
        input.modelIds,
        input.prompt,
        {
          temperature: input.temperature,
          maxTokens: input.maxTokens,
        }
      );
      return { success: true, results };
    }),

  /**
   * 10. Recomendar modelo para tarefa
   */
  recommendModel: publicProcedure
    .input(z.object({
      taskType: z.enum(['code', 'reasoning', 'analysis', 'chat', 'general']),
    }))
    .query(async ({ input }) => {
      const modelId = await lmstudioService.recommendModel(input.taskType);
      return { success: true, recommendedModel: modelId };
    }),

  /**
   * 11. Limpar cache de modelos
   */
  clearCache: publicProcedure
    .mutation(() => {
      lmstudioService.clearCache();
      return { success: true, message: 'Cache limpo' };
    }),

  /**
   * 12. Processar texto longo em chunks
   */
  processLongText: publicProcedure
    .input(z.object({
      modelId: z.string(),
      text: z.string(),
      instruction: z.string(),
    }))
    .mutation(async ({ input }) => {
      const result = await lmstudioService.processLongText(
        input.modelId,
        input.text,
        (chunk, index, total) => 
          `${input.instruction}\n\nChunk ${index}/${total}:\n${chunk}`
      );
      return { success: true, result };
    }),
});
