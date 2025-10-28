import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { executionLogs } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { idSchema, searchSchema } from '../utils/validation';
import { z } from 'zod';

export const executionLogsRouter = router({
  listByTask: publicProcedure
    .input(z.object({
      taskId: idSchema,
      level: z.enum(['debug', 'info', 'warning', 'error', 'critical']).optional(),
      page: z.number().default(1),
      limit: z.number().default(50),
    }))
    .query(async ({ input }) => {
      const { taskId, level, page, limit } = input;
      const offset = (page - 1) * limit;

      let conditions = [eq(executionLogs.taskId, taskId)];
      if (level) {
        conditions.push(eq(executionLogs.level, level));
      }

      const where = and(...conditions);

      const items = await db.select()
        .from(executionLogs)
        .where(where)
        .orderBy(desc(executionLogs.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: executionLogs.id })
        .from(executionLogs)
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

  listBySubtask: publicProcedure
    .input(idSchema)
    .query(async ({ input: subtaskId }) => {
      const items = await db.select()
        .from(executionLogs)
        .where(eq(executionLogs.subtaskId, subtaskId))
        .orderBy(desc(executionLogs.createdAt));

      return items;
    }),

  create: publicProcedure
    .input(z.object({
      taskId: idSchema.optional(),
      subtaskId: idSchema.optional(),
      level: z.enum(['debug', 'info', 'warning', 'error', 'critical']),
      message: z.string(),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      const [log] = await db.insert(executionLogs)
        .values(input)
        .$returningId();

      return { id: log.id, success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(executionLogs)
        .where(eq(executionLogs.id, id));

      return { success: true };
    }),
});
