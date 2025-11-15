/**
 * Rate Limiting - Previne sobrecarga e abuso
 */
import { TRPCError } from '@trpc/server';
class RateLimiter {
    constructor() {
        Object.defineProperty(this, "requests", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    /**
     * Verifica se pode fazer requisição
     */
    check(key, config) {
        const now = Date.now();
        const windowStart = now - config.windowMs;
        // Buscar requests dentro da janela
        let timestamps = this.requests.get(key) || [];
        // Remover timestamps fora da janela
        timestamps = timestamps.filter(t => t > windowStart);
        // Verificar limite
        if (timestamps.length >= config.maxRequests) {
            return false;
        }
        // Adicionar novo timestamp
        timestamps.push(now);
        this.requests.set(key, timestamps);
        return true;
    }
    /**
     * Limpar requests antigos (executar periodicamente)
     */
    cleanup(maxAgeMs = 3600000) {
        const now = Date.now();
        const cutoff = now - maxAgeMs;
        for (const [key, timestamps] of this.requests.entries()) {
            const filtered = timestamps.filter(t => t > cutoff);
            if (filtered.length === 0) {
                this.requests.delete(key);
            }
            else {
                this.requests.set(key, filtered);
            }
        }
    }
    /**
     * Resetar limite para uma chave
     */
    reset(key) {
        this.requests.delete(key);
    }
    /**
     * Obter estatísticas
     */
    getStats(key, windowMs) {
        const now = Date.now();
        const windowStart = now - windowMs;
        const timestamps = (this.requests.get(key) || []).filter(t => t > windowStart);
        return {
            requests: timestamps.length,
            oldestRequest: timestamps.length > 0 ? timestamps[0] : null,
        };
    }
}
// Instância global
export const rateLimiter = new RateLimiter();
// Configurações pré-definidas
export const rateLimitConfigs = {
    // Requisições gerais
    general: {
        windowMs: 60000, // 1 minuto
        maxRequests: 60, // 60 req/min
        message: 'Muitas requisições. Aguarde um momento.',
    },
    // Criação de recursos
    create: {
        windowMs: 60000,
        maxRequests: 10,
        message: 'Muitas criações. Aguarde antes de criar mais.',
    },
    // Operações pesadas (AI, processamento)
    heavy: {
        windowMs: 300000, // 5 minutos
        maxRequests: 20,
        message: 'Limite de operações pesadas atingido. Aguarde alguns minutos.',
    },
    // Autenticação
    auth: {
        windowMs: 900000, // 15 minutos
        maxRequests: 5,
        message: 'Muitas tentativas de autenticação. Aguarde 15 minutos.',
    },
};
/**
 * Middleware tRPC para rate limiting
 */
export function createRateLimitMiddleware(config) {
    return async (opts) => {
        const { ctx, next } = opts;
        // Chave única (pode usar IP, userId, etc)
        const key = ctx.userId ? `user:${ctx.userId}` : `ip:${ctx.ip || 'unknown'}`;
        // Verificar limite
        if (!rateLimiter.check(key, config)) {
            throw new TRPCError({
                code: 'TOO_MANY_REQUESTS',
                message: config.message || 'Muitas requisições',
            });
        }
        return next();
    };
}
/**
 * Wrapper para funções com rate limit
 */
export async function withRateLimit(key, config, operation) {
    if (!rateLimiter.check(key, config)) {
        throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: config.message || 'Muitas requisições',
        });
    }
    return operation();
}
// Limpar rate limits periodicamente (a cada 1 hora)
setInterval(() => {
    rateLimiter.cleanup();
    console.log('🧹 Rate limits limpos');
}, 3600000);
