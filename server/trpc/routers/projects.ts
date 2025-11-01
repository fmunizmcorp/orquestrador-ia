/**
 * Projects tRPC Router
 * Project management endpoints
 * 10 endpoints
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { projects, tasks } from '../../db/schema.js';
import { eq, desc, like, and, sql } from 'drizzle-orm';

export const projectsRouter = router({
  /**
   * 1. List all projects
   */
  list: publicProcedure
    .input(z.object({
      teamId: z.number().optional(),
      status: z.enum(['active', 'completed', 'archived']).optional(),
      limit: z.number().min(1).max(100).optional().default(50),
      offset: z.number().min(0).optional().default(0),
    }))
    .query(async ({ input }) => {
      const conditions = [];

      if (input.teamId) {
        conditions.push(eq(projects.teamId, input.teamId));
      }

      if (input.status) {
        conditions.push(eq(projects.status, input.status));
      }

      const query = conditions.length > 0
        ? db.select().from(projects).where(and(...conditions))
        : db.select().from(projects);

      const allProjects = await query
        .orderBy(desc(projects.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return { success: true, projects: allProjects };
    }),

  /**
   * 2. Get project by ID
   */
  getById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const [project] = await db.select()
        .from(projects)
        .where(eq(projects.id, input.id))
        .limit(1);

      if (!project) {
        throw new Error('Project not found');
      }

      // Get tasks count
      const projectTasks = await db.select()
        .from(tasks)
        .where(eq(tasks.projectId, input.id));

      return {
        success: true,
        project: {
          ...project,
          tasksCount: projectTasks.length,
          completedTasks: projectTasks.filter(t => t.status === 'completed').length,
        },
      };
    }),

  /**
   * 3. Create new project
   */
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      teamId: z.number().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      budget: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const result: any = await db.insert(projects).values({
        userId: 1, // TODO: Get from context
        name: input.name,
        description: input.description,
        teamId: input.teamId,
        status: 'active',
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        budget: input.budget,
      } as any);

      const projId = result[0]?.insertId || result.insertId;
      const [project] = await db.select().from(projects).where(eq(projects.id, projId)).limit(1);

      return { success: true, project };
    }),

  /**
   * 4. Update project
   */
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(['active', 'completed', 'archived']).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      budget: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      const finalUpdates: any = { ...updates };

      if (input.startDate) {
        finalUpdates.startDate = new Date(input.startDate);
      }

      if (input.endDate) {
        finalUpdates.endDate = new Date(input.endDate);
      }

      await db.update(projects)
        .set(finalUpdates)
        .where(eq(projects.id, id));

      const [updated] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

      return { success: true, project: updated };
    }),

  /**
   * 5. Delete project
   */
  delete: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.delete(projects).where(eq(projects.id, input.id));
      return { success: true, message: 'Project deleted' };
    }),

  /**
   * 6. Get project statistics
   */
  getStats: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const projectTasks = await db.select()
        .from(tasks)
        .where(eq(tasks.projectId, input.id));

      const stats = {
        totalTasks: projectTasks.length,
        completedTasks: projectTasks.filter(t => t.status === 'completed').length,
        inProgressTasks: projectTasks.filter(t => t.status === 'in_progress').length,
        pendingTasks: projectTasks.filter(t => t.status === 'pending').length,
        blockedTasks: projectTasks.filter(t => t.status === 'blocked').length,
        completionRate: projectTasks.length > 0
          ? (projectTasks.filter(t => t.status === 'completed').length / projectTasks.length) * 100
          : 0,
        estimatedHours: projectTasks.reduce((sum, t) => sum + (parseFloat(t.estimatedHours as any) || 0), 0),
        actualHours: projectTasks.reduce((sum, t) => sum + (parseFloat(t.actualHours as any) || 0), 0),
      };

      return { success: true, stats };
    }),

  /**
   * 7. Search projects
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      teamId: z.number().optional(),
      limit: z.number().min(1).max(50).optional().default(20),
    }))
    .query(async ({ input }) => {
      const conditions = [like(projects.name, `%${input.query}%`)];

      if (input.teamId) {
        conditions.push(eq(projects.teamId, input.teamId));
      }

      const results = await db.select().from(projects)
        .where(and(...conditions))
        .limit(input.limit);

      return { success: true, projects: results };
    }),

  /**
   * 8. Archive project
   */
  archive: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.update(projects)
        .set({ status: 'archived' })
        .where(eq(projects.id, input.id));

      const [updated] = await db.select().from(projects).where(eq(projects.id, input.id)).limit(1);

      return { success: true, project: updated };
    }),

  /**
   * 9. Restore project
   */
  restore: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.update(projects)
        .set({ status: 'active' })
        .where(eq(projects.id, input.id));

      const [updated] = await db.select().from(projects).where(eq(projects.id, input.id)).limit(1);

      return { success: true, project: updated };
    }),

  /**
   * 10. Duplicate project
   */
  duplicate: publicProcedure
    .input(z.object({
      id: z.number(),
      newName: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [original] = await db.select()
        .from(projects)
        .where(eq(projects.id, input.id))
        .limit(1);

      if (!original) {
        throw new Error('Project not found');
      }

      const result: any = await db.insert(projects).values({
        userId: original.userId,
        name: input.newName || `${original.name} (copy)`,
        description: original.description,
        teamId: original.teamId,
        status: 'active',
        budget: original.budget,
      } as any);

      const dupId = result[0]?.insertId || result.insertId;
      const [duplicate] = await db.select().from(projects).where(eq(projects.id, dupId)).limit(1);

      return { success: true, project: duplicate };
    }),
});
