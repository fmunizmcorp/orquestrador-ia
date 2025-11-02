import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { specializedAIs, aiModels } from '../db/schema.js';
import { eq, like, and, desc } from 'drizzle-orm';
import { idSchema, createSpecializedAISchema, updateSpecializedAISchema, searchSchema } from '../utils/validation.js';
import { z } from 'zod';

export const specializedAIsRouter = router({
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [eq(specializedAIs.userId, 1)];
      if (query) {
        conditions.push(like(specializedAIs.name, `%${query}%`));
      }

      const where = and(...conditions);

      const items = await db.select({
        id: specializedAIs.id,
        userId: specializedAIs.userId,
        name: specializedAIs.name,
        description: specializedAIs.description,
        category: specializedAIs.category,
        defaultModelId: specializedAIs.defaultModelId,
        defaultModelName: aiModels.name,
        fallbackModelIds: specializedAIs.fallbackModelIds,
        systemPrompt: specializedAIs.systemPrompt,
        capabilities: specializedAIs.capabilities,
        isActive: specializedAIs.isActive,
        createdAt: specializedAIs.createdAt,
        updatedAt: specializedAIs.updatedAt,
      })
        .from(specializedAIs)
        .leftJoin(aiModels, eq(specializedAIs.defaultModelId, aiModels.id))
        .where(where)
        .orderBy(desc(specializedAIs.createdAt))
        .limit(limit)
        .offset(offset);

      const countRows = await db.select({ count: specializedAIs.id })
        .from(specializedAIs)
        .where(where);

      const total = countRows.length;

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [ai] = await db.select()
        .from(specializedAIs)
        .where(eq(specializedAIs.id, id))
        .limit(1);

      if (!ai) {
        throw new Error('IA especializada não encontrada');
      }

      return ai;
    }),

  create: publicProcedure
    .input(createSpecializedAISchema)
    .mutation(async ({ input }) => {
      const result: any = await db.insert(specializedAIs)
        .values(input);

      const insertId = result[0]?.insertId || result.insertId;
      return { id: insertId, success: true };
    }),

  update: publicProcedure
    .input(updateSpecializedAISchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(specializedAIs)
        .set(data)
        .where(eq(specializedAIs.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(specializedAIs)
        .where(eq(specializedAIs.id, id));

      return { success: true };
    }),

  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [ai] = await db.select()
        .from(specializedAIs)
        .where(eq(specializedAIs.id, id))
        .limit(1);

      if (!ai) {
        throw new Error('IA especializada não encontrada');
      }

      await db.update(specializedAIs)
        .set({ isActive: !ai.isActive })
        .where(eq(specializedAIs.id, id));

      return { success: true, isActive: !ai.isActive };
    }),

  listByCategory: publicProcedure
    .input(searchSchema.extend({ category: z.string().optional() }))
    .query(async ({ input }) => {
      const { category, page = 1, limit = 20 } = input;
      const offset = (page - 1) * limit;

      let conditions = [eq(specializedAIs.userId, 1)];
      if (category) {
        conditions.push(eq(specializedAIs.category, category as any));
      }

      const where = and(...conditions);

      const items = await db.select()
        .from(specializedAIs)
        .where(where)
        .orderBy(desc(specializedAIs.createdAt))
        .limit(limit)
        .offset(offset);

      const countRows = await db.select({ count: specializedAIs.id })
        .from(specializedAIs)
        .where(where);

      const total = countRows.length;

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),
});
