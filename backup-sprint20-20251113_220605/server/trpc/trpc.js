/**
 * tRPC Configuration
 * Base setup for type-safe API
 */
import { initTRPC } from '@trpc/server';
import pino from 'pino';
import { env, isDevelopment } from '../config/env.js';
const logger = pino({ level: env.LOG_LEVEL, transport: isDevelopment ? { target: 'pino-pretty' } : undefined });
const t = initTRPC.context().create();
/**
 * Logging middleware for all tRPC calls
 */
const loggingMiddleware = t.middleware(async ({ path, type, next, rawInput }) => {
    const start = Date.now();
    logger.info({
        type,
        path,
        input: rawInput,
    }, `[tRPC] ${type.toUpperCase()} ${path} - Started`);
    try {
        const result = await next();
        const duration = Date.now() - start;
        logger.info({
            type,
            path,
            duration,
            success: true,
        }, `[tRPC] ${type.toUpperCase()} ${path} - Success (${duration}ms)`);
        return result;
    }
    catch (error) {
        const duration = Date.now() - start;
        logger.error({
            type,
            path,
            duration,
            error: error.message,
            stack: error.stack,
        }, `[tRPC] ${type.toUpperCase()} ${path} - Error (${duration}ms)`);
        throw error;
    }
});
/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure.use(loggingMiddleware);
export const middleware = t.middleware;
/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(middleware(async ({ ctx, next }) => {
    if (!ctx.userId) {
        throw new Error('Not authenticated');
    }
    return next({
        ctx: {
            ...ctx,
            userId: ctx.userId,
        },
    });
}));
