/**
 * Notion Integration Service
 * Provides integration with Notion API
 */
import axios from 'axios';
import { db } from '../../db/index.js';
import { credentials } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import CryptoJS from 'crypto-js';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key';

interface NotionCredentials {
  accessToken: string;
}

interface PageProperty {
  [key: string]: any;
}

interface DatabaseQueryFilter {
  property?: string;
  filter?: any;
  sorts?: any[];
}

class NotionService {
  private async getToken(userId: number): Promise<string> {
    const [cred] = await db.select().from(credentials)
      .where(and(
        eq(credentials.userId, userId),
        eq(credentials.service, 'notion')
      ))
      .limit(1);
    
    if (!cred) {
      throw new Error('Notion credentials not found');
    }
    
    const bytes = CryptoJS.AES.decrypt(cred.encryptedData, ENCRYPTION_KEY);
    const decrypted: NotionCredentials = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decrypted.accessToken;
  }

  async saveToken(userId: number, token: string) {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify({ accessToken: token }),
      ENCRYPTION_KEY
    ).toString();

    const existing = await db.select()
      .from(credentials)
      .where(and(
        eq(credentials.userId, userId),
        eq(credentials.service, 'notion')
      ))
      .limit(1);

    if (existing.length > 0) {
      await db.update(credentials)
        .set({ encryptedData: encrypted, updatedAt: new Date() })
        .where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({
        userId,
        service: 'notion',
        credentialType: 'oauth',
        encryptedData: encrypted,
        isActive: true,
      });
    }
  }

  private async request(userId: number, method: string, endpoint: string, data?: any) {
    const token = await this.getToken(userId);
    
    try {
      const response = await axios({
        method,
        url: `${NOTION_API}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        data,
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Notion API error: ${error.response?.data?.message || error.message}`
      );
    }
  }

  // Database operations
  async queryDatabase(userId: number, databaseId: string, options?: DatabaseQueryFilter) {
    return this.request(userId, 'POST', `/databases/${databaseId}/query`, options || {});
  }

  async createDatabase(userId: number, parentPageId: string, title: string, properties: any) {
    return this.request(userId, 'POST', '/databases', {
      parent: { type: 'page_id', page_id: parentPageId },
      title: [{ type: 'text', text: { content: title } }],
      properties,
    });
  }

  async getDatabase(userId: number, databaseId: string) {
    return this.request(userId, 'GET', `/databases/${databaseId}`);
  }

  async updateDatabase(userId: number, databaseId: string, updates: any) {
    return this.request(userId, 'PATCH', `/databases/${databaseId}`, updates);
  }

  // Page operations
  async getPage(userId: number, pageId: string) {
    return this.request(userId, 'GET', `/pages/${pageId}`);
  }

  async createPage(userId: number, parentId: string, parentType: 'database_id' | 'page_id', properties: PageProperty, content?: any[]) {
    const parent = parentType === 'database_id' 
      ? { database_id: parentId }
      : { page_id: parentId };

    const body: any = { parent, properties };
    
    if (content && content.length > 0) {
      body.children = content;
    }

    return this.request(userId, 'POST', '/pages', body);
  }

  async updatePage(userId: number, pageId: string, properties: PageProperty) {
    return this.request(userId, 'PATCH', `/pages/${pageId}`, { properties });
  }

  async archivePage(userId: number, pageId: string) {
    return this.request(userId, 'PATCH', `/pages/${pageId}`, { archived: true });
  }

  // Block operations
  async getBlockChildren(userId: number, blockId: string, startCursor?: string) {
    const params = startCursor ? `?start_cursor=${startCursor}` : '';
    return this.request(userId, 'GET', `/blocks/${blockId}/children${params}`);
  }

  async appendBlockChildren(userId: number, blockId: string, children: any[]) {
    return this.request(userId, 'PATCH', `/blocks/${blockId}/children`, { children });
  }

  async deleteBlock(userId: number, blockId: string) {
    return this.request(userId, 'DELETE', `/blocks/${blockId}`);
  }

  // Search operations
  async search(userId: number, query?: string, filter?: any, sort?: any) {
    const body: any = {};
    if (query) body.query = query;
    if (filter) body.filter = filter;
    if (sort) body.sort = sort;

    return this.request(userId, 'POST', '/search', body);
  }

  // User operations
  async getUser(userId: number, notionUserId: string) {
    return this.request(userId, 'GET', `/users/${notionUserId}`);
  }

  async listUsers(userId: number) {
    return this.request(userId, 'GET', '/users');
  }

  async getBotUser(userId: number) {
    return this.request(userId, 'GET', '/users/me');
  }

  // Comment operations
  async createComment(userId: number, pageId: string, richText: any[]) {
    return this.request(userId, 'POST', '/comments', {
      parent: { page_id: pageId },
      rich_text: richText,
    });
  }

  async getComments(userId: number, blockId: string) {
    return this.request(userId, 'GET', `/comments?block_id=${blockId}`);
  }

  // Helper methods to create common block types
  createParagraphBlock(text: string): any {
    return {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: text } }],
      },
    };
  }

  createHeadingBlock(level: 1 | 2 | 3, text: string): any {
    const type = `heading_${level}` as 'heading_1' | 'heading_2' | 'heading_3';
    return {
      object: 'block',
      type,
      [type]: {
        rich_text: [{ type: 'text', text: { content: text } }],
      },
    };
  }

  createToDoBlock(text: string, checked: boolean = false): any {
    return {
      object: 'block',
      type: 'to_do',
      to_do: {
        rich_text: [{ type: 'text', text: { content: text } }],
        checked,
      },
    };
  }

  createBulletedListBlock(text: string): any {
    return {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ type: 'text', text: { content: text } }],
      },
    };
  }

  createCodeBlock(code: string, language: string = 'javascript'): any {
    return {
      object: 'block',
      type: 'code',
      code: {
        rich_text: [{ type: 'text', text: { content: code } }],
        language,
      },
    };
  }

  // Helper to create common property types
  createTitleProperty(text: string): any {
    return {
      title: [{ type: 'text', text: { content: text } }],
    };
  }

  createRichTextProperty(text: string): any {
    return {
      rich_text: [{ type: 'text', text: { content: text } }],
    };
  }

  createNumberProperty(number: number): any {
    return { number };
  }

  createSelectProperty(option: string): any {
    return { select: { name: option } };
  }

  createMultiSelectProperty(options: string[]): any {
    return { multi_select: options.map(name => ({ name })) };
  }

  createDateProperty(start: string, end?: string): any {
    return { date: { start, end: end || null } };
  }

  createCheckboxProperty(checked: boolean): any {
    return { checkbox: checked };
  }

  createUrlProperty(url: string): any {
    return { url };
  }

  createEmailProperty(email: string): any {
    return { email };
  }

  createPhoneProperty(phone: string): any {
    return { phone_number: phone };
  }
}

export const notionService = new NotionService();
