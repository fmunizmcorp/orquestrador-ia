/**
 * Error Handler Middleware - Tratamento global de erros
 */
import { TRPCError } from '@trpc/server';
export declare class AppError extends Error {
    message: string;
    code: string;
    statusCode: number;
    metadata?: any | undefined;
    constructor(message: string, code: string, statusCode?: number, metadata?: any | undefined);
}
export declare class ValidationError extends AppError {
    constructor(message: string, metadata?: any);
}
export declare class NotFoundError extends AppError {
    constructor(entity: string, id?: number | string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string, metadata?: any);
}
export declare class ExternalServiceError extends AppError {
    constructor(service: string, originalError?: any);
}
/**
 * Converte erros conhecidos para TRPCError
 */
export declare function toTRPCError(error: any): TRPCError;
/**
 * Classe para gerenciar retry de operações
 */
export declare class RetryManager {
    private maxRetries;
    private initialDelayMs;
    private maxDelayMs;
    private backoffMultiplier;
    constructor(maxRetries?: number, initialDelayMs?: number, maxDelayMs?: number, backoffMultiplier?: number);
    execute<T>(operation: () => Promise<T>, options?: {
        retryIf?: (error: any) => boolean;
        onRetry?: (attempt: number, error: any) => void;
    }): Promise<T>;
}
/**
 * Logger de erros para banco de dados
 */
export declare function logError(error: any, context: {
    operation: string;
    taskId?: number;
    subtaskId?: number;
    userId?: number;
    metadata?: any;
}): Promise<void>;
/**
 * Wrapper para operações com retry e logging automático
 */
export declare function withErrorHandling<T>(operation: () => Promise<T>, context: {
    name: string;
    taskId?: number;
    subtaskId?: number;
    userId?: number;
    retry?: boolean;
    retryOptions?: {
        maxRetries?: number;
        retryIf?: (error: any) => boolean;
    };
}): Promise<T>;
/**
 * Circuit Breaker - Previne sobrecarga de serviços com falhas
 */
export declare class CircuitBreaker {
    private threshold;
    private timeout;
    private name;
    private failureCount;
    private lastFailureTime;
    private state;
    constructor(threshold?: number, // Falhas antes de abrir
    timeout?: number, // Tempo em aberto (ms)
    name?: string);
    execute<T>(operation: () => Promise<T>): Promise<T>;
    getState(): {
        state: string;
        failureCount: number;
    };
    reset(): void;
}
