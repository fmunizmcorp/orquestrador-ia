import { z } from 'zod';

/**
 * Validações comuns
 */

export const idSchema = z.number().int().positive();

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const searchSchema = z.object({
  query: z.string().optional(),
  ...paginationSchema.shape,
});

/**
 * Schemas para validação de entidades
 */

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
  data: z.any(), // Será criptografado
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
});

export const createSubtaskSchema = z.object({
  taskId: idSchema,
  assignedModelId: idSchema.optional(),
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  prompt: z.string().min(1),
});

export const updateSubtaskSchema = z.object({
  id: idSchema,
  title: z.string().min(1).max(500).optional(),
  description: z.string().optional(),
  prompt: z.string().min(1).optional(),
  result: z.string().optional(),
  status: z.enum(['pending', 'executing', 'completed', 'failed', 'validating', 'rejected']).optional(),
  reviewedBy: idSchema.optional(),
  reviewNotes: z.string().optional(),
});

export const createTemplateSchema = z.object({
  userId: idSchema.default(1),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.string().max(100).optional(),
  templateData: z.any(),
  isPublic: z.boolean().default(false),
});

export const updateTemplateSchema = createTemplateSchema.partial().extend({
  id: idSchema,
});

export const createWorkflowSchema = z.object({
  userId: idSchema.default(1),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  steps: z.any(),
  isActive: z.boolean().default(true),
});

export const updateWorkflowSchema = createWorkflowSchema.partial().extend({
  id: idSchema,
});

export const createInstructionSchema = z.object({
  userId: idSchema.default(1),
  aiId: idSchema.optional(),
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  priority: z.number().int().min(0).max(100).default(50),
  isActive: z.boolean().default(true),
});

export const updateInstructionSchema = createInstructionSchema.partial().extend({
  id: idSchema,
});

export const createKnowledgeBaseSchema = z.object({
  userId: idSchema.default(1),
  title: z.string().min(1).max(500),
  content: z.string().min(1),
  category: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export const updateKnowledgeBaseSchema = createKnowledgeBaseSchema.partial().extend({
  id: idSchema,
});

export const createKnowledgeSourceSchema = z.object({
  knowledgeBaseId: idSchema,
  sourceType: z.string().max(50).optional(),
  sourceUrl: z.string().max(1000).optional(),
  sourceData: z.any().optional(),
});

export const updateKnowledgeSourceSchema = createKnowledgeSourceSchema.partial().extend({
  id: idSchema,
});

export const createExternalAPIAccountSchema = z.object({
  userId: idSchema.default(1),
  provider: z.string().min(1).max(100),
  accountName: z.string().min(1).max(255),
  credentialId: idSchema.optional(),
  creditBalance: z.number().default(0),
  creditLimit: z.number().optional(),
  alertThreshold: z.number().optional(),
  isActive: z.boolean().default(true),
});

export const updateExternalAPIAccountSchema = createExternalAPIAccountSchema.partial().extend({
  id: idSchema,
});

export const createChatConversationSchema = z.object({
  userId: idSchema.default(1),
  title: z.string().max(500).optional(),
  aiId: idSchema.optional(),
  modelId: idSchema.optional(),
  isActive: z.boolean().default(true),
  metadata: z.any().optional(),
});

export const createChatMessageSchema = z.object({
  conversationId: idSchema,
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  attachments: z.any().optional(),
  metadata: z.any().optional(),
});
