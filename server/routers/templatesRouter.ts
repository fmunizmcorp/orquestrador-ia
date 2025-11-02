import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { aiTemplates } from '../db/schema.js';
import { eq, and, like, desc } from 'drizzle-orm';
import { idSchema, createTemplateSchema, updateTemplateSchema, searchSchema } from '../utils/validation.js';

export const templatesRouter = router({
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [eq(aiTemplates.userId, 1)];
      if (query) {
        conditions.push(like(aiTemplates.name, `%${query}%`));
      }

      const where = and(...conditions);

      const items = await db.select()
        .from(aiTemplates)
        .where(where)
        .orderBy(desc(aiTemplates.createdAt))
        .limit(limit)
        .offset(offset);

      const countRows = await db.select({ count: aiTemplates.id })
        .from(aiTemplates)
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
      const [template] = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.id, id))
        .limit(1);

      if (!template) {
        throw new Error('Template não encontrado');
      }

      return template;
    }),

  create: publicProcedure
    .input(createTemplateSchema)
    .mutation(async ({ input }) => {
      const { isActive, templateData, ...rest } = input;
      
      const result: any = await db.insert(aiTemplates)
        .values({
          ...rest,
          templateData: templateData || {},
        });

      const insertId = result[0]?.insertId || result.insertId;
      return { id: insertId, success: true };
    }),

  update: publicProcedure
    .input(updateTemplateSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(aiTemplates)
        .set(data)
        .where(eq(aiTemplates.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(aiTemplates)
        .where(eq(aiTemplates.id, id));

      return { success: true };
    }),
});