/**
 * Discord Integration Service
 * Provides integration with Discord API
 */
import axios from 'axios';
import { db } from '../../db/index.js';
import { credentials } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import CryptoJS from 'crypto-js';

const DISCORD_API = 'https://discord.com/api/v10';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key';

interface DiscordCredentials {
  botToken?: string;
  accessToken?: string;
}

interface MessageOptions {
  content?: string;
  embeds?: any[];
  components?: any[];
  tts?: boolean;
  files?: any[];
}

interface EmbedOptions {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string; icon_url?: string };
  timestamp?: string;
  url?: string;
  author?: { name: string; url?: string; icon_url?: string };
  thumbnail?: { url: string };
  image?: { url: string };
}

class DiscordService {
  private async getToken(userId: number): Promise<{ botToken?: string; accessToken?: string }> {
    const [cred] = await db.select().from(credentials)
      .where(eq(credentials.userId, userId))
      .where(eq(credentials.service, 'discord'))
      .limit(1);
    
    if (!cred) {
      throw new Error('Discord credentials not found');
    }
    
    const bytes = CryptoJS.AES.decrypt(cred.encryptedData, ENCRYPTION_KEY);
    const decrypted: DiscordCredentials = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decrypted;
  }

  async saveToken(userId: number, botToken?: string, accessToken?: string) {
    if (!botToken && !accessToken) {
      throw new Error('At least one token (bot or access) is required');
    }

    const tokenData: DiscordCredentials = {};
    if (botToken) tokenData.botToken = botToken;
    if (accessToken) tokenData.accessToken = accessToken;

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(tokenData),
      ENCRYPTION_KEY
    ).toString();

    const existing = await db.select()
      .from(credentials)
      .where(eq(credentials.userId, userId))
      .where(eq(credentials.service, 'discord'))
      .limit(1);

    if (existing.length > 0) {
      await db.update(credentials)
        .set({ encryptedData: encrypted, updatedAt: new Date() })
        .where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({
        userId,
        service: 'discord',
        credentialType: 'oauth',
        encryptedData: encrypted,
        isActive: true,
      });
    }
  }

  private async request(userId: number, method: string, endpoint: string, data?: any, useBot: boolean = true) {
    const tokens = await this.getToken(userId);
    const token = useBot ? tokens.botToken : tokens.accessToken;

    if (!token) {
      throw new Error(`Discord ${useBot ? 'bot' : 'access'} token not found`);
    }
    
    try {
      const response = await axios({
        method,
        url: `${DISCORD_API}${endpoint}`,
        headers: {
          'Authorization': useBot ? `Bot ${token}` : `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data,
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Discord API error: ${error.response?.data?.message || error.message}`
      );
    }
  }

  // Message operations
  async sendMessage(userId: number, channelId: string, options: MessageOptions) {
    return this.request(userId, 'POST', `/channels/${channelId}/messages`, options);
  }

  async editMessage(userId: number, channelId: string, messageId: string, options: MessageOptions) {
    return this.request(userId, 'PATCH', `/channels/${channelId}/messages/${messageId}`, options);
  }

  async deleteMessage(userId: number, channelId: string, messageId: string) {
    return this.request(userId, 'DELETE', `/channels/${channelId}/messages/${messageId}`);
  }

  async getMessage(userId: number, channelId: string, messageId: string) {
    return this.request(userId, 'GET', `/channels/${channelId}/messages/${messageId}`);
  }

  async getMessages(userId: number, channelId: string, limit: number = 50, before?: string, after?: string) {
    let query = `?limit=${limit}`;
    if (before) query += `&before=${before}`;
    if (after) query += `&after=${after}`;
    
    return this.request(userId, 'GET', `/channels/${channelId}/messages${query}`);
  }

  async bulkDeleteMessages(userId: number, channelId: string, messageIds: string[]) {
    if (messageIds.length < 2 || messageIds.length > 100) {
      throw new Error('Message IDs must be between 2 and 100');
    }
    return this.request(userId, 'POST', `/channels/${channelId}/messages/bulk-delete`, { messages: messageIds });
  }

  // Reaction operations
  async addReaction(userId: number, channelId: string, messageId: string, emoji: string) {
    return this.request(userId, 'PUT', `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`);
  }

  async removeReaction(userId: number, channelId: string, messageId: string, emoji: string, userIdToRemove?: string) {
    const endpoint = userIdToRemove
      ? `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/${userIdToRemove}`
      : `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`;
    return this.request(userId, 'DELETE', endpoint);
  }

  async getReactions(userId: number, channelId: string, messageId: string, emoji: string) {
    return this.request(userId, 'GET', `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`);
  }

  // Channel operations
  async getChannel(userId: number, channelId: string) {
    return this.request(userId, 'GET', `/channels/${channelId}`);
  }

  async modifyChannel(userId: number, channelId: string, options: any) {
    return this.request(userId, 'PATCH', `/channels/${channelId}`, options);
  }

  async deleteChannel(userId: number, channelId: string) {
    return this.request(userId, 'DELETE', `/channels/${channelId}`);
  }

  async getChannelInvites(userId: number, channelId: string) {
    return this.request(userId, 'GET', `/channels/${channelId}/invites`);
  }

  async createChannelInvite(userId: number, channelId: string, options?: any) {
    return this.request(userId, 'POST', `/channels/${channelId}/invites`, options || {});
  }

  // Guild (Server) operations
  async getGuild(userId: number, guildId: string, withCounts: boolean = false) {
    const query = withCounts ? '?with_counts=true' : '';
    return this.request(userId, 'GET', `/guilds/${guildId}${query}`);
  }

  async getGuildChannels(userId: number, guildId: string) {
    return this.request(userId, 'GET', `/guilds/${guildId}/channels`);
  }

  async createGuildChannel(userId: number, guildId: string, options: any) {
    return this.request(userId, 'POST', `/guilds/${guildId}/channels`, options);
  }

  async getGuildMembers(userId: number, guildId: string, limit: number = 100, after?: string) {
    let query = `?limit=${limit}`;
    if (after) query += `&after=${after}`;
    return this.request(userId, 'GET', `/guilds/${guildId}/members${query}`);
  }

  async getGuildMember(userId: number, guildId: string, memberId: string) {
    return this.request(userId, 'GET', `/guilds/${guildId}/members/${memberId}`);
  }

  async addGuildMemberRole(userId: number, guildId: string, memberId: string, roleId: string) {
    return this.request(userId, 'PUT', `/guilds/${guildId}/members/${memberId}/roles/${roleId}`);
  }

  async removeGuildMemberRole(userId: number, guildId: string, memberId: string, roleId: string) {
    return this.request(userId, 'DELETE', `/guilds/${guildId}/members/${memberId}/roles/${roleId}`);
  }

  async kickGuildMember(userId: number, guildId: string, memberId: string, reason?: string) {
    const headers = reason ? { 'X-Audit-Log-Reason': reason } : undefined;
    return this.request(userId, 'DELETE', `/guilds/${guildId}/members/${memberId}`, undefined);
  }

  async banGuildMember(userId: number, guildId: string, memberId: string, deleteMessageDays?: number, reason?: string) {
    const data: any = {};
    if (deleteMessageDays) data.delete_message_days = deleteMessageDays;
    return this.request(userId, 'PUT', `/guilds/${guildId}/bans/${memberId}`, data);
  }

  async unbanGuildMember(userId: number, guildId: string, memberId: string) {
    return this.request(userId, 'DELETE', `/guilds/${guildId}/bans/${memberId}`);
  }

  // Role operations
  async getGuildRoles(userId: number, guildId: string) {
    return this.request(userId, 'GET', `/guilds/${guildId}/roles`);
  }

  async createGuildRole(userId: number, guildId: string, options: any) {
    return this.request(userId, 'POST', `/guilds/${guildId}/roles`, options);
  }

  async modifyGuildRole(userId: number, guildId: string, roleId: string, options: any) {
    return this.request(userId, 'PATCH', `/guilds/${guildId}/roles/${roleId}`, options);
  }

  async deleteGuildRole(userId: number, guildId: string, roleId: string) {
    return this.request(userId, 'DELETE', `/guilds/${guildId}/roles/${roleId}`);
  }

  // User operations
  async getCurrentUser(userId: number) {
    return this.request(userId, 'GET', '/users/@me', undefined, false);
  }

  async getUser(userId: number, discordUserId: string) {
    return this.request(userId, 'GET', `/users/${discordUserId}`);
  }

  async modifyCurrentUser(userId: number, username?: string, avatar?: string) {
    const data: any = {};
    if (username) data.username = username;
    if (avatar) data.avatar = avatar;
    return this.request(userId, 'PATCH', '/users/@me', data, false);
  }

  async getCurrentUserGuilds(userId: number) {
    return this.request(userId, 'GET', '/users/@me/guilds', undefined, false);
  }

  // Webhook operations
  async createWebhook(userId: number, channelId: string, name: string, avatar?: string) {
    const data: any = { name };
    if (avatar) data.avatar = avatar;
    return this.request(userId, 'POST', `/channels/${channelId}/webhooks`, data);
  }

  async getChannelWebhooks(userId: number, channelId: string) {
    return this.request(userId, 'GET', `/channels/${channelId}/webhooks`);
  }

  async getGuildWebhooks(userId: number, guildId: string) {
    return this.request(userId, 'GET', `/guilds/${guildId}/webhooks`);
  }

  async executeWebhook(webhookId: string, webhookToken: string, options: MessageOptions, wait: boolean = false) {
    const query = wait ? '?wait=true' : '';
    try {
      const response = await axios.post(
        `${DISCORD_API}/webhooks/${webhookId}/${webhookToken}${query}`,
        options,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(`Discord webhook error: ${error.response?.data?.message || error.message}`);
    }
  }

  // Helper methods
  createEmbed(options: EmbedOptions): any {
    const embed: any = {};
    if (options.title) embed.title = options.title;
    if (options.description) embed.description = options.description;
    if (options.color) embed.color = options.color;
    if (options.fields) embed.fields = options.fields;
    if (options.footer) embed.footer = options.footer;
    if (options.timestamp) embed.timestamp = options.timestamp;
    if (options.url) embed.url = options.url;
    if (options.author) embed.author = options.author;
    if (options.thumbnail) embed.thumbnail = options.thumbnail;
    if (options.image) embed.image = options.image;
    return embed;
  }

  hexToColor(hex: string): number {
    return parseInt(hex.replace('#', ''), 16);
  }

  colorToHex(color: number): string {
    return `#${color.toString(16).padStart(6, '0')}`;
  }
}

export const discordService = new DiscordService();
