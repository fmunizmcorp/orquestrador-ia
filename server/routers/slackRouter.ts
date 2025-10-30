/**
 * Slack Router
 * tRPC endpoints for Slack integration
 */
import { router, publicProcedure } from '../trpc.js';
import { slackService } from '../services/integrations/slackService.js';
import { z } from 'zod';

export const slackRouter = router({
  saveToken: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      token: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      await slackService.saveToken(input.userId, input.token);
      return { success: true, message: 'Slack token saved successfully' };
    }),

  postMessage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channel: z.string().min(1),
      text: z.string().min(1),
      blocks: z.array(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await slackService.postMessage(
        input.userId,
        input.channel,
        input.text,
        input.blocks
      );
      return result;
    }),

  listChannels: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
    }))
    .query(async ({ input }) => {
      const channels = await slackService.listChannels(input.userId);
      return channels;
    }),

  getChannelHistory: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channel: z.string().min(1),
      limit: z.number().min(1).max(1000).default(100),
    }))
    .query(async ({ input }) => {
      const messages = await slackService.getChannelHistory(
        input.userId,
        input.channel,
        input.limit
      );
      return messages;
    }),

  uploadFile: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channels: z.array(z.string()),
      content: z.string().min(1),
      filename: z.string().min(1),
      title: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result = await slackService.uploadFile(
        input.userId,
        input.channels,
        input.content,
        input.filename,
        input.title
      );
      return result;
    }),

  updateMessage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channel: z.string().min(1),
      ts: z.string().min(1),
      text: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const result = await slackService.updateMessage(
        input.userId,
        input.channel,
        input.ts,
        input.text
      );
      return result;
    }),

  deleteMessage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channel: z.string().min(1),
      ts: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const result = await slackService.deleteMessage(
        input.userId,
        input.channel,
        input.ts
      );
      return result;
    }),

  addReaction: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channel: z.string().min(1),
      timestamp: z.string().min(1),
      emoji: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const result = await slackService.addReaction(
        input.userId,
        input.channel,
        input.timestamp,
        input.emoji
      );
      return result;
    }),

  getUsers: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
    }))
    .query(async ({ input }) => {
      const users = await slackService.getUsers(input.userId);
      return users;
    }),
});
