/**
 * Models tRPC Router
 * AI Model management endpoints
 * 10 endpoints
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { aiModels, specializedAIs } from '../../db/schema.js';
import { eq, desc, like, and } from 'drizzle-orm';

export const modelsRouter = router({
  /**
   * 1. List all AI models
   */
  list: publicProcedure
    .input(z.object({
      isActive: z.boolean().optional(),
      limit: z.number().min(1).max(100).optional().default(50),
    }))
    .query(async ({ input }) => {
      const query = input.isActive !== undefined
        ? db.select().from(aiModels).where(eq(aiModels.isActive, input.isActive))
        : db.select().from(aiModels);

      const models = await query
        .orderBy(desc(aiModels.createdAt))
        .limit(input.limit);

      return { success: true, models };
    }),

  /**
   * 2. Get model by ID
   */
  getById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const [model] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.id, input.id))
        .limit(1);

      if (!model) {
        throw new Error('Model not found');
      }

      return { success: true, model };
    }),

  /**
   * 3. Create new model
   */
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      modelId: z.string().min(1),
      provider: z.string().optional().default('lmstudio'),
      modelType: z.string().optional(),
      contextWindow: z.number().optional(),
      parameters: z.string().optional(),
      quantization: z.string().optional(),
      capabilities: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      const result: any = await db.insert(aiModels).values({
        userId: 1,
        name: input.name,
        modelId: input.modelId,
        provider: input.provider,
        modelType: input.modelType,
        contextWindow: input.contextWindow,
        parameters: input.parameters,
        quantization: input.quantization,
        capabilities: input.capabilities as any,
        isActive: true,
      } as any);

      const modelId = result[0]?.insertId || result.insertId;
      const [model] = await db.select().from(aiModels).where(eq(aiModels.id, modelId)).limit(1);

      return { success: true, model };
    }),

  /**
   * 4. Update model
   */
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      contextWindow: z.number().optional(),
      parameters: z.string().optional(),
      quantization: z.string().optional(),
      capabilities: z.any().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      if (updates.capabilities) {
        updates.capabilities = JSON.stringify(updates.capabilities);
      }

      await db.update(aiModels)
        .set(updates)
        .where(eq(aiModels.id, id));

      const [updated] = await db.select().from(aiModels).where(eq(aiModels.id, id)).limit(1);

      return { success: true, model: updated };
    }),

  /**
   * 5. Delete model
   */
  delete: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.delete(aiModels).where(eq(aiModels.id, input.id));
      return { success: true, message: 'Model deleted' };
    }),

  /**
   * 6. Toggle model active status
   */
  toggleActive: publicProcedure
    .input(z.object({
      id: z.number(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      await db.update(aiModels)
        .set({ isActive: input.isActive })
        .where(eq(aiModels.id, input.id));

      const [updated] = await db.select().from(aiModels).where(eq(aiModels.id, input.id)).limit(1);

      return { success: true, model: updated };
    }),

  /**
   * 7. List specialized AIs
   */
  listSpecialized: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const conditions = [];

      if (input.category) {
        conditions.push(eq(specializedAIs.category, input.category));
      }

      if (input.isActive !== undefined) {
        conditions.push(eq(specializedAIs.isActive, input.isActive));
      }

      const query = conditions.length > 0
        ? db.select().from(specializedAIs).where(and(...conditions))
        : db.select().from(specializedAIs);

      const ais = await query;

      return { success: true, specializedAIs: ais };
    }),

  /**
   * 8. Create specialized AI
   */
  createSpecialized: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      category: z.string(),
      systemPrompt: z.string().optional(),
      defaultModelId: z.number(),
      fallbackModelIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ input }) => {
      const result: any = await db.insert(specializedAIs).values({
        userId: 1,
        name: input.name,
        description: input.description,
        category: input.category,
        systemPrompt: input.systemPrompt,
        defaultModelId: input.defaultModelId,
        fallbackModelIds: input.fallbackModelIds as any,
        isActive: true,
      } as any);

      const aiId = result[0]?.insertId || result.insertId;
      const [ai] = await db.select().from(specializedAIs).where(eq(specializedAIs.id, aiId)).limit(1);

      return { success: true, specializedAI: ai };
    }),

  /**
   * 9. Update specialized AI
   */
  updateSpecialized: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      systemPrompt: z.string().optional(),
      defaultModelId: z.number().optional(),
      fallbackModelIds: z.array(z.number()).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      await db.update(specializedAIs)
        .set(updates as any)
        .where(eq(specializedAIs.id, id));

      const [updated] = await db.select().from(specializedAIs).where(eq(specializedAIs.id, id)).limit(1);

      return { success: true, specializedAI: updated };
    }),

  /**
   * 10. Search models
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      limit: z.number().min(1).max(50).optional().default(20),
    }))
    .query(async ({ input }) => {
      const results = await db.select()
        .from(aiModels)
        .where(like(aiModels.name, `%${input.query}%`))
        .limit(input.limit);

      return { success: true, models: results };
    }),
});
