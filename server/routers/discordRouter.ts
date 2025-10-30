/**
 * Discord Router
 * tRPC endpoints for Discord integration
 */
import { router, publicProcedure } from '../trpc.js';
import { discordService } from '../services/integrations/discordService.js';
import { z } from 'zod';

export const discordRouter = router({
  // Credentials
  saveToken: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      botToken: z.string().optional(),
      accessToken: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await discordService.saveToken(input.userId, input.botToken, input.accessToken);
      return { success: true, message: 'Discord token saved successfully' };
    }),

  // Message operations
  sendMessage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      content: z.string().optional(),
      embeds: z.array(z.any()).optional(),
      components: z.array(z.any()).optional(),
      tts: z.boolean().optional(),
      files: z.array(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const { userId, channelId, ...options } = input;
      return discordService.sendMessage(userId, channelId, options);
    }),

  editMessage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      messageId: z.string().min(1),
      content: z.string().optional(),
      embeds: z.array(z.any()).optional(),
      components: z.array(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const { userId, channelId, messageId, ...options } = input;
      return discordService.editMessage(userId, channelId, messageId, options);
    }),

  deleteMessage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      messageId: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return discordService.deleteMessage(input.userId, input.channelId, input.messageId);
    }),

  getMessage: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      messageId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return discordService.getMessage(input.userId, input.channelId, input.messageId);
    }),

  getMessages: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      limit: z.number().min(1).max(100).default(50),
      before: z.string().optional(),
      after: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return discordService.getMessages(input.userId, input.channelId, input.limit, input.before, input.after);
    }),

  bulkDeleteMessages: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      messageIds: z.array(z.string()).min(2).max(100),
    }))
    .mutation(async ({ input }) => {
      return discordService.bulkDeleteMessages(input.userId, input.channelId, input.messageIds);
    }),

  // Reaction operations
  addReaction: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      messageId: z.string().min(1),
      emoji: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return discordService.addReaction(input.userId, input.channelId, input.messageId, input.emoji);
    }),

  removeReaction: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      messageId: z.string().min(1),
      emoji: z.string().min(1),
      userIdToRemove: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return discordService.removeReaction(input.userId, input.channelId, input.messageId, input.emoji, input.userIdToRemove);
    }),

  getReactions: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      messageId: z.string().min(1),
      emoji: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return discordService.getReactions(input.userId, input.channelId, input.messageId, input.emoji);
    }),

  // Channel operations
  getChannel: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return discordService.getChannel(input.userId, input.channelId);
    }),

  modifyChannel: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      options: z.record(z.any()),
    }))
    .mutation(async ({ input }) => {
      return discordService.modifyChannel(input.userId, input.channelId, input.options);
    }),

  deleteChannel: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return discordService.deleteChannel(input.userId, input.channelId);
    }),

  getChannelInvites: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return discordService.getChannelInvites(input.userId, input.channelId);
    }),

  createChannelInvite: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      options: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      return discordService.createChannelInvite(input.userId, input.channelId, input.options);
    }),

  // Guild (Server) operations
  getGuild: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      withCounts: z.boolean().default(false),
    }))
    .query(async ({ input }) => {
      return discordService.getGuild(input.userId, input.guildId, input.withCounts);
    }),

  getGuildChannels: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return discordService.getGuildChannels(input.userId, input.guildId);
    }),

  createGuildChannel: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      options: z.record(z.any()),
    }))
    .mutation(async ({ input }) => {
      return discordService.createGuildChannel(input.userId, input.guildId, input.options);
    }),

  getGuildMembers: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      limit: z.number().min(1).max(1000).default(100),
      after: z.string().optional(),
    }))
    .query(async ({ input }) => {
      return discordService.getGuildMembers(input.userId, input.guildId, input.limit, input.after);
    }),

  getGuildMember: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      memberId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return discordService.getGuildMember(input.userId, input.guildId, input.memberId);
    }),

  addGuildMemberRole: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      memberId: z.string().min(1),
      roleId: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return discordService.addGuildMemberRole(input.userId, input.guildId, input.memberId, input.roleId);
    }),

  removeGuildMemberRole: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      memberId: z.string().min(1),
      roleId: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return discordService.removeGuildMemberRole(input.userId, input.guildId, input.memberId, input.roleId);
    }),

  kickGuildMember: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      memberId: z.string().min(1),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return discordService.kickGuildMember(input.userId, input.guildId, input.memberId, input.reason);
    }),

  banGuildMember: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      memberId: z.string().min(1),
      deleteMessageDays: z.number().min(0).max(7).optional(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return discordService.banGuildMember(input.userId, input.guildId, input.memberId, input.deleteMessageDays, input.reason);
    }),

  unbanGuildMember: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      memberId: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return discordService.unbanGuildMember(input.userId, input.guildId, input.memberId);
    }),

  // Role operations
  getGuildRoles: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return discordService.getGuildRoles(input.userId, input.guildId);
    }),

  createGuildRole: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      options: z.record(z.any()),
    }))
    .mutation(async ({ input }) => {
      return discordService.createGuildRole(input.userId, input.guildId, input.options);
    }),

  modifyGuildRole: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      roleId: z.string().min(1),
      options: z.record(z.any()),
    }))
    .mutation(async ({ input }) => {
      return discordService.modifyGuildRole(input.userId, input.guildId, input.roleId, input.options);
    }),

  deleteGuildRole: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
      roleId: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return discordService.deleteGuildRole(input.userId, input.guildId, input.roleId);
    }),

  // User operations
  getCurrentUser: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
    }))
    .query(async ({ input }) => {
      return discordService.getCurrentUser(input.userId);
    }),

  getUser: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      discordUserId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return discordService.getUser(input.userId, input.discordUserId);
    }),

  modifyCurrentUser: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      username: z.string().optional(),
      avatar: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return discordService.modifyCurrentUser(input.userId, input.username, input.avatar);
    }),

  getCurrentUserGuilds: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
    }))
    .query(async ({ input }) => {
      return discordService.getCurrentUserGuilds(input.userId);
    }),

  // Webhook operations
  createWebhook: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
      name: z.string().min(1),
      avatar: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return discordService.createWebhook(input.userId, input.channelId, input.name, input.avatar);
    }),

  getChannelWebhooks: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      channelId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return discordService.getChannelWebhooks(input.userId, input.channelId);
    }),

  getGuildWebhooks: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      guildId: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return discordService.getGuildWebhooks(input.userId, input.guildId);
    }),

  executeWebhook: publicProcedure
    .input(z.object({
      webhookId: z.string().min(1),
      webhookToken: z.string().min(1),
      content: z.string().optional(),
      embeds: z.array(z.any()).optional(),
      components: z.array(z.any()).optional(),
      tts: z.boolean().optional(),
      files: z.array(z.any()).optional(),
      wait: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const { webhookId, webhookToken, wait, ...options } = input;
      return discordService.executeWebhook(webhookId, webhookToken, options, wait);
    }),

  // Helper methods
  createEmbed: publicProcedure
    .input(z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      color: z.number().optional(),
      fields: z.array(z.object({
        name: z.string(),
        value: z.string(),
        inline: z.boolean().optional(),
      })).optional(),
      footer: z.object({
        text: z.string(),
        icon_url: z.string().optional(),
      }).optional(),
      timestamp: z.string().optional(),
      url: z.string().optional(),
      author: z.object({
        name: z.string(),
        url: z.string().optional(),
        icon_url: z.string().optional(),
      }).optional(),
      thumbnail: z.object({ url: z.string() }).optional(),
      image: z.object({ url: z.string() }).optional(),
    }))
    .query(({ input }) => {
      return discordService.createEmbed(input);
    }),

  hexToColor: publicProcedure
    .input(z.object({
      hex: z.string().regex(/^#?[0-9A-Fa-f]{6}$/),
    }))
    .query(({ input }) => {
      return { color: discordService.hexToColor(input.hex) };
    }),

  colorToHex: publicProcedure
    .input(z.object({
      color: z.number().min(0).max(16777215),
    }))
    .query(({ input }) => {
      return { hex: discordService.colorToHex(input.color) };
    }),
});
