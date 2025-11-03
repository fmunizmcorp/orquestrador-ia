import { mysqlTable, int, varchar, text, boolean, timestamp, decimal, bigint, json, mysqlEnum, uniqueIndex, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// ==================================================
// 1. TABELA: users
// ==================================================
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  openId: varchar('openId', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  username: varchar('username', { length: 100 }),
  passwordHash: text('passwordHash'),
  lastLoginAt: timestamp('lastLoginAt'),
  avatarUrl: varchar('avatarUrl', { length: 500 }),
  bio: text('bio'),
  preferences: json('preferences'),
  role: mysqlEnum('role', ['admin', 'user']).default('user'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  openIdIdx: uniqueIndex('idx_openId').on(table.openId),
  emailIdx: index('idx_email').on(table.email),
  usernameIdx: index('idx_username').on(table.username),
}));

// ==================================================
// 2. TABELA: aiProviders
// ==================================================
export const aiProviders = mysqlTable('aiProviders', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['local', 'api']).notNull(),
  endpoint: varchar('endpoint', { length: 500 }).notNull(),
  apiKey: text('apiKey'),
  isActive: boolean('isActive').default(true),
  config: json('config'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  typeIdx: index('idx_type').on(table.type),
  isActiveIdx: index('idx_isActive').on(table.isActive),
}));

// ==================================================
// 3. TABELA: aiModels
// ==================================================
export const aiModels = mysqlTable('aiModels', {
  id: int('id').primaryKey().autoincrement(),
  providerId: int('providerId').notNull().references(() => aiProviders.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  modelId: varchar('modelId', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 50 }).default('lmstudio'), // lmstudio, openai, anthropic, google, genspark, mistral
  capabilities: json('capabilities').$type<string[]>(),
  contextWindow: int('contextWindow').default(4096),
  isLoaded: boolean('isLoaded').default(false),
  priority: int('priority').default(50),
  isActive: boolean('isActive').default(true),
  modelPath: varchar('modelPath', { length: 500 }),
  quantization: varchar('quantization', { length: 50 }),
  parameters: varchar('parameters', { length: 50 }),
  sizeBytes: bigint('sizeBytes', { mode: 'number' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  providerIdIdx: index('idx_providerId').on(table.providerId),
  isLoadedIdx: index('idx_isLoaded').on(table.isLoaded),
  isActiveIdx: index('idx_isActive').on(table.isActive),
  providerIdx: index('idx_provider').on(table.provider),
}));

// ==================================================
// 4. TABELA: specializedAIs
// ==================================================
export const specializedAIs = mysqlTable('specializedAIs', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  defaultModelId: int('defaultModelId').references(() => aiModels.id, { onDelete: 'set null' }),
  fallbackModelIds: json('fallbackModelIds').$type<number[]>(),
  systemPrompt: text('systemPrompt').notNull(),
  capabilities: json('capabilities').$type<string[]>(),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  categoryIdx: index('idx_category').on(table.category),
  isActiveIdx: index('idx_isActive').on(table.isActive),
}));

// ==================================================
// 5. TABELA: apiKeys - Chaves de API para providers externos
// ==================================================
export const apiKeys = mysqlTable('apiKeys', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').references(() => users.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull(), // openai, anthropic, google, genspark, mistral
  apiKey: text('apiKey').notNull(),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  providerIdx: index('idx_provider').on(table.provider),
  userIdIdx: index('idx_userId').on(table.userId),
  isActiveIdx: index('idx_isActive').on(table.isActive),
}));

// ==================================================
// 6. TABELA: credentials
// ==================================================
export const credentials = mysqlTable('credentials', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  service: varchar('service', { length: 100 }).notNull(),
  credentialType: varchar('credentialType', { length: 50 }),
  encryptedData: text('encryptedData').notNull(),
  metadata: json('metadata'),
  isActive: boolean('isActive').default(true),
  expiresAt: timestamp('expiresAt'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userServiceIdx: index('idx_userId_service').on(table.userId, table.service),
  isActiveIdx: index('idx_isActive').on(table.isActive),
}));

// ==================================================
// 6. TABELA: externalAPIAccounts
// ==================================================
export const externalAPIAccounts = mysqlTable('externalAPIAccounts', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 100 }).notNull(),
  accountName: varchar('accountName', { length: 255 }).notNull(),
  credentialId: int('credentialId').references(() => credentials.id, { onDelete: 'set null' }),
  creditBalance: decimal('creditBalance', { precision: 10, scale: 2 }).default('0.00'),
  creditLimit: decimal('creditLimit', { precision: 10, scale: 2 }),
  usageThisMonth: decimal('usageThisMonth', { precision: 10, scale: 2 }).default('0.00'),
  alertThreshold: decimal('alertThreshold', { precision: 10, scale: 2 }),
  isActive: boolean('isActive').default(true),
  lastSync: timestamp('lastSync'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  providerIdx: index('idx_provider').on(table.provider),
}));

// ==================================================
// 7. TABELA: tasks
// ==================================================
export const tasks = mysqlTable('tasks', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: int('projectId').references(() => projects.id, { onDelete: 'set null' }),
  assignedUserId: int('assignedUserId').references(() => users.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  status: mysqlEnum('status', ['pending', 'planning', 'in_progress', 'executing', 'validating', 'completed', 'blocked', 'failed', 'cancelled', 'paused']).default('pending'),
  priority: mysqlEnum('priority', ['low', 'medium', 'high', 'urgent']).default('medium'),
  estimatedHours: decimal('estimatedHours', { precision: 8, scale: 2 }),
  actualHours: decimal('actualHours', { precision: 8, scale: 2 }),
  dueDate: timestamp('dueDate'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
  completedAt: timestamp('completedAt'),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  projectIdIdx: index('idx_projectId').on(table.projectId),
  assignedUserIdIdx: index('idx_assignedUserId').on(table.assignedUserId),
  statusIdx: index('idx_status').on(table.status),
  priorityIdx: index('idx_priority').on(table.priority),
}));

// ==================================================
// 8. TABELA: subtasks
// ==================================================
export const subtasks = mysqlTable('subtasks', {
  id: int('id').primaryKey().autoincrement(),
  taskId: int('taskId').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  assignedModelId: int('assignedModelId').references(() => aiModels.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  prompt: text('prompt').notNull(),
  result: text('result'),
  status: mysqlEnum('status', ['pending', 'executing', 'completed', 'failed', 'validating', 'rejected']).default('pending'),
  orderIndex: int('orderIndex').default(0),
  estimatedDifficulty: mysqlEnum('estimatedDifficulty', ['easy', 'medium', 'hard', 'expert']).default('medium'),
  reviewedBy: int('reviewedBy').references(() => aiModels.id, { onDelete: 'set null' }),
  reviewNotes: text('reviewNotes'),
  completedAt: timestamp('completedAt'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  taskIdIdx: index('idx_taskId').on(table.taskId),
  statusIdx: index('idx_status').on(table.status),
  orderIndexIdx: index('idx_orderIndex').on(table.orderIndex),
}));

// ==================================================
// 9. TABELA: chatConversations
// ==================================================
export const chatConversations = mysqlTable('chatConversations', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }),
  aiId: int('aiId').references(() => specializedAIs.id, { onDelete: 'set null' }),
  modelId: int('modelId').references(() => aiModels.id, { onDelete: 'set null' }),
  systemPrompt: text('systemPrompt'),
  lastMessageAt: timestamp('lastMessageAt'),
  messageCount: int('messageCount').default(0),
  isRead: boolean('isRead').default(false),
  isActive: boolean('isActive').default(true),
  metadata: json('metadata'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  isActiveIdx: index('idx_isActive').on(table.isActive),
}));

// ==================================================
// 10. TABELA: chatMessages
// ==================================================
export const chatMessages: any = mysqlTable('chatMessages', {
  id: int('id').primaryKey().autoincrement(),
  conversationId: int('conversationId').notNull().references(() => chatConversations.id, { onDelete: 'cascade' }),
  parentMessageId: int('parentMessageId').references((): any => chatMessages.id, { onDelete: 'set null' }),
  role: mysqlEnum('role', ['user', 'assistant', 'system']).notNull(),
  content: text('content').notNull(),
  isEdited: boolean('isEdited').default(false),
  attachments: json('attachments'),
  metadata: json('metadata'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  conversationIdIdx: index('idx_conversationId').on(table.conversationId),
  parentMessageIdIdx: index('idx_parentMessageId').on(table.parentMessageId),
  createdAtIdx: index('idx_createdAt').on(table.createdAt),
}));

// ==================================================
// 11. TABELA: aiTemplates
// ==================================================
export const aiTemplates = mysqlTable('aiTemplates', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 100 }),
  templateData: json('templateData').notNull(),
  isPublic: boolean('isPublic').default(false),
  usageCount: int('usageCount').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  categoryIdx: index('idx_category').on(table.category),
  isPublicIdx: index('idx_isPublic').on(table.isPublic),
}));

// ==================================================
// 12. TABELA: aiWorkflows
// ==================================================
export const aiWorkflows = mysqlTable('aiWorkflows', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  steps: json('steps').notNull(),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  isActiveIdx: index('idx_isActive').on(table.isActive),
}));

// ==================================================
// 13. TABELA: instructions
// ==================================================
export const instructions = mysqlTable('instructions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  aiId: int('aiId').references(() => specializedAIs.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  priority: int('priority').default(50),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  aiIdIdx: index('idx_aiId').on(table.aiId),
  isActiveIdx: index('idx_isActive').on(table.isActive),
}));

// ==================================================
// 14. TABELA: knowledgeBase
// ==================================================
export const knowledgeBase = mysqlTable('knowledgeBase', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }),
  tags: json('tags').$type<string[]>(),
  embedding: json('embedding'),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  categoryIdx: index('idx_category').on(table.category),
  isActiveIdx: index('idx_isActive').on(table.isActive),
}));

// ==================================================
// 15. TABELA: knowledgeSources
// ==================================================
export const knowledgeSources = mysqlTable('knowledgeSources', {
  id: int('id').primaryKey().autoincrement(),
  knowledgeBaseId: int('knowledgeBaseId').notNull().references(() => knowledgeBase.id, { onDelete: 'cascade' }),
  sourceType: varchar('sourceType', { length: 50 }),
  sourceUrl: varchar('sourceUrl', { length: 1000 }),
  sourceData: json('sourceData'),
  lastSync: timestamp('lastSync'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  knowledgeBaseIdIdx: index('idx_knowledgeBaseId').on(table.knowledgeBaseId),
  sourceTypeIdx: index('idx_sourceType').on(table.sourceType),
}));

// ==================================================
// 16. TABELA: modelDiscovery
// ==================================================
export const modelDiscovery = mysqlTable('modelDiscovery', {
  id: int('id').primaryKey().autoincrement(),
  modelName: varchar('modelName', { length: 255 }).notNull(),
  modelPath: varchar('modelPath', { length: 1000 }).notNull(),
  sizeBytes: bigint('sizeBytes', { mode: 'number' }),
  quantization: varchar('quantization', { length: 50 }),
  parameters: varchar('parameters', { length: 50 }),
  discoveredAt: timestamp('discoveredAt').defaultNow(),
  lastSeen: timestamp('lastSeen').defaultNow().onUpdateNow(),
  isImported: boolean('isImported').default(false),
}, (table) => ({
  modelNameIdx: index('idx_modelName').on(table.modelName),
  isImportedIdx: index('idx_isImported').on(table.isImported),
}));

// ==================================================
// 17. TABELA: modelRatings
// ==================================================
export const modelRatings = mysqlTable('modelRatings', {
  id: int('id').primaryKey().autoincrement(),
  modelId: int('modelId').notNull().references(() => aiModels.id, { onDelete: 'cascade' }),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: int('rating').notNull(),
  comment: text('comment'),
  taskType: varchar('taskType', { length: 100 }),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  modelIdIdx: index('idx_modelId').on(table.modelId),
  userIdIdx: index('idx_userId').on(table.userId),
}));

// ==================================================
// 18. TABELA: storage
// ==================================================
export const storage = mysqlTable('storage', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fileName: varchar('fileName', { length: 500 }).notNull(),
  filePath: varchar('filePath', { length: 1000 }).notNull(),
  fileType: varchar('fileType', { length: 100 }),
  sizeBytes: bigint('sizeBytes', { mode: 'number' }),
  metadata: json('metadata'),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  fileTypeIdx: index('idx_fileType').on(table.fileType),
}));

// ==================================================
// 19. TABELA: taskMonitoring
// ==================================================
export const taskMonitoring = mysqlTable('taskMonitoring', {
  id: int('id').primaryKey().autoincrement(),
  taskId: int('taskId').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  cpuUsage: decimal('cpuUsage', { precision: 5, scale: 2 }),
  ramUsage: decimal('ramUsage', { precision: 5, scale: 2 }),
  gpuUsage: decimal('gpuUsage', { precision: 5, scale: 2 }),
  executionTime: int('executionTime'),
  recordedAt: timestamp('recordedAt').defaultNow(),
}, (table) => ({
  taskIdIdx: index('idx_taskId').on(table.taskId),
  recordedAtIdx: index('idx_recordedAt').on(table.recordedAt),
}));

// ==================================================
// 20. TABELA: executionLogs
// ==================================================
export const executionLogs = mysqlTable('executionLogs', {
  id: int('id').primaryKey().autoincrement(),
  taskId: int('taskId').references(() => tasks.id, { onDelete: 'cascade' }),
  subtaskId: int('subtaskId').references(() => subtasks.id, { onDelete: 'cascade' }),
  level: mysqlEnum('level', ['debug', 'info', 'warning', 'error', 'critical']).default('info'),
  message: text('message').notNull(),
  metadata: json('metadata'),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  taskIdIdx: index('idx_taskId').on(table.taskId),
  subtaskIdIdx: index('idx_subtaskId').on(table.subtaskId),
  levelIdx: index('idx_level').on(table.level),
  createdAtIdx: index('idx_createdAt').on(table.createdAt),
}));

// ==================================================
// 21. TABELA: creditUsage
// ==================================================
export const creditUsage = mysqlTable('creditUsage', {
  id: int('id').primaryKey().autoincrement(),
  accountId: int('accountId').notNull().references(() => externalAPIAccounts.id, { onDelete: 'cascade' }),
  taskId: int('taskId').references(() => tasks.id, { onDelete: 'set null' }),
  creditsUsed: decimal('creditsUsed', { precision: 10, scale: 4 }).notNull(),
  provider: varchar('provider', { length: 100 }),
  modelUsed: varchar('modelUsed', { length: 255 }),
  tokensUsed: int('tokensUsed'),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  accountIdIdx: index('idx_accountId').on(table.accountId),
  taskIdIdx: index('idx_taskId').on(table.taskId),
  createdAtIdx: index('idx_createdAt').on(table.createdAt),
}));

// ==================================================
// 22. TABELA: credentialTemplates
// ==================================================
export const credentialTemplates = mysqlTable('credentialTemplates', {
  id: int('id').primaryKey().autoincrement(),
  service: varchar('service', { length: 100 }).notNull().unique(),
  fields: json('fields').notNull(),
  instructions: text('instructions'),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  serviceIdx: uniqueIndex('idx_service').on(table.service),
}));

// ==================================================
// 23. TABELA: aiQualityMetrics
// ==================================================
export const aiQualityMetrics = mysqlTable('aiQualityMetrics', {
  id: int('id').primaryKey().autoincrement(),
  aiId: int('aiId').notNull().references(() => specializedAIs.id, { onDelete: 'cascade' }),
  taskType: varchar('taskType', { length: 100 }).notNull(),
  successRate: decimal('successRate', { precision: 5, scale: 2 }).default('0.00'),
  avgScore: decimal('avgScore', { precision: 5, scale: 2 }).default('0.00'),
  totalTasks: int('totalTasks').default(0),
  lastUpdated: timestamp('lastUpdated').defaultNow().onUpdateNow(),
}, (table) => ({
  aiTaskTypeIdx: uniqueIndex('idx_ai_taskType').on(table.aiId, table.taskType),
  taskTypeIdx: index('idx_taskType').on(table.taskType),
}));

// ==================================================
// RELATIONS
// ==================================================
export const usersRelations = relations(users, ({ many }) => ({
  specializedAIs: many(specializedAIs),
  credentials: many(credentials),
  tasks: many(tasks),
  chatConversations: many(chatConversations),
  aiTemplates: many(aiTemplates),
  aiWorkflows: many(aiWorkflows),
  instructions: many(instructions),
  knowledgeBase: many(knowledgeBase),
}));

export const aiProvidersRelations = relations(aiProviders, ({ many }) => ({
  models: many(aiModels),
}));

export const aiModelsRelations = relations(aiModels, ({ one, many }) => ({
  provider: one(aiProviders, {
    fields: [aiModels.providerId],
    references: [aiProviders.id],
  }),
  assignedSubtasks: many(subtasks),
  ratings: many(modelRatings),
}));

export const specializedAIsRelations = relations(specializedAIs, ({ one, many }) => ({
  user: one(users, {
    fields: [specializedAIs.userId],
    references: [users.id],
  }),
  defaultModel: one(aiModels, {
    fields: [specializedAIs.defaultModelId],
    references: [aiModels.id],
  }),
  instructions: many(instructions),
  qualityMetrics: many(aiQualityMetrics),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
  subtasks: many(subtasks),
  logs: many(executionLogs),
  monitoring: many(taskMonitoring),
}));

export const subtasksRelations = relations(subtasks, ({ one }) => ({
  task: one(tasks, {
    fields: [subtasks.taskId],
    references: [tasks.id],
  }),
  assignedModel: one(aiModels, {
    fields: [subtasks.assignedModelId],
    references: [aiModels.id],
  }),
}));

export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [chatConversations.userId],
    references: [users.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [chatMessages.conversationId],
    references: [chatConversations.id],
  }),
}));

// ==================================================
// TABELAS PARA MODEL TRAINING SERVICE
// ==================================================

export const trainingDatasets = mysqlTable('trainingDatasets', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  datasetType: mysqlEnum('datasetType', ['text', 'code', 'qa', 'completion', 'chat']).default('text'),
  format: mysqlEnum('format', ['jsonl', 'csv', 'txt', 'parquet']).default('jsonl'),
  filePath: varchar('filePath', { length: 500 }),
  fileSize: bigint('fileSize', { mode: 'number' }),
  recordCount: int('recordCount').default(0),
  metadata: json('metadata'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  datasetTypeIdx: index('idx_datasetType').on(table.datasetType),
}));

export const trainingJobs = mysqlTable('trainingJobs', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  datasetId: int('datasetId').notNull().references(() => trainingDatasets.id, { onDelete: 'cascade' }),
  baseModelId: int('baseModelId').notNull().references(() => aiModels.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: mysqlEnum('status', ['pending', 'preparing', 'training', 'validating', 'completed', 'failed', 'cancelled']).default('pending'),
  trainingType: mysqlEnum('trainingType', ['fine-tuning', 'lora', 'qlora', 'full']).default('lora'),
  hyperparameters: json('hyperparameters'),
  progress: decimal('progress', { precision: 5, scale: 2 }).default('0.00'),
  currentEpoch: int('currentEpoch').default(0),
  totalEpochs: int('totalEpochs').default(1),
  trainingLoss: decimal('trainingLoss', { precision: 10, scale: 6 }),
  validationLoss: decimal('validationLoss', { precision: 10, scale: 6 }),
  trainingAccuracy: decimal('trainingAccuracy', { precision: 5, scale: 2 }),
  validationAccuracy: decimal('validationAccuracy', { precision: 5, scale: 2 }),
  estimatedTimeRemaining: int('estimatedTimeRemaining'),
  startedAt: timestamp('startedAt'),
  completedAt: timestamp('completedAt'),
  errorMessage: text('errorMessage'),
  logFilePath: varchar('logFilePath', { length: 500 }),
  metadata: json('metadata'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  statusIdx: index('idx_status').on(table.status),
  datasetIdIdx: index('idx_datasetId').on(table.datasetId),
}));

export const modelVersions = mysqlTable('modelVersions', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  baseModelId: int('baseModelId').notNull().references(() => aiModels.id, { onDelete: 'cascade' }),
  trainingJobId: int('trainingJobId').references(() => trainingJobs.id, { onDelete: 'set null' }),
  versionName: varchar('versionName', { length: 255 }).notNull(),
  description: text('description'),
  modelPath: varchar('modelPath', { length: 500 }).notNull(),
  sizeBytes: bigint('sizeBytes', { mode: 'number' }),
  format: mysqlEnum('format', ['gguf', 'safetensors', 'pytorch', 'onnx']).default('gguf'),
  quantization: varchar('quantization', { length: 50 }),
  parameters: varchar('parameters', { length: 50 }),
  performanceMetrics: json('performanceMetrics'),
  benchmarkScores: json('benchmarkScores'),
  isActive: boolean('isActive').notNull().default(true),
  isPublic: boolean('isPublic').notNull().default(false),
  downloadCount: int('downloadCount').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  baseModelIdIdx: index('idx_baseModelId').on(table.baseModelId),
  isPublicIdx: index('idx_isPublic').on(table.isPublic),
}));

export const puppeteerSessions = mysqlTable('puppeteerSessions', {
  id: int('id').primaryKey().autoincrement(),
  sessionId: varchar('sessionId', { length: 255 }).notNull().unique(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: mysqlEnum('status', ['active', 'closed', 'error']).default('active'),
  config: json('config'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
  expiresAt: timestamp('expiresAt'),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  sessionIdIdx: index('idx_sessionId').on(table.sessionId),
  statusIdx: index('idx_status').on(table.status),
}));

export const puppeteerResults = mysqlTable('puppeteerResults', {
  id: int('id').primaryKey().autoincrement(),
  sessionId: varchar('sessionId', { length: 255 }).notNull().references(() => puppeteerSessions.sessionId, { onDelete: 'cascade' }),
  resultType: mysqlEnum('resultType', ['screenshot', 'pdf', 'data', 'html']).notNull(),
  data: text('data'),
  url: varchar('url', { length: 1000 }),
  metadata: json('metadata'),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  sessionIdIdx: index('idx_sessionId').on(table.sessionId),
  resultTypeIdx: index('idx_resultType').on(table.resultType),
}));

// Relations para Training
export const trainingDatasetsRelations = relations(trainingDatasets, ({ one, many }) => ({
  user: one(users, {
    fields: [trainingDatasets.userId],
    references: [users.id],
  }),
  trainingJobs: many(trainingJobs),
}));

export const trainingJobsRelations = relations(trainingJobs, ({ one, many }) => ({
  user: one(users, {
    fields: [trainingJobs.userId],
    references: [users.id],
  }),
  dataset: one(trainingDatasets, {
    fields: [trainingJobs.datasetId],
    references: [trainingDatasets.id],
  }),
  baseModel: one(aiModels, {
    fields: [trainingJobs.baseModelId],
    references: [aiModels.id],
  }),
  modelVersions: many(modelVersions),
}));

export const modelVersionsRelations = relations(modelVersions, ({ one }) => ({
  user: one(users, {
    fields: [modelVersions.userId],
    references: [users.id],
  }),
  baseModel: one(aiModels, {
    fields: [modelVersions.baseModelId],
    references: [aiModels.id],
  }),
  trainingJob: one(trainingJobs, {
    fields: [modelVersions.trainingJobId],
    references: [trainingJobs.id],
  }),
}));

export const puppeteerSessionsRelations = relations(puppeteerSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [puppeteerSessions.userId],
    references: [users.id],
  }),
  results: many(puppeteerResults),
}));

export const puppeteerResultsRelations = relations(puppeteerResults, ({ one }) => ({
  session: one(puppeteerSessions, {
    fields: [puppeteerResults.sessionId],
    references: [puppeteerSessions.sessionId],
  }),
}));

// ==================================================
// TABELAS ADICIONAIS - TEAMS & PROJECTS
// ==================================================

export const teams = mysqlTable('teams', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  ownerId: int('ownerId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  ownerIdIdx: index('idx_ownerId').on(table.ownerId),
}));

export const teamMembers = mysqlTable('teamMembers', {
  id: int('id').primaryKey().autoincrement(),
  teamId: int('teamId').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: mysqlEnum('role', ['owner', 'admin', 'member', 'viewer']).default('member'),
  joinedAt: timestamp('joinedAt').defaultNow(),
}, (table) => ({
  teamUserIdx: uniqueIndex('idx_team_user').on(table.teamId, table.userId),
  teamIdIdx: index('idx_teamId').on(table.teamId),
  userIdIdx: index('idx_userId').on(table.userId),
}));

export const projects = mysqlTable('projects', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  teamId: int('teamId').references(() => teams.id, { onDelete: 'set null' }),
  status: mysqlEnum('status', ['planning', 'active', 'on_hold', 'completed', 'archived']).default('planning'),
  startDate: timestamp('startDate'),
  endDate: timestamp('endDate'),
  budget: decimal('budget', { precision: 12, scale: 2 }),
  progress: int('progress').default(0),
  tags: json('tags'),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  teamIdIdx: index('idx_teamId').on(table.teamId),
  statusIdx: index('idx_status').on(table.status),
}));

export const taskDependencies = mysqlTable('taskDependencies', {
  id: int('id').primaryKey().autoincrement(),
  taskId: int('taskId').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  dependsOnTaskId: int('dependsOnTaskId').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  dependencyType: mysqlEnum('dependencyType', ['finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish']).default('finish_to_start'),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  taskDependencyIdx: uniqueIndex('idx_task_dependency').on(table.taskId, table.dependsOnTaskId),
  taskIdIdx: index('idx_taskId').on(table.taskId),
  dependsOnTaskIdIdx: index('idx_dependsOnTaskId').on(table.dependsOnTaskId),
}));

// ==================================================
// TABELAS DE ORQUESTRAÇÃO - CRÍTICAS
// ==================================================

export const orchestrationLogs = mysqlTable('orchestrationLogs', {
  id: int('id').primaryKey().autoincrement(),
  taskId: int('taskId').references(() => tasks.id, { onDelete: 'cascade' }),
  subtaskId: int('subtaskId').references(() => subtasks.id, { onDelete: 'cascade' }),
  aiId: int('aiId').references(() => specializedAIs.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  input: text('input'),
  output: text('output'),
  executionTime: int('executionTime'),
  status: mysqlEnum('status', ['success', 'failed', 'timeout', 'cancelled']).default('success'),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  taskIdIdx: index('idx_taskId').on(table.taskId),
  subtaskIdIdx: index('idx_subtaskId').on(table.subtaskId),
  aiIdIdx: index('idx_aiId').on(table.aiId),
  actionIdx: index('idx_action').on(table.action),
}));

export const crossValidations = mysqlTable('crossValidations', {
  id: int('id').primaryKey().autoincrement(),
  subtaskId: int('subtaskId').notNull().references(() => subtasks.id, { onDelete: 'cascade' }),
  validatorAiId: int('validatorAiId').notNull().references(() => specializedAIs.id, { onDelete: 'cascade' }),
  score: decimal('score', { precision: 5, scale: 2 }).notNull(),
  approved: boolean('approved').notNull(),
  feedback: text('feedback'),
  divergence: decimal('divergence', { precision: 5, scale: 2 }),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  subtaskIdIdx: index('idx_subtaskId').on(table.subtaskId),
  validatorAiIdIdx: index('idx_validatorAiId').on(table.validatorAiId),
  approvedIdx: index('idx_approved').on(table.approved),
}));

export const hallucinationDetections = mysqlTable('hallucinationDetections', {
  id: int('id').primaryKey().autoincrement(),
  subtaskId: int('subtaskId').notNull().references(() => subtasks.id, { onDelete: 'cascade' }),
  detectedAt: timestamp('detectedAt').defaultNow(),
  confidenceScore: decimal('confidenceScore', { precision: 5, scale: 2 }).notNull(),
  indicators: json('indicators'),
  wasRecovered: boolean('wasRecovered').default(false),
  recoveryMethod: varchar('recoveryMethod', { length: 100 }),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  subtaskIdIdx: index('idx_subtaskId').on(table.subtaskId),
  wasRecoveredIdx: index('idx_wasRecovered').on(table.wasRecovered),
}));

export const executionResults = mysqlTable('executionResults', {
  id: int('id').primaryKey().autoincrement(),
  subtaskId: int('subtaskId').notNull().references(() => subtasks.id, { onDelete: 'cascade' }),
  executorAiId: int('executorAiId').notNull().references(() => specializedAIs.id, { onDelete: 'cascade' }),
  result: text('result').notNull(),
  score: decimal('score', { precision: 5, scale: 2 }),
  metrics: json('metrics'),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  subtaskIdIdx: index('idx_subtaskId').on(table.subtaskId),
  executorAiIdIdx: index('idx_executorAiId').on(table.executorAiId),
}));

// ==================================================
// TABELAS DE CHAT AVANÇADO
// ==================================================

export const messageAttachments = mysqlTable('messageAttachments', {
  id: int('id').primaryKey().autoincrement(),
  messageId: int('messageId').notNull().references(() => chatMessages.id, { onDelete: 'cascade' }),
  fileName: varchar('fileName', { length: 500 }).notNull(),
  fileType: varchar('fileType', { length: 100 }),
  fileUrl: varchar('fileUrl', { length: 1000 }).notNull(),
  fileSize: bigint('fileSize', { mode: 'number' }),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  messageIdIdx: index('idx_messageId').on(table.messageId),
}));

export const messageReactions = mysqlTable('messageReactions', {
  id: int('id').primaryKey().autoincrement(),
  messageId: int('messageId').notNull().references(() => chatMessages.id, { onDelete: 'cascade' }),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  emoji: varchar('emoji', { length: 10 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  messageUserEmojiIdx: uniqueIndex('idx_message_user_emoji').on(table.messageId, table.userId, table.emoji),
  messageIdIdx: index('idx_messageId').on(table.messageId),
}));

// ==================================================
// TABELAS DE MONITORAMENTO
// ==================================================

export const systemMetrics = mysqlTable('systemMetrics', {
  id: int('id').primaryKey().autoincrement(),
  cpuUsage: decimal('cpuUsage', { precision: 5, scale: 2 }).notNull(),
  memoryUsage: decimal('memoryUsage', { precision: 5, scale: 2 }).notNull(),
  diskUsage: decimal('diskUsage', { precision: 5, scale: 2 }).notNull(),
  activeConnections: int('activeConnections').default(0),
  timestamp: timestamp('timestamp').defaultNow(),
}, (table) => ({
  timestampIdx: index('idx_timestamp').on(table.timestamp),
}));

export const apiUsage = mysqlTable('apiUsage', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').references(() => users.id, { onDelete: 'set null' }),
  endpoint: varchar('endpoint', { length: 255 }).notNull(),
  method: varchar('method', { length: 10 }).notNull(),
  statusCode: int('statusCode').notNull(),
  responseDuration: int('responseDuration'),
  timestamp: timestamp('timestamp').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  endpointIdx: index('idx_endpoint').on(table.endpoint),
  timestampIdx: index('idx_timestamp').on(table.timestamp),
}));

export const errorLogs = mysqlTable('errorLogs', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').references(() => users.id, { onDelete: 'set null' }),
  level: mysqlEnum('level', ['error', 'warning', 'critical']).default('error'),
  message: text('message').notNull(),
  stack: text('stack'),
  metadata: json('metadata'),
  timestamp: timestamp('timestamp').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  levelIdx: index('idx_level').on(table.level),
  timestampIdx: index('idx_timestamp').on(table.timestamp),
}));

export const auditLogs = mysqlTable('auditLogs', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resourceType', { length: 100 }),
  resourceId: int('resourceId'),
  changes: json('changes'),
  ipAddress: varchar('ipAddress', { length: 45 }),
  userAgent: text('userAgent'),
  timestamp: timestamp('timestamp').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  actionIdx: index('idx_action').on(table.action),
  timestampIdx: index('idx_timestamp').on(table.timestamp),
}));

// ==================================================
// TABELAS DE SERVIÇOS EXTERNOS
// ==================================================

export const externalServices = mysqlTable('externalServices', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  serviceName: varchar('serviceName', { length: 100 }).notNull(),
  config: json('config'),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  serviceNameIdx: index('idx_serviceName').on(table.serviceName),
}));

export const oauthTokens = mysqlTable('oauthTokens', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  serviceId: int('serviceId').notNull().references(() => externalServices.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken').notNull(),
  refreshToken: text('refreshToken'),
  expiresAt: timestamp('expiresAt').notNull(),
  scope: text('scope'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  serviceIdIdx: index('idx_serviceId').on(table.serviceId),
}));

export const apiCredentials = mysqlTable('apiCredentials', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  serviceName: varchar('serviceName', { length: 100 }).notNull(),
  credentialName: varchar('credentialName', { length: 255 }).notNull(),
  encryptedData: text('encryptedData').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  serviceNameIdx: index('idx_serviceName').on(table.serviceName),
}));

// ==================================================
// TABELAS DE PROMPTS
// ==================================================

export const prompts = mysqlTable('prompts', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  content: text('content').notNull(),
  category: varchar('category', { length: 100 }),
  tags: json('tags').$type<string[]>(),
  variables: json('variables'),
  isPublic: boolean('isPublic').default(false),
  useCount: int('useCount').default(0),
  currentVersion: int('currentVersion').default(1),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
  categoryIdx: index('idx_category').on(table.category),
  isPublicIdx: index('idx_isPublic').on(table.isPublic),
}));

export const promptVersions = mysqlTable('promptVersions', {
  id: int('id').primaryKey().autoincrement(),
  promptId: int('promptId').notNull().references(() => prompts.id, { onDelete: 'cascade' }),
  version: int('version').notNull(),
  content: text('content').notNull(),
  changelog: text('changelog'),
  createdByUserId: int('createdByUserId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  promptVersionIdx: uniqueIndex('idx_prompt_version').on(table.promptId, table.version),
  promptIdIdx: index('idx_promptId').on(table.promptId),
}));

// ==================================================
// RELATIONS ADICIONAIS
// ==================================================

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
  }),
  members: many(teamMembers),
  projects: many(projects),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  team: one(teams, {
    fields: [projects.teamId],
    references: [teams.id],
  }),
}));

export const orchestrationLogsRelations = relations(orchestrationLogs, ({ one }) => ({
  task: one(tasks, {
    fields: [orchestrationLogs.taskId],
    references: [tasks.id],
  }),
  subtask: one(subtasks, {
    fields: [orchestrationLogs.subtaskId],
    references: [subtasks.id],
  }),
  ai: one(specializedAIs, {
    fields: [orchestrationLogs.aiId],
    references: [specializedAIs.id],
  }),
}));

export const crossValidationsRelations = relations(crossValidations, ({ one }) => ({
  subtask: one(subtasks, {
    fields: [crossValidations.subtaskId],
    references: [subtasks.id],
  }),
  validatorAi: one(specializedAIs, {
    fields: [crossValidations.validatorAiId],
    references: [specializedAIs.id],
  }),
}));

export const promptsRelations = relations(prompts, ({ one, many }) => ({
  user: one(users, {
    fields: [prompts.userId],
    references: [users.id],
  }),
  versions: many(promptVersions),
}));

export const promptVersionsRelations = relations(promptVersions, ({ one }) => ({
  prompt: one(prompts, {
    fields: [promptVersions.promptId],
    references: [prompts.id],
  }),
  createdBy: one(users, {
    fields: [promptVersions.createdByUserId],
    references: [users.id],
  }),
}));

// ==================================================
// ALIASES FOR ROUTER COMPATIBILITY
// ==================================================

// Chat router compatibility
export const conversations = chatConversations;
export const messages = chatMessages;
