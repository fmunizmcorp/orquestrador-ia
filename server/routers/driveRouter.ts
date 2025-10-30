import { router, publicProcedure } from '../trpc.js';
import { driveService } from '../services/integrations/driveService.js';
import { z } from 'zod';

export const driveRouter = router({
  saveToken: publicProcedure.input(z.object({ userId: z.number().default(1), accessToken: z.string(), refreshToken: z.string().optional() }))
    .mutation(async ({ input }) => { await driveService.saveCredentials(input.userId, input.accessToken, input.refreshToken); return { success: true }; }),
  
  listFiles: publicProcedure.input(z.object({ userId: z.number().default(1), query: z.string().optional(), maxResults: z.number().default(100) }))
    .query(async ({ input }) => driveService.listFiles(input.userId, input.query, input.maxResults)),
  
  getFile: publicProcedure.input(z.object({ userId: z.number().default(1), fileId: z.string() }))
    .query(async ({ input }) => driveService.getFile(input.userId, input.fileId)),
  
  createFolder: publicProcedure.input(z.object({ userId: z.number().default(1), name: z.string(), parentId: z.string().optional() }))
    .mutation(async ({ input }) => driveService.createFolder(input.userId, input.name, input.parentId)),
  
  uploadFile: publicProcedure.input(z.object({ userId: z.number().default(1), name: z.string(), content: z.string(), mimeType: z.string(), parentId: z.string().optional() }))
    .mutation(async ({ input }) => driveService.uploadFile(input.userId, input.name, input.content, input.mimeType, input.parentId)),
  
  deleteFile: publicProcedure.input(z.object({ userId: z.number().default(1), fileId: z.string() }))
    .mutation(async ({ input }) => { await driveService.deleteFile(input.userId, input.fileId); return { success: true }; }),
  
  shareFile: publicProcedure.input(z.object({ userId: z.number().default(1), fileId: z.string(), email: z.string(), role: z.enum(['reader', 'writer', 'commenter']).default('reader') }))
    .mutation(async ({ input }) => driveService.shareFile(input.userId, input.fileId, input.email, input.role)),
});
