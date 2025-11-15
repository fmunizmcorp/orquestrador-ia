/**
 * Standardized Error Handling (RFC 7807)
 * Provides consistent error responses across the application
 */
import { TRPCError } from '@trpc/server';
export declare enum ErrorCodes {
    AUTH_INVALID_CREDENTIALS = "AUTH_INVALID_CREDENTIALS",
    AUTH_TOKEN_EXPIRED = "AUTH_TOKEN_EXPIRED",
    AUTH_INSUFFICIENT_PERMISSIONS = "AUTH_INSUFFICIENT_PERMISSIONS",
    VALIDATION_INVALID_INPUT = "VALIDATION_INVALID_INPUT",
    VALIDATION_MISSING_FIELD = "VALIDATION_MISSING_FIELD",
    DATABASE_CONNECTION_ERROR = "DATABASE_CONNECTION_ERROR",
    DATABASE_QUERY_ERROR = "DATABASE_QUERY_ERROR",
    DATABASE_CONSTRAINT_VIOLATION = "DATABASE_CONSTRAINT_VIOLATION",
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
    RESOURCE_ALREADY_EXISTS = "RESOURCE_ALREADY_EXISTS",
    RESOURCE_CONFLICT = "RESOURCE_CONFLICT",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    INTERNAL_DATABASE_ERROR = "INTERNAL_DATABASE_ERROR"
}
export interface ErrorMetadata {
    code?: ErrorCodes;
    field?: string;
    resourceType?: string;
    resourceId?: number | string;
    context?: Record<string, any>;
    technicalMessage?: string;
    suggestion?: string;
}
export declare function createStandardError(httpStatus: 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'INTERNAL_SERVER_ERROR', code: ErrorCodes, message: string, metadata?: ErrorMetadata): TRPCError;
export declare function notFoundError(resourceType: string, resourceId: number | string, suggestion?: string): TRPCError;
export declare function forbiddenError(message: string, suggestion?: string): TRPCError;
export declare function validationError(field: string, message: string, suggestion?: string): TRPCError;
export declare function handleDatabaseError(error: unknown, metadata?: ErrorMetadata): TRPCError;
export declare function handleGenericError(error: unknown, context?: string): TRPCError;
