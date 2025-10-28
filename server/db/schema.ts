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
  role: mysqlEnum('role', ['admin', 'user']).default('user'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  openIdIdx: uniqueIndex('idx_openId').on(table.openId),
  emailIdx: index('idx_email').on(table.email),
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
// 5. TABELA: credentials
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
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  status: mysqlEnum('status', ['pending', 'planning', 'executing', 'validating', 'completed', 'failed', 'paused']).default('pending'),
  priority: mysqlEnum('priority', ['low', 'medium', 'high', 'urgent']).default('medium'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
  completedAt: timestamp('completedAt'),
}, (table) => ({
  userIdIdx: index('idx_userId').on(table.userId),
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
  reviewedBy: int('reviewedBy').references(() => aiModels.id, { onDelete: 'set null' }),
  reviewNotes: text('reviewNotes'),
  completedAt: timestamp('completedAt'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
}, (table) => ({
  taskIdIdx: index('idx_taskId').on(table.taskId),
  statusIdx: index('idx_status').on(table.status),
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
export const chatMessages = mysqlTable('chatMessages', {
  id: int('id').primaryKey().autoincrement(),
  conversationId: int('conversationId').notNull().references(() => chatConversations.id, { onDelete: 'cascade' }),
  role: mysqlEnum('role', ['user', 'assistant', 'system']).notNull(),
  content: text('content').notNull(),
  attachments: json('attachments'),
  metadata: json('metadata'),
  createdAt: timestamp('createdAt').defaultNow(),
}, (table) => ({
  conversationIdIdx: index('idx_conversationId').on(table.conversationId),
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
