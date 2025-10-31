/**
 * Chat tRPC Router
 * SPRINT 8 - Chat Interface
 * 12+ endpoints para gerenciamento de conversas e mensagens
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { conversations, messages, messageAttachments, messageReactions } from '../../db/schema.js';
import { eq, and, desc, asc, sql } from 'drizzle-orm';

export const chatRouter = router({
  /**
   * 1. Listar conversas do usuário
   */
  listConversations: publicProcedure
    .input(z.object({
      userId: z.number(),
      limit: z.number().min(1).max(100).optional().default(50),
      offset: z.number().min(0).optional().default(0),
    }))
    .query(async ({ input }) => {
      const userConversations = await db.select()
        .from(conversations)
        .where(eq(conversations.userId, input.userId))
        .orderBy(desc(conversations.lastMessageAt))
        .limit(input.limit)
        .offset(input.offset);

      return { success: true, conversations: userConversations };
    }),

  /**
   * 2. Criar nova conversa
   */
  createConversation: publicProcedure
    .input(z.object({
      userId: z.number(),
      title: z.string().optional(),
      modelId: z.number(),
      systemPrompt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const result: any = await db.insert(conversations).values({
        userId: input.userId,
        title: input.title || 'Nova Conversa',
        modelId: input.modelId,
        systemPrompt: input.systemPrompt,
      });

      const convId = result[0]?.insertId || result.insertId;
      const [conversation] = await db.select().from(conversations).where(eq(conversations.id, convId)).limit(1);

      return { success: true, conversation };
    }),

  /**
   * 3. Obter conversa específica
   */
  getConversation: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const [conversation] = await db.select()
        .from(conversations)
        .where(eq(conversations.id, input.id))
        .limit(1);

      if (!conversation) {
        throw new Error('Conversa não encontrada');
      }

      return { success: true, conversation };
    }),

  /**
   * 4. Atualizar conversa
   */
  updateConversation: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      systemPrompt: z.string().optional(),
      metadata: z.any().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      await db.update(conversations)
        .set(updates)
        .where(eq(conversations.id, id));

      const [updated] = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);

      return { success: true, conversation: updated };
    }),

  /**
   * 5. Deletar conversa
   */
  deleteConversation: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.delete(conversations).where(eq(conversations.id, input.id));
      return { success: true, message: 'Conversa deletada' };
    }),

  /**
   * 6. Listar mensagens de uma conversa
   */
  listMessages: publicProcedure
    .input(z.object({
      conversationId: z.number(),
      limit: z.number().min(1).max(200).optional().default(100),
      offset: z.number().min(0).optional().default(0),
    }))
    .query(async ({ input }) => {
      const conversationMessages = await db.select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId))
        .orderBy(asc(messages.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return { success: true, messages: conversationMessages };
    }),

  /**
   * 7. Enviar mensagem
   */
  sendMessage: publicProcedure
    .input(z.object({
      conversationId: z.number(),
      content: z.string().min(1),
      role: z.enum(['user', 'assistant', 'system']).optional().default('user'),
      parentMessageId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const result: any = await db.insert(messages).values({
        conversationId: input.conversationId,
        content: input.content,
        role: input.role,
        parentMessageId: input.parentMessageId,
      });

      const msgId = result[0]?.insertId || result.insertId;
      const [message] = await db.select().from(messages).where(eq(messages.id, msgId)).limit(1);

      // Atualizar lastMessageAt da conversa
      await db.update(conversations)
        .set({ 
          lastMessageAt: new Date(),
          messageCount: sql`${conversations.messageCount} + 1`,
        })
        .where(eq(conversations.id, input.conversationId));

      return { success: true, message };
    }),

  /**
   * 8. Obter mensagem específica
   */
  getMessage: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const [message] = await db.select()
        .from(messages)
        .where(eq(messages.id, input.id))
        .limit(1);

      if (!message) {
        throw new Error('Mensagem não encontrada');
      }

      // Buscar anexos
      const attachments = await db.select()
        .from(messageAttachments)
        .where(eq(messageAttachments.messageId, input.id));

      // Buscar reações
      const reactions = await db.select()
        .from(messageReactions)
        .where(eq(messageReactions.messageId, input.id));

      return { success: true, message, attachments, reactions };
    }),

  /**
   * 9. Adicionar anexo a mensagem
   */
  addAttachment: publicProcedure
    .input(z.object({
      messageId: z.number(),
      fileName: z.string(),
      fileType: z.string(),
      fileUrl: z.string(),
      fileSize: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const result: any = await db.insert(messageAttachments).values({
        messageId: input.messageId,
        fileName: input.fileName,
        fileType: input.fileType,
        fileUrl: input.fileUrl,
        fileSize: input.fileSize,
      });

      const attId = result[0]?.insertId || result.insertId;
      const [attachment] = await db.select().from(messageAttachments).where(eq(messageAttachments.id, attId)).limit(1);

      return { success: true, attachment };
    }),

  /**
   * 10. Adicionar reação a mensagem
   */
  addReaction: publicProcedure
    .input(z.object({
      messageId: z.number(),
      userId: z.number(),
      emoji: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Verificar se usuário já reagiu com esse emoji
      const [existing] = await db.select()
        .from(messageReactions)
        .where(and(
          eq(messageReactions.messageId, input.messageId),
          eq(messageReactions.userId, input.userId),
          eq(messageReactions.emoji, input.emoji)
        ))
        .limit(1);

      if (existing) {
        // Remover reação
        await db.delete(messageReactions)
          .where(eq(messageReactions.id, existing.id));
        
        return { success: true, action: 'removed', message: 'Reação removida' };
      }

      // Adicionar reação
      const result: any = await db.insert(messageReactions).values({
        messageId: input.messageId,
        userId: input.userId,
        emoji: input.emoji,
      });

      const reactId = result[0]?.insertId || result.insertId;
      const [reaction] = await db.select().from(messageReactions).where(eq(messageReactions.id, reactId)).limit(1);

      return { success: true, action: 'added', reaction };
    }),

  /**
   * 11. Deletar mensagem
   */
  deleteMessage: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.delete(messages).where(eq(messages.id, input.id));
      return { success: true, message: 'Mensagem deletada' };
    }),

  /**
   * 12. Editar mensagem
   */
  editMessage: publicProcedure
    .input(z.object({
      id: z.number(),
      content: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      await db.update(messages)
        .set({
          content: input.content,
          isEdited: true,
          updatedAt: new Date(),
        })
        .where(eq(messages.id, input.id));

      const [updated] = await db.select().from(messages).where(eq(messages.id, input.id)).limit(1);

      return { success: true, message: updated };
    }),

  /**
   * 13. Buscar mensagens
   */
  searchMessages: publicProcedure
    .input(z.object({
      conversationId: z.number().optional(),
      userId: z.number().optional(),
      query: z.string().min(1),
      limit: z.number().min(1).max(50).optional().default(20),
    }))
    .query(async ({ input }) => {
      let dbQuery = db.select()
        .from(messages)
        .where(sql`${messages.content} LIKE ${`%${input.query}%`}`);

      if (input.conversationId) {
        dbQuery = dbQuery.where(eq(messages.conversationId, input.conversationId));
      }

      const results = await dbQuery.limit(input.limit);

      return { success: true, messages: results };
    }),

  /**
   * 14. Obter estatísticas de conversa
   */
  getConversationStats: publicProcedure
    .input(z.object({
      conversationId: z.number(),
    }))
    .query(async ({ input }) => {
      const conversationMessages = await db.select()
        .from(messages)
        .where(eq(messages.conversationId, input.conversationId));

      const userMessages = conversationMessages.filter(m => m.role === 'user');
      const assistantMessages = conversationMessages.filter(m => m.role === 'assistant');

      const totalChars = conversationMessages.reduce((sum, m) => sum + (m.content?.length || 0), 0);
      const avgMessageLength = conversationMessages.length > 0 
        ? totalChars / conversationMessages.length 
        : 0;

      return {
        success: true,
        stats: {
          totalMessages: conversationMessages.length,
          userMessages: userMessages.length,
          assistantMessages: assistantMessages.length,
          totalCharacters: totalChars,
          avgMessageLength,
        },
      };
    }),

  /**
   * 15. Marcar conversa como lida
   */
  markAsRead: publicProcedure
    .input(z.object({
      conversationId: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.update(conversations)
        .set({ isRead: true })
        .where(eq(conversations.id, input.conversationId));

      return { success: true, message: 'Marcada como lida' };
    }),
});
