/**
 * Response Helpers - Respostas padronizadas para API
 */
/**
 * Resposta de sucesso
 */
export declare function success<T>(data: T, message?: string): {
    success: boolean;
    data: T;
    message: string | undefined;
    timestamp: string;
};
/**
 * Resposta de sucesso para criação
 */
export declare function created<T>(data: T, message?: string): {
    success: boolean;
    data: T;
    message: string;
    timestamp: string;
};
/**
 * Resposta de sucesso para atualização
 */
export declare function updated<T>(data: T, message?: string): {
    success: boolean;
    data: T;
    message: string;
    timestamp: string;
};
/**
 * Resposta de sucesso para deleção
 */
export declare function deleted(message?: string): {
    success: boolean;
    message: string;
    timestamp: string;
};
/**
 * Resposta paginada
 */
export declare function paginated<T>(items: T[], total: number, page: number, limit: number): {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrevious: boolean;
    };
    timestamp: string;
};
/**
 * Resposta de lista
 */
export declare function list<T>(items: T[], total?: number): {
    success: boolean;
    data: T[];
    total: number;
    timestamp: string;
};
/**
 * Resposta de item único
 */
export declare function single<T>(item: T | null, notFoundMessage?: string): {
    success: boolean;
    data: null;
    message: string;
    timestamp: string;
} | {
    success: boolean;
    data: NonNullable<T>;
    timestamp: string;
    message?: undefined;
};
/**
 * Resposta de progresso (para operações longas)
 */
export declare function progress(current: number, total: number, message?: string): {
    success: boolean;
    progress: {
        current: number;
        total: number;
        percentage: number;
        message: string | undefined;
    };
    timestamp: string;
};
/**
 * Resposta de validação (múltiplos erros)
 */
export declare function validationError(errors: Record<string, string[]>): {
    success: boolean;
    errors: Record<string, string[]>;
    message: string;
    timestamp: string;
};
/**
 * Formata número com casas decimais
 */
export declare function formatNumber(value: number, decimals?: number): string;
/**
 * Formata tamanho de arquivo
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Formata duração em milissegundos
 */
export declare function formatDuration(ms: number): string;
/**
 * Estatísticas genéricas
 */
export declare function stats(data: Record<string, any>): {
    success: boolean;
    stats: Record<string, any>;
    timestamp: string;
};
