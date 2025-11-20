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
import pino from 'pino';
import { env, isDevelopment } from '../../config/env.js';
import {
  createStandardError,
  handleDatabaseError,
  ErrorCodes,
  notFoundError,
} from '../../utils/errors.js';
import {
  paginationInputSchema,
  optionalPaginationInputSchema,
  createPaginatedResponse,
  applyPagination,
} from '../../utils/pagination.js';

const logger = pino({ level: env.LOG_LEVEL, transport: isDevelopment ? { target: 'pino-pretty' } : undefined });

export const projectsRouter = router({
  /**
   * 1. List all projects
   */
  list: publicProcedure
    .input(z.object({
      teamId: z.number().optional(),
      status: z.enum(['active', 'completed', 'archived']).optional(),
    }).merge(paginationInputSchema).optional().default({ limit: 50, offset: 0 }))
    .query(async ({ input }) => {
      try {
        const conditions = [];

        if (input.teamId) {
          conditions.push(eq(projects.teamId, input.teamId));
        }

        if (input.status) {
          conditions.push(eq(projects.status, input.status));
        }

        // Count total
        const [{ count: total }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(projects)
          .where(conditions.length > 0 ? and(...conditions) : undefined);

        // Get paginated results
        const { limit, offset } = applyPagination(input);
        const query = conditions.length > 0
          ? db.select().from(projects).where(and(...conditions))
          : db.select().from(projects);

        const allProjects = await query
          .orderBy(desc(projects.createdAt))
          .limit(limit)
          .offset(offset);

        return createPaginatedResponse(allProjects, total || 0, input);
      } catch (error) {
        logger.error({ error }, 'Error listing projects');
        
        if (error && typeof error === 'object' && 'code' in error) {
          throw error;
        }
        
        throw handleDatabaseError(error, {
          resourceType: 'Project',
          suggestion: 'Tente novamente ou contate o suporte',
        });
      }
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
   * 3. Create new project (SPRINT 49 - P2-1: Enhanced description handling)
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
      logger.info({ input }, '[SPRINT 49 P2-1] Creating project with input');
      
      // SPRINT 49 - P2-1: Explicitly handle description (convert empty string to null)
      const descriptionValue = input.description && input.description.trim() 
        ? input.description.trim() 
        : null;
      
      logger.info({ 
        originalDescription: input.description,
        processedDescription: descriptionValue,
        hasDescription: !!descriptionValue
      }, '[SPRINT 49 P2-1] Description processing');
      
      const result: any = await db.insert(projects).values({
        userId: 1, // TODO: Get from context
        name: input.name,
        description: descriptionValue, // SPRINT 49 - P2-1: Use processed description
        teamId: input.teamId,
        status: 'active',
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
        budget: input.budget,
      } as any);

      logger.info({ result }, '[SPRINT 49 P2-1] Insert result received');
      
      const projId = result[0]?.insertId || result.insertId;
      logger.info({ projId }, '[SPRINT 49 P2-1] Project ID extracted');
      
      if (!projId) {
        logger.error({ result }, '[SPRINT 49 P2-1] Failed to get project ID from insert result');
        throw new Error('Failed to create project - no ID returned');
      }
      
      const [project] = await db.select().from(projects).where(eq(projects.id, projId)).limit(1);
      logger.info({ 
        project,
        savedDescription: project.description
      }, '[SPRINT 49 P2-1] Project retrieved from database with description');

      return { success: true, project };
    }),

  /**
   * 4. Update project (SPRINT 49 - P0-7: Fixed missing status values and teamId)
   */
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      // SPRINT 49 - P0-7: Added missing 'planning' and 'on_hold' status values
      status: z.enum(['planning', 'active', 'on_hold', 'completed', 'archived']).optional(),
      teamId: z.number().optional(), // SPRINT 49 - P0-7: Added missing teamId
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      budget: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      logger.info({ input }, '[SPRINT 49 P0-7] Updating project with input');
      
      const { id, ...updates } = input;

      const finalUpdates: any = { ...updates };

      if (input.startDate) {
        finalUpdates.startDate = new Date(input.startDate);
      }

      if (input.endDate) {
        finalUpdates.endDate = new Date(input.endDate);
      }
      
      // SPRINT 49 - P0-7: Enhanced logging
      logger.info({ id, finalUpdates }, '[SPRINT 49 P0-7] Executing update with final updates');

      await db.update(projects)
        .set(finalUpdates)
        .where(eq(projects.id, id));

      const [updated] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
      
      logger.info({ updated }, '[SPRINT 49 P0-7] Project updated successfully');

      return { success: true, project: updated };
    }),

  /**
   * 5. Delete project (SPRINT 49 - P0-8: Enhanced with logging)
   */
  delete: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      logger.info({ projectId: input.id }, '[SPRINT 49 P0-8] Deleting project');
      
      // SPRINT 49 - P0-8: Check if project exists before deleting
      const [existingProject] = await db.select()
        .from(projects)
        .where(eq(projects.id, input.id))
        .limit(1);
      
      if (!existingProject) {
        logger.error({ projectId: input.id }, '[SPRINT 49 P0-8] Project not found');
        throw new Error(`Projeto com ID ${input.id} não encontrado`);
      }
      
      logger.info({ project: existingProject }, '[SPRINT 49 P0-8] Project found, proceeding with deletion');
      
      await db.delete(projects).where(eq(projects.id, input.id));
      
      logger.info({ projectId: input.id }, '[SPRINT 49 P0-8] Project deleted successfully');
      
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
