/**
 * Rate Limiter Middleware
 * Protege contra abuso de endpoints
 */
import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number; // Janela de tempo em ms
  max: number; // Máximo de requisições
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private clients: Map<string, ClientRecord> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      message: 'Muitas requisições, tente novamente mais tarde',
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      ...config,
    };

    // Cleanup old entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  middleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const clientId = this.getClientId(req);
      const now = Date.now();

      let client = this.clients.get(clientId);

      // Create or reset client record
      if (!client || now > client.resetTime) {
        client = {
          count: 0,
          resetTime: now + this.config.windowMs,
        };
        this.clients.set(clientId, client);
      }

      // Increment count
      client.count++;

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', this.config.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.config.max - client.count));
      res.setHeader('X-RateLimit-Reset', new Date(client.resetTime).toISOString());

      // Check if limit exceeded
      if (client.count > this.config.max) {
        res.status(429).json({
          error: this.config.message,
          retryAfter: Math.ceil((client.resetTime - now) / 1000),
        });
        return;
      }

      // Handle response to optionally skip counting
      const originalSend = res.send.bind(res);
      res.send = function (body: any) {
        const statusCode = res.statusCode;

        if (
          (statusCode >= 200 && statusCode < 300 && this.config.skipSuccessfulRequests) ||
          (statusCode >= 400 && this.config.skipFailedRequests)
        ) {
          if (client) client.count--;
        }

        return originalSend(body);
      }.bind(this);

      next();
    };
  }

  private getClientId(req: Request): string {
    // Try to get real IP from various headers
    const forwarded = req.headers['x-forwarded-for'];
    const realIp = req.headers['x-real-ip'];
    
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    
    if (typeof realIp === 'string') {
      return realIp;
    }

    return req.ip || req.socket.remoteAddress || 'unknown';
  }

  private cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [clientId, client] of this.clients.entries()) {
      if (now > client.resetTime) {
        this.clients.delete(clientId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Rate Limiter: Cleaned up ${cleaned} expired client records`);
    }
  }

  // Get current status
  getStatus() {
    return {
      activeClients: this.clients.size,
      config: this.config,
    };
  }
}

// Pre-configured rate limiters for different use cases
export const strictLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15min
  message: 'Muitas requisições. Limite: 100 requisições por 15 minutos',
});

export const moderateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per 15min
  message: 'Muitas requisições. Limite: 500 requisições por 15 minutos',
});

export const relaxedLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per 15min
  message: 'Muitas requisições. Limite: 1000 requisições por 15 minutos',
});

export const authLimiter = new RateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: 'Muitas tentativas de autenticação. Tente novamente em 1 hora',
  skipSuccessfulRequests: true, // Don't count successful logins
});

export const apiLimiter = new RateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Limite de API excedido. Máximo: 60 requisições por minuto',
});

export { RateLimiter };
