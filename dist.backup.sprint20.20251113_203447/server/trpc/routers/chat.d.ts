/**
 * Chat tRPC Router
 * SPRINT 8 - Chat Interface
 * 12+ endpoints para gerenciamento de conversas e mensagens
 */
export declare const chatRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1. Listar conversas do usuário
     */
    listConversations: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            userId?: number | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined;
        _input_out: {
            userId: number;
            limit: number;
            offset: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("../../utils/pagination.js").PaginatedResponse<{
        userId: number;
        id: number;
        createdAt: Date | null;
        updatedAt: Date | null;
        isActive: boolean | null;
        modelId: number | null;
        systemPrompt: string | null;
        metadata: unknown;
        title: string | null;
        aiId: number | null;
        lastMessageAt: Date | null;
        messageCount: number | null;
        isRead: boolean | null;
    }>>;
    /**
     * 2. Criar nova conversa
     */
    createConversation: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            userId: number;
            modelId: number;
            systemPrompt?: string | undefined;
            title?: string | undefined;
        };
        _input_out: {
            userId: number;
            modelId: number;
            systemPrompt?: string | undefined;
            title?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        conversation: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            modelId: number | null;
            systemPrompt: string | null;
            metadata: unknown;
            title: string | null;
            aiId: number | null;
            lastMessageAt: Date | null;
            messageCount: number | null;
            isRead: boolean | null;
        };
    }>;
    /**
     * 3. Obter conversa específica
     */
    getConversation: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            id: number;
        };
        _input_out: {
            id: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        conversation: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            modelId: number | null;
            systemPrompt: string | null;
            metadata: unknown;
            title: string | null;
            aiId: number | null;
            lastMessageAt: Date | null;
            messageCount: number | null;
            isRead: boolean | null;
        };
    }>;
    /**
     * 4. Atualizar conversa
     */
    updateConversation: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            id: number;
            systemPrompt?: string | undefined;
            metadata?: any;
            title?: string | undefined;
        };
        _input_out: {
            id: number;
            systemPrompt?: string | undefined;
            metadata?: any;
            title?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        conversation: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            modelId: number | null;
            systemPrompt: string | null;
            metadata: unknown;
            title: string | null;
            aiId: number | null;
            lastMessageAt: Date | null;
            messageCount: number | null;
            isRead: boolean | null;
        };
    }>;
    /**
     * 5. Deletar conversa
     */
    deleteConversation: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            id: number;
        };
        _input_out: {
            id: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: string;
    }>;
    /**
     * 6. Listar mensagens de uma conversa
     */
    listMessages: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            conversationId?: number | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined;
        _input_out: {
            conversationId: number;
            limit: number;
            offset: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("../../utils/pagination.js").PaginatedResponse<{
        [x: string]: any;
    }>>;
    /**
     * 7. Enviar mensagem
     */
    sendMessage: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            conversationId: number;
            content: string;
            role?: "user" | "assistant" | "system" | undefined;
            parentMessageId?: number | undefined;
        };
        _input_out: {
            role: "user" | "assistant" | "system";
            conversationId: number;
            content: string;
            parentMessageId?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: {
            [x: string]: any;
        };
    }>;
    /**
     * 8. Obter mensagem específica
     */
    getMessage: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            id: number;
        };
        _input_out: {
            id: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: {
            [x: string]: any;
        };
        attachments: {
            id: number;
            createdAt: Date | null;
            fileName: string;
            fileType: string | null;
            fileSize: number | null;
            messageId: number;
            fileUrl: string;
        }[];
        reactions: {
            userId: number;
            id: number;
            createdAt: Date | null;
            messageId: number;
            emoji: string;
        }[];
    }>;
    /**
     * 9. Adicionar anexo a mensagem
     */
    addAttachment: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            fileName: string;
            fileType: string;
            messageId: number;
            fileUrl: string;
            fileSize?: number | undefined;
        };
        _input_out: {
            fileName: string;
            fileType: string;
            messageId: number;
            fileUrl: string;
            fileSize?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        attachment: {
            id: number;
            createdAt: Date | null;
            fileName: string;
            fileType: string | null;
            fileSize: number | null;
            messageId: number;
            fileUrl: string;
        };
    }>;
    /**
     * 10. Adicionar reação a mensagem
     */
    addReaction: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            userId: number;
            messageId: number;
            emoji: string;
        };
        _input_out: {
            userId: number;
            messageId: number;
            emoji: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        action: string;
        message: string;
        reaction?: undefined;
    } | {
        success: boolean;
        action: string;
        reaction: {
            userId: number;
            id: number;
            createdAt: Date | null;
            messageId: number;
            emoji: string;
        };
        message?: undefined;
    }>;
    /**
     * 11. Deletar mensagem
     */
    deleteMessage: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            id: number;
        };
        _input_out: {
            id: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: string;
    }>;
    /**
     * 12. Editar mensagem
     */
    editMessage: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            id: number;
            content: string;
        };
        _input_out: {
            id: number;
            content: string;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: {
            [x: string]: any;
        };
    }>;
    /**
     * 13. Buscar mensagens
     */
    searchMessages: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            query: string;
            userId?: number | undefined;
            conversationId?: number | undefined;
            limit?: number | undefined;
        };
        _input_out: {
            query: string;
            limit: number;
            userId?: number | undefined;
            conversationId?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        messages: {
            [x: string]: any;
        }[];
    }>;
    /**
     * 14. Obter estatísticas de conversa
     */
    getConversationStats: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            conversationId: number;
        };
        _input_out: {
            conversationId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        stats: {
            totalMessages: number;
            userMessages: number;
            assistantMessages: number;
            totalCharacters: number;
            avgMessageLength: number;
        };
    }>;
    /**
     * 15. Marcar conversa como lida
     */
    markAsRead: import("@trpc/server").BuildProcedure<"mutation", {
        _config: import("@trpc/server").RootConfig<{
            ctx: import("../trpc.js").Context;
            meta: object;
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").DefaultDataTransformer;
        }>;
        _meta: object;
        _ctx_out: {
            userId: number | undefined;
            db: any;
        };
        _input_in: {
            conversationId: number;
        };
        _input_out: {
            conversationId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: string;
    }>;
}>;
