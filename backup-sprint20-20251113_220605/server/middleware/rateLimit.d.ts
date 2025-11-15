/**
 * Rate Limiting - Previne sobrecarga e abuso
 */
interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
}
declare class RateLimiter {
    private requests;
    /**
     * Verifica se pode fazer requisição
     */
    check(key: string, config: RateLimitConfig): boolean;
    /**
     * Limpar requests antigos (executar periodicamente)
     */
    cleanup(maxAgeMs?: number): void;
    /**
     * Resetar limite para uma chave
     */
    reset(key: string): void;
    /**
     * Obter estatísticas
     */
    getStats(key: string, windowMs: number): {
        requests: number;
        oldestRequest: number | null;
    };
}
export declare const rateLimiter: RateLimiter;
export declare const rateLimitConfigs: {
    general: {
        windowMs: number;
        maxRequests: number;
        message: string;
    };
    create: {
        windowMs: number;
        maxRequests: number;
        message: string;
    };
    heavy: {
        windowMs: number;
        maxRequests: number;
        message: string;
    };
    auth: {
        windowMs: number;
        maxRequests: number;
        message: string;
    };
};
/**
 * Middleware tRPC para rate limiting
 */
export declare function createRateLimitMiddleware(config: RateLimitConfig): (opts: any) => Promise<any>;
/**
 * Wrapper para funções com rate limit
 */
export declare function withRateLimit<T>(key: string, config: RateLimitConfig, operation: () => Promise<T>): Promise<T>;
export {};
