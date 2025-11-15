/**
 * Rate Limiter Middleware
 * Protege contra abuso de endpoints
 */
import { Request, Response, NextFunction } from 'express';
interface RateLimitConfig {
    windowMs: number;
    max: number;
    message?: string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
}
declare class RateLimiter {
    private clients;
    private config;
    constructor(config: RateLimitConfig);
    middleware(): (req: Request, res: Response, next: NextFunction) => void;
    private getClientId;
    private cleanup;
    getStatus(): {
        activeClients: number;
        config: RateLimitConfig;
    };
}
export declare const strictLimiter: RateLimiter;
export declare const moderateLimiter: RateLimiter;
export declare const relaxedLimiter: RateLimiter;
export declare const authLimiter: RateLimiter;
export declare const apiLimiter: RateLimiter;
export { RateLimiter };
