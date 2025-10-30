/**
 * Validation Helpers - Validações reutilizáveis
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

// ========================================
// ZOD SCHEMAS (compatibilidade com routers existentes)
// ========================================

export const idSchema = z.number().int().positive();

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  ...paginationSchema.shape,
});

export const createProviderSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['local', 'api']),
  endpoint: z.string().url().max(500),
  apiKey: z.string().optional(),
  config: z.any().optional(),
  isActive: z.boolean().default(true),
});

export const updateProviderSchema = createProviderSchema.partial().extend({
  id: idSchema,
});

export const createModelSchema = z.object({
  providerId: idSchema,
  name: z.string().min(1).max(255),
  modelId: z.string().min(1).max(255),
  capabilities: z.array(z.string()).optional(),
  contextWindow: z.number().int().positive().default(4096),
  priority: z.number().int().min(0).max(100).default(50),
  modelPath: z.string().max(500).optional(),
  quantization: z.string().max(50).optional(),
  parameters: z.string().max(50).optional(),
  sizeBytes: z.number().int().optional(),
  isActive: z.boolean().default(true),
});

export const updateModelSchema = createModelSchema.partial().extend({
  id: idSchema,
});

export const createSpecializedAISchema = z.object({
  userId: idSchema.default(1),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  defaultModelId: idSchema.optional(),
  fallbackModelIds: z.array(idSchema).optional(),
  systemPrompt: z.string().min(1),
  capabilities: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export const updateSpecializedAISchema = createSpecializedAISchema.partial().extend({
  id: idSchema,
});

export const createCredentialSchema = z.object({
  userId: idSchema.default(1),
  service: z.string().min(1).max(100),
  credentialType: z.string().max(50).optional(),
  data: z.any(),
  metadata: z.any().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional(),
});

export const updateCredentialSchema = createCredentialSchema.partial().extend({
  id: idSchema,
});

export const createTaskSchema = z.object({
  userId: idSchema.default(1),
  title: z.string().min(1).max(500),
  description: z.string().min(1),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
});

export const updateTaskSchema = z.object({
  id: idSchema,
  title: z.string().min(1).max(500).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(['pending', 'planning', 'executing', 'validating', 'completed', 'failed', 'paused']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  completedAt: z.date().optional(),
});

export const createSubtaskSchema = z.object({
  taskId: idSchema,
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  prompt: z.string().min(1),
  assignedModelId: idSchema.optional(),
  status: z.enum(['pending', 'executing', 'validating', 'completed', 'failed', 'rejected']).default('pending'),
});

export const updateSubtaskSchema = createSubtaskSchema.partial().extend({
  id: idSchema,
  completedAt: z.date().optional(),
});

// Chat schemas
export const createChatConversationSchema = z.object({
  userId: idSchema.default(1),
  title: z.string().min(1).max(500).optional(),
  metadata: z.any().optional(),
});

export const createChatMessageSchema = z.object({
  conversationId: idSchema,
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  metadata: z.any().optional(),
});

// External API Account schemas
export const createExternalAPIAccountSchema = z.object({
  userId: idSchema.default(1),
  service: z.string().min(1).max(100),
  accountIdentifier: z.string().min(1).max(255),
  credentialId: idSchema,
  isActive: z.boolean().default(true),
  metadata: z.any().optional(),
});

export const updateExternalAPIAccountSchema = createExternalAPIAccountSchema.partial().extend({
  id: idSchema,
});

// Instruction schemas
export const createInstructionSchema = z.object({
  userId: idSchema.default(1),
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  instructionText: z.string().min(1),
  usageCount: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const updateInstructionSchema = createInstructionSchema.partial().extend({
  id: idSchema,
});

// Knowledge Base schemas
export const createKnowledgeBaseSchema = z.object({
  userId: idSchema.default(1),
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateKnowledgeBaseSchema = createKnowledgeBaseSchema.partial().extend({
  id: idSchema,
});

// Knowledge Source schemas
export const createKnowledgeSourceSchema = z.object({
  knowledgeBaseId: idSchema,
  sourceType: z.enum(['text', 'file', 'url', 'api']),
  content: z.string().optional(),
  url: z.string().url().optional(),
  metadata: z.any().optional(),
  isActive: z.boolean().default(true),
});

export const updateKnowledgeSourceSchema = createKnowledgeSourceSchema.partial().extend({
  id: idSchema,
});

// Template schemas
export const createTemplateSchema = z.object({
  userId: idSchema.default(1),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  templateData: z.any(),
  isPublic: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const updateTemplateSchema = createTemplateSchema.partial().extend({
  id: idSchema,
});

// Workflow schemas
export const createWorkflowSchema = z.object({
  userId: idSchema.default(1),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  steps: z.array(z.any()),
  isActive: z.boolean().default(true),
});

export const updateWorkflowSchema = createWorkflowSchema.partial().extend({
  id: idSchema,
});

// ========================================
// VALIDATION HELPERS (funções auxiliares)
// ========================================

/**
 * Valida se um ID é válido (número positivo)
 */
export function validateId(id: any, fieldName: string = 'ID'): number {
  const parsed = parseInt(id);
  
  if (isNaN(parsed) || parsed <= 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} inválido. Deve ser um número positivo.`,
    });
  }
  
  return parsed;
}

/**
 * Valida se uma string não está vazia
 */
export function validateNonEmpty(value: any, fieldName: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} é obrigatório e não pode estar vazio.`,
    });
  }
  
  return value.trim();
}

/**
 * Valida comprimento mínimo de string
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): string {
  if (value.length < minLength) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} deve ter no mínimo ${minLength} caracteres.`,
    });
  }
  
  return value;
}

/**
 * Valida comprimento máximo de string
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): string {
  if (value.length > maxLength) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} deve ter no máximo ${maxLength} caracteres.`,
    });
  }
  
  return value;
}

/**
 * Valida enum (valor dentro de lista permitida)
 */
export function validateEnum<T extends string>(
  value: any,
  allowedValues: T[],
  fieldName: string
): T {
  if (!allowedValues.includes(value)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} inválido. Valores permitidos: ${allowedValues.join(', ')}`,
    });
  }
  
  return value as T;
}

/**
 * Valida se um array não está vazio
 */
export function validateNonEmptyArray<T>(value: any, fieldName: string): T[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} deve ser um array com pelo menos um elemento.`,
    });
  }
  
  return value;
}

/**
 * Valida se um número está dentro de um intervalo
 */
export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): number {
  if (value < min || value > max) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} deve estar entre ${min} e ${max}.`,
    });
  }
  
  return value;
}

/**
 * Valida se um objeto JSON é válido
 */
export function validateJSON(value: any, fieldName: string): object {
  try {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    
    if (typeof value === 'object' && value !== null) {
      return value;
    }
    
    throw new Error('Não é um objeto JSON válido');
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} deve ser um objeto JSON válido.`,
    });
  }
}

/**
 * Valida se uma URL é válida
 */
export function validateURL(value: string, fieldName: string): string {
  try {
    new URL(value);
    return value;
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} deve ser uma URL válida.`,
    });
  }
}

/**
 * Valida se um email é válido
 */
export function validateEmail(value: string, fieldName: string): string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(value)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} deve ser um email válido.`,
    });
  }
  
  return value;
}

/**
 * Valida se uma data é válida
 */
export function validateDate(value: any, fieldName: string): Date {
  const date = new Date(value);
  
  if (isNaN(date.getTime())) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} deve ser uma data válida.`,
    });
  }
  
  return date;
}

/**
 * Valida se uma data está no futuro
 */
export function validateFutureDate(value: any, fieldName: string): Date {
  const date = validateDate(value, fieldName);
  
  if (date <= new Date()) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `${fieldName} deve ser uma data futura.`,
    });
  }
  
  return date;
}

/**
 * Wrapper para tratamento de erros de banco
 */
export function handleDatabaseError(error: any, operation: string): never {
  console.error(`Erro na operação ${operation}:`, error);
  
  // Erro de duplicata (chave única)
  if (error.code === 'ER_DUP_ENTRY' || error.code === '23000') {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Já existe um registro com esses dados.',
    });
  }
  
  // Erro de chave estrangeira
  if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === '23000') {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Referência inválida. Verifique se todos os IDs relacionados existem.',
    });
  }
  
  // Erro genérico
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: `Erro ao executar ${operation}. Tente novamente.`,
  });
}

/**
 * Verifica se um registro existe
 */
export function ensureExists<T>(
  record: T | undefined | null,
  entityName: string
): T {
  if (!record) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `${entityName} não encontrado(a).`,
    });
  }
  
  return record;
}

/**
 * Sanitiza string HTML (previne XSS)
 */
export function sanitizeHTML(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida paginação
 */
export function validatePagination(page?: number, limit?: number): {
  page: number;
  limit: number;
  offset: number;
} {
  const validPage = Math.max(1, page || 1);
  const validLimit = Math.min(Math.max(1, limit || 20), 100); // Max 100
  const offset = (validPage - 1) * validLimit;
  
  return {
    page: validPage,
    limit: validLimit,
    offset,
  };
}
