import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { subtasks, aiModels } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { idSchema, createSubtaskSchema, updateSubtaskSchema } from '../utils/validation';

export const subtasksRouter = router({
  listByTask: publicProcedure
    .input(idSchema)
    .query(async ({ input: taskId }) => {
      const items = await db.select({
        id: subtasks.id,
        taskId: subtasks.taskId,
        assignedModelId: subtasks.assignedModelId,
        assignedModelName: aiModels.name,
        title: subtasks.title,
        description: subtasks.description,
        prompt: subtasks.prompt,
        result: subtasks.result,
        status: subtasks.status,
        reviewedBy: subtasks.reviewedBy,
        reviewNotes: subtasks.reviewNotes,
        completedAt: subtasks.completedAt,
        createdAt: subtasks.createdAt,
        updatedAt: subtasks.updatedAt,
      })
        .from(subtasks)
        .leftJoin(aiModels, eq(subtasks.assignedModelId, aiModels.id))
        .where(eq(subtasks.taskId, taskId))
        .orderBy(subtasks.createdAt);

      return items;
    }),

  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [subtask] = await db.select()
        .from(subtasks)
        .where(eq(subtasks.id, id))
        .limit(1);

      if (!subtask) {
        throw new Error('Subtarefa não encontrada');
      }

      return subtask;
    }),

  create: publicProcedure
    .input(createSubtaskSchema)
    .mutation(async ({ input }) => {
      const [subtask] = await db.insert(subtasks)
        .values(input)
        .$returningId();

      return { id: subtask.id, success: true };
    }),

  update: publicProcedure
    .input(updateSubtaskSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      // Se completando subtarefa, adicionar timestamp
      if (data.status === 'completed' && !data.completedAt) {
        (data as any).completedAt = new Date();
      }

      await db.update(subtasks)
        .set(data)
        .where(eq(subtasks.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(subtasks)
        .where(eq(subtasks.id, id));

      return { success: true };
    }),
});
