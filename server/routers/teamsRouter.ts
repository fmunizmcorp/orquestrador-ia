import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { teams, teamMembers, users } from '../db/schema.js';
import { eq, like, and, desc } from 'drizzle-orm';
import { z } from 'zod';

const idSchema = z.number().int().positive();

const createTeamSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  ownerId: z.number().int().positive(),
});

const updateTeamSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
});

const searchSchema = z.object({
  query: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
});

export const teamsRouter = router({
  // List all teams
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [];
      if (query) {
        conditions.push(like(teams.name, `%${query}%`));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db.select({
        id: teams.id,
        name: teams.name,
        description: teams.description,
        ownerId: teams.ownerId,
        ownerName: users.name,
        createdAt: teams.createdAt,
        updatedAt: teams.updatedAt,
      })
        .from(teams)
        .leftJoin(users, eq(teams.ownerId, users.id))
        .where(where)
        .orderBy(desc(teams.createdAt))
        .limit(limit)
        .offset(offset);

      const countRows = await db.select({ count: teams.id })
        .from(teams)
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

  // Get team by ID
  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [team] = await db.select()
        .from(teams)
        .where(eq(teams.id, id))
        .limit(1);

      if (!team) {
        throw new Error('Time não encontrado');
      }

      return team;
    }),

  // Create team
  create: publicProcedure
    .input(createTeamSchema)
    .mutation(async ({ input }) => {
      const result: any = await db.insert(teams).values(input);
      const insertId = result[0]?.insertId || result.insertId;
      return { id: insertId, success: true };
    }),

  // Update team
  update: publicProcedure
    .input(updateTeamSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(teams)
        .set(data)
        .where(eq(teams.id, id));
      return { success: true };
    }),

  // Delete team
  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(teams)
        .where(eq(teams.id, id));
      return { success: true };
    }),
});
