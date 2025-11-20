/**
 * Model Management Router
 * Endpoints tRPC para gerenciamento de modelos
 */

import { router, publicProcedure } from '../trpc.js';
import { z } from 'zod';
import { modelLoaderService } from '../../services/modelLoaderService.js';

export const modelManagementRouter = router({
  /**
   * Verifica o status de um modelo
   */
  checkStatus: publicProcedure
    .input(z.object({ modelId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return await modelLoaderService.checkModelStatus(input.modelId);
    }),

  /**
   * Carrega um modelo no LM Studio
   */
  load: publicProcedure
    .input(z.object({ modelId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return await modelLoaderService.loadModel(input.modelId);
    }),

  /**
   * Aguarda o carregamento de um modelo
   */
  waitForLoad: publicProcedure
    .input(z.object({
      modelId: z.number().int().positive(),
      maxWaitMs: z.number().int().positive().optional(),
    }))
    .mutation(async ({ input }) => {
      const success = await modelLoaderService.waitForModelLoad(
        input.modelId,
        input.maxWaitMs
      );
      return { success };
    }),

  /**
   * Descarrega um modelo
   */
  unload: publicProcedure
    .input(z.object({ modelId: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      return await modelLoaderService.unloadModel(input.modelId);
    }),

  /**
   * Lista todos os modelos com seus status
   */
  listWithStatus: publicProcedure
    .query(async () => {
      return await modelLoaderService.listAvailableModels();
    }),

  /**
   * Sugere um modelo alternativo
   */
  suggestAlternative: publicProcedure
    .input(z.object({ failedModelId: z.number().int().positive() }))
    .query(async ({ input }) => {
      return await modelLoaderService.suggestAlternativeModel(input.failedModelId);
    }),

  /**
   * Reseta o cache de modelos falhados
   */
  resetFailedCache: publicProcedure
    .mutation(async () => {
      modelLoaderService.resetFailedModels();
      return { success: true, message: 'Cache resetado com sucesso' };
    }),
});
