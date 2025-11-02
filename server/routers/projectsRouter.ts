import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { projects, teams } from '../db/schema.js';
import { eq, like, and, desc } from 'drizzle-orm';
import { z } from 'zod';

const idSchema = z.number().int().positive();

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  userId: z.number().int().positive(),
  teamId: z.number().int().positive().optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'archived']).default('planning'),
  budget: z.string().optional(),
  progress: z.number().int().min(0).max(100).default(0),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

const updateProjectSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  teamId: z.number().int().positive().optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'archived']).optional(),
  budget: z.string().optional(),
  progress: z.number().int().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

const searchSchema = z.object({
  query: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
});

export const projectsRouter = router({
  // List all projects
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [];
      if (query) {
        conditions.push(like(projects.name, `%${query}%`));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db.select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        userId: projects.userId,
        teamId: projects.teamId,
        teamName: teams.name,
        status: projects.status,
        startDate: projects.startDate,
        endDate: projects.endDate,
        budget: projects.budget,
        progress: projects.progress,
        tags: projects.tags,
        isActive: projects.isActive,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
        .from(projects)
        .leftJoin(teams, eq(projects.teamId, teams.id))
        .where(where)
        .orderBy(desc(projects.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: projects.id })
        .from(projects)
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

  // Get project by ID
  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [project] = await db.select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

      if (!project) {
        throw new Error('Projeto não encontrado');
      }

      return project;
    }),

  // Create project
  create: publicProcedure
    .input(createProjectSchema)
    .mutation(async ({ input }) => {
      const result: any = await db.insert(projects).values(input);
      const insertId = result[0]?.insertId || result.insertId;
      return { id: insertId, success: true };
    }),

  // Update project
  update: publicProcedure
    .input(updateProjectSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(projects)
        .set(data)
        .where(eq(projects.id, id));
      return { success: true };
    }),

  // Delete project
  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(projects)
        .where(eq(projects.id, id));
      return { success: true };
    }),
});
