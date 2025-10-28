import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { aiWorkflows } from '../db/schema.js';
import { eq, and, like, desc } from 'drizzle-orm';
import { idSchema, createWorkflowSchema, updateWorkflowSchema, searchSchema } from '../utils/validation.js';

export const workflowsRouter = router({
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [eq(aiWorkflows.userId, 1)];
      if (query) {
        conditions.push(like(aiWorkflows.name, `%${query}%`));
      }

      const where = and(...conditions);

      const items = await db.select()
        .from(aiWorkflows)
        .where(where)
        .orderBy(desc(aiWorkflows.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: aiWorkflows.id })
        .from(aiWorkflows)
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
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, id))
        .limit(1);

      if (!workflow) {
        throw new Error('Workflow não encontrado');
      }

      return workflow;
    }),

  create: publicProcedure
    .input(createWorkflowSchema)
    .mutation(async ({ input }) => {
      const [workflow] = await db.insert(aiWorkflows)
        .values(input)
        .$returningId();

      return { id: workflow.id, success: true };
    }),

  update: publicProcedure
    .input(updateWorkflowSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(aiWorkflows)
        .set(data)
        .where(eq(aiWorkflows.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(aiWorkflows)
        .where(eq(aiWorkflows.id, id));

      return { success: true };
    }),

  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, id))
        .limit(1);

      if (!workflow) {
        throw new Error('Workflow não encontrado');
      }

      await db.update(aiWorkflows)
        .set({ isActive: !workflow.isActive })
        .where(eq(aiWorkflows.id, id));

      return { success: true, isActive: !workflow.isActive };
    }),
});
