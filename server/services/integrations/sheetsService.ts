/**
 * Google Sheets Integration Service
 * Provides integration with Google Sheets API v4
 */
import axios from 'axios';
import { db } from '../../db/index.js';
import { credentials } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import CryptoJS from 'crypto-js';

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key';

interface SheetsCredentials {
  accessToken: string;
  refreshToken?: string;
}

interface CellValue {
  row: number;
  col: number;
  value: any;
}

interface BatchUpdate {
  range: string;
  values: any[][];
}

class SheetsService {
  private async getToken(userId: number): Promise<string> {
    const [cred] = await db.select().from(credentials)
      .where(eq(credentials.userId, userId))
      .where(eq(credentials.service, 'google_sheets'))
      .limit(1);
    
    if (!cred) {
      throw new Error('Google Sheets credentials not found');
    }
    
    const bytes = CryptoJS.AES.decrypt(cred.encryptedData, ENCRYPTION_KEY);
    const decrypted: SheetsCredentials = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decrypted.accessToken;
  }

  async saveToken(userId: number, accessToken: string, refreshToken?: string) {
    const tokenData: SheetsCredentials = { accessToken };
    if (refreshToken) tokenData.refreshToken = refreshToken;

    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(tokenData),
      ENCRYPTION_KEY
    ).toString();

    const existing = await db.select()
      .from(credentials)
      .where(eq(credentials.userId, userId))
      .where(eq(credentials.service, 'google_sheets'))
      .limit(1);

    if (existing.length > 0) {
      await db.update(credentials)
        .set({ encryptedData: encrypted, updatedAt: new Date() })
        .where(eq(credentials.id, existing[0].id));
    } else {
      await db.insert(credentials).values({
        userId,
        service: 'google_sheets',
        credentialType: 'oauth',
        encryptedData: encrypted,
        isActive: true,
      });
    }
  }

  private async request(userId: number, method: string, url: string, data?: any) {
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
    } catch (error: any) {
      throw new Error(
        `Google Sheets API error: ${error.response?.data?.error?.message || error.message}`
      );
    }
  }

  // Spreadsheet operations
  async createSpreadsheet(userId: number, title: string, sheets?: any[]) {
    const body: any = {
      properties: { title },
    };

    if (sheets && sheets.length > 0) {
      body.sheets = sheets;
    }

    return this.request(userId, 'POST', SHEETS_API, body);
  }

  async getSpreadsheet(userId: number, spreadsheetId: string, includeGridData: boolean = false) {
    const params = includeGridData ? '?includeGridData=true' : '';
    return this.request(userId, 'GET', `${SHEETS_API}/${spreadsheetId}${params}`);
  }

  async getSpreadsheetValues(userId: number, spreadsheetId: string, range: string) {
    return this.request(
      userId,
      'GET',
      `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}`
    );
  }

  async updateSpreadsheetValues(
    userId: number,
    spreadsheetId: string,
    range: string,
    values: any[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED'
  ) {
    return this.request(
      userId,
      'PUT',
      `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=${valueInputOption}`,
      { values }
    );
  }

  async appendSpreadsheetValues(
    userId: number,
    spreadsheetId: string,
    range: string,
    values: any[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED'
  ) {
    return this.request(
      userId,
      'POST',
      `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=${valueInputOption}`,
      { values }
    );
  }

  async clearSpreadsheetValues(userId: number, spreadsheetId: string, range: string) {
    return this.request(
      userId,
      'POST',
      `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}:clear`,
      {}
    );
  }

  async batchGetValues(userId: number, spreadsheetId: string, ranges: string[]) {
    const rangesParam = ranges.map(r => `ranges=${encodeURIComponent(r)}`).join('&');
    return this.request(
      userId,
      'GET',
      `${SHEETS_API}/${spreadsheetId}/values:batchGet?${rangesParam}`
    );
  }

  async batchUpdateValues(
    userId: number,
    spreadsheetId: string,
    updates: BatchUpdate[],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED'
  ) {
    return this.request(
      userId,
      'POST',
      `${SHEETS_API}/${spreadsheetId}/values:batchUpdate`,
      {
        valueInputOption,
        data: updates.map(u => ({ range: u.range, values: u.values })),
      }
    );
  }

  async batchClearValues(userId: number, spreadsheetId: string, ranges: string[]) {
    return this.request(
      userId,
      'POST',
      `${SHEETS_API}/${spreadsheetId}/values:batchClear`,
      { ranges }
    );
  }

  // Sheet operations (within spreadsheet)
  async addSheet(userId: number, spreadsheetId: string, title: string, index?: number) {
    const request: any = {
      addSheet: {
        properties: { title },
      },
    };

    if (index !== undefined) {
      request.addSheet.properties.index = index;
    }

    return this.batchUpdate(userId, spreadsheetId, [request]);
  }

  async deleteSheet(userId: number, spreadsheetId: string, sheetId: number) {
    return this.batchUpdate(userId, spreadsheetId, [
      { deleteSheet: { sheetId } },
    ]);
  }

  async duplicateSheet(
    userId: number,
    spreadsheetId: string,
    sourceSheetId: number,
    newSheetName: string,
    insertSheetIndex?: number
  ) {
    const request: any = {
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

  async updateSheetProperties(
    userId: number,
    spreadsheetId: string,
    sheetId: number,
    properties: any,
    fields: string
  ) {
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
  async batchUpdate(userId: number, spreadsheetId: string, requests: any[]) {
    return this.request(
      userId,
      'POST',
      `${SHEETS_API}/${spreadsheetId}:batchUpdate`,
      { requests }
    );
  }

  async mergeCells(
    userId: number,
    spreadsheetId: string,
    sheetId: number,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    mergeType: 'MERGE_ALL' | 'MERGE_COLUMNS' | 'MERGE_ROWS' = 'MERGE_ALL'
  ) {
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

  async autoResizeDimensions(
    userId: number,
    spreadsheetId: string,
    sheetId: number,
    dimension: 'ROWS' | 'COLUMNS',
    startIndex: number,
    endIndex: number
  ) {
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

  async sortRange(
    userId: number,
    spreadsheetId: string,
    sheetId: number,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    sortSpecs: Array<{ dimensionIndex: number; sortOrder: 'ASCENDING' | 'DESCENDING' }>
  ) {
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

  async setDataValidation(
    userId: number,
    spreadsheetId: string,
    sheetId: number,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    condition: any,
    strict: boolean = true
  ) {
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
  async formatCells(
    userId: number,
    spreadsheetId: string,
    sheetId: number,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    format: any,
    fields: string
  ) {
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
  columnToLetter(column: number): string {
    let letter = '';
    while (column > 0) {
      const remainder = (column - 1) % 26;
      letter = String.fromCharCode(65 + remainder) + letter;
      column = Math.floor((column - 1) / 26);
    }
    return letter;
  }

  letterToColumn(letter: string): number {
    let column = 0;
    for (let i = 0; i < letter.length; i++) {
      column = column * 26 + (letter.charCodeAt(i) - 64);
    }
    return column;
  }

  a1ToRowCol(a1: string): { row: number; col: number } {
    const match = a1.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new Error('Invalid A1 notation');
    return {
      col: this.letterToColumn(match[1]),
      row: parseInt(match[2]),
    };
  }

  rowColToA1(row: number, col: number): string {
    return `${this.columnToLetter(col)}${row}`;
  }
}

export const sheetsService = new SheetsService();
