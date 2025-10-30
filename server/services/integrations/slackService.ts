/**
 * Slack Integration Service
 */
import axios from 'axios';
import { db } from '../../db/index.js';
import { credentials } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import CryptoJS from 'crypto-js';

const SLACK_API = 'https://slack.com/api';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key';

class SlackService {
  private async getToken(userId: number): Promise<string> {
    const [cred] = await db.select().from(credentials)
      .where(eq(credentials.userId, userId))
      .where(eq(credentials.service, 'slack')).limit(1);
    if (!cred) throw new Error('Slack credentials not found');
    const bytes = CryptoJS.AES.decrypt(cred.encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)).accessToken;
  }

  async saveToken(userId: number, token: string) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ accessToken: token }), ENCRYPTION_KEY).toString();
    const existing = await db.select().from(credentials).where(eq(credentials.userId, userId)).where(eq(credentials.service, 'slack')).limit(1);
    if (existing.length > 0) {
      await db.update(credentials).set({ encryptedData: encrypted }).where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({ userId, service: 'slack', credentialType: 'oauth', encryptedData: encrypted, isActive: true });
    }
  }

  async postMessage(userId: number, channel: string, text: string, blocks?: any[]) {
    const token = await this.getToken(userId);
    const response = await axios.post(`${SLACK_API}/chat.postMessage`, { channel, text, blocks }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  }

  async listChannels(userId: number) {
    const token = await this.getToken(userId);
    const response = await axios.get(`${SLACK_API}/conversations.list`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.channels;
  }

  async getChannelHistory(userId: number, channel: string, limit: number = 100) {
    const token = await this.getToken(userId);
    const response = await axios.get(`${SLACK_API}/conversations.history`, { 
      params: { channel, limit },
      headers: { Authorization: `Bearer ${token}` } 
    });
    return response.data.messages;
  }

  async uploadFile(userId: number, channels: string[], content: string, filename: string, title?: string) {
    const token = await this.getToken(userId);
    const formData = new URLSearchParams();
    formData.append('channels', channels.join(','));
    formData.append('content', content);
    formData.append('filename', filename);
    if (title) formData.append('title', title);
    
    const response = await axios.post(`${SLACK_API}/files.upload`, formData, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  }

  async updateMessage(userId: number, channel: string, ts: string, text: string) {
    const token = await this.getToken(userId);
    const response = await axios.post(`${SLACK_API}/chat.update`, { channel, ts, text }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  }

  async deleteMessage(userId: number, channel: string, ts: string) {
    const token = await this.getToken(userId);
    const response = await axios.post(`${SLACK_API}/chat.delete`, { channel, ts }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  }

  async addReaction(userId: number, channel: string, timestamp: string, emoji: string) {
    const token = await this.getToken(userId);
    const response = await axios.post(`${SLACK_API}/reactions.add`, { channel, timestamp, name: emoji }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  }

  async getUsers(userId: number) {
    const token = await this.getToken(userId);
    const response = await axios.get(`${SLACK_API}/users.list`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.members;
  }
}

export const slackService = new SlackService();
