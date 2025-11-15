declare class DriveService {
    private getCredentials;
    saveCredentials(userId: number, accessToken: string, refreshToken?: string): Promise<void>;
    private request;
    listFiles(userId: number, query?: string, maxResults?: number): Promise<any>;
    getFile(userId: number, fileId: string): Promise<any>;
    createFolder(userId: number, name: string, parentId?: string): Promise<any>;
    uploadFile(userId: number, name: string, content: string, mimeType: string, parentId?: string): Promise<any>;
    deleteFile(userId: number, fileId: string): Promise<void>;
    shareFile(userId: number, fileId: string, email: string, role?: 'reader' | 'writer' | 'commenter'): Promise<any>;
}
export declare const driveService: DriveService;
export {};
