import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { chatConversations, chatMessages } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { idSchema, createChatConversationSchema, createChatMessageSchema, searchSchema } from '../utils/validation.js';

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
      await db.insert(chatConversations)
        .values(input);

      // Buscar último ID inserido
      const [conversation] = await db.select()
        .from(chatConversations)
        .orderBy(desc(chatConversations.id))
        .limit(1);

      return { id: conversation.id, success: true };
    }),

  createMessage: publicProcedure
    .input(createChatMessageSchema)
    .mutation(async ({ input }) => {
      await db.insert(chatMessages)
        .values(input);

      // Buscar último ID inserido
      const [message] = await db.select()
        .from(chatMessages)
        .orderBy(desc(chatMessages.id))
        .limit(1);

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
