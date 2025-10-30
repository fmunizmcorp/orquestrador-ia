/**
 * Google Drive Integration
 */
import axios from 'axios';
import { db } from '../../db/index.js';
import { credentials } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import CryptoJS from 'crypto-js';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key';

class DriveService {
  private async getCredentials(userId: number) {
    const [cred] = await db.select().from(credentials)
      .where(eq(credentials.userId, userId))
      .where(eq(credentials.service, 'drive')).limit(1);
    if (!cred) throw new Error('Credentials not found');
    const bytes = CryptoJS.AES.decrypt(cred.encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  async saveCredentials(userId: number, accessToken: string, refreshToken?: string) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ accessToken, refreshToken }), ENCRYPTION_KEY).toString();
    const existing = await db.select().from(credentials)
      .where(eq(credentials.userId, userId))
      .where(eq(credentials.service, 'drive')).limit(1);
    
    if (existing.length > 0) {
      await db.update(credentials).set({ encryptedData: encrypted }).where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({ userId, service: 'drive', credentialType: 'oauth', encryptedData: encrypted, isActive: true });
    }
  }

  private async request(userId: number, method: string, endpoint: string, data?: any) {
    const creds = await this.getCredentials(userId);
    const response = await axios({
      method,
      url: `${DRIVE_API}${endpoint}`,
      headers: { Authorization: `Bearer ${creds.accessToken}` },
      data,
    });
    return response.data;
  }

  async listFiles(userId: number, query?: string, maxResults: number = 100) {
    const params = new URLSearchParams({ pageSize: maxResults.toString() });
    if (query) params.append('q', query);
    return this.request(userId, 'GET', `/files?${params}`);
  }

  async getFile(userId: number, fileId: string) {
    return this.request(userId, 'GET', `/files/${fileId}`);
  }

  async createFolder(userId: number, name: string, parentId?: string) {
    return this.request(userId, 'POST', '/files', {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      ...(parentId && { parents: [parentId] }),
    });
  }

  async uploadFile(userId: number, name: string, content: string, mimeType: string, parentId?: string) {
    const metadata = { name, ...(parentId && { parents: [parentId] }) };
    const boundary = '-------314159265358979323846';
    const body = [
      `--${boundary}`,
      'Content-Type: application/json; charset=UTF-8',
      '',
      JSON.stringify(metadata),
      `--${boundary}`,
      `Content-Type: ${mimeType}`,
      '',
      content,
      `--${boundary}--`,
    ].join('\r\n');

    const creds = await this.getCredentials(userId);
    const response = await axios.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', body, {
      headers: {
        Authorization: `Bearer ${creds.accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
    });
    return response.data;
  }

  async deleteFile(userId: number, fileId: string) {
    await this.request(userId, 'DELETE', `/files/${fileId}`);
  }

  async shareFile(userId: number, fileId: string, email: string, role: 'reader' | 'writer' | 'commenter' = 'reader') {
    return this.request(userId, 'POST', `/files/${fileId}/permissions`, {
      type: 'user',
      role,
      emailAddress: email,
    });
  }
}

export const driveService = new DriveService();
