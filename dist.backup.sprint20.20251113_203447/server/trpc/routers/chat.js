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
import pino from 'pino';
import { env, isDevelopment } from '../../config/env.js';
import { createStandardError, handleDatabaseError, ErrorCodes, notFoundError, } from '../../utils/errors.js';
import { paginationInputSchema, createPaginatedResponse, applyPagination, } from '../../utils/pagination.js';
const logger = pino({ level: env.LOG_LEVEL, transport: isDevelopment ? { target: 'pino-pretty' } : undefined });
export const chatRouter = router({
    /**
     * 1. Listar conversas do usuário
     */
    listConversations: publicProcedure
        .input(z.object({
        userId: z.number().optional().default(1),
    }).merge(paginationInputSchema).optional().default({ userId: 1, limit: 50, offset: 0 }))
        .query(async ({ input }) => {
        try {
            // Count total conversations
            const [{ count: total }] = await db
                .select({ count: sql `count(*)` })
                .from(conversations)
                .where(eq(conversations.userId, input.userId));
            // Get paginated conversations
            const { limit, offset } = applyPagination(input);
            const userConversations = await db.select()
                .from(conversations)
                .where(eq(conversations.userId, input.userId))
                .orderBy(desc(conversations.lastMessageAt))
                .limit(limit)
                .offset(offset);
            return createPaginatedResponse(userConversations, total || 0, input);
        }
        catch (error) {
            logger.error({ error, userId: input.userId }, 'Error listing conversations');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Conversation',
                context: { userId: input.userId },
                suggestion: 'Tente novamente ou contate o suporte',
            });
        }
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
        try {
            const result = await db.insert(conversations).values({
                userId: input.userId,
                title: input.title || 'Nova Conversa',
                modelId: input.modelId,
                systemPrompt: input.systemPrompt,
            });
            const convId = result[0]?.insertId || result.insertId;
            if (!convId) {
                throw createStandardError('INTERNAL_SERVER_ERROR', ErrorCodes.INTERNAL_DATABASE_ERROR, 'Falha ao criar conversa no banco de dados', {
                    context: { userId: input.userId, modelId: input.modelId },
                    technicalMessage: 'Failed to get insertId after conversation insert',
                    suggestion: 'Tente novamente ou contate o suporte',
                });
            }
            const [conversation] = await db.select().from(conversations).where(eq(conversations.id, convId)).limit(1);
            return { success: true, conversation };
        }
        catch (error) {
            logger.error({ error, input }, 'Error creating conversation');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Conversation',
                context: { userId: input.userId },
                suggestion: 'Verifique se o usuário e modelo existem',
            });
        }
    }),
    /**
     * 3. Obter conversa específica
     */
    getConversation: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .query(async ({ input }) => {
        try {
            const [conversation] = await db.select()
                .from(conversations)
                .where(eq(conversations.id, input.id))
                .limit(1);
            if (!conversation) {
                throw notFoundError('Conversation', input.id, 'Verifique o ID ou acesse a lista de conversas');
            }
            return { success: true, conversation };
        }
        catch (error) {
            logger.error({ error, conversationId: input.id }, 'Error getting conversation');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Conversation',
                resourceId: input.id,
                suggestion: 'Verifique se a conversa existe',
            });
        }
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
        try {
            const { id, ...updates } = input;
            await db.update(conversations)
                .set(updates)
                .where(eq(conversations.id, id));
            const [updated] = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
            if (!updated) {
                throw notFoundError('Conversation', id, 'A conversa pode ter sido deletada');
            }
            return { success: true, conversation: updated };
        }
        catch (error) {
            logger.error({ error, conversationId: input.id }, 'Error updating conversation');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Conversation',
                resourceId: input.id,
                suggestion: 'Verifique se a conversa existe',
            });
        }
    }),
    /**
     * 5. Deletar conversa
     */
    deleteConversation: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .mutation(async ({ input }) => {
        try {
            const [conversation] = await db.select().from(conversations).where(eq(conversations.id, input.id)).limit(1);
            if (!conversation) {
                throw notFoundError('Conversation', input.id, 'A conversa já foi deletada ou não existe');
            }
            await db.delete(conversations).where(eq(conversations.id, input.id));
            return { success: true, message: 'Conversa deletada' };
        }
        catch (error) {
            logger.error({ error, conversationId: input.id }, 'Error deleting conversation');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Conversation',
                resourceId: input.id,
                suggestion: 'Verifique se a conversa existe',
            });
        }
    }),
    /**
     * 6. Listar mensagens de uma conversa
     */
    listMessages: publicProcedure
        .input(z.object({
        conversationId: z.number().optional().default(1),
        limit: z.number().min(1).max(200).optional().default(100),
        offset: z.number().min(0).optional().default(0),
    }).optional().default({ conversationId: 1, limit: 100, offset: 0 }))
        .query(async ({ input }) => {
        try {
            // Count total messages
            const [{ count: total }] = await db
                .select({ count: sql `count(*)` })
                .from(messages)
                .where(eq(messages.conversationId, input.conversationId));
            // Get paginated messages
            const { limit, offset } = applyPagination(input);
            const conversationMessages = await db.select()
                .from(messages)
                .where(eq(messages.conversationId, input.conversationId))
                .orderBy(asc(messages.createdAt))
                .limit(limit)
                .offset(offset);
            return createPaginatedResponse(conversationMessages, total || 0, input);
        }
        catch (error) {
            logger.error({ error, conversationId: input.conversationId }, 'Error listing messages');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Message',
                context: { conversationId: input.conversationId },
                suggestion: 'Verifique se a conversa existe',
            });
        }
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
        try {
            const result = await db.insert(messages).values({
                conversationId: input.conversationId,
                content: input.content,
                role: input.role,
                parentMessageId: input.parentMessageId,
            });
            const msgId = result[0]?.insertId || result.insertId;
            if (!msgId) {
                throw createStandardError('INTERNAL_SERVER_ERROR', ErrorCodes.INTERNAL_DATABASE_ERROR, 'Falha ao enviar mensagem', {
                    context: { conversationId: input.conversationId },
                    technicalMessage: 'Failed to get insertId after message insert',
                    suggestion: 'Tente novamente ou contate o suporte',
                });
            }
            const [message] = await db.select().from(messages).where(eq(messages.id, msgId)).limit(1);
            // Atualizar lastMessageAt da conversa
            await db.update(conversations)
                .set({
                lastMessageAt: new Date(),
                messageCount: sql `${conversations.messageCount} + 1`,
            })
                .where(eq(conversations.id, input.conversationId));
            return { success: true, message };
        }
        catch (error) {
            logger.error({ error, input }, 'Error sending message');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Message',
                context: { conversationId: input.conversationId },
                suggestion: 'Verifique se a conversa existe',
            });
        }
    }),
    /**
     * 8. Obter mensagem específica
     */
    getMessage: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .query(async ({ input }) => {
        try {
            const [message] = await db.select()
                .from(messages)
                .where(eq(messages.id, input.id))
                .limit(1);
            if (!message) {
                throw notFoundError('Message', input.id, 'Verifique o ID ou acesse a lista de mensagens');
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
        }
        catch (error) {
            logger.error({ error, messageId: input.id }, 'Error getting message');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Message',
                resourceId: input.id,
                suggestion: 'Verifique se a mensagem existe',
            });
        }
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
        try {
            const result = await db.insert(messageAttachments).values({
                messageId: input.messageId,
                fileName: input.fileName,
                fileType: input.fileType,
                fileUrl: input.fileUrl,
                fileSize: input.fileSize,
            });
            const attId = result[0]?.insertId || result.insertId;
            if (!attId) {
                throw createStandardError('INTERNAL_SERVER_ERROR', ErrorCodes.INTERNAL_DATABASE_ERROR, 'Falha ao adicionar anexo', {
                    context: { messageId: input.messageId },
                    technicalMessage: 'Failed to get insertId after attachment insert',
                    suggestion: 'Tente novamente',
                });
            }
            const [attachment] = await db.select().from(messageAttachments).where(eq(messageAttachments.id, attId)).limit(1);
            return { success: true, attachment };
        }
        catch (error) {
            logger.error({ error, input }, 'Error adding attachment');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Attachment',
                context: { messageId: input.messageId },
                suggestion: 'Verifique se a mensagem existe',
            });
        }
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
        try {
            // Verificar se usuário já reagiu com esse emoji
            const [existing] = await db.select()
                .from(messageReactions)
                .where(and(eq(messageReactions.messageId, input.messageId), eq(messageReactions.userId, input.userId), eq(messageReactions.emoji, input.emoji)))
                .limit(1);
            if (existing) {
                // Remover reação
                await db.delete(messageReactions)
                    .where(eq(messageReactions.id, existing.id));
                return { success: true, action: 'removed', message: 'Reação removida' };
            }
            // Adicionar reação
            const result = await db.insert(messageReactions).values({
                messageId: input.messageId,
                userId: input.userId,
                emoji: input.emoji,
            });
            const reactId = result[0]?.insertId || result.insertId;
            const [reaction] = await db.select().from(messageReactions).where(eq(messageReactions.id, reactId)).limit(1);
            return { success: true, action: 'added', reaction };
        }
        catch (error) {
            logger.error({ error, input }, 'Error adding reaction');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Reaction',
                context: { messageId: input.messageId },
                suggestion: 'Verifique se a mensagem existe',
            });
        }
    }),
    /**
     * 11. Deletar mensagem
     */
    deleteMessage: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .mutation(async ({ input }) => {
        try {
            const [message] = await db.select().from(messages).where(eq(messages.id, input.id)).limit(1);
            if (!message) {
                throw notFoundError('Message', input.id, 'A mensagem já foi deletada ou não existe');
            }
            await db.delete(messages).where(eq(messages.id, input.id));
            return { success: true, message: 'Mensagem deletada' };
        }
        catch (error) {
            logger.error({ error, messageId: input.id }, 'Error deleting message');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Message',
                resourceId: input.id,
                suggestion: 'Verifique se a mensagem existe',
            });
        }
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
        try {
            await db.update(messages)
                .set({
                content: input.content,
                isEdited: true,
                updatedAt: new Date(),
            })
                .where(eq(messages.id, input.id));
            const [updated] = await db.select().from(messages).where(eq(messages.id, input.id)).limit(1);
            if (!updated) {
                throw notFoundError('Message', input.id, 'A mensagem pode ter sido deletada');
            }
            return { success: true, message: updated };
        }
        catch (error) {
            logger.error({ error, messageId: input.id }, 'Error editing message');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Message',
                resourceId: input.id,
                suggestion: 'Verifique se a mensagem existe',
            });
        }
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
        try {
            const conditions = [sql `${messages.content} LIKE ${`%${input.query}%`}`];
            if (input.conversationId) {
                conditions.push(eq(messages.conversationId, input.conversationId));
            }
            const results = await db.select()
                .from(messages)
                .where(and(...conditions))
                .limit(input.limit);
            return { success: true, messages: results };
        }
        catch (error) {
            logger.error({ error, query: input.query }, 'Error searching messages');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Message',
                suggestion: 'Tente novamente com termos diferentes',
            });
        }
    }),
    /**
     * 14. Obter estatísticas de conversa
     */
    getConversationStats: publicProcedure
        .input(z.object({
        conversationId: z.number(),
    }))
        .query(async ({ input }) => {
        try {
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
        }
        catch (error) {
            logger.error({ error, conversationId: input.conversationId }, 'Error getting conversation stats');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Conversation',
                resourceId: input.conversationId,
                suggestion: 'Verifique se a conversa existe',
            });
        }
    }),
    /**
     * 15. Marcar conversa como lida
     */
    markAsRead: publicProcedure
        .input(z.object({
        conversationId: z.number(),
    }))
        .mutation(async ({ input }) => {
        try {
            await db.update(conversations)
                .set({ isRead: true })
                .where(eq(conversations.id, input.conversationId));
            return { success: true, message: 'Marcada como lida' };
        }
        catch (error) {
            logger.error({ error, conversationId: input.conversationId }, 'Error marking conversation as read');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Conversation',
                resourceId: input.conversationId,
                suggestion: 'Verifique se a conversa existe',
            });
        }
    }),
});
