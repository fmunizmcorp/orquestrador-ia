/**
 * Models tRPC Router
 * AI Model management endpoints
 * 10 endpoints
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { aiModels, specializedAIs } from '../../db/schema.js';
import { eq, desc, like, and, sql } from 'drizzle-orm';
import pino from 'pino';
import { env, isDevelopment } from '../../config/env.js';
import {
  createStandardError,
  handleDatabaseError,
  handleGenericError,
  ErrorCodes,
  notFoundError,
  forbiddenError,
  validationError,
} from '../../utils/errors.js';
import {
  paginationInputSchema,
  optionalPaginationInputSchema,
  createPaginatedResponse,
  applyPagination,
} from '../../utils/pagination.js';

const logger = pino({ level: env.LOG_LEVEL, transport: isDevelopment ? { target: 'pino-pretty' } : undefined });

export const modelsRouter = router({
  /**
   * 1. List all AI models
   */
  list: publicProcedure
    .input(z.object({
      isActive: z.boolean().optional(),
    }).merge(paginationInputSchema).optional().default({ limit: 50, offset: 0 }))
    .query(async ({ input }) => {
      try {
        // Build condition
        const condition = input.isActive !== undefined
          ? eq(aiModels.isActive, input.isActive)
          : undefined;

        // Count total
        const [{ count: total }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(aiModels)
          .where(condition);

        // Get paginated results
        const { limit, offset } = applyPagination(input);
        const query = condition
          ? db.select().from(aiModels).where(condition)
          : db.select().from(aiModels);

        const models = await query
          .orderBy(desc(aiModels.createdAt))
          .limit(limit)
          .offset(offset);

        return createPaginatedResponse(models, total || 0, input);
      } catch (error) {
        logger.error({ error }, 'Error listing models');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIModel',
          suggestion: 'Tente novamente ou contate o suporte',
        });
      }
    }),

  /**
   * 2. Get model by ID
   */
  getById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const [model] = await db.select()
          .from(aiModels)
          .where(eq(aiModels.id, input.id))
          .limit(1);

        if (!model) {
          throw notFoundError('AIModel', input.id, 'Verifique o ID ou acesse a lista de modelos');
        }

        return { success: true, model };
      } catch (error) {
        logger.error({ error, modelId: input.id }, 'Error getting model');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIModel',
          resourceId: input.id,
          suggestion: 'Verifique se o modelo existe',
        });
      }
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
      try {
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
      
      if (!modelId) {
        throw createStandardError(
          'INTERNAL_SERVER_ERROR',
          ErrorCodes.INTERNAL_DATABASE_ERROR,
          'Falha ao criar modelo',
          {
            context: { name: input.name, modelId: input.modelId },
            technicalMessage: 'Failed to get insertId after model insert',
            suggestion: 'Tente novamente',
          }
        );
      }
      
      const [model] = await db.select().from(aiModels).where(eq(aiModels.id, modelId)).limit(1);

      return { success: true, model };
      } catch (error) {
        logger.error({ error, input }, 'Error creating model');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIModel',
          context: { name: input.name },
          suggestion: 'Verifique se o modelId não está duplicado',
        });
      }
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
      try {
        const { id, ...updates } = input;

        if (updates.capabilities) {
          updates.capabilities = JSON.stringify(updates.capabilities);
        }

        await db.update(aiModels)
          .set(updates)
          .where(eq(aiModels.id, id));

        const [updated] = await db.select().from(aiModels).where(eq(aiModels.id, id)).limit(1);
        
        if (!updated) {
          throw notFoundError('AIModel', id, 'O modelo pode ter sido deletado');
        }

        return { success: true, model: updated };
      } catch (error) {
        logger.error({ error, modelId: input.id }, 'Error updating model');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIModel',
          resourceId: input.id,
          suggestion: 'Verifique se o modelo existe',
        });
      }
    }),

  /**
   * 5. Delete model
   */
  delete: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        const [model] = await db.select().from(aiModels).where(eq(aiModels.id, input.id)).limit(1);
        
        if (!model) {
          throw notFoundError('AIModel', input.id, 'O modelo já foi deletado ou não existe');
        }
        
        await db.delete(aiModels).where(eq(aiModels.id, input.id));
        return { success: true, message: 'Model deleted' };
      } catch (error) {
        logger.error({ error, modelId: input.id }, 'Error deleting model');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIModel',
          resourceId: input.id,
          suggestion: 'Verifique se o modelo existe',
        });
      }
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
      try {
        await db.update(aiModels)
          .set({ isActive: input.isActive })
          .where(eq(aiModels.id, input.id));

        const [updated] = await db.select().from(aiModels).where(eq(aiModels.id, input.id)).limit(1);
        
        if (!updated) {
          throw notFoundError('AIModel', input.id, 'O modelo pode ter sido deletado');
        }

        return { success: true, model: updated };
      } catch (error) {
        logger.error({ error, modelId: input.id }, 'Error toggling model active status');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIModel',
          resourceId: input.id,
          suggestion: 'Verifique se o modelo existe',
        });
      }
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
      try {
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
      } catch (error) {
        logger.error({ error }, 'Error listing specialized AIs');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'SpecializedAI',
          suggestion: 'Tente novamente ou contate o suporte',
        });
      }
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
      try {
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
        
        if (!aiId) {
          throw createStandardError(
            'INTERNAL_SERVER_ERROR',
            ErrorCodes.INTERNAL_DATABASE_ERROR,
            'Falha ao criar IA especializada',
            {
              context: { name: input.name },
              technicalMessage: 'Failed to get insertId after specialized AI insert',
              suggestion: 'Tente novamente',
            }
          );
        }
        
        const [ai] = await db.select().from(specializedAIs).where(eq(specializedAIs.id, aiId)).limit(1);

        return { success: true, specializedAI: ai };
      } catch (error) {
        logger.error({ error, input }, 'Error creating specialized AI');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'SpecializedAI',
          context: { name: input.name },
          suggestion: 'Verifique se o modelo padrão existe',
        });
      }
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
      try {
        const { id, ...updates } = input;

        await db.update(specializedAIs)
          .set(updates as any)
          .where(eq(specializedAIs.id, id));

        const [updated] = await db.select().from(specializedAIs).where(eq(specializedAIs.id, id)).limit(1);
        
        if (!updated) {
          throw notFoundError('SpecializedAI', id, 'A IA especializada pode ter sido deletada');
        }

        return { success: true, specializedAI: updated };
      } catch (error) {
        logger.error({ error, aiId: input.id }, 'Error updating specialized AI');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'SpecializedAI',
          resourceId: input.id,
          suggestion: 'Verifique se a IA especializada existe',
        });
      }
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
      try {
        const results = await db.select()
          .from(aiModels)
          .where(like(aiModels.name, `%${input.query}%`))
          .limit(input.limit);

        return { success: true, models: results };
      } catch (error) {
        logger.error({ error, query: input.query }, 'Error searching models');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIModel',
          suggestion: 'Tente novamente com termos diferentes',
        });
      }
    }),

  /**
   * 11. Discover models from LM Studio
   */
  discoverModels: publicProcedure
    .input(z.object({}).optional())
    .query(async () => {
      try {
        // Try to connect to LM Studio on default port 1234
        const lmStudioUrl = 'http://127.0.0.1:1234/v1/models';
        
        try {
          const response = await fetch(lmStudioUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(5000), // 5 second timeout
          });

          if (!response.ok) {
            throw new Error(`LM Studio returned ${response.status}`);
          }

          const data = await response.json();
          
          // Get existing models from database
          const existingModels = await db.select().from(aiModels);
          const existingModelIds = new Set(existingModels.map(m => m.modelId));

          // Format discovered models
          const discoveredModels = (data.data || []).map((model: any) => ({
            id: model.id,
            modelName: model.id.replace(/\//g, '-'),
            modelPath: model.id,
            modelId: model.id,
            object: model.object,
            created: model.created,
            owned_by: model.owned_by || 'local',
            discoveredAt: new Date().toISOString(),
            isImported: existingModelIds.has(model.id),
          }));

          logger.info({ count: discoveredModels.length }, 'Discovered models from LM Studio');

          return {
            success: true,
            discovered: discoveredModels,
            totalDiscovered: discoveredModels.length,
            message: discoveredModels.length > 0
              ? `${discoveredModels.length} modelo(s) descoberto(s)`
              : 'Nenhum modelo encontrado no LM Studio',
          };
        } catch (fetchError: any) {
          logger.warn({ error: fetchError.message }, 'LM Studio not reachable');
          
          return {
            success: false,
            discovered: [],
            totalDiscovered: 0,
            message: 'LM Studio não está rodando ou não está acessível na porta 1234',
            error: fetchError.message,
          };
        }
      } catch (error) {
        logger.error({ error }, 'Error discovering models');
        
        throw handleGenericError(error, 'discover models');
      }
    }),
});
