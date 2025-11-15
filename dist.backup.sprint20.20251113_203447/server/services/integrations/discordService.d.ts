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
    fields?: Array<{
        name: string;
        value: string;
        inline?: boolean;
    }>;
    footer?: {
        text: string;
        icon_url?: string;
    };
    timestamp?: string;
    url?: string;
    author?: {
        name: string;
        url?: string;
        icon_url?: string;
    };
    thumbnail?: {
        url: string;
    };
    image?: {
        url: string;
    };
}
declare class DiscordService {
    private getToken;
    saveToken(userId: number, botToken?: string, accessToken?: string): Promise<void>;
    private request;
    sendMessage(userId: number, channelId: string, options: MessageOptions): Promise<any>;
    editMessage(userId: number, channelId: string, messageId: string, options: MessageOptions): Promise<any>;
    deleteMessage(userId: number, channelId: string, messageId: string): Promise<any>;
    getMessage(userId: number, channelId: string, messageId: string): Promise<any>;
    getMessages(userId: number, channelId: string, limit?: number, before?: string, after?: string): Promise<any>;
    bulkDeleteMessages(userId: number, channelId: string, messageIds: string[]): Promise<any>;
    addReaction(userId: number, channelId: string, messageId: string, emoji: string): Promise<any>;
    removeReaction(userId: number, channelId: string, messageId: string, emoji: string, userIdToRemove?: string): Promise<any>;
    getReactions(userId: number, channelId: string, messageId: string, emoji: string): Promise<any>;
    getChannel(userId: number, channelId: string): Promise<any>;
    modifyChannel(userId: number, channelId: string, options: any): Promise<any>;
    deleteChannel(userId: number, channelId: string): Promise<any>;
    getChannelInvites(userId: number, channelId: string): Promise<any>;
    createChannelInvite(userId: number, channelId: string, options?: any): Promise<any>;
    getGuild(userId: number, guildId: string, withCounts?: boolean): Promise<any>;
    getGuildChannels(userId: number, guildId: string): Promise<any>;
    createGuildChannel(userId: number, guildId: string, options: any): Promise<any>;
    getGuildMembers(userId: number, guildId: string, limit?: number, after?: string): Promise<any>;
    getGuildMember(userId: number, guildId: string, memberId: string): Promise<any>;
    addGuildMemberRole(userId: number, guildId: string, memberId: string, roleId: string): Promise<any>;
    removeGuildMemberRole(userId: number, guildId: string, memberId: string, roleId: string): Promise<any>;
    kickGuildMember(userId: number, guildId: string, memberId: string, reason?: string): Promise<any>;
    banGuildMember(userId: number, guildId: string, memberId: string, deleteMessageDays?: number, reason?: string): Promise<any>;
    unbanGuildMember(userId: number, guildId: string, memberId: string): Promise<any>;
    getGuildRoles(userId: number, guildId: string): Promise<any>;
    createGuildRole(userId: number, guildId: string, options: any): Promise<any>;
    modifyGuildRole(userId: number, guildId: string, roleId: string, options: any): Promise<any>;
    deleteGuildRole(userId: number, guildId: string, roleId: string): Promise<any>;
    getCurrentUser(userId: number): Promise<any>;
    getUser(userId: number, discordUserId: string): Promise<any>;
    modifyCurrentUser(userId: number, username?: string, avatar?: string): Promise<any>;
    getCurrentUserGuilds(userId: number): Promise<any>;
    createWebhook(userId: number, channelId: string, name: string, avatar?: string): Promise<any>;
    getChannelWebhooks(userId: number, channelId: string): Promise<any>;
    getGuildWebhooks(userId: number, guildId: string): Promise<any>;
    executeWebhook(webhookId: string, webhookToken: string, options: MessageOptions, wait?: boolean): Promise<any>;
    createEmbed(options: EmbedOptions): any;
    hexToColor(hex: string): number;
    colorToHex(color: number): string;
}
export declare const discordService: DiscordService;
export {};
