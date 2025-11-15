/**
 * Knowledge Base tRPC Router
 * SPRINT 15 - Knowledge Management System
 * 16 endpoints para gerenciamento completo de base de conhecimento
 */
export declare const knowledgebaseRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1. Listar todos os itens da base de conhecimento
     */
    list: import("@trpc/server").BuildProcedure<"query", {
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
            query?: string | undefined;
            isActive?: boolean | undefined;
            category?: string | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
        };
        _input_out: {
            limit: number;
            offset: number;
            query?: string | undefined;
            isActive?: boolean | undefined;
            category?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        items: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            category: string | null;
            tags: string[] | null;
            title: string;
            content: string;
            embedding: unknown;
        }[];
        total: number;
        limit: number;
        offset: number;
    }>;
    /**
     * 2. Obter item por ID
     */
    getById: import("@trpc/server").BuildProcedure<"query", {
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
        item: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            category: string | null;
            tags: string[] | null;
            title: string;
            content: string;
            embedding: unknown;
        };
        sources: {
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            lastSync: Date | null;
            knowledgeBaseId: number;
            sourceType: string | null;
            sourceUrl: string | null;
            sourceData: unknown;
        }[];
    }>;
    /**
     * 3. Criar novo item
     */
    create: import("@trpc/server").BuildProcedure<"mutation", {
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
            title: string;
            content: string;
            isActive?: boolean | undefined;
            category?: string | undefined;
            tags?: string[] | undefined;
        };
        _input_out: {
            isActive: boolean;
            title: string;
            content: string;
            category?: string | undefined;
            tags?: string[] | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        item: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            category: string | null;
            tags: string[] | null;
            title: string;
            content: string;
            embedding: unknown;
        };
        message: string;
    }>;
    /**
     * 4. Atualizar item
     */
    update: import("@trpc/server").BuildProcedure<"mutation", {
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
            isActive?: boolean | undefined;
            category?: string | undefined;
            tags?: string[] | undefined;
            title?: string | undefined;
            content?: string | undefined;
        };
        _input_out: {
            id: number;
            isActive?: boolean | undefined;
            category?: string | undefined;
            tags?: string[] | undefined;
            title?: string | undefined;
            content?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        item: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            category: string | null;
            tags: string[] | null;
            title: string;
            content: string;
            embedding: unknown;
        };
        message: string;
    }>;
    /**
     * 5. Deletar item
     */
    delete: import("@trpc/server").BuildProcedure<"mutation", {
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
     * 6. Buscar na base de conhecimento
     */
    search: import("@trpc/server").BuildProcedure<"query", {
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
            category?: string | undefined;
            tags?: string[] | undefined;
        };
        _input_out: {
            query: string;
            category?: string | undefined;
            tags?: string[] | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        results: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            category: string | null;
            tags: string[] | null;
            title: string;
            content: string;
            embedding: unknown;
        }[];
    }>;
    /**
     * 7. Obter estatísticas
     */
    getStats: import("@trpc/server").BuildProcedure<"query", {
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
        _input_in: typeof import("@trpc/server").unsetMarker;
        _input_out: typeof import("@trpc/server").unsetMarker;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        stats: {
            total: number;
            active: number;
            inactive: number;
            categories: Record<string, number>;
            tags: Record<string, number>;
            totalTags: number;
            mostUsedTags: {
                tag: string;
                count: number;
            }[];
        };
    }>;
    /**
     * 8. Listar categorias
     */
    getCategories: import("@trpc/server").BuildProcedure<"query", {
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
        _input_in: typeof import("@trpc/server").unsetMarker;
        _input_out: typeof import("@trpc/server").unsetMarker;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        categories: (string | null)[];
    }>;
    /**
     * 9. Listar tags
     */
    getTags: import("@trpc/server").BuildProcedure<"query", {
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
        _input_in: typeof import("@trpc/server").unsetMarker;
        _input_out: typeof import("@trpc/server").unsetMarker;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        tags: string[];
    }>;
    /**
     * 10. Adicionar source a um item
     */
    addSource: import("@trpc/server").BuildProcedure<"mutation", {
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
            knowledgeBaseId: number;
            sourceType?: string | undefined;
            sourceUrl?: string | undefined;
            sourceData?: Record<string, any> | undefined;
        };
        _input_out: {
            knowledgeBaseId: number;
            sourceType?: string | undefined;
            sourceUrl?: string | undefined;
            sourceData?: Record<string, any> | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        source: {
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            lastSync: Date | null;
            knowledgeBaseId: number;
            sourceType: string | null;
            sourceUrl: string | null;
            sourceData: unknown;
        };
        message: string;
    }>;
    /**
     * 11. Remover source
     */
    removeSource: import("@trpc/server").BuildProcedure<"mutation", {
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
     * 12. Listar sources de um item
     */
    getSources: import("@trpc/server").BuildProcedure<"query", {
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
            knowledgeBaseId: number;
        };
        _input_out: {
            knowledgeBaseId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        sources: {
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            lastSync: Date | null;
            knowledgeBaseId: number;
            sourceType: string | null;
            sourceUrl: string | null;
            sourceData: unknown;
        }[];
    }>;
    /**
     * 13. Duplicar item
     */
    duplicate: import("@trpc/server").BuildProcedure<"mutation", {
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
            newTitle?: string | undefined;
        };
        _input_out: {
            id: number;
            newTitle?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        item: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            category: string | null;
            tags: string[] | null;
            title: string;
            content: string;
            embedding: unknown;
        };
        message: string;
    }>;
    /**
     * 14. Exportar item
     */
    export: import("@trpc/server").BuildProcedure<"query", {
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
        data: {
            title: string;
            content: string;
            category: string | null;
            tags: string[] | null;
            sources: {
                sourceType: string | null;
                sourceUrl: string | null;
                sourceData: unknown;
            }[];
            exportedAt: string;
        };
    }>;
    /**
     * 15. Importar item
     */
    import: import("@trpc/server").BuildProcedure<"mutation", {
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
            data: {
                title: string;
                content: string;
                category?: string | undefined;
                tags?: string[] | undefined;
                sources?: {
                    sourceType?: string | undefined;
                    sourceUrl?: string | undefined;
                    sourceData?: Record<string, any> | undefined;
                }[] | undefined;
            };
        };
        _input_out: {
            data: {
                title: string;
                content: string;
                category?: string | undefined;
                tags?: string[] | undefined;
                sources?: {
                    sourceType?: string | undefined;
                    sourceUrl?: string | undefined;
                    sourceData?: Record<string, any> | undefined;
                }[] | undefined;
            };
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        item: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            category: string | null;
            tags: string[] | null;
            title: string;
            content: string;
            embedding: unknown;
        };
        message: string;
    }>;
    /**
     * 16. Buscar itens similares (por tags)
     */
    findSimilar: import("@trpc/server").BuildProcedure<"query", {
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
            limit?: number | undefined;
        };
        _input_out: {
            id: number;
            limit: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        similar: {
            similarityScore: number;
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            category: string | null;
            tags: string[] | null;
            title: string;
            content: string;
            embedding: unknown;
        }[];
    }>;
}>;
