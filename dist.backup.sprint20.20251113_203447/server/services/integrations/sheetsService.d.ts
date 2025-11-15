interface BatchUpdate {
    range: string;
    values: any[][];
}
declare class SheetsService {
    private getToken;
    saveToken(userId: number, accessToken: string, refreshToken?: string): Promise<void>;
    private request;
    createSpreadsheet(userId: number, title: string, sheets?: any[]): Promise<any>;
    getSpreadsheet(userId: number, spreadsheetId: string, includeGridData?: boolean): Promise<any>;
    getSpreadsheetValues(userId: number, spreadsheetId: string, range: string): Promise<any>;
    updateSpreadsheetValues(userId: number, spreadsheetId: string, range: string, values: any[][], valueInputOption?: 'RAW' | 'USER_ENTERED'): Promise<any>;
    appendSpreadsheetValues(userId: number, spreadsheetId: string, range: string, values: any[][], valueInputOption?: 'RAW' | 'USER_ENTERED'): Promise<any>;
    clearSpreadsheetValues(userId: number, spreadsheetId: string, range: string): Promise<any>;
    batchGetValues(userId: number, spreadsheetId: string, ranges: string[]): Promise<any>;
    batchUpdateValues(userId: number, spreadsheetId: string, updates: BatchUpdate[], valueInputOption?: 'RAW' | 'USER_ENTERED'): Promise<any>;
    batchClearValues(userId: number, spreadsheetId: string, ranges: string[]): Promise<any>;
    addSheet(userId: number, spreadsheetId: string, title: string, index?: number): Promise<any>;
    deleteSheet(userId: number, spreadsheetId: string, sheetId: number): Promise<any>;
    duplicateSheet(userId: number, spreadsheetId: string, sourceSheetId: number, newSheetName: string, insertSheetIndex?: number): Promise<any>;
    updateSheetProperties(userId: number, spreadsheetId: string, sheetId: number, properties: any, fields: string): Promise<any>;
    batchUpdate(userId: number, spreadsheetId: string, requests: any[]): Promise<any>;
    mergeCells(userId: number, spreadsheetId: string, sheetId: number, startRow: number, endRow: number, startCol: number, endCol: number, mergeType?: 'MERGE_ALL' | 'MERGE_COLUMNS' | 'MERGE_ROWS'): Promise<any>;
    autoResizeDimensions(userId: number, spreadsheetId: string, sheetId: number, dimension: 'ROWS' | 'COLUMNS', startIndex: number, endIndex: number): Promise<any>;
    sortRange(userId: number, spreadsheetId: string, sheetId: number, startRow: number, endRow: number, startCol: number, endCol: number, sortSpecs: Array<{
        dimensionIndex: number;
        sortOrder: 'ASCENDING' | 'DESCENDING';
    }>): Promise<any>;
    setDataValidation(userId: number, spreadsheetId: string, sheetId: number, startRow: number, endRow: number, startCol: number, endCol: number, condition: any, strict?: boolean): Promise<any>;
    formatCells(userId: number, spreadsheetId: string, sheetId: number, startRow: number, endRow: number, startCol: number, endCol: number, format: any, fields: string): Promise<any>;
    columnToLetter(column: number): string;
    letterToColumn(letter: string): number;
    a1ToRowCol(a1: string): {
        row: number;
        col: number;
    };
    rowColToA1(row: number, col: number): string;
}
export declare const sheetsService: SheetsService;
export {};
