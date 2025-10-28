import { initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import superjson from 'superjson';

/**
 * Contexto da aplicação
 */
export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  // Single-user: sempre userId = 1
  return {
    userId: 1,
    req,
    res,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Inicialização do tRPC
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Exports
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
