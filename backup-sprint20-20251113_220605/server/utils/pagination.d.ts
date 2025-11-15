/**
 * Pagination Utilities (Offset-based)
 * Provides consistent pagination across list endpoints
 */
import { z } from 'zod';
export declare const paginationInputSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
}, {
    limit?: number | undefined;
    offset?: number | undefined;
}>;
export declare const optionalPaginationInputSchema: z.ZodDefault<z.ZodOptional<z.ZodObject<{
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
}, {
    limit?: number | undefined;
    offset?: number | undefined;
}>>>;
export type PaginationInput = z.infer<typeof paginationInputSchema>;
export interface PaginationMetadata {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    totalPages: number;
    currentPage: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMetadata;
}
/**
 * Apply pagination parameters with defaults
 */
export declare function applyPagination(input: {
    limit?: number;
    offset?: number;
}): {
    limit: number;
    offset: number;
};
/**
 * Create paginated response with metadata
 */
export declare function createPaginatedResponse<T>(data: T[], total: number, input: {
    limit?: number;
    offset?: number;
}): PaginatedResponse<T>;
/**
 * Calculate offset from page number
 */
export declare function pageToOffset(page: number, limit: number): number;
/**
 * Calculate page number from offset
 */
export declare function offsetToPage(offset: number, limit: number): number;
