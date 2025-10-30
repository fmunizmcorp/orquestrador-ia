import { router, publicProcedure } from '../trpc.js';
import { gmailService } from '../services/integrations/gmailService.js';
import { z } from 'zod';

export const gmailRouter = router({
  saveToken: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      accessToken: z.string(),
      refreshToken: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await gmailService.saveCredentials(input.userId, input.accessToken, input.refreshToken);
      return { success: true };
    }),

  sendEmail: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      to: z.union([z.string(), z.array(z.string())]),
      subject: z.string(),
      body: z.string(),
      cc: z.union([z.string(), z.array(z.string())]).optional(),
      bcc: z.union([z.string(), z.array(z.string())]).optional(),
    }))
    .mutation(async ({ input }) => {
      return await gmailService.sendEmail(input.userId, {
        to: input.to,
        subject: input.subject,
        body: input.body,
        cc: input.cc,
        bcc: input.bcc,
      });
    }),

  listEmails: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      maxResults: z.number().optional(),
      query: z.string().optional(),
      labelIds: z.array(z.string()).optional(),
    }))
    .query(async ({ input }) => {
      return await gmailService.listEmails(input.userId, {
        maxResults: input.maxResults,
        query: input.query,
        labelIds: input.labelIds,
      });
    }),

  getEmail: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      emailId: z.string(),
    }))
    .query(async ({ input }) => {
      return await gmailService.getEmail(input.userId, input.emailId);
    }),

  deleteEmail: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      emailId: z.string(),
    }))
    .mutation(async ({ input }) => {
      await gmailService.deleteEmail(input.userId, input.emailId);
      return { success: true };
    }),

  markAsRead: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      emailId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await gmailService.markAsRead(input.userId, input.emailId);
    }),

  markAsUnread: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      emailId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await gmailService.markAsUnread(input.userId, input.emailId);
    }),

  listLabels: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
    }))
    .query(async ({ input }) => {
      return await gmailService.listLabels(input.userId);
    }),

  createLabel: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      name: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await gmailService.createLabel(input.userId, input.name);
    }),

  searchEmails: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
      query: z.string(),
      maxResults: z.number().default(10),
    }))
    .query(async ({ input }) => {
      return await gmailService.searchEmails(input.userId, input.query, input.maxResults);
    }),

  getProfile: publicProcedure
    .input(z.object({
      userId: z.number().default(1),
    }))
    .query(async ({ input }) => {
      return await gmailService.getProfile(input.userId);
    }),
});
