import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { knowledgeBase } from '../db/schema.js';
import { eq, and, like, desc } from 'drizzle-orm';
import { idSchema, createKnowledgeBaseSchema, updateKnowledgeBaseSchema, searchSchema } from '../utils/validation.js';

export const knowledgeBaseRouter = router({
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [eq(knowledgeBase.userId, 1)];
      if (query) {
        conditions.push(like(knowledgeBase.title, `%${query}%`));
      }

      const where = and(...conditions);

      const items = await db.select()
        .from(knowledgeBase)
        .where(where)
        .orderBy(desc(knowledgeBase.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: knowledgeBase.id })
        .from(knowledgeBase)
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

  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [kb] = await db.select()
        .from(knowledgeBase)
        .where(eq(knowledgeBase.id, id))
        .limit(1);

      if (!kb) {
        throw new Error('Item da base de conhecimento não encontrado');
      }

      return kb;
    }),

  create: publicProcedure
    .input(createKnowledgeBaseSchema)
    .mutation(async ({ input }) => {
      const [kb] = await db.insert(knowledgeBase)
        .values(input)
        .$returningId();

      return { id: kb.id, success: true };
    }),

  update: publicProcedure
    .input(updateKnowledgeBaseSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(knowledgeBase)
        .set(data)
        .where(eq(knowledgeBase.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(knowledgeBase)
        .where(eq(knowledgeBase.id, id));

      return { success: true };
    }),

  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [kb] = await db.select()
        .from(knowledgeBase)
        .where(eq(knowledgeBase.id, id))
        .limit(1);

      if (!kb) {
        throw new Error('Item da base de conhecimento não encontrado');
      }

      await db.update(knowledgeBase)
        .set({ isActive: !kb.isActive })
        .where(eq(knowledgeBase.id, id));

      return { success: true, isActive: !kb.isActive };
    }),
});
