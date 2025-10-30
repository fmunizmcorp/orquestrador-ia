/**
 * Google Sheets Router
 * tRPC endpoints for Google Sheets integration
 */
import { router, publicProcedure } from '../trpc.js';
import { sheetsService } from '../services/integrations/sheetsService.js';
import { z } from 'zod';

export const sheetsRouter = router({
  // Credentials
  saveToken: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      accessToken: z.string().min(1),
      refreshToken: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await sheetsService.saveToken(input.userId, input.accessToken, input.refreshToken);
      return { success: true, message: 'Google Sheets token saved successfully' };
    }),

  // Spreadsheet operations
  createSpreadsheet: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      title: z.string().min(1),
      sheets: z.array(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.createSpreadsheet(input.userId, input.title, input.sheets);
    }),

  getSpreadsheet: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      includeGridData: z.boolean().default(false),
    }))
    .query(async ({ input }) => {
      return sheetsService.getSpreadsheet(input.userId, input.spreadsheetId, input.includeGridData);
    }),

  getSpreadsheetValues: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      range: z.string().min(1),
    }))
    .query(async ({ input }) => {
      return sheetsService.getSpreadsheetValues(input.userId, input.spreadsheetId, input.range);
    }),

  updateSpreadsheetValues: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      range: z.string().min(1),
      values: z.array(z.array(z.any())),
      valueInputOption: z.enum(['RAW', 'USER_ENTERED']).default('USER_ENTERED'),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.updateSpreadsheetValues(
        input.userId,
        input.spreadsheetId,
        input.range,
        input.values,
        input.valueInputOption
      );
    }),

  appendSpreadsheetValues: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      range: z.string().min(1),
      values: z.array(z.array(z.any())),
      valueInputOption: z.enum(['RAW', 'USER_ENTERED']).default('USER_ENTERED'),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.appendSpreadsheetValues(
        input.userId,
        input.spreadsheetId,
        input.range,
        input.values,
        input.valueInputOption
      );
    }),

  clearSpreadsheetValues: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      range: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.clearSpreadsheetValues(input.userId, input.spreadsheetId, input.range);
    }),

  batchGetValues: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      ranges: z.array(z.string()),
    }))
    .query(async ({ input }) => {
      return sheetsService.batchGetValues(input.userId, input.spreadsheetId, input.ranges);
    }),

  batchUpdateValues: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      updates: z.array(z.object({
        range: z.string(),
        values: z.array(z.array(z.any())),
      })),
      valueInputOption: z.enum(['RAW', 'USER_ENTERED']).default('USER_ENTERED'),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.batchUpdateValues(
        input.userId,
        input.spreadsheetId,
        input.updates,
        input.valueInputOption
      );
    }),

  batchClearValues: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      ranges: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.batchClearValues(input.userId, input.spreadsheetId, input.ranges);
    }),

  // Sheet operations
  addSheet: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      title: z.string().min(1),
      index: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.addSheet(input.userId, input.spreadsheetId, input.title, input.index);
    }),

  deleteSheet: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      sheetId: z.number(),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.deleteSheet(input.userId, input.spreadsheetId, input.sheetId);
    }),

  duplicateSheet: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      sourceSheetId: z.number(),
      newSheetName: z.string().min(1),
      insertSheetIndex: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.duplicateSheet(
        input.userId,
        input.spreadsheetId,
        input.sourceSheetId,
        input.newSheetName,
        input.insertSheetIndex
      );
    }),

  updateSheetProperties: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      sheetId: z.number(),
      properties: z.record(z.any()),
      fields: z.string(),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.updateSheetProperties(
        input.userId,
        input.spreadsheetId,
        input.sheetId,
        input.properties,
        input.fields
      );
    }),

  // Advanced operations
  batchUpdate: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      requests: z.array(z.any()),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.batchUpdate(input.userId, input.spreadsheetId, input.requests);
    }),

  mergeCells: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      sheetId: z.number(),
      startRow: z.number(),
      endRow: z.number(),
      startCol: z.number(),
      endCol: z.number(),
      mergeType: z.enum(['MERGE_ALL', 'MERGE_COLUMNS', 'MERGE_ROWS']).default('MERGE_ALL'),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.mergeCells(
        input.userId,
        input.spreadsheetId,
        input.sheetId,
        input.startRow,
        input.endRow,
        input.startCol,
        input.endCol,
        input.mergeType
      );
    }),

  autoResizeDimensions: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      sheetId: z.number(),
      dimension: z.enum(['ROWS', 'COLUMNS']),
      startIndex: z.number(),
      endIndex: z.number(),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.autoResizeDimensions(
        input.userId,
        input.spreadsheetId,
        input.sheetId,
        input.dimension,
        input.startIndex,
        input.endIndex
      );
    }),

  sortRange: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      sheetId: z.number(),
      startRow: z.number(),
      endRow: z.number(),
      startCol: z.number(),
      endCol: z.number(),
      sortSpecs: z.array(z.object({
        dimensionIndex: z.number(),
        sortOrder: z.enum(['ASCENDING', 'DESCENDING']),
      })),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.sortRange(
        input.userId,
        input.spreadsheetId,
        input.sheetId,
        input.startRow,
        input.endRow,
        input.startCol,
        input.endCol,
        input.sortSpecs
      );
    }),

  setDataValidation: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      sheetId: z.number(),
      startRow: z.number(),
      endRow: z.number(),
      startCol: z.number(),
      endCol: z.number(),
      condition: z.any(),
      strict: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.setDataValidation(
        input.userId,
        input.spreadsheetId,
        input.sheetId,
        input.startRow,
        input.endRow,
        input.startCol,
        input.endCol,
        input.condition,
        input.strict
      );
    }),

  formatCells: publicProcedure
    .input(z.object({
      userId: z.number().positive().default(1),
      spreadsheetId: z.string().min(1),
      sheetId: z.number(),
      startRow: z.number(),
      endRow: z.number(),
      startCol: z.number(),
      endCol: z.number(),
      format: z.any(),
      fields: z.string(),
    }))
    .mutation(async ({ input }) => {
      return sheetsService.formatCells(
        input.userId,
        input.spreadsheetId,
        input.sheetId,
        input.startRow,
        input.endRow,
        input.startCol,
        input.endCol,
        input.format,
        input.fields
      );
    }),

  // Helper methods
  columnToLetter: publicProcedure
    .input(z.object({
      column: z.number().positive(),
    }))
    .query(({ input }) => {
      return { letter: sheetsService.columnToLetter(input.column) };
    }),

  letterToColumn: publicProcedure
    .input(z.object({
      letter: z.string().min(1),
    }))
    .query(({ input }) => {
      return { column: sheetsService.letterToColumn(input.letter) };
    }),

  a1ToRowCol: publicProcedure
    .input(z.object({
      a1: z.string().min(1),
    }))
    .query(({ input }) => {
      return sheetsService.a1ToRowCol(input.a1);
    }),

  rowColToA1: publicProcedure
    .input(z.object({
      row: z.number().positive(),
      col: z.number().positive(),
    }))
    .query(({ input }) => {
      return { a1: sheetsService.rowColToA1(input.row, input.col) };
    }),
});
