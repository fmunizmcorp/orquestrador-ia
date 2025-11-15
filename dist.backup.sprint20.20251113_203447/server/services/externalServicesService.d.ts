/**
 * External Services Integration
 * Integração com serviços externos
 * - GitHub, Drive, Gmail, Sheets, Notion, Slack, Discord, etc
 * - Credenciais criptografadas
 * - OAuth2 automático
 * - Logs de todas as ações
 */
declare class ExternalServicesService {
    executeGitHubAction(credentialId: number, action: string, params: any): Promise<any>;
    executeGoogleDriveAction(credentialId: number, action: string, params: any): Promise<any>;
    executeGmailAction(credentialId: number, action: string, params: any): Promise<any>;
    private getCredentials;
}
export declare const externalServicesService: ExternalServicesService;
export {};
