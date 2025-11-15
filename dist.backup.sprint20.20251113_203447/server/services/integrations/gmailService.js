/**
 * Gmail Integration Service
 * - OAuth2 authentication
 * - Send emails
 * - Read emails
 * - Search and filter
 * - Manage labels
 * - Attachments support
 */
import axios from 'axios';
import { db } from '../../db/index.js';
import { credentials } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { withErrorHandling, ExternalServiceError } from '../../middleware/errorHandler.js';
import CryptoJS from 'crypto-js';
const GMAIL_API = 'https://gmail.googleapis.com/gmail/v1';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
class GmailService {
    /**
     * Obter credenciais
     */
    async getCredentials(userId) {
        const [cred] = await db.select()
            .from(credentials)
            .where(and(eq(credentials.userId, userId), eq(credentials.service, 'gmail')))
            .limit(1);
        if (!cred) {
            throw new ExternalServiceError('Gmail', 'Credenciais não encontradas');
        }
        const bytes = CryptoJS.AES.decrypt(cred.encryptedData, ENCRYPTION_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    }
    /**
     * Salvar credenciais
     */
    async saveCredentials(userId, accessToken, refreshToken) {
        const data = {
            accessToken,
            refreshToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1h
        };
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
        const existing = await db.select()
            .from(credentials)
            .where(and(eq(credentials.userId, userId), eq(credentials.service, 'gmail')))
            .limit(1);
        if (existing.length > 0) {
            await db.update(credentials)
                .set({ encryptedData: encrypted, updatedAt: new Date() })
                .where(eq(credentials.id, existing[0].id));
        }
        else {
            await db.insert(credentials).values({
                userId,
                service: 'gmail',
                credentialType: 'oauth',
                encryptedData: encrypted,
                isActive: true,
            });
        }
    }
    /**
     * Request autenticado
     */
    async request(userId, method, endpoint, data) {
        return withErrorHandling(async () => {
            const creds = await this.getCredentials(userId);
            const response = await axios({
                method,
                url: `${GMAIL_API}${endpoint}`,
                headers: {
                    Authorization: `Bearer ${creds.accessToken}`,
                },
                data,
            });
            return response.data;
        }, { name: 'gmailRequest', userId });
    }
    /**
     * Enviar email
     */
    async sendEmail(userId, options) {
        // Criar email no formato RFC 2822
        const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;
        const cc = options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : '';
        const bcc = options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(', ') : options.bcc) : '';
        let emailContent = [
            `To: ${to}`,
            cc ? `Cc: ${cc}` : '',
            bcc ? `Bcc: ${bcc}` : '',
            `Subject: ${options.subject}`,
            'Content-Type: text/html; charset=utf-8',
            '',
            options.body,
        ].filter(Boolean).join('\r\n');
        // Encode em base64
        const encodedEmail = Buffer.from(emailContent)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
        return this.request(userId, 'POST', '/users/me/messages/send', {
            raw: encodedEmail,
        });
    }
    /**
     * Listar emails
     */
    async listEmails(userId, options) {
        const params = new URLSearchParams();
        if (options?.maxResults)
            params.append('maxResults', options.maxResults.toString());
        if (options?.query)
            params.append('q', options.query);
        if (options?.labelIds) {
            options.labelIds.forEach(id => params.append('labelIds', id));
        }
        return this.request(userId, 'GET', `/users/me/messages?${params}`);
    }
    /**
     * Obter email
     */
    async getEmail(userId, emailId) {
        return this.request(userId, 'GET', `/users/me/messages/${emailId}`);
    }
    /**
     * Deletar email
     */
    async deleteEmail(userId, emailId) {
        await this.request(userId, 'DELETE', `/users/me/messages/${emailId}`);
    }
    /**
     * Marcar como lido
     */
    async markAsRead(userId, emailId) {
        return this.request(userId, 'POST', `/users/me/messages/${emailId}/modify`, {
            removeLabelIds: ['UNREAD'],
        });
    }
    /**
     * Marcar como não lido
     */
    async markAsUnread(userId, emailId) {
        return this.request(userId, 'POST', `/users/me/messages/${emailId}/modify`, {
            addLabelIds: ['UNREAD'],
        });
    }
    /**
     * Adicionar label
     */
    async addLabel(userId, emailId, labelId) {
        return this.request(userId, 'POST', `/users/me/messages/${emailId}/modify`, {
            addLabelIds: [labelId],
        });
    }
    /**
     * Remover label
     */
    async removeLabel(userId, emailId, labelId) {
        return this.request(userId, 'POST', `/users/me/messages/${emailId}/modify`, {
            removeLabelIds: [labelId],
        });
    }
    /**
     * Listar labels
     */
    async listLabels(userId) {
        const response = await this.request(userId, 'GET', '/users/me/labels');
        return response.labels || [];
    }
    /**
     * Criar label
     */
    async createLabel(userId, name) {
        return this.request(userId, 'POST', '/users/me/labels', {
            name,
            messageListVisibility: 'show',
            labelListVisibility: 'labelShow',
        });
    }
    /**
     * Pesquisar emails
     */
    async searchEmails(userId, query, maxResults = 10) {
        return this.listEmails(userId, { query, maxResults });
    }
    /**
     * Obter perfil
     */
    async getProfile(userId) {
        return this.request(userId, 'GET', '/users/me/profile');
    }
}
export const gmailService = new GmailService();
