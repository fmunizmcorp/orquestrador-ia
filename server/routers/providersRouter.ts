import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { aiProviders } from '../db/schema.js';
import { eq, like, and } from 'drizzle-orm';
import {
  idSchema,
  createProviderSchema,
  updateProviderSchema,
  searchSchema,
} from '../utils/validation.js';

export const providersRouter = router({
  // Listar todos os provedores
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      try {
        const { query, page = 1, limit = 20 } = input || {};
        const offset = (page - 1) * limit;

        let conditions = [];
        if (query) {
          conditions.push(like(aiProviders.name, `%${query}%`));
        }

        const where = conditions.length > 0 ? and(...conditions) : undefined;

        const [items, total] = await Promise.all([
          db.select()
            .from(aiProviders)
            .where(where)
            .limit(limit)
            .offset(offset),
          db.select({ count: aiProviders.id })
            .from(aiProviders)
            .where(where)
            .then(rows => rows.length),
        ]);

        return {
          items,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        };
      } catch (error) {
        console.error('Erro ao listar provedores:', error);
        throw new Error('Falha ao listar provedores');
      }
    }),

  // Buscar provedor por ID
  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      try {
        const [provider] = await db.select()
          .from(aiProviders)
          .where(eq(aiProviders.id, id))
          .limit(1);

        if (!provider) {
          throw new Error('Provedor não encontrado');
        }

        return provider;
      } catch (error) {
        console.error('Erro ao buscar provedor:', error);
        throw error;
      }
    }),

  // Criar provedor
  create: publicProcedure
    .input(createProviderSchema)
    .mutation(async ({ input }) => {
      try {
        const result: any = await db.insert(aiProviders)
          .values(input);

        const insertId = result[0]?.insertId || result.insertId;
        return { id: insertId, success: true };
      } catch (error) {
        console.error('Erro ao criar provedor:', error);
        throw new Error('Falha ao criar provedor');
      }
    }),

  // Atualizar provedor
  update: publicProcedure
    .input(updateProviderSchema)
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;

        await db.update(aiProviders)
          .set(data)
          .where(eq(aiProviders.id, id));

        return { success: true };
      } catch (error) {
        console.error('Erro ao atualizar provedor:', error);
        throw new Error('Falha ao atualizar provedor');
      }
    }),

  // Deletar provedor
  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      try {
        await db.delete(aiProviders)
          .where(eq(aiProviders.id, id));

        return { success: true };
      } catch (error) {
        console.error('Erro ao deletar provedor:', error);
        throw new Error('Falha ao deletar provedor');
      }
    }),

  // Ativar/desativar provedor
  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      try {
        const [provider] = await db.select()
          .from(aiProviders)
          .where(eq(aiProviders.id, id))
          .limit(1);

        if (!provider) {
          throw new Error('Provedor não encontrado');
        }

        await db.update(aiProviders)
          .set({ isActive: !provider.isActive })
          .where(eq(aiProviders.id, id));

        return { success: true, isActive: !provider.isActive };
      } catch (error) {
        console.error('Erro ao alternar status do provedor:', error);
        throw new Error('Falha ao alternar status');
      }
    }),
});
