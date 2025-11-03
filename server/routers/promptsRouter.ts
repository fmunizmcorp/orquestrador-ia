import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { prompts, users } from '../db/schema.js';
import { eq, like, and, desc } from 'drizzle-orm';
import { z } from 'zod';
import { promptExecutionService } from '../services/promptExecutionService.js';

const idSchema = z.number().int().positive();

const createPromptSchema = z.object({
  userId: z.number().int().positive(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  content: z.string().min(1),
  category: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  variables: z.record(z.any()).optional(),
  isPublic: z.boolean().default(false),
  useCount: z.number().int().default(0),
  currentVersion: z.number().int().default(1),
});

const updatePromptSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  content: z.string().min(1).optional(),
  category: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  variables: z.record(z.any()).optional(),
  isPublic: z.boolean().optional(),
  currentVersion: z.number().int().optional(),
});

const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
});

const executePromptSchema = z.object({
  promptId: z.number().int().positive(),
  modelId: z.number().int().positive().optional(),
  variables: z.record(z.any()).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
});

const executeDirectSchema = z.object({
  content: z.string().min(1),
  modelId: z.number().int().positive().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().positive().optional(),
});

const executeMultipleSchema = z.object({
  promptId: z.number().int().positive(),
  modelIds: z.array(z.number().int().positive()),
  variables: z.record(z.any()).optional(),
});

const testPromptSchema = z.object({
  content: z.string().min(1),
  variables: z.record(z.any()).optional(),
  modelId: z.number().int().positive().optional(),
});

export const promptsRouter = router({
  // List all prompts
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, category, isPublic, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [];
      if (query) {
        conditions.push(like(prompts.title, `%${query}%`));
      }
      if (category) {
        conditions.push(eq(prompts.category, category));
      }
      if (isPublic !== undefined) {
        conditions.push(eq(prompts.isPublic, isPublic));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db.select({
        id: prompts.id,
        userId: prompts.userId,
        userName: users.name,
        title: prompts.title,
        description: prompts.description,
        content: prompts.content,
        category: prompts.category,
        tags: prompts.tags,
        variables: prompts.variables,
        isPublic: prompts.isPublic,
        useCount: prompts.useCount,
        currentVersion: prompts.currentVersion,
        createdAt: prompts.createdAt,
        updatedAt: prompts.updatedAt,
      })
        .from(prompts)
        .leftJoin(users, eq(prompts.userId, users.id))
        .where(where)
        .orderBy(desc(prompts.createdAt))
        .limit(limit)
        .offset(offset);

      const countRows = await db.select({ count: prompts.id })
        .from(prompts)
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

  // Get prompt by ID
  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [prompt] = await db.select()
        .from(prompts)
        .where(eq(prompts.id, id))
        .limit(1);

      if (!prompt) {
        throw new Error('Prompt não encontrado');
      }

      return prompt;
    }),

  // Create prompt
  create: publicProcedure
    .input(createPromptSchema)
    .mutation(async ({ input }) => {
      const result: any = await db.insert(prompts).values(input);
      const insertId = result[0]?.insertId || result.insertId;
      return { id: insertId, success: true };
    }),

  // Update prompt
  update: publicProcedure
    .input(updatePromptSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db.update(prompts)
        .set(data)
        .where(eq(prompts.id, id));
      return { success: true };
    }),

  // Delete prompt
  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(prompts)
        .where(eq(prompts.id, id));
      return { success: true };
    }),

  // Increment use count
  incrementUseCount: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [prompt] = await db.select()
        .from(prompts)
        .where(eq(prompts.id, id))
        .limit(1);

      if (!prompt) {
        throw new Error('Prompt não encontrado');
      }

      await db.update(prompts)
        .set({ useCount: (prompt.useCount || 0) + 1 })
        .where(eq(prompts.id, id));

      return { success: true, useCount: (prompt.useCount || 0) + 1 };
    }),

  // Execute prompt
  execute: publicProcedure
    .input(executePromptSchema)
    .mutation(async ({ input }) => {
      const result = await promptExecutionService.executePrompt(input);
      return result;
    }),

  // Execute direct
  executeDirect: publicProcedure
    .input(executeDirectSchema)
    .mutation(async ({ input }) => {
      const result = await promptExecutionService.executeDirect(input);
      return result;
    }),

  // Execute multiple
  executeMultiple: publicProcedure
    .input(executeMultipleSchema)
    .mutation(async ({ input }) => {
      const result = await promptExecutionService.executeMultiple(
        input.promptId,
        input.modelIds,
        input.variables
      );
      return result;
    }),

  // Test prompt
  testPrompt: publicProcedure
    .input(testPromptSchema)
    .mutation(async ({ input }) => {
      const result = await promptExecutionService.testPrompt(
        input.content,
        input.variables,
        input.modelId
      );
      return result;
    }),
});
