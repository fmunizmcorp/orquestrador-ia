/**
 * Pagination Utilities (Offset-based)
 * Provides consistent pagination across list endpoints
 */
import { z } from 'zod';
// Pagination input schema
export const paginationInputSchema = z.object({
    limit: z.number().min(1).max(100).optional().default(50),
    offset: z.number().min(0).optional().default(0),
});
// Pagination input schema that allows empty object
export const optionalPaginationInputSchema = z.object({
    limit: z.number().min(1).max(100).optional().default(50),
    offset: z.number().min(0).optional().default(0),
}).optional().default({ limit: 50, offset: 0 });
/**
 * Apply pagination parameters with defaults
 */
export function applyPagination(input) {
    return {
        limit: input.limit || 50,
        offset: input.offset || 0,
    };
}
/**
 * Create paginated response with metadata
 */
export function createPaginatedResponse(data, total, input) {
    const { limit, offset } = applyPagination(input);
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const hasMore = offset + limit < total;
    return {
        data,
        pagination: {
            total,
            limit,
            offset,
            hasMore,
            totalPages,
            currentPage,
        },
    };
}
/**
 * Calculate offset from page number
 */
export function pageToOffset(page, limit) {
    return (page - 1) * limit;
}
/**
 * Calculate page number from offset
 */
export function offsetToPage(offset, limit) {
    return Math.floor(offset / limit) + 1;
}
