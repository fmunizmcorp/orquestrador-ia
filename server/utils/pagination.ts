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

export type PaginationInput = z.infer<typeof paginationInputSchema>;

// Pagination metadata interface
export interface PaginationMetadata {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  totalPages: number;
  currentPage: number;
}

// Paginated response interface
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

/**
 * Apply pagination parameters with defaults
 */
export function applyPagination(input: { limit?: number; offset?: number }) {
  return {
    limit: input.limit || 50,
    offset: input.offset || 0,
  };
}

/**
 * Create paginated response with metadata
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  input: { limit?: number; offset?: number }
): PaginatedResponse<T> {
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
export function pageToOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Calculate page number from offset
 */
export function offsetToPage(offset: number, limit: number): number {
  return Math.floor(offset / limit) + 1;
}
