/**
 * Gmail Integration Service
 * - OAuth2 authentication
 * - Send emails
 * - Read emails
 * - Search and filter
 * - Manage labels
 * - Attachments support
 */
interface SendEmailOptions {
    to: string | string[];
    subject: string;
    body: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Array<{
        filename: string;
        content: string;
        mimeType: string;
    }>;
}
declare class GmailService {
    /**
     * Obter credenciais
     */
    private getCredentials;
    /**
     * Salvar credenciais
     */
    saveCredentials(userId: number, accessToken: string, refreshToken?: string): Promise<void>;
    /**
     * Request autenticado
     */
    private request;
    /**
     * Enviar email
     */
    sendEmail(userId: number, options: SendEmailOptions): Promise<any>;
    /**
     * Listar emails
     */
    listEmails(userId: number, options?: {
        maxResults?: number;
        query?: string;
        labelIds?: string[];
    }): Promise<any>;
    /**
     * Obter email
     */
    getEmail(userId: number, emailId: string): Promise<any>;
    /**
     * Deletar email
     */
    deleteEmail(userId: number, emailId: string): Promise<void>;
    /**
     * Marcar como lido
     */
    markAsRead(userId: number, emailId: string): Promise<any>;
    /**
     * Marcar como não lido
     */
    markAsUnread(userId: number, emailId: string): Promise<any>;
    /**
     * Adicionar label
     */
    addLabel(userId: number, emailId: string, labelId: string): Promise<any>;
    /**
     * Remover label
     */
    removeLabel(userId: number, emailId: string, labelId: string): Promise<any>;
    /**
     * Listar labels
     */
    listLabels(userId: number): Promise<any[]>;
    /**
     * Criar label
     */
    createLabel(userId: number, name: string): Promise<any>;
    /**
     * Pesquisar emails
     */
    searchEmails(userId: number, query: string, maxResults?: number): Promise<any>;
    /**
     * Obter perfil
     */
    getProfile(userId: number): Promise<any>;
}
export declare const gmailService: GmailService;
export {};
