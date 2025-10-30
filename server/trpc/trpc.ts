/**
 * tRPC Configuration
 * Base setup for type-safe API
 */

import { initTRPC } from '@trpc/server';
import { z } from 'zod';

/**
 * Context creation for tRPC
 * Can include user info, DB connection, etc.
 */
export interface Context {
  userId?: number;
  db?: any;
}

const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(
  middleware(async ({ ctx, next }) => {
    if (!ctx.userId) {
      throw new Error('Not authenticated');
    }
    return next({
      ctx: {
        ...ctx,
        userId: ctx.userId,
      },
    });
  })
);
