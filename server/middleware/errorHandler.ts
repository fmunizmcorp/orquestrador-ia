/**
 * Error Handler Middleware - Tratamento global de erros
 */

import { TRPCError } from '@trpc/server';
import { db } from '../db/index.js';
import { executionLogs } from '../db/schema.js';

// Tipos de erro personalizados
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public metadata?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, metadata?: any) {
    super(message, 'VALIDATION_ERROR', 400, metadata);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string, id?: number | string) {
    super(
      id ? `${entity} com ID ${id} não encontrado` : `${entity} não encontrado`,
      'NOT_FOUND',
      404,
      { entity, id }
    );
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Não autorizado') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acesso negado') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string, metadata?: any) {
    super(message, 'CONFLICT', 409, metadata);
    this.name = 'ConflictError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, originalError?: any) {
    super(
      `Erro ao comunicar com serviço externo: ${service}`,
      'EXTERNAL_SERVICE_ERROR',
      503,
      { service, originalError: String(originalError) }
    );
    this.name = 'ExternalServiceError';
  }
}

/**
 * Converte erros conhecidos para TRPCError
 */
export function toTRPCError(error: any): TRPCError {
  // Já é TRPCError
  if (error instanceof TRPCError) {
    return error;
  }

  // AppError customizado
  if (error instanceof AppError) {
    let code: any = 'INTERNAL_SERVER_ERROR';
    
    switch (error.statusCode) {
      case 400:
        code = 'BAD_REQUEST';
        break;
      case 401:
        code = 'UNAUTHORIZED';
        break;
      case 403:
        code = 'FORBIDDEN';
        break;
      case 404:
        code = 'NOT_FOUND';
        break;
      case 409:
        code = 'CONFLICT';
        break;
      case 503:
        code = 'UNAVAILABLE';
        break;
    }

    return new TRPCError({
      code,
      message: error.message,
      cause: error.metadata,
    });
  }

  // Erros de banco de dados
  if (error.code === 'ER_DUP_ENTRY') {
    return new TRPCError({
      code: 'CONFLICT',
      message: 'Registro duplicado. Já existe um registro com esses dados.',
    });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Referência inválida. Verifique se todos os IDs relacionados existem.',
    });
  }

  // Erro genérico
  console.error('Erro não tratado:', error);
  
  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno do servidor. Tente novamente mais tarde.',
    cause: String(error),
  });
}

/**
 * Classe para gerenciar retry de operações
 */
export class RetryManager {
  constructor(
    private maxRetries: number = 3,
    private initialDelayMs: number = 1000,
    private maxDelayMs: number = 10000,
    private backoffMultiplier: number = 2
  ) {}

  async execute<T>(
    operation: () => Promise<T>,
    options?: {
      retryIf?: (error: any) => boolean;
      onRetry?: (attempt: number, error: any) => void;
    }
  ): Promise<T> {
    let lastError: any;
    let delay = this.initialDelayMs;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Verificar se deve fazer retry
        if (options?.retryIf && !options.retryIf(error)) {
          throw error;
        }

        // Última tentativa
        if (attempt === this.maxRetries) {
          throw error;
        }

        // Callback de retry
        if (options?.onRetry) {
          options.onRetry(attempt, error);
        }

        // Aguardar antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, delay));

        // Aumentar delay (exponential backoff)
        delay = Math.min(delay * this.backoffMultiplier, this.maxDelayMs);
      }
    }

    throw lastError;
  }
}

/**
 * Logger de erros para banco de dados
 */
export async function logError(
  error: any,
  context: {
    operation: string;
    taskId?: number;
    subtaskId?: number;
    userId?: number;
    metadata?: any;
  }
): Promise<void> {
  try {
    await db.insert(executionLogs).values({
      taskId: context.taskId || null,
      subtaskId: context.subtaskId || null,
      level: 'error',
      message: `[${context.operation}] ${error.message || String(error)}`,
      metadata: {
        ...context.metadata,
        errorName: error.name,
        errorStack: error.stack?.split('\n').slice(0, 5).join('\n'), // Primeiras 5 linhas
        userId: context.userId,
      },
    });
  } catch (logError) {
    // Se falhar ao logar, apenas console.error
    console.error('Falha ao logar erro:', logError);
    console.error('Erro original:', error);
  }
}

/**
 * Wrapper para operações com retry e logging automático
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: {
    name: string;
    taskId?: number;
    subtaskId?: number;
    userId?: number;
    retry?: boolean;
    retryOptions?: {
      maxRetries?: number;
      retryIf?: (error: any) => boolean;
    };
  }
): Promise<T> {
  try {
    if (context.retry) {
      const retryManager = new RetryManager(
        context.retryOptions?.maxRetries,
        1000,
        10000,
        2
      );

      return await retryManager.execute(operation, {
        retryIf: context.retryOptions?.retryIf,
        onRetry: (attempt, error) => {
          console.warn(`Retry ${attempt} para ${context.name}:`, error.message);
        },
      });
    }

    return await operation();
  } catch (error) {
    // Logar erro
    await logError(error, {
      operation: context.name,
      taskId: context.taskId,
      subtaskId: context.subtaskId,
      userId: context.userId,
    });

    // Converter para TRPCError
    throw toTRPCError(error);
  }
}

/**
 * Circuit Breaker - Previne sobrecarga de serviços com falhas
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5, // Falhas antes de abrir
    private timeout: number = 60000, // Tempo em aberto (ms)
    private name: string = 'CircuitBreaker'
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    // Se aberto, verificar se deve tentar novamente
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (this.lastFailureTime && now - this.lastFailureTime >= this.timeout) {
        this.state = 'HALF_OPEN';
        console.log(`${this.name}: Tentando recuperar (HALF_OPEN)`);
      } else {
        throw new ExternalServiceError(
          this.name,
          'Circuit breaker aberto (serviço indisponível)'
        );
      }
    }

    try {
      const result = await operation();

      // Sucesso - resetar ou fechar
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
        console.log(`${this.name}: Recuperado (CLOSED)`);
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      // Abrir se atingir threshold
      if (this.failureCount >= this.threshold) {
        this.state = 'OPEN';
        console.error(`${this.name}: Circuito aberto após ${this.failureCount} falhas`);
      }

      throw error;
    }
  }

  getState(): { state: string; failureCount: number } {
    return {
      state: this.state,
      failureCount: this.failureCount,
    };
  }

  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
  }
}
