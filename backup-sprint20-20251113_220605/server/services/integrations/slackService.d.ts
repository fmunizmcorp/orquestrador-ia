declare class SlackService {
    private getToken;
    saveToken(userId: number, token: string): Promise<void>;
    postMessage(userId: number, channel: string, text: string, blocks?: any[]): Promise<any>;
    listChannels(userId: number): Promise<any>;
    getChannelHistory(userId: number, channel: string, limit?: number): Promise<any>;
    uploadFile(userId: number, channels: string[], content: string, filename: string, title?: string): Promise<any>;
    updateMessage(userId: number, channel: string, ts: string, text: string): Promise<any>;
    deleteMessage(userId: number, channel: string, ts: string): Promise<any>;
    addReaction(userId: number, channel: string, timestamp: string, emoji: string): Promise<any>;
    getUsers(userId: number): Promise<any>;
}
export declare const slackService: SlackService;
export {};
