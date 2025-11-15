/**
 * Google Sheets Integration Service
 * Provides integration with Google Sheets API v4
 */
import axios from 'axios';
import { db } from '../../db/index.js';
import { credentials } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import CryptoJS from 'crypto-js';
const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key';
class SheetsService {
    async getToken(userId) {
        const [cred] = await db.select().from(credentials)
            .where(and(eq(credentials.userId, userId), eq(credentials.service, 'google_sheets')))
            .limit(1);
        if (!cred) {
            throw new Error('Google Sheets credentials not found');
        }
        const bytes = CryptoJS.AES.decrypt(cred.encryptedData, ENCRYPTION_KEY);
        const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decrypted.accessToken;
    }
    async saveToken(userId, accessToken, refreshToken) {
        const tokenData = { accessToken };
        if (refreshToken)
            tokenData.refreshToken = refreshToken;
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(tokenData), ENCRYPTION_KEY).toString();
        const existing = await db.select()
            .from(credentials)
            .where(and(eq(credentials.userId, userId), eq(credentials.service, 'google_sheets')))
            .limit(1);
        if (existing.length > 0) {
            await db.update(credentials)
                .set({ encryptedData: encrypted, updatedAt: new Date() })
                .where(eq(credentials.id, existing[0].id));
        }
        else {
            await db.insert(credentials).values({
                userId,
                service: 'google_sheets',
                credentialType: 'oauth',
                encryptedData: encrypted,
                isActive: true,
            });
        }
    }
    async request(userId, method, url, data) {
        const token = await this.getToken(userId);
        try {
            const response = await axios({
                method,
                url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Google Sheets API error: ${error.response?.data?.error?.message || error.message}`);
        }
    }
    // Spreadsheet operations
    async createSpreadsheet(userId, title, sheets) {
        const body = {
            properties: { title },
        };
        if (sheets && sheets.length > 0) {
            body.sheets = sheets;
        }
        return this.request(userId, 'POST', SHEETS_API, body);
    }
    async getSpreadsheet(userId, spreadsheetId, includeGridData = false) {
        const params = includeGridData ? '?includeGridData=true' : '';
        return this.request(userId, 'GET', `${SHEETS_API}/${spreadsheetId}${params}`);
    }
    async getSpreadsheetValues(userId, spreadsheetId, range) {
        return this.request(userId, 'GET', `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}`);
    }
    async updateSpreadsheetValues(userId, spreadsheetId, range, values, valueInputOption = 'USER_ENTERED') {
        return this.request(userId, 'PUT', `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=${valueInputOption}`, { values });
    }
    async appendSpreadsheetValues(userId, spreadsheetId, range, values, valueInputOption = 'USER_ENTERED') {
        return this.request(userId, 'POST', `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=${valueInputOption}`, { values });
    }
    async clearSpreadsheetValues(userId, spreadsheetId, range) {
        return this.request(userId, 'POST', `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`, {});
    }
    async batchGetValues(userId, spreadsheetId, ranges) {
        const rangesParam = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&');
        return this.request(userId, 'GET', `${SHEETS_API}/${spreadsheetId}/values:batchGet?${rangesParam}`);
    }
    async batchUpdateValues(userId, spreadsheetId, updates, valueInputOption = 'USER_ENTERED') {
        return this.request(userId, 'POST', `${SHEETS_API}/${spreadsheetId}/values:batchUpdate`, {
            valueInputOption,
            data: updates.map(u => ({ range: u.range, values: u.values })),
        });
    }
    async batchClearValues(userId, spreadsheetId, ranges) {
        return this.request(userId, 'POST', `${SHEETS_API}/${spreadsheetId}/values:batchClear`, { ranges });
    }
    // Sheet operations (within spreadsheet)
    async addSheet(userId, spreadsheetId, title, index) {
        const request = {
            addSheet: {
                properties: { title },
            },
        };
        if (index !== undefined) {
            request.addSheet.properties.index = index;
        }
        return this.batchUpdate(userId, spreadsheetId, [request]);
    }
    async deleteSheet(userId, spreadsheetId, sheetId) {
        return this.batchUpdate(userId, spreadsheetId, [
            { deleteSheet: { sheetId } },
        ]);
    }
    async duplicateSheet(userId, spreadsheetId, sourceSheetId, newSheetName, insertSheetIndex) {
        const request = {
            duplicateSheet: {
                sourceSheetId,
                newSheetName,
            },
        };
        if (insertSheetIndex !== undefined) {
            request.duplicateSheet.insertSheetIndex = insertSheetIndex;
        }
        return this.batchUpdate(userId, spreadsheetId, [request]);
    }
    async updateSheetProperties(userId, spreadsheetId, sheetId, properties, fields) {
        return this.batchUpdate(userId, spreadsheetId, [
            {
                updateSheetProperties: {
                    properties: { sheetId, ...properties },
                    fields,
                },
            },
        ]);
    }
    // Advanced operations
    async batchUpdate(userId, spreadsheetId, requests) {
        return this.request(userId, 'POST', `${SHEETS_API}/${spreadsheetId}:batchUpdate`, { requests });
    }
    async mergeCells(userId, spreadsheetId, sheetId, startRow, endRow, startCol, endCol, mergeType = 'MERGE_ALL') {
        return this.batchUpdate(userId, spreadsheetId, [
            {
                mergeCells: {
                    range: {
                        sheetId,
                        startRowIndex: startRow,
                        endRowIndex: endRow,
                        startColumnIndex: startCol,
                        endColumnIndex: endCol,
                    },
                    mergeType,
                },
            },
        ]);
    }
    async autoResizeDimensions(userId, spreadsheetId, sheetId, dimension, startIndex, endIndex) {
        return this.batchUpdate(userId, spreadsheetId, [
            {
                autoResizeDimensions: {
                    dimensions: {
                        sheetId,
                        dimension,
                        startIndex,
                        endIndex,
                    },
                },
            },
        ]);
    }
    async sortRange(userId, spreadsheetId, sheetId, startRow, endRow, startCol, endCol, sortSpecs) {
        return this.batchUpdate(userId, spreadsheetId, [
            {
                sortRange: {
                    range: {
                        sheetId,
                        startRowIndex: startRow,
                        endRowIndex: endRow,
                        startColumnIndex: startCol,
                        endColumnIndex: endCol,
                    },
                    sortSpecs,
                },
            },
        ]);
    }
    async setDataValidation(userId, spreadsheetId, sheetId, startRow, endRow, startCol, endCol, condition, strict = true) {
        return this.batchUpdate(userId, spreadsheetId, [
            {
                setDataValidation: {
                    range: {
                        sheetId,
                        startRowIndex: startRow,
                        endRowIndex: endRow,
                        startColumnIndex: startCol,
                        endColumnIndex: endCol,
                    },
                    rule: {
                        condition,
                        strict,
                    },
                },
            },
        ]);
    }
    // Formatting operations
    async formatCells(userId, spreadsheetId, sheetId, startRow, endRow, startCol, endCol, format, fields) {
        return this.batchUpdate(userId, spreadsheetId, [
            {
                repeatCell: {
                    range: {
                        sheetId,
                        startRowIndex: startRow,
                        endRowIndex: endRow,
                        startColumnIndex: startCol,
                        endColumnIndex: endCol,
                    },
                    cell: { userEnteredFormat: format },
                    fields: `userEnteredFormat.${fields}`,
                },
            },
        ]);
    }
    // Helper methods
    columnToLetter(column) {
        let letter = '';
        while (column > 0) {
            const remainder = (column - 1) % 26;
            letter = String.fromCharCode(65 + remainder) + letter;
            column = Math.floor((column - 1) / 26);
        }
        return letter;
    }
    letterToColumn(letter) {
        let column = 0;
        for (let i = 0; i < letter.length; i++) {
            column = column * 26 + (letter.charCodeAt(i) - 64);
        }
        return column;
    }
    a1ToRowCol(a1) {
        const match = a1.match(/^([A-Z]+)(\d+)$/);
        if (!match)
            throw new Error('Invalid A1 notation');
        return {
            col: this.letterToColumn(match[1]),
            row: parseInt(match[2]),
        };
    }
    rowColToA1(row, col) {
        return `${this.columnToLetter(col)}${row}`;
    }
}
export const sheetsService = new SheetsService();
