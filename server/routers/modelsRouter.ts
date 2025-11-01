import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { aiModels, aiProviders } from '../db/schema.js';
import { eq, like, and, desc } from 'drizzle-orm';
import { idSchema, createModelSchema, updateModelSchema, searchSchema } from '../utils/validation.js';
import { z } from 'zod';

export const modelsRouter = router({
  // Listar todos os modelos
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [];
      if (query) {
        conditions.push(like(aiModels.name, `%${query}%`));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db.select({
        id: aiModels.id,
        providerId: aiModels.providerId,
        providerName: aiProviders.name,
        name: aiModels.name,
        modelId: aiModels.modelId,
        capabilities: aiModels.capabilities,
        contextWindow: aiModels.contextWindow,
        isLoaded: aiModels.isLoaded,
        priority: aiModels.priority,
        isActive: aiModels.isActive,
        modelPath: aiModels.modelPath,
        quantization: aiModels.quantization,
        parameters: aiModels.parameters,
        sizeBytes: aiModels.sizeBytes,
        createdAt: aiModels.createdAt,
        updatedAt: aiModels.updatedAt,
      })
        .from(aiModels)
        .leftJoin(aiProviders, eq(aiModels.providerId, aiProviders.id))
        .where(where)
        .orderBy(desc(aiModels.priority))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: aiModels.id })
        .from(aiModels)
        .where(where);

      return {
        items,
        pagination: {
          page,
          limit,
          total: countResult?.count || 0,
          totalPages: Math.ceil((countResult?.count || 0) / limit),
        },
      };
    }),

  // Buscar modelo por ID
  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [model] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.id, id))
        .limit(1);

      if (!model) {
        throw new Error('Modelo não encontrado');
      }

      return model;
    }),

  // Criar modelo
  create: publicProcedure
    .input(createModelSchema)
    .mutation(async ({ input }) => {
      const { name, ...rest } = input;
      
      const result: any = await db.insert(aiModels)
        .values({
          ...rest,
          name: name,
        });

      const insertId = result[0]?.insertId || result.insertId;
      return { id: insertId, success: true };
    }),

  // Atualizar modelo
  update: publicProcedure
    .input(updateModelSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(aiModels)
        .set(data)
        .where(eq(aiModels.id, id));

      return { success: true };
    }),

  // Deletar modelo
  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(aiModels)
        .where(eq(aiModels.id, id));

      return { success: true };
    }),

  // Ativar/desativar modelo
  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [model] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.id, id))
        .limit(1);

      if (!model) {
        throw new Error('Modelo não encontrado');
      }

      await db.update(aiModels)
        .set({ isActive: !model.isActive })
        .where(eq(aiModels.id, id));

      return { success: true, isActive: !model.isActive };
    }),

  // Carregar/descarregar modelo
  toggleLoaded: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [model] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.id, id))
        .limit(1);

      if (!model) {
        throw new Error('Modelo não encontrado');
      }

      await db.update(aiModels)
        .set({ isLoaded: !model.isLoaded })
        .where(eq(aiModels.id, id));

      return { success: true, isLoaded: !model.isLoaded };
    }),

  // Listar modelos por provedor
  listByProvider: publicProcedure
    .input(idSchema)
    .query(async ({ input: providerId }) => {
      const items = await db.select()
        .from(aiModels)
        .where(eq(aiModels.providerId, providerId))
        .orderBy(desc(aiModels.priority));

      return items;
    }),
});
