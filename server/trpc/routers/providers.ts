/**
 * AI Providers tRPC Router
 * Manages AI provider configurations (OpenAI, Anthropic, local, etc.)
 * SPRINT 49 - P0-1: Implementation of missing providers.create procedure
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { aiProviders } from '../../db/schema.js';
import { eq, desc, and, sql } from 'drizzle-orm';
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

const logger = pino({ level: env.LOG_LEVEL, transport: isDevelopment ? { target: 'pino-pretty' } : undefined });

export const providersRouter = router({
  /**
   * 1. List all AI providers
   */
  list: publicProcedure
    .input(z.object({
      isActive: z.boolean().optional(),
    }).optional())
    .query(async ({ input }) => {
      try {
        // Build condition
        const condition = input?.isActive !== undefined
          ? eq(aiProviders.isActive, input.isActive)
          : undefined;

        // Get providers
        const query = condition
          ? db.select().from(aiProviders).where(condition)
          : db.select().from(aiProviders);

        const providers = await query.orderBy(desc(aiProviders.createdAt));

        return { success: true, providers };
      } catch (error) {
        logger.error({ error }, 'Error listing providers');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIProvider',
          suggestion: 'Tente novamente ou contate o suporte',
        });
      }
    }),

  /**
   * 2. Get provider by ID
   */
  getById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      try {
        const [provider] = await db.select()
          .from(aiProviders)
          .where(eq(aiProviders.id, input.id))
          .limit(1);

        if (!provider) {
          throw notFoundError('AIProvider', input.id, 'Verifique o ID ou acesse a lista de provedores');
        }

        return { success: true, provider };
      } catch (error) {
        logger.error({ error, providerId: input.id }, 'Error getting provider');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIProvider',
          resourceId: input.id,
          suggestion: 'Verifique se o provedor existe',
        });
      }
    }),

  /**
   * 3. Create new provider
   * SPRINT 49 - P0-1: Fixed missing procedure
   */
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1, 'Nome é obrigatório'),
      type: z.enum(['local', 'api'], { 
        errorMap: () => ({ message: 'Tipo deve ser "local" ou "api"' }) 
      }),
      endpoint: z.string().min(1, 'Endpoint/URL é obrigatório'),
      apiKey: z.string().optional(),
      config: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        logger.info({ input: { ...input, apiKey: input.apiKey ? '***' : undefined } }, 'Creating AI provider');

        // Validate that API providers have an API key
        if (input.type === 'api' && !input.apiKey) {
          throw validationError(
            'apiKey',
            'API Key é obrigatória para provedores do tipo "api"',
            'Forneça uma API Key válida para provedores externos'
          );
        }

        const result: any = await db.insert(aiProviders).values({
          name: input.name,
          type: input.type,
          endpoint: input.endpoint,
          apiKey: input.apiKey || null,
          config: input.config as any,
          isActive: true,
        } as any);

        const providerId = result[0]?.insertId || result.insertId;
        
        if (!providerId) {
          throw createStandardError(
            'INTERNAL_SERVER_ERROR',
            ErrorCodes.INTERNAL_DATABASE_ERROR,
            'Falha ao criar provedor',
            {
              context: { name: input.name, type: input.type },
              technicalMessage: 'Failed to get insertId after provider insert',
              suggestion: 'Tente novamente',
            }
          );
        }
        
        const [provider] = await db.select().from(aiProviders).where(eq(aiProviders.id, providerId)).limit(1);

        logger.info({ providerId }, 'AI provider created successfully');

        return { success: true, provider };
      } catch (error) {
        logger.error({ error, input: { ...input, apiKey: input.apiKey ? '***' : undefined } }, 'Error creating provider');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIProvider',
          context: { name: input.name },
          suggestion: 'Verifique se o nome não está duplicado',
        });
      }
    }),

  /**
   * 4. Update provider
   */
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      type: z.enum(['local', 'api']).optional(),
      endpoint: z.string().optional(),
      apiKey: z.string().optional(),
      config: z.any().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { id, ...updates } = input;

        logger.info({ providerId: id, updates: { ...updates, apiKey: updates.apiKey ? '***' : undefined } }, 'Updating provider');

        if (updates.config) {
          updates.config = JSON.stringify(updates.config);
        }

        await db.update(aiProviders)
          .set(updates as any)
          .where(eq(aiProviders.id, id));

        const [updated] = await db.select().from(aiProviders).where(eq(aiProviders.id, id)).limit(1);
        
        if (!updated) {
          throw notFoundError('AIProvider', id, 'O provedor pode ter sido deletado');
        }

        logger.info({ providerId: id }, 'Provider updated successfully');

        return { success: true, provider: updated };
      } catch (error) {
        logger.error({ error, providerId: input.id }, 'Error updating provider');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIProvider',
          resourceId: input.id,
          suggestion: 'Verifique se o provedor existe',
        });
      }
    }),

  /**
   * 5. Delete provider
   */
  delete: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      try {
        const [provider] = await db.select().from(aiProviders).where(eq(aiProviders.id, input.id)).limit(1);
        
        if (!provider) {
          throw notFoundError('AIProvider', input.id, 'O provedor já foi deletado ou não existe');
        }
        
        await db.delete(aiProviders).where(eq(aiProviders.id, input.id));

        logger.info({ providerId: input.id }, 'Provider deleted successfully');

        return { success: true, message: 'Provider deleted' };
      } catch (error) {
        logger.error({ error, providerId: input.id }, 'Error deleting provider');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIProvider',
          resourceId: input.id,
          suggestion: 'Verifique se o provedor existe',
        });
      }
    }),

  /**
   * 6. Toggle provider active status
   */
  toggleActive: publicProcedure
    .input(z.object({
      id: z.number(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      try {
        await db.update(aiProviders)
          .set({ isActive: input.isActive })
          .where(eq(aiProviders.id, input.id));

        const [updated] = await db.select().from(aiProviders).where(eq(aiProviders.id, input.id)).limit(1);
        
        if (!updated) {
          throw notFoundError('AIProvider', input.id, 'O provedor pode ter sido deletado');
        }

        logger.info({ providerId: input.id, isActive: input.isActive }, 'Provider active status toggled');

        return { success: true, provider: updated };
      } catch (error) {
        logger.error({ error, providerId: input.id }, 'Error toggling provider active status');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIProvider',
          resourceId: input.id,
          suggestion: 'Verifique se o provedor existe',
        });
      }
    }),

  /**
   * 7. Get provider statistics
   */
  getStats: publicProcedure
    .query(async () => {
      try {
        // Count total providers
        const [{ total }] = await db
          .select({ total: sql<number>`count(*)` })
          .from(aiProviders);

        // Count active providers
        const [{ active }] = await db
          .select({ active: sql<number>`count(*)` })
          .from(aiProviders)
          .where(eq(aiProviders.isActive, true));

        // Count by type
        const byType = await db
          .select({
            type: aiProviders.type,
            count: sql<number>`count(*)`,
          })
          .from(aiProviders)
          .groupBy(aiProviders.type);

        return {
          success: true,
          stats: {
            total: total || 0,
            active: active || 0,
            inactive: (total || 0) - (active || 0),
            byType: byType.reduce((acc, item) => {
              acc[item.type] = item.count;
              return acc;
            }, {} as Record<string, number>),
          },
        };
      } catch (error) {
        logger.error({ error }, 'Error getting provider stats');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'AIProvider',
          suggestion: 'Tente novamente',
        });
      }
    }),
});
