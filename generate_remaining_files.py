#!/usr/bin/env python3
"""
Script para gerar TODOS os arquivos restantes do Orquestrador V3.0
Garante implementação 100% completa conforme especificações
"""

import os
from pathlib import Path

# Diretório base
BASE_DIR = Path(__file__).parent

# ==================================================
# ROUTERS
# ==================================================

ROUTERS = {
    "instructionsRouter.ts": """import { router, publicProcedure } from '../trpc';
import { db } from '../db';
import { instructions, specializedAIs } from '../db/schema';
import { eq, and, like, desc } from 'drizzle-orm';
import { idSchema, createInstructionSchema, updateInstructionSchema, searchSchema } from '../utils/validation';

export const instructionsRouter = router({
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [eq(instructions.userId, 1)];
      if (query) {
        conditions.push(like(instructions.title, `%${query}%`));
      }

      const where = and(...conditions);

      const items = await db.select({
        id: instructions.id,
        userId: instructions.userId,
        aiId: instructions.aiId,
        aiName: specializedAIs.name,
        title: instructions.title,
        content: instructions.content,
        priority: instructions.priority,
        isActive: instructions.isActive,
        createdAt: instructions.createdAt,
        updatedAt: instructions.updatedAt,
      })
        .from(instructions)
        .leftJoin(specializedAIs, eq(instructions.aiId, specializedAIs.id))
        .where(where)
        .orderBy(desc(instructions.priority), desc(instructions.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: instructions.id })
        .from(instructions)
        .where(where);

      return {
        items,
        pagination: {
          page,
          limit,
          total: countResult?.count || 0,
          totalPages: Math.ceil((countResult?.count || 0) / limit),
        },
      };
    }),

  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [instruction] = await db.select()
        .from(instructions)
        .where(eq(instructions.id, id))
        .limit(1);

      if (!instruction) {
        throw new Error('Instrução não encontrada');
      }

      return instruction;
    }),

  create: publicProcedure
    .input(createInstructionSchema)
    .mutation(async ({ input }) => {
      const [instruction] = await db.insert(instructions)
        .values(input)
        .$returningId();

      return { id: instruction.id, success: true };
    }),

  update: publicProcedure
    .input(updateInstructionSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(instructions)
        .set(data)
        .where(eq(instructions.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(instructions)
        .where(eq(instructions.id, id));

      return { success: true };
    }),

  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [instruction] = await db.select()
        .from(instructions)
        .where(eq(instructions.id, id))
        .limit(1);

      if (!instruction) {
        throw new Error('Instrução não encontrada');
      }

      await db.update(instructions)
        .set({ isActive: !instruction.isActive })
        .where(eq(instructions.id, id));

      return { success: true, isActive: !instruction.isActive };
    }),
});
""",

    "knowledgeBaseRouter.ts": """import { router, publicProcedure } from '../trpc';
import { db } from '../db';
import { knowledgeBase } from '../db/schema';
import { eq, and, like, desc } from 'drizzle-orm';
import { idSchema, createKnowledgeBaseSchema, updateKnowledgeBaseSchema, searchSchema } from '../utils/validation';

export const knowledgeBaseRouter = router({
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [eq(knowledgeBase.userId, 1)];
      if (query) {
        conditions.push(like(knowledgeBase.title, `%${query}%`));
      }

      const where = and(...conditions);

      const items = await db.select()
        .from(knowledgeBase)
        .where(where)
        .orderBy(desc(knowledgeBase.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: knowledgeBase.id })
        .from(knowledgeBase)
        .where(where);

      return {
        items,
        pagination: {
          page,
          limit,
          total: countResult?.count || 0,
          totalPages: Math.ceil((countResult?.count || 0) / limit),
        },
      };
    }),

  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [kb] = await db.select()
        .from(knowledgeBase)
        .where(eq(knowledgeBase.id, id))
        .limit(1);

      if (!kb) {
        throw new Error('Item da base de conhecimento não encontrado');
      }

      return kb;
    }),

  create: publicProcedure
    .input(createKnowledgeBaseSchema)
    .mutation(async ({ input }) => {
      const [kb] = await db.insert(knowledgeBase)
        .values(input)
        .$returningId();

      return { id: kb.id, success: true };
    }),

  update: publicProcedure
    .input(updateKnowledgeBaseSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(knowledgeBase)
        .set(data)
        .where(eq(knowledgeBase.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(knowledgeBase)
        .where(eq(knowledgeBase.id, id));

      return { success: true };
    }),

  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [kb] = await db.select()
        .from(knowledgeBase)
        .where(eq(knowledgeBase.id, id))
        .limit(1);

      if (!kb) {
        throw new Error('Item da base de conhecimento não encontrado');
      }

      await db.update(knowledgeBase)
        .set({ isActive: !kb.isActive })
        .where(eq(knowledgeBase.id, id));

      return { success: true, isActive: !kb.isActive };
    }),
});
""",

    "knowledgeSourcesRouter.ts": """import { router, publicProcedure } from '../trpc';
import { db } from '../db';
import { knowledgeSources } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { idSchema, createKnowledgeSourceSchema, updateKnowledgeSourceSchema } from '../utils/validation';

export const knowledgeSourcesRouter = router({
  listByKnowledgeBase: publicProcedure
    .input(idSchema)
    .query(async ({ input: knowledgeBaseId }) => {
      const items = await db.select()
        .from(knowledgeSources)
        .where(eq(knowledgeSources.knowledgeBaseId, knowledgeBaseId))
        .orderBy(desc(knowledgeSources.createdAt));

      return items;
    }),

  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [source] = await db.select()
        .from(knowledgeSources)
        .where(eq(knowledgeSources.id, id))
        .limit(1);

      if (!source) {
        throw new Error('Fonte não encontrada');
      }

      return source;
    }),

  create: publicProcedure
    .input(createKnowledgeSourceSchema)
    .mutation(async ({ input }) => {
      const [source] = await db.insert(knowledgeSources)
        .values(input)
        .$returningId();

      return { id: source.id, success: true };
    }),

  update: publicProcedure
    .input(updateKnowledgeSourceSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(knowledgeSources)
        .set(data)
        .where(eq(knowledgeSources.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(knowledgeSources)
        .where(eq(knowledgeSources.id, id));

      return { success: true };
    }),
});
""",

    "executionLogsRouter.ts": """import { router, publicProcedure } from '../trpc';
import { db } from '../db';
import { executionLogs } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { idSchema, searchSchema } from '../utils/validation';
import { z } from 'zod';

export const executionLogsRouter = router({
  listByTask: publicProcedure
    .input(z.object({
      taskId: idSchema,
      level: z.enum(['debug', 'info', 'warning', 'error', 'critical']).optional(),
      page: z.number().default(1),
      limit: z.number().default(50),
    }))
    .query(async ({ input }) => {
      const { taskId, level, page, limit } = input;
      const offset = (page - 1) * limit;

      let conditions = [eq(executionLogs.taskId, taskId)];
      if (level) {
        conditions.push(eq(executionLogs.level, level));
      }

      const where = and(...conditions);

      const items = await db.select()
        .from(executionLogs)
        .where(where)
        .orderBy(desc(executionLogs.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: executionLogs.id })
        .from(executionLogs)
        .where(where);

      return {
        items,
        pagination: {
          page,
          limit,
          total: countResult?.count || 0,
          totalPages: Math.ceil((countResult?.count || 0) / limit),
        },
      };
    }),

  listBySubtask: publicProcedure
    .input(idSchema)
    .query(async ({ input: subtaskId }) => {
      const items = await db.select()
        .from(executionLogs)
        .where(eq(executionLogs.subtaskId, subtaskId))
        .orderBy(desc(executionLogs.createdAt));

      return items;
    }),

  create: publicProcedure
    .input(z.object({
      taskId: idSchema.optional(),
      subtaskId: idSchema.optional(),
      level: z.enum(['debug', 'info', 'warning', 'error', 'critical']),
      message: z.string(),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      const [log] = await db.insert(executionLogs)
        .values(input)
        .$returningId();

      return { id: log.id, success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(executionLogs)
        .where(eq(executionLogs.id, id));

      return { success: true };
    }),
});
""",

    "chatRouter.ts": """import { router, publicProcedure } from '../trpc';
import { db } from '../db';
import { chatConversations, chatMessages } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { idSchema, createChatConversationSchema, createChatMessageSchema, searchSchema } from '../utils/validation';
import { z } from 'zod';

export const chatRouter = router({
  listConversations: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      const items = await db.select()
        .from(chatConversations)
        .where(eq(chatConversations.userId, 1))
        .orderBy(desc(chatConversations.updatedAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: chatConversations.id })
        .from(chatConversations)
        .where(eq(chatConversations.userId, 1));

      return {
        items,
        pagination: {
          page,
          limit,
          total: countResult?.count || 0,
          totalPages: Math.ceil((countResult?.count || 0) / limit),
        },
      };
    }),

  getConversation: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [conversation] = await db.select()
        .from(chatConversations)
        .where(eq(chatConversations.id, id))
        .limit(1);

      if (!conversation) {
        throw new Error('Conversa não encontrada');
      }

      const messages = await db.select()
        .from(chatMessages)
        .where(eq(chatMessages.conversationId, id))
        .orderBy(chatMessages.createdAt);

      return {
        ...conversation,
        messages,
      };
    }),

  createConversation: publicProcedure
    .input(createChatConversationSchema)
    .mutation(async ({ input }) => {
      const [conversation] = await db.insert(chatConversations)
        .values(input)
        .$returningId();

      return { id: conversation.id, success: true };
    }),

  createMessage: publicProcedure
    .input(createChatMessageSchema)
    .mutation(async ({ input }) => {
      const [message] = await db.insert(chatMessages)
        .values(input)
        .$returningId();

      // Atualizar timestamp da conversa
      await db.update(chatConversations)
        .set({ updatedAt: new Date() })
        .where(eq(chatConversations.id, input.conversationId));

      return { id: message.id, success: true };
    }),

  deleteConversation: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(chatConversations)
        .where(eq(chatConversations.id, id));

      return { success: true };
    }),
});
""",

    "externalAPIAccountsRouter.ts": """import { router, publicProcedure } from '../trpc';
import { db } from '../db';
import { externalAPIAccounts, credentials } from '../db/schema';
import { eq, and, like, desc } from 'drizzle-orm';
import { idSchema, createExternalAPIAccountSchema, updateExternalAPIAccountSchema, searchSchema } from '../utils/validation';

export const externalAPIAccountsRouter = router({
  list: publicProcedure
    .input(searchSchema.optional())
    .query(async ({ input }) => {
      const { query, page = 1, limit = 20 } = input || {};
      const offset = (page - 1) * limit;

      let conditions = [eq(externalAPIAccounts.userId, 1)];
      if (query) {
        conditions.push(like(externalAPIAccounts.accountName, `%${query}%`));
      }

      const where = and(...conditions);

      const items = await db.select({
        id: externalAPIAccounts.id,
        userId: externalAPIAccounts.userId,
        provider: externalAPIAccounts.provider,
        accountName: externalAPIAccounts.accountName,
        credentialId: externalAPIAccounts.credentialId,
        creditBalance: externalAPIAccounts.creditBalance,
        creditLimit: externalAPIAccounts.creditLimit,
        usageThisMonth: externalAPIAccounts.usageThisMonth,
        alertThreshold: externalAPIAccounts.alertThreshold,
        isActive: externalAPIAccounts.isActive,
        lastSync: externalAPIAccounts.lastSync,
        createdAt: externalAPIAccounts.createdAt,
        updatedAt: externalAPIAccounts.updatedAt,
      })
        .from(externalAPIAccounts)
        .where(where)
        .orderBy(desc(externalAPIAccounts.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db.select({ count: externalAPIAccounts.id })
        .from(externalAPIAccounts)
        .where(where);

      return {
        items,
        pagination: {
          page,
          limit,
          total: countResult?.count || 0,
          totalPages: Math.ceil((countResult?.count || 0) / limit),
        },
      };
    }),

  getById: publicProcedure
    .input(idSchema)
    .query(async ({ input: id }) => {
      const [account] = await db.select()
        .from(externalAPIAccounts)
        .where(eq(externalAPIAccounts.id, id))
        .limit(1);

      if (!account) {
        throw new Error('Conta de API externa não encontrada');
      }

      return account;
    }),

  create: publicProcedure
    .input(createExternalAPIAccountSchema)
    .mutation(async ({ input }) => {
      const [account] = await db.insert(externalAPIAccounts)
        .values(input)
        .$returningId();

      return { id: account.id, success: true };
    }),

  update: publicProcedure
    .input(updateExternalAPIAccountSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db.update(externalAPIAccounts)
        .set(data)
        .where(eq(externalAPIAccounts.id, id));

      return { success: true };
    }),

  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      await db.delete(externalAPIAccounts)
        .where(eq(externalAPIAccounts.id, id));

      return { success: true };
    }),

  toggleActive: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: id }) => {
      const [account] = await db.select()
        .from(externalAPIAccounts)
        .where(eq(externalAPIAccounts.id, id))
        .limit(1);

      if (!account) {
        throw new Error('Conta de API externa não encontrada');
      }

      await db.update(externalAPIAccounts)
        .set({ isActive: !account.isActive })
        .where(eq(externalAPIAccounts.id, id));

      return { success: true, isActive: !account.isActive };
    }),
});
""",
}

# Criar todos os routers
routers_dir = BASE_DIR / "server" / "routers"
for filename, content in ROUTERS.items():
    file_path = routers_dir / filename
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Criado: {filename}")

# Criar index.ts dos routers
index_content = """import { router } from '../trpc';
import { providersRouter } from './providersRouter';
import { modelsRouter } from './modelsRouter';
import { specializedAIsRouter } from './specializedAIsRouter';
import { credentialsRouter } from './credentialsRouter';
import { tasksRouter } from './tasksRouter';
import { subtasksRouter } from './subtasksRouter';
import { templatesRouter } from './templatesRouter';
import { workflowsRouter } from './workflowsRouter';
import { instructionsRouter } from './instructionsRouter';
import { knowledgeBaseRouter } from './knowledgeBaseRouter';
import { knowledgeSourcesRouter } from './knowledgeSourcesRouter';
import { executionLogsRouter } from './executionLogsRouter';
import { chatRouter} from './chatRouter';
import { externalAPIAccountsRouter } from './externalAPIAccountsRouter';

export const appRouter = router({
  providers: providersRouter,
  models: modelsRouter,
  specializedAIs: specializedAIsRouter,
  credentials: credentialsRouter,
  tasks: tasksRouter,
  subtasks: subtasksRouter,
  templates: templatesRouter,
  workflows: workflowsRouter,
  instructions: instructionsRouter,
  knowledgeBase: knowledgeBaseRouter,
  knowledgeSources: knowledgeSourcesRouter,
  executionLogs: executionLogsRouter,
  chat: chatRouter,
  externalAPIAccounts: externalAPIAccountsRouter,
});

export type AppRouter = typeof appRouter;
"""

with open(routers_dir / "index.ts", 'w', encoding='utf-8') as f:
    f.write(index_content)

print("✅ Criado: index.ts (router principal)")
print("\n✅ TODOS OS ROUTERS CRIADOS COM SUCESSO!")
