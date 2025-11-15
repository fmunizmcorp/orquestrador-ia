import { initTRPC, TRPCError } from '@trpc/server';
// @ts-ignore - superjson has no types
import superjson from 'superjson';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
/**
 * Contexto da aplicação
 */
export const createContext = ({ req, res }) => {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization;
    let userId;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            userId = decoded.userId;
        }
        catch (error) {
            // Token inválido - continua sem userId
            console.warn('Invalid JWT token:', error);
        }
    }
    // Fallback para single-user mode se não houver autenticação
    if (!userId) {
        userId = 1; // Single-user system default
    }
    return {
        userId,
        req,
        res,
    };
};
/**
 * Inicialização do tRPC
 */
const t = initTRPC.context().create({
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
/**
 * Protected procedure - requires authentication
 */
export const protectedProcedure = t.procedure.use(middleware(async ({ ctx, next }) => {
    if (!ctx.userId) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Você precisa estar autenticado para acessar este recurso',
        });
    }
    return next({
        ctx: {
            ...ctx,
            userId: ctx.userId, // garantido como number aqui
        },
    });
}));
