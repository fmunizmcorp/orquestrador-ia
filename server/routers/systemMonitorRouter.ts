import { router, publicProcedure } from '../trpc.js';
import { systemMonitorService } from '../services/systemMonitorService.js';
import { z } from 'zod';

export const systemMonitorRouter = router({
  /**
   * Obter métricas atuais
   */
  getMetrics: publicProcedure
    .query(async () => {
      return await systemMonitorService.getMetrics();
    }),

  /**
   * Obter histórico de métricas
   */
  getHistory: publicProcedure
    .input(z.object({
      minutes: z.number().int().positive().optional(),
    }).optional())
    .query(async ({ input }) => {
      return systemMonitorService.getHistory(input?.minutes);
    }),

  /**
   * Obter médias do histórico
   */
  getAverages: publicProcedure
    .input(z.object({
      minutes: z.number().int().positive().default(10),
    }).optional())
    .query(async ({ input }) => {
      return systemMonitorService.getAverages(input?.minutes);
    }),

  /**
   * Verificar limites de recursos
   */
  checkLimits: publicProcedure
    .input(z.object({
      cpuMax: z.number().optional(),
      ramMax: z.number().optional(),
      vramMax: z.number().optional(),
      diskMax: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return await systemMonitorService.checkLimits(input);
    }),

  /**
   * Obter sugestões de ações
   */
  getSuggestions: publicProcedure
    .query(async () => {
      return await systemMonitorService.suggestActions();
    }),

  /**
   * Health check do sistema
   */
  healthCheck: publicProcedure
    .query(async () => {
      return await systemMonitorService.healthCheck();
    }),

  /**
   * Obter alertas ativos
   */
  getAlerts: publicProcedure
    .input(z.object({
      includeResolved: z.boolean().default(false),
    }).optional())
    .query(({ input }) => {
      return systemMonitorService.getAlerts(input?.includeResolved);
    }),

  /**
   * Limpar todos os alertas
   */
  clearAlerts: publicProcedure
    .mutation(() => {
      systemMonitorService.clearAlerts();
      return { success: true };
    }),

  /**
   * Obter estatísticas de GPU específica
   */
  getGPUStats: publicProcedure
    .input(z.object({
      index: z.number().int().nonnegative().default(0),
    }).optional())
    .query(async ({ input }) => {
      return await systemMonitorService.getGPUStats(input?.index);
    }),
});
