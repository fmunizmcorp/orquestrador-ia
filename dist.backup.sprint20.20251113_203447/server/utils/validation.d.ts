/**
 * Validation Helpers - Validações reutilizáveis
 */
import { z } from 'zod';
export declare const idSchema: z.ZodNumber;
export declare const paginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
}, {
    limit?: number | undefined;
    page?: number | undefined;
}>;
export declare const searchSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    query: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    query?: string | undefined;
}, {
    query?: string | undefined;
    limit?: number | undefined;
    page?: number | undefined;
}>;
export declare const createProviderSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<["local", "api"]>;
    endpoint: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
    config: z.ZodOptional<z.ZodAny>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "local" | "api";
    name: string;
    endpoint: string;
    isActive: boolean;
    apiKey?: string | undefined;
    config?: any;
}, {
    type: "local" | "api";
    name: string;
    endpoint: string;
    apiKey?: string | undefined;
    isActive?: boolean | undefined;
    config?: any;
}>;
export declare const updateProviderSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["local", "api"]>>;
    endpoint: z.ZodOptional<z.ZodString>;
    apiKey: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    config: z.ZodOptional<z.ZodOptional<z.ZodAny>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
} & {
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    type?: "local" | "api" | undefined;
    name?: string | undefined;
    endpoint?: string | undefined;
    apiKey?: string | undefined;
    isActive?: boolean | undefined;
    config?: any;
}, {
    id: number;
    type?: "local" | "api" | undefined;
    name?: string | undefined;
    endpoint?: string | undefined;
    apiKey?: string | undefined;
    isActive?: boolean | undefined;
    config?: any;
}>;
export declare const createModelSchema: z.ZodObject<{
    providerId: z.ZodNumber;
    name: z.ZodString;
    modelId: z.ZodString;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    contextWindow: z.ZodDefault<z.ZodNumber>;
    priority: z.ZodDefault<z.ZodNumber>;
    modelPath: z.ZodOptional<z.ZodString>;
    quantization: z.ZodOptional<z.ZodString>;
    parameters: z.ZodOptional<z.ZodString>;
    sizeBytes: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    isActive: boolean;
    providerId: number;
    modelId: string;
    contextWindow: number;
    priority: number;
    capabilities?: string[] | undefined;
    modelPath?: string | undefined;
    quantization?: string | undefined;
    parameters?: string | undefined;
    sizeBytes?: number | undefined;
}, {
    name: string;
    providerId: number;
    modelId: string;
    isActive?: boolean | undefined;
    capabilities?: string[] | undefined;
    contextWindow?: number | undefined;
    priority?: number | undefined;
    modelPath?: string | undefined;
    quantization?: string | undefined;
    parameters?: string | undefined;
    sizeBytes?: number | undefined;
}>;
export declare const updateModelSchema: z.ZodObject<{
    providerId: z.ZodOptional<z.ZodNumber>;
    name: z.ZodOptional<z.ZodString>;
    modelId: z.ZodOptional<z.ZodString>;
    capabilities: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    contextWindow: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    modelPath: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    quantization: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parameters: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sizeBytes: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
} & {
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    name?: string | undefined;
    isActive?: boolean | undefined;
    providerId?: number | undefined;
    modelId?: string | undefined;
    capabilities?: string[] | undefined;
    contextWindow?: number | undefined;
    priority?: number | undefined;
    modelPath?: string | undefined;
    quantization?: string | undefined;
    parameters?: string | undefined;
    sizeBytes?: number | undefined;
}, {
    id: number;
    name?: string | undefined;
    isActive?: boolean | undefined;
    providerId?: number | undefined;
    modelId?: string | undefined;
    capabilities?: string[] | undefined;
    contextWindow?: number | undefined;
    priority?: number | undefined;
    modelPath?: string | undefined;
    quantization?: string | undefined;
    parameters?: string | undefined;
    sizeBytes?: number | undefined;
}>;
export declare const createSpecializedAISchema: z.ZodObject<{
    userId: z.ZodDefault<z.ZodNumber>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    defaultModelId: z.ZodOptional<z.ZodNumber>;
    fallbackModelIds: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
    systemPrompt: z.ZodString;
    capabilities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    userId: number;
    name: string;
    isActive: boolean;
    systemPrompt: string;
    description?: string | undefined;
    capabilities?: string[] | undefined;
    category?: string | undefined;
    defaultModelId?: number | undefined;
    fallbackModelIds?: number[] | undefined;
}, {
    name: string;
    systemPrompt: string;
    description?: string | undefined;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    capabilities?: string[] | undefined;
    category?: string | undefined;
    defaultModelId?: number | undefined;
    fallbackModelIds?: number[] | undefined;
}>;
export declare const updateSpecializedAISchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    category: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    defaultModelId: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    fallbackModelIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    capabilities: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
} & {
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    description?: string | undefined;
    userId?: number | undefined;
    name?: string | undefined;
    isActive?: boolean | undefined;
    capabilities?: string[] | undefined;
    category?: string | undefined;
    defaultModelId?: number | undefined;
    fallbackModelIds?: number[] | undefined;
    systemPrompt?: string | undefined;
}, {
    id: number;
    description?: string | undefined;
    userId?: number | undefined;
    name?: string | undefined;
    isActive?: boolean | undefined;
    capabilities?: string[] | undefined;
    category?: string | undefined;
    defaultModelId?: number | undefined;
    fallbackModelIds?: number[] | undefined;
    systemPrompt?: string | undefined;
}>;
export declare const createCredentialSchema: z.ZodObject<{
    userId: z.ZodDefault<z.ZodNumber>;
    service: z.ZodString;
    credentialType: z.ZodOptional<z.ZodString>;
    data: z.ZodAny;
    metadata: z.ZodOptional<z.ZodAny>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    expiresAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: number;
    isActive: boolean;
    service: string;
    data?: any;
    credentialType?: string | undefined;
    metadata?: any;
    expiresAt?: string | undefined;
}, {
    service: string;
    data?: any;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    credentialType?: string | undefined;
    metadata?: any;
    expiresAt?: string | undefined;
}>;
export declare const updateCredentialSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    service: z.ZodOptional<z.ZodString>;
    credentialType: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    data: z.ZodOptional<z.ZodAny>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodAny>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    expiresAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
} & {
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    data?: any;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    service?: string | undefined;
    credentialType?: string | undefined;
    metadata?: any;
    expiresAt?: string | undefined;
}, {
    id: number;
    data?: any;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    service?: string | undefined;
    credentialType?: string | undefined;
    metadata?: any;
    expiresAt?: string | undefined;
}>;
export declare const createTaskSchema: z.ZodObject<{
    userId: z.ZodDefault<z.ZodNumber>;
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    userId: number;
    priority: "low" | "medium" | "high" | "urgent";
    title: string;
}, {
    description: string;
    title: string;
    userId?: number | undefined;
    priority?: "low" | "medium" | "high" | "urgent" | undefined;
}>;
export declare const updateTaskSchema: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["pending", "planning", "executing", "validating", "completed", "failed", "paused"]>>;
    priority: z.ZodOptional<z.ZodEnum<["low", "medium", "high", "urgent"]>>;
    completedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: number;
    description?: string | undefined;
    status?: "planning" | "completed" | "pending" | "executing" | "validating" | "failed" | "paused" | undefined;
    priority?: "low" | "medium" | "high" | "urgent" | undefined;
    title?: string | undefined;
    completedAt?: Date | undefined;
}, {
    id: number;
    description?: string | undefined;
    status?: "planning" | "completed" | "pending" | "executing" | "validating" | "failed" | "paused" | undefined;
    priority?: "low" | "medium" | "high" | "urgent" | undefined;
    title?: string | undefined;
    completedAt?: Date | undefined;
}>;
export declare const createSubtaskSchema: z.ZodObject<{
    taskId: z.ZodNumber;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    prompt: z.ZodString;
    assignedModelId: z.ZodOptional<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["pending", "executing", "validating", "completed", "failed", "rejected"]>>;
}, "strip", z.ZodTypeAny, {
    status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected";
    title: string;
    taskId: number;
    prompt: string;
    description?: string | undefined;
    assignedModelId?: number | undefined;
}, {
    title: string;
    taskId: number;
    prompt: string;
    description?: string | undefined;
    status?: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | undefined;
    assignedModelId?: number | undefined;
}>;
export declare const updateSubtaskSchema: z.ZodObject<{
    taskId: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    prompt: z.ZodOptional<z.ZodString>;
    assignedModelId: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["pending", "executing", "validating", "completed", "failed", "rejected"]>>>;
} & {
    id: z.ZodNumber;
    completedAt: z.ZodOptional<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    id: number;
    description?: string | undefined;
    status?: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | undefined;
    title?: string | undefined;
    completedAt?: Date | undefined;
    taskId?: number | undefined;
    assignedModelId?: number | undefined;
    prompt?: string | undefined;
}, {
    id: number;
    description?: string | undefined;
    status?: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | undefined;
    title?: string | undefined;
    completedAt?: Date | undefined;
    taskId?: number | undefined;
    assignedModelId?: number | undefined;
    prompt?: string | undefined;
}>;
export declare const createChatConversationSchema: z.ZodObject<{
    userId: z.ZodDefault<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    userId: number;
    metadata?: any;
    title?: string | undefined;
}, {
    userId?: number | undefined;
    metadata?: any;
    title?: string | undefined;
}>;
export declare const createChatMessageSchema: z.ZodObject<{
    conversationId: z.ZodNumber;
    role: z.ZodEnum<["user", "assistant", "system"]>;
    content: z.ZodString;
    metadata: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    role: "user" | "assistant" | "system";
    conversationId: number;
    content: string;
    metadata?: any;
}, {
    role: "user" | "assistant" | "system";
    conversationId: number;
    content: string;
    metadata?: any;
}>;
export declare const createExternalAPIAccountSchema: z.ZodObject<{
    userId: z.ZodDefault<z.ZodNumber>;
    service: z.ZodString;
    accountIdentifier: z.ZodString;
    credentialId: z.ZodNumber;
    isActive: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    userId: number;
    isActive: boolean;
    service: string;
    credentialId: number;
    accountIdentifier: string;
    metadata?: any;
}, {
    service: string;
    credentialId: number;
    accountIdentifier: string;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    metadata?: any;
}>;
export declare const updateExternalAPIAccountSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    service: z.ZodOptional<z.ZodString>;
    accountIdentifier: z.ZodOptional<z.ZodString>;
    credentialId: z.ZodOptional<z.ZodNumber>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodAny>>;
} & {
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    service?: string | undefined;
    metadata?: any;
    credentialId?: number | undefined;
    accountIdentifier?: string | undefined;
}, {
    id: number;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    service?: string | undefined;
    metadata?: any;
    credentialId?: number | undefined;
    accountIdentifier?: string | undefined;
}>;
export declare const createInstructionSchema: z.ZodObject<{
    userId: z.ZodDefault<z.ZodNumber>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    instructionText: z.ZodString;
    usageCount: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    userId: number;
    isActive: boolean;
    title: string;
    usageCount: number;
    instructionText: string;
    description?: string | undefined;
    category?: string | undefined;
}, {
    title: string;
    instructionText: string;
    description?: string | undefined;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    usageCount?: number | undefined;
}>;
export declare const updateInstructionSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    category: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    instructionText: z.ZodOptional<z.ZodString>;
    usageCount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
} & {
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    description?: string | undefined;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    title?: string | undefined;
    usageCount?: number | undefined;
    instructionText?: string | undefined;
}, {
    id: number;
    description?: string | undefined;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    title?: string | undefined;
    usageCount?: number | undefined;
    instructionText?: string | undefined;
}>;
export declare const createKnowledgeBaseSchema: z.ZodObject<{
    userId: z.ZodDefault<z.ZodNumber>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    isPublic: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    userId: number;
    isActive: boolean;
    title: string;
    isPublic: boolean;
    description?: string | undefined;
    category?: string | undefined;
    tags?: string[] | undefined;
}, {
    title: string;
    description?: string | undefined;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    tags?: string[] | undefined;
    isPublic?: boolean | undefined;
}>;
export declare const updateKnowledgeBaseSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    category: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    isPublic: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
} & {
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    description?: string | undefined;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    tags?: string[] | undefined;
    title?: string | undefined;
    isPublic?: boolean | undefined;
}, {
    id: number;
    description?: string | undefined;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    tags?: string[] | undefined;
    title?: string | undefined;
    isPublic?: boolean | undefined;
}>;
export declare const createKnowledgeSourceSchema: z.ZodObject<{
    knowledgeBaseId: z.ZodNumber;
    sourceType: z.ZodEnum<["text", "file", "url", "api"]>;
    content: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodAny>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    isActive: boolean;
    knowledgeBaseId: number;
    sourceType: "text" | "api" | "url" | "file";
    metadata?: any;
    content?: string | undefined;
    url?: string | undefined;
}, {
    knowledgeBaseId: number;
    sourceType: "text" | "api" | "url" | "file";
    isActive?: boolean | undefined;
    metadata?: any;
    content?: string | undefined;
    url?: string | undefined;
}>;
export declare const updateKnowledgeSourceSchema: z.ZodObject<{
    knowledgeBaseId: z.ZodOptional<z.ZodNumber>;
    sourceType: z.ZodOptional<z.ZodEnum<["text", "file", "url", "api"]>>;
    content: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    url: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodAny>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
} & {
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    isActive?: boolean | undefined;
    metadata?: any;
    content?: string | undefined;
    knowledgeBaseId?: number | undefined;
    sourceType?: "text" | "api" | "url" | "file" | undefined;
    url?: string | undefined;
}, {
    id: number;
    isActive?: boolean | undefined;
    metadata?: any;
    content?: string | undefined;
    knowledgeBaseId?: number | undefined;
    sourceType?: "text" | "api" | "url" | "file" | undefined;
    url?: string | undefined;
}>;
export declare const createTemplateSchema: z.ZodObject<{
    userId: z.ZodDefault<z.ZodNumber>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    templateData: z.ZodAny;
    isPublic: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    userId: number;
    name: string;
    isActive: boolean;
    isPublic: boolean;
    description?: string | undefined;
    category?: string | undefined;
    templateData?: any;
}, {
    name: string;
    description?: string | undefined;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    templateData?: any;
    isPublic?: boolean | undefined;
}>;
export declare const updateTemplateSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    category: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    templateData: z.ZodOptional<z.ZodAny>;
    isPublic: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
} & {
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    description?: string | undefined;
    userId?: number | undefined;
    name?: string | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    templateData?: any;
    isPublic?: boolean | undefined;
}, {
    id: number;
    description?: string | undefined;
    userId?: number | undefined;
    name?: string | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    templateData?: any;
    isPublic?: boolean | undefined;
}>;
export declare const createWorkflowSchema: z.ZodObject<{
    userId: z.ZodDefault<z.ZodNumber>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    steps: z.ZodArray<z.ZodAny, "many">;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    userId: number;
    name: string;
    isActive: boolean;
    steps: any[];
    description?: string | undefined;
    category?: string | undefined;
}, {
    name: string;
    steps: any[];
    description?: string | undefined;
    userId?: number | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
}>;
export declare const updateWorkflowSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    category: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    steps: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
} & {
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    description?: string | undefined;
    userId?: number | undefined;
    name?: string | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    steps?: any[] | undefined;
}, {
    id: number;
    description?: string | undefined;
    userId?: number | undefined;
    name?: string | undefined;
    isActive?: boolean | undefined;
    category?: string | undefined;
    steps?: any[] | undefined;
}>;
/**
 * Valida se um ID é válido (número positivo)
 */
export declare function validateId(id: any, fieldName?: string): number;
/**
 * Valida se uma string não está vazia
 */
export declare function validateNonEmpty(value: any, fieldName: string): string;
/**
 * Valida comprimento mínimo de string
 */
export declare function validateMinLength(value: string, minLength: number, fieldName: string): string;
/**
 * Valida comprimento máximo de string
 */
export declare function validateMaxLength(value: string, maxLength: number, fieldName: string): string;
/**
 * Valida enum (valor dentro de lista permitida)
 */
export declare function validateEnum<T extends string>(value: any, allowedValues: T[], fieldName: string): T;
/**
 * Valida se um array não está vazio
 */
export declare function validateNonEmptyArray<T>(value: any, fieldName: string): T[];
/**
 * Valida se um número está dentro de um intervalo
 */
export declare function validateRange(value: number, min: number, max: number, fieldName: string): number;
/**
 * Valida se um objeto JSON é válido
 */
export declare function validateJSON(value: any, fieldName: string): object;
/**
 * Valida se uma URL é válida
 */
export declare function validateURL(value: string, fieldName: string): string;
/**
 * Valida se um email é válido
 */
export declare function validateEmail(value: string, fieldName: string): string;
/**
 * Valida se uma data é válida
 */
export declare function validateDate(value: any, fieldName: string): Date;
/**
 * Valida se uma data está no futuro
 */
export declare function validateFutureDate(value: any, fieldName: string): Date;
/**
 * Wrapper para tratamento de erros de banco
 */
export declare function handleDatabaseError(error: any, operation: string): never;
/**
 * Verifica se um registro existe
 */
export declare function ensureExists<T>(record: T | undefined | null, entityName: string): T;
/**
 * Sanitiza string HTML (previne XSS)
 */
export declare function sanitizeHTML(value: string): string;
/**
 * Valida paginação
 */
export declare function validatePagination(page?: number, limit?: number): {
    page: number;
    limit: number;
    offset: number;
};
