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
class NotionService {
    async getToken(userId) {
        const [cred] = await db.select().from(credentials)
            .where(and(eq(credentials.userId, userId), eq(credentials.service, 'notion')))
            .limit(1);
        if (!cred) {
            throw new Error('Notion credentials not found');
        }
        const bytes = CryptoJS.AES.decrypt(cred.encryptedData, ENCRYPTION_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decrypted.accessToken;
    }
    async saveToken(userId, token) {
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ accessToken: token }), ENCRYPTION_KEY).toString();
        const existing = await db.select()
            .from(credentials)
            .where(and(eq(credentials.userId, userId), eq(credentials.service, 'notion')))
            .limit(1);
        if (existing.length > 0) {
            await db.update(credentials)
                .set({ encryptedData: encrypted, updatedAt: new Date() })
                .where(eq(credentials.id, existing[0].id));
        }
        else {
            await db.insert(credentials).values({
                userId,
                service: 'notion',
                credentialType: 'oauth',
                encryptedData: encrypted,
                isActive: true,
            });
        }
    }
    async request(userId, method, endpoint, data) {
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
        }
        catch (error) {
            throw new Error(`Notion API error: ${error.response?.data?.message || error.message}`);
        }
    }
    // Database operations
    async queryDatabase(userId, databaseId, options) {
        return this.request(userId, 'POST', `/databases/${databaseId}/query`, options || {});
    }
    async createDatabase(userId, parentPageId, title, properties) {
        return this.request(userId, 'POST', '/databases', {
            parent: { type: 'page_id', page_id: parentPageId },
            title: [{ type: 'text', text: { content: title } }],
            properties,
        });
    }
    async getDatabase(userId, databaseId) {
        return this.request(userId, 'GET', `/databases/${databaseId}`);
    }
    async updateDatabase(userId, databaseId, updates) {
        return this.request(userId, 'PATCH', `/databases/${databaseId}`, updates);
    }
    // Page operations
    async getPage(userId, pageId) {
        return this.request(userId, 'GET', `/pages/${pageId}`);
    }
    async createPage(userId, parentId, parentType, properties, content) {
        const parent = parentType === 'database_id'
            ? { database_id: parentId }
            : { page_id: parentId };
        const body = { parent, properties };
        if (content && content.length > 0) {
            body.children = content;
        }
        return this.request(userId, 'POST', '/pages', body);
    }
    async updatePage(userId, pageId, properties) {
        return this.request(userId, 'PATCH', `/pages/${pageId}`, { properties });
    }
    async archivePage(userId, pageId) {
        return this.request(userId, 'PATCH', `/pages/${pageId}`, { archived: true });
    }
    // Block operations
    async getBlockChildren(userId, blockId, startCursor) {
        const params = startCursor ? `?start_cursor=${startCursor}` : '';
        return this.request(userId, 'GET', `/blocks/${blockId}/children${params}`);
    }
    async appendBlockChildren(userId, blockId, children) {
        return this.request(userId, 'PATCH', `/blocks/${blockId}/children`, { children });
    }
    async deleteBlock(userId, blockId) {
        return this.request(userId, 'DELETE', `/blocks/${blockId}`);
    }
    // Search operations
    async search(userId, query, filter, sort) {
        const body = {};
        if (query)
            body.query = query;
        if (filter)
            body.filter = filter;
        if (sort)
            body.sort = sort;
        return this.request(userId, 'POST', '/search', body);
    }
    // User operations
    async getUser(userId, notionUserId) {
        return this.request(userId, 'GET', `/users/${notionUserId}`);
    }
    async listUsers(userId) {
        return this.request(userId, 'GET', '/users');
    }
    async getBotUser(userId) {
        return this.request(userId, 'GET', '/users/me');
    }
    // Comment operations
    async createComment(userId, pageId, richText) {
        return this.request(userId, 'POST', '/comments', {
            parent: { page_id: pageId },
            rich_text: richText,
        });
    }
    async getComments(userId, blockId) {
        return this.request(userId, 'GET', `/comments?block_id=${blockId}`);
    }
    // Helper methods to create common block types
    createParagraphBlock(text) {
        return {
            object: 'block',
            type: 'paragraph',
            paragraph: {
                rich_text: [{ type: 'text', text: { content: text } }],
            },
        };
    }
    createHeadingBlock(level, text) {
        const type = `heading_${level}`;
        return {
            object: 'block',
            type,
            [type]: {
                rich_text: [{ type: 'text', text: { content: text } }],
            },
        };
    }
    createToDoBlock(text, checked = false) {
        return {
            object: 'block',
            type: 'to_do',
            to_do: {
                rich_text: [{ type: 'text', text: { content: text } }],
                checked,
            },
        };
    }
    createBulletedListBlock(text) {
        return {
            object: 'block',
            type: 'bulleted_list_item',
            bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: text } }],
            },
        };
    }
    createCodeBlock(code, language = 'javascript') {
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
    createTitleProperty(text) {
        return {
            title: [{ type: 'text', text: { content: text } }],
        };
    }
    createRichTextProperty(text) {
        return {
            rich_text: [{ type: 'text', text: { content: text } }],
        };
    }
    createNumberProperty(number) {
        return { number };
    }
    createSelectProperty(option) {
        return { select: { name: option } };
    }
    createMultiSelectProperty(options) {
        return { multi_select: options.map(name => ({ name })) };
    }
    createDateProperty(start, end) {
        return { date: { start, end: end || null } };
    }
    createCheckboxProperty(checked) {
        return { checkbox: checked };
    }
    createUrlProperty(url) {
        return { url };
    }
    createEmailProperty(email) {
        return { email };
    }
    createPhoneProperty(phone) {
        return { phone_number: phone };
    }
}
export const notionService = new NotionService();
