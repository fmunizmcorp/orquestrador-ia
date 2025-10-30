/**
 * Notion Router
 * tRPC endpoints for Notion integration
 */
import { router, publicProcedure } from '../trpc.js';
import { notionService } from '../services/integrations/notionService.js';
import { z } from 'zod';

export const notionRouter = router({
  // Credentials
  saveToken: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      token: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      await notionService.saveToken(input.userId, input.token);
      return { success: true, message: 'Notion token saved successfully' };
    }),

  // Database operations
  queryDatabase: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      databaseId: z.string().min(1),
      filter: z.any().optional(),
      sorts: z.array(z.any()).optional(),
    }))
    .query(async ({ input }) => {
      const options: any = {};
      if (input.filter) options.filter = input.filter;
      if (input.sorts) options.sorts = input.sorts;
      
      return notionService.queryDatabase(input.userId, input.databaseId, options);
    }),

  createDatabase: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      parentPageId: z.string().min(1),
      title: z.string().min(1),
      properties: z.record(z.any()),
    }))
    .mutation(async ({ input }) => {
      return notionService.createDatabase(
        input.userId,
        input.parentPageId,
        input.title,
        input.properties
      );
    }),

  getDatabase: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      databaseId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return notionService.getDatabase(input.userId, input.databaseId);
    }),

  updateDatabase: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      databaseId: z.string().min(1),
      updates: z.record(z.any()),
    }))
    .mutation(async ({ input }) => {
      return notionService.updateDatabase(input.userId, input.databaseId, input.updates);
    }),

  // Page operations
  getPage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      pageId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return notionService.getPage(input.userId, input.pageId);
    }),

  createPage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      parentId: z.string().min(1),
      parentType: z.enum(['database_id', 'page_id']),
      properties: z.record(z.any()),
      content: z.array(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      return notionService.createPage(
        input.userId,
        input.parentId,
        input.parentType,
        input.properties,
        input.content
      );
    }),

  updatePage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      pageId: z.string().min(1),
      properties: z.record(z.any()),
    }))
    .mutation(async ({ input }) => {
      return notionService.updatePage(input.userId, input.pageId, input.properties);
    }),

  archivePage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      pageId: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return notionService.archivePage(input.userId, input.pageId);
    }),

  // Block operations
  getBlockChildren: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      blockId: z.string().min(1),
      startCursor: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return notionService.getBlockChildren(input.userId, input.blockId, input.startCursor);
    }),

  appendBlockChildren: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      blockId: z.string().min(1),
      children: z.array(z.any()),
    }))
    .mutation(async ({ input }) => {
      return notionService.appendBlockChildren(input.userId, input.blockId, input.children);
    }),

  deleteBlock: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      blockId: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return notionService.deleteBlock(input.userId, input.blockId);
    }),

  // Search operations
  search: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      query: z.string().optional(),
      filter: z.any().optional(),
      sort: z.any().optional(),
    }))
    .query(async ({ input }) => {
      return notionService.search(input.userId, input.query, input.filter, input.sort);
    }),

  // User operations
  getUser: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      notionUserId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return notionService.getUser(input.userId, input.notionUserId);
    }),

  listUsers: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
    }))
    .query(async ({ input }) => {
      return notionService.listUsers(input.userId);
    }),

  getBotUser: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
    }))
    .query(async ({ input }) => {
      return notionService.getBotUser(input.userId);
    }),

  // Comment operations
  createComment: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      pageId: z.string().min(1),
      richText: z.array(z.any()),
    }))
    .mutation(async ({ input }) => {
      return notionService.createComment(input.userId, input.pageId, input.richText);
    }),

  getComments: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      blockId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return notionService.getComments(input.userId, input.blockId);
    }),

  // Helper methods for block creation
  createParagraphBlock: publicProcedure
    .input(z.object({
      text: z.string(),
    }))
    .query(({ input }) => {
      return notionService.createParagraphBlock(input.text);
    }),

  createHeadingBlock: publicProcedure
    .input(z.object({
      level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      text: z.string(),
    }))
    .query(({ input }) => {
      return notionService.createHeadingBlock(input.level, input.text);
    }),

  createToDoBlock: publicProcedure
    .input(z.object({
      text: z.string(),
      checked: z.boolean().default(false),
    }))
    .query(({ input }) => {
      return notionService.createToDoBlock(input.text, input.checked);
    }),

  createBulletedListBlock: publicProcedure
    .input(z.object({
      text: z.string(),
    }))
    .query(({ input }) => {
      return notionService.createBulletedListBlock(input.text);
    }),

  createCodeBlock: publicProcedure
    .input(z.object({
      code: z.string(),
      language: z.string().default('javascript'),
    }))
    .query(({ input }) => {
      return notionService.createCodeBlock(input.code, input.language);
    }),
});
