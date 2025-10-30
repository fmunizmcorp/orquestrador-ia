import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { tasks, subtasks } from '../db/schema.js';
import { eq, desc, and, like } from 'drizzle-orm';
import { idSchema, createTaskSchema, updateTaskSchema, searchSchema } from '../utils/validation.js';
import { z } from 'zod';

export const tasksRouter = router({
  list: publicProcedure
    .input(searchSchema.extend({
      status: z.enum(['pending', 'planning', 'executing', 'validating', 'completed', 'failed', 'paused']).optional(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    }).optional())
    .query(async ({ input }) => {
      const { query, status, priority, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [eq(tasks.userId, 1)];
      if (query) {
        conditions.push(like(tasks.title, `%${query}%`));
      }
      if (status) {
        conditions.push(eq(tasks.status, status));
      }
      if (priority) {
        conditions.push(eq(tasks.priority, priority));
      }

      const where = and(...conditions);

      const items = await db.select()
        .from(tasks)
        .where(where)
        .orderBy(desc(tasks.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: tasks.id })
        .from(tasks)
        .where(where);

      // Adicionar contagem de subtarefas para cada tarefa
      const itemsWithSubtasks = await Promise.all(
        items.map(async (task) => {
          const [subtaskCount] = await db.select({ count: subtasks.id })
            .from(subtasks)
            .where(eq(subtasks.taskId, task.id));

          const [completedCount] = await db.select({ count: subtasks.id })
            .from(subtasks)
            .where(and(
              eq(subtasks.taskId, task.id),
              eq(subtasks.status, 'completed')
            ));

          return {
            ...task,
            subtaskCount: subtaskCount?.count || 0,
            completedSubtasks: completedCount?.count || 0,
          };
        })
      );

      return {
        items: itemsWithSubtasks,
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
      const [task] = await db.select()
        .from(tasks)
        .where(eq(tasks.id, id))
        .limit(1);

      if (!task) {
        throw new Error('Tarefa não encontrada');
      }

      // Buscar subtarefas
      const taskSubtasks = await db.select()
        .from(subtasks)
        .where(eq(subtasks.taskId, id))
        .orderBy(subtasks.createdAt);

      return {
        ...task,
        subtasks: taskSubtasks,
      };
    }),

  create: publicProcedure
    .input(createTaskSchema)
    .mutation(async ({ input }) => {
      const result: any = await db.insert(tasks)
        .values(input);

      const insertId = result[0]?.insertId || result.insertId;
      return { id: insertId, success: true };
    }),

  update: publicProcedure
    .input(updateTaskSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      // Se completando tarefa, adicionar timestamp
      if (data.status === 'completed' && !data.completedAt) {
        (data as any).completedAt = new Date();
      }

      await db.update(tasks)
        .set(data)
        .where(eq(tasks.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(tasks)
        .where(eq(tasks.id, id));

      return { success: true };
    }),

  // Estatísticas de tarefas
  stats: publicProcedure
    .query(async () => {
      const allTasks = await db.select()
        .from(tasks)
        .where(eq(tasks.userId, 1));

      const stats = {
        total: allTasks.length,
        pending: allTasks.filter(t => t.status === 'pending').length,
        planning: allTasks.filter(t => t.status === 'planning').length,
        executing: allTasks.filter(t => t.status === 'executing').length,
        validating: allTasks.filter(t => t.status === 'validating').length,
        completed: allTasks.filter(t => t.status === 'completed').length,
        failed: allTasks.filter(t => t.status === 'failed').length,
        paused: allTasks.filter(t => t.status === 'paused').length,
      };

      return stats;
    }),
});
