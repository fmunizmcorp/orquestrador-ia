/**
 * Discord Integration Service
 * Provides integration with Discord API
 */
import axios from 'axios';
import { db } from '../../db/index.js';
import { credentials } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import CryptoJS from 'crypto-js';
const DISCORD_API = 'https://discord.com/api/v10';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key';
class DiscordService {
    async getToken(userId) {
        const [cred] = await db.select().from(credentials)
            .where(and(eq(credentials.userId, userId), eq(credentials.service, 'discord')))
            .limit(1);
        if (!cred) {
            throw new Error('Discord credentials not found');
        }
        const bytes = CryptoJS.AES.decrypt(cred.encryptedData, ENCRYPTION_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decrypted;
    }
    async saveToken(userId, botToken, accessToken) {
        if (!botToken && !accessToken) {
            throw new Error('At least one token (bot or access) is required');
        }
        const tokenData = {};
        if (botToken)
            tokenData.botToken = botToken;
        if (accessToken)
            tokenData.accessToken = accessToken;
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(tokenData), ENCRYPTION_KEY).toString();
        const existing = await db.select()
            .from(credentials)
            .where(and(eq(credentials.userId, userId), eq(credentials.service, 'discord')))
            .limit(1);
        if (existing.length > 0) {
            await db.update(credentials)
                .set({ encryptedData: encrypted, updatedAt: new Date() })
                .where(eq(credentials.id, existing[0].id));
        }
        else {
            await db.insert(credentials).values({
                userId,
                service: 'discord',
                credentialType: 'oauth',
                encryptedData: encrypted,
                isActive: true,
            });
        }
    }
    async request(userId, method, endpoint, data, useBot = true) {
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
        }
        catch (error) {
            throw new Error(`Discord API error: ${error.response?.data?.message || error.message}`);
        }
    }
    // Message operations
    async sendMessage(userId, channelId, options) {
        return this.request(userId, 'POST', `/channels/${channelId}/messages`, options);
    }
    async editMessage(userId, channelId, messageId, options) {
        return this.request(userId, 'PATCH', `/channels/${channelId}/messages/${messageId}`, options);
    }
    async deleteMessage(userId, channelId, messageId) {
        return this.request(userId, 'DELETE', `/channels/${channelId}/messages/${messageId}`);
    }
    async getMessage(userId, channelId, messageId) {
        return this.request(userId, 'GET', `/channels/${channelId}/messages/${messageId}`);
    }
    async getMessages(userId, channelId, limit = 50, before, after) {
        let query = `?limit=${limit}`;
        if (before)
            query += `&before=${before}`;
        if (after)
            query += `&after=${after}`;
        return this.request(userId, 'GET', `/channels/${channelId}/messages${query}`);
    }
    async bulkDeleteMessages(userId, channelId, messageIds) {
        if (messageIds.length < 2 || messageIds.length > 100) {
            throw new Error('Message IDs must be between 2 and 100');
        }
        return this.request(userId, 'POST', `/channels/${channelId}/messages/bulk-delete`, { messages: messageIds });
    }
    // Reaction operations
    async addReaction(userId, channelId, messageId, emoji) {
        return this.request(userId, 'PUT', `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`);
    }
    async removeReaction(userId, channelId, messageId, emoji, userIdToRemove) {
        const endpoint = userIdToRemove
            ? `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/${userIdToRemove}`
            : `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`;
        return this.request(userId, 'DELETE', endpoint);
    }
    async getReactions(userId, channelId, messageId, emoji) {
        return this.request(userId, 'GET', `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`);
    }
    // Channel operations
    async getChannel(userId, channelId) {
        return this.request(userId, 'GET', `/channels/${channelId}`);
    }
    async modifyChannel(userId, channelId, options) {
        return this.request(userId, 'PATCH', `/channels/${channelId}`, options);
    }
    async deleteChannel(userId, channelId) {
        return this.request(userId, 'DELETE', `/channels/${channelId}`);
    }
    async getChannelInvites(userId, channelId) {
        return this.request(userId, 'GET', `/channels/${channelId}/invites`);
    }
    async createChannelInvite(userId, channelId, options) {
        return this.request(userId, 'POST', `/channels/${channelId}/invites`, options || {});
    }
    // Guild (Server) operations
    async getGuild(userId, guildId, withCounts = false) {
        const query = withCounts ? '?with_counts=true' : '';
        return this.request(userId, 'GET', `/guilds/${guildId}${query}`);
    }
    async getGuildChannels(userId, guildId) {
        return this.request(userId, 'GET', `/guilds/${guildId}/channels`);
    }
    async createGuildChannel(userId, guildId, options) {
        return this.request(userId, 'POST', `/guilds/${guildId}/channels`, options);
    }
    async getGuildMembers(userId, guildId, limit = 100, after) {
        let query = `?limit=${limit}`;
        if (after)
            query += `&after=${after}`;
        return this.request(userId, 'GET', `/guilds/${guildId}/members${query}`);
    }
    async getGuildMember(userId, guildId, memberId) {
        return this.request(userId, 'GET', `/guilds/${guildId}/members/${memberId}`);
    }
    async addGuildMemberRole(userId, guildId, memberId, roleId) {
        return this.request(userId, 'PUT', `/guilds/${guildId}/members/${memberId}/roles/${roleId}`);
    }
    async removeGuildMemberRole(userId, guildId, memberId, roleId) {
        return this.request(userId, 'DELETE', `/guilds/${guildId}/members/${memberId}/roles/${roleId}`);
    }
    async kickGuildMember(userId, guildId, memberId, reason) {
        const headers = reason ? { 'X-Audit-Log-Reason': reason } : undefined;
        return this.request(userId, 'DELETE', `/guilds/${guildId}/members/${memberId}`, undefined);
    }
    async banGuildMember(userId, guildId, memberId, deleteMessageDays, reason) {
        const data = {};
        if (deleteMessageDays)
            data.delete_message_days = deleteMessageDays;
        return this.request(userId, 'PUT', `/guilds/${guildId}/bans/${memberId}`, data);
    }
    async unbanGuildMember(userId, guildId, memberId) {
        return this.request(userId, 'DELETE', `/guilds/${guildId}/bans/${memberId}`);
    }
    // Role operations
    async getGuildRoles(userId, guildId) {
        return this.request(userId, 'GET', `/guilds/${guildId}/roles`);
    }
    async createGuildRole(userId, guildId, options) {
        return this.request(userId, 'POST', `/guilds/${guildId}/roles`, options);
    }
    async modifyGuildRole(userId, guildId, roleId, options) {
        return this.request(userId, 'PATCH', `/guilds/${guildId}/roles/${roleId}`, options);
    }
    async deleteGuildRole(userId, guildId, roleId) {
        return this.request(userId, 'DELETE', `/guilds/${guildId}/roles/${roleId}`);
    }
    // User operations
    async getCurrentUser(userId) {
        return this.request(userId, 'GET', '/users/@me', undefined, false);
    }
    async getUser(userId, discordUserId) {
        return this.request(userId, 'GET', `/users/${discordUserId}`);
    }
    async modifyCurrentUser(userId, username, avatar) {
        const data = {};
        if (username)
            data.username = username;
        if (avatar)
            data.avatar = avatar;
        return this.request(userId, 'PATCH', '/users/@me', data, false);
    }
    async getCurrentUserGuilds(userId) {
        return this.request(userId, 'GET', '/users/@me/guilds', undefined, false);
    }
    // Webhook operations
    async createWebhook(userId, channelId, name, avatar) {
        const data = { name };
        if (avatar)
            data.avatar = avatar;
        return this.request(userId, 'POST', `/channels/${channelId}/webhooks`, data);
    }
    async getChannelWebhooks(userId, channelId) {
        return this.request(userId, 'GET', `/channels/${channelId}/webhooks`);
    }
    async getGuildWebhooks(userId, guildId) {
        return this.request(userId, 'GET', `/guilds/${guildId}/webhooks`);
    }
    async executeWebhook(webhookId, webhookToken, options, wait = false) {
        const query = wait ? '?wait=true' : '';
        try {
            const response = await axios.post(`${DISCORD_API}/webhooks/${webhookId}/${webhookToken}${query}`, options, { headers: { 'Content-Type': 'application/json' } });
            return response.data;
        }
        catch (error) {
            throw new Error(`Discord webhook error: ${error.response?.data?.message || error.message}`);
        }
    }
    // Helper methods
    createEmbed(options) {
        const embed = {};
        if (options.title)
            embed.title = options.title;
        if (options.description)
            embed.description = options.description;
        if (options.color)
            embed.color = options.color;
        if (options.fields)
            embed.fields = options.fields;
        if (options.footer)
            embed.footer = options.footer;
        if (options.timestamp)
            embed.timestamp = options.timestamp;
        if (options.url)
            embed.url = options.url;
        if (options.author)
            embed.author = options.author;
        if (options.thumbnail)
            embed.thumbnail = options.thumbnail;
        if (options.image)
            embed.image = options.image;
        return embed;
    }
    hexToColor(hex) {
        return parseInt(hex.replace('#', ''), 16);
    }
    colorToHex(color) {
        return `#${color.toString(16).padStart(6, '0')}`;
    }
}
export const discordService = new DiscordService();
