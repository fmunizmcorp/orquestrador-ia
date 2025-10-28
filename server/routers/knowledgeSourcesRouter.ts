import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { knowledgeSources } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { idSchema, createKnowledgeSourceSchema, updateKnowledgeSourceSchema } from '../utils/validation';

export const knowledgeSourcesRouter = router({
  listByKnowledgeBase: publicProcedure
    .input(idSchema)
    .query(async ({ input: knowledgeBaseId }) => {
      const items = await db.select()
        .from(knowledgeSources)
        .where(eq(knowledgeSources.knowledgeBaseId, knowledgeBaseId))
        .orderBy(desc(knowledgeSources.createdAt));

      return items;
    }),

  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [source] = await db.select()
        .from(knowledgeSources)
        .where(eq(knowledgeSources.id, id))
        .limit(1);

      if (!source) {
        throw new Error('Fonte não encontrada');
      }

      return source;
    }),

  create: publicProcedure
    .input(createKnowledgeSourceSchema)
    .mutation(async ({ input }) => {
      const [source] = await db.insert(knowledgeSources)
        .values(input)
        .$returningId();

      return { id: source.id, success: true };
    }),

  update: publicProcedure
    .input(updateKnowledgeSourceSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(knowledgeSources)
        .set(data)
        .where(eq(knowledgeSources.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(knowledgeSources)
        .where(eq(knowledgeSources.id, id));

      return { success: true };
    }),
});
