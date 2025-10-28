import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { instructions, specializedAIs } from '../db/schema.js';
import { eq, and, like, desc } from 'drizzle-orm';
import { idSchema, createInstructionSchema, updateInstructionSchema, searchSchema } from '../utils/validation';

export const instructionsRouter = router({
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [eq(instructions.userId, 1)];
      if (query) {
        conditions.push(like(instructions.title, `%${query}%`));
      }

      const where = and(...conditions);

      const items = await db.select({
        id: instructions.id,
        userId: instructions.userId,
        aiId: instructions.aiId,
        aiName: specializedAIs.name,
        title: instructions.title,
        content: instructions.content,
        priority: instructions.priority,
        isActive: instructions.isActive,
        createdAt: instructions.createdAt,
        updatedAt: instructions.updatedAt,
      })
        .from(instructions)
        .leftJoin(specializedAIs, eq(instructions.aiId, specializedAIs.id))
        .where(where)
        .orderBy(desc(instructions.priority), desc(instructions.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: instructions.id })
        .from(instructions)
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
      const [instruction] = await db.select()
        .from(instructions)
        .where(eq(instructions.id, id))
        .limit(1);

      if (!instruction) {
        throw new Error('Instrução não encontrada');
      }

      return instruction;
    }),

  create: publicProcedure
    .input(createInstructionSchema)
    .mutation(async ({ input }) => {
      const [instruction] = await db.insert(instructions)
        .values(input)
        .$returningId();

      return { id: instruction.id, success: true };
    }),

  update: publicProcedure
    .input(updateInstructionSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(instructions)
        .set(data)
        .where(eq(instructions.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(instructions)
        .where(eq(instructions.id, id));

      return { success: true };
    }),

  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [instruction] = await db.select()
        .from(instructions)
        .where(eq(instructions.id, id))
        .limit(1);

      if (!instruction) {
        throw new Error('Instrução não encontrada');
      }

      await db.update(instructions)
        .set({ isActive: !instruction.isActive })
        .where(eq(instructions.id, id));

      return { success: true, isActive: !instruction.isActive };
    }),
});
