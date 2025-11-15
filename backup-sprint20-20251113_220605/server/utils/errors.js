/**
 * Standardized Error Handling (RFC 7807)
 * Provides consistent error responses across the application
 */
import { TRPCError } from '@trpc/server';
// Error codes enum
export var ErrorCodes;
(function (ErrorCodes) {
    // Authentication & Authorization
    ErrorCodes["AUTH_INVALID_CREDENTIALS"] = "AUTH_INVALID_CREDENTIALS";
    ErrorCodes["AUTH_TOKEN_EXPIRED"] = "AUTH_TOKEN_EXPIRED";
    ErrorCodes["AUTH_INSUFFICIENT_PERMISSIONS"] = "AUTH_INSUFFICIENT_PERMISSIONS";
    // Validation
    ErrorCodes["VALIDATION_INVALID_INPUT"] = "VALIDATION_INVALID_INPUT";
    ErrorCodes["VALIDATION_MISSING_FIELD"] = "VALIDATION_MISSING_FIELD";
    // Database
    ErrorCodes["DATABASE_CONNECTION_ERROR"] = "DATABASE_CONNECTION_ERROR";
    ErrorCodes["DATABASE_QUERY_ERROR"] = "DATABASE_QUERY_ERROR";
    ErrorCodes["DATABASE_CONSTRAINT_VIOLATION"] = "DATABASE_CONSTRAINT_VIOLATION";
    // Resource
    ErrorCodes["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
    ErrorCodes["RESOURCE_ALREADY_EXISTS"] = "RESOURCE_ALREADY_EXISTS";
    ErrorCodes["RESOURCE_CONFLICT"] = "RESOURCE_CONFLICT";
    // Internal
    ErrorCodes["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCodes["INTERNAL_DATABASE_ERROR"] = "INTERNAL_DATABASE_ERROR";
})(ErrorCodes || (ErrorCodes = {}));
// Create standardized error
export function createStandardError(httpStatus, code, message, metadata) {
    return new TRPCError({
        code: httpStatus,
        message,
        cause: {
            code,
            ...metadata,
        },
    });
}
// Not found error helper
export function notFoundError(resourceType, resourceId, suggestion) {
    return createStandardError('NOT_FOUND', ErrorCodes.RESOURCE_NOT_FOUND, `${resourceType} não encontrado`, {
        resourceType,
        resourceId,
        suggestion: suggestion || `Verifique se o ID ${resourceId} está correto`,
    });
}
// Forbidden error helper
export function forbiddenError(message, suggestion) {
    return createStandardError('FORBIDDEN', ErrorCodes.AUTH_INSUFFICIENT_PERMISSIONS, message, {
        suggestion: suggestion || 'Verifique suas permissões ou contate o administrador',
    });
}
// Validation error helper
export function validationError(field, message, suggestion) {
    return createStandardError('BAD_REQUEST', ErrorCodes.VALIDATION_INVALID_INPUT, message, {
        field,
        suggestion: suggestion || `Verifique o campo ${field}`,
    });
}
// Handle database errors
export function handleDatabaseError(error, metadata) {
    const err = error;
    // MySQL duplicate entry error
    if (err?.code === 'ER_DUP_ENTRY' || err?.errno === 1062) {
        return createStandardError('CONFLICT', ErrorCodes.DATABASE_CONSTRAINT_VIOLATION, 'Registro duplicado no banco de dados', {
            ...metadata,
            technicalMessage: err.message,
            suggestion: metadata?.suggestion || 'Este registro já existe',
        });
    }
    // MySQL foreign key constraint
    if (err?.code === 'ER_NO_REFERENCED_ROW' || err?.errno === 1452) {
        return createStandardError('BAD_REQUEST', ErrorCodes.DATABASE_CONSTRAINT_VIOLATION, 'Referência inválida no banco de dados', {
            ...metadata,
            technicalMessage: err.message,
            suggestion: metadata?.suggestion || 'Verifique se os registros relacionados existem',
        });
    }
    // Generic database error
    return createStandardError('INTERNAL_SERVER_ERROR', ErrorCodes.DATABASE_QUERY_ERROR, 'Erro ao acessar banco de dados', {
        ...metadata,
        technicalMessage: err?.message || 'Unknown database error',
        suggestion: metadata?.suggestion || 'Tente novamente ou contate o suporte',
    });
}
// Handle generic errors
export function handleGenericError(error, context) {
    const err = error;
    return createStandardError('INTERNAL_SERVER_ERROR', ErrorCodes.INTERNAL_SERVER_ERROR, context ? `Erro em ${context}` : 'Erro interno do servidor', {
        technicalMessage: err?.message || 'Unknown error',
        suggestion: 'Tente novamente ou contate o suporte',
    });
}
