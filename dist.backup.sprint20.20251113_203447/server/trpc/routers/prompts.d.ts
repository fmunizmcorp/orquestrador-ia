/**
 * Prompts tRPC Router
 * SPRINT 9 - Prompt Management
 * 9+ endpoints para gerenciamento de templates de prompts
 */
export declare const promptsRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1. Listar todos os prompts
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
            userId?: number | undefined;
            category?: string | undefined;
            isPublic?: boolean | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined;
        _input_out: {
            limit: number;
            offset: number;
            userId?: number | undefined;
            category?: string | undefined;
            isPublic?: boolean | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("../../utils/pagination.js").PaginatedResponse<{
        description: string | null;
        userId: number;
        category: string | null;
        isPublic: boolean | null;
        id: number;
        title: string;
        content: string;
        tags: string[] | null;
        variables: unknown;
        createdAt: Date | null;
        updatedAt: Date | null;
        useCount: number | null;
        currentVersion: number | null;
    }>>;
    /**
     * 2. Obter prompt específico
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
        prompt: {
            description: string | null;
            userId: number;
            category: string | null;
            isPublic: boolean | null;
            id: number;
            title: string;
            content: string;
            tags: string[] | null;
            variables: unknown;
            createdAt: Date | null;
            updatedAt: Date | null;
            useCount: number | null;
            currentVersion: number | null;
        };
        versions: {
            id: number;
            content: string;
            changelog: string | null;
            promptId: number;
            version: number;
            createdAt: Date | null;
            createdByUserId: number;
        }[];
    }>;
    /**
     * 3. Criar novo prompt
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
            userId: number;
            title: string;
            content: string;
            description?: string | undefined;
            category?: string | undefined;
            isPublic?: boolean | undefined;
            tags?: string | string[] | undefined;
            variables?: string[] | undefined;
        };
        _input_out: {
            userId: number;
            isPublic: boolean;
            title: string;
            content: string;
            description?: string | undefined;
            category?: string | undefined;
            tags?: string | string[] | undefined;
            variables?: string[] | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        prompt: {
            description: string | null;
            userId: number;
            category: string | null;
            isPublic: boolean | null;
            id: number;
            title: string;
            content: string;
            tags: string[] | null;
            variables: unknown;
            createdAt: Date | null;
            updatedAt: Date | null;
            useCount: number | null;
            currentVersion: number | null;
        };
    }>;
    /**
     * 4. Atualizar prompt
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
            userId: number;
            id: number;
            description?: string | undefined;
            category?: string | undefined;
            isPublic?: boolean | undefined;
            title?: string | undefined;
            content?: string | undefined;
            tags?: string | string[] | undefined;
            variables?: string[] | undefined;
            changelog?: string | undefined;
        };
        _input_out: {
            userId: number;
            id: number;
            description?: string | undefined;
            category?: string | undefined;
            isPublic?: boolean | undefined;
            title?: string | undefined;
            content?: string | undefined;
            tags?: string | string[] | undefined;
            variables?: string[] | undefined;
            changelog?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        prompt: {
            description: string | null;
            userId: number;
            category: string | null;
            isPublic: boolean | null;
            id: number;
            title: string;
            content: string;
            tags: string[] | null;
            variables: unknown;
            createdAt: Date | null;
            updatedAt: Date | null;
            useCount: number | null;
            currentVersion: number | null;
        };
    }>;
    /**
     * 5. Deletar prompt
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
     * 6. Buscar prompts
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
            userId?: number | undefined;
            limit?: number | undefined;
        };
        _input_out: {
            query: string;
            limit: number;
            userId?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        prompts: {
            description: string | null;
            userId: number;
            category: string | null;
            isPublic: boolean | null;
            id: number;
            title: string;
            content: string;
            tags: string[] | null;
            variables: unknown;
            createdAt: Date | null;
            updatedAt: Date | null;
            useCount: number | null;
            currentVersion: number | null;
        }[];
    }>;
    /**
     * 7. Listar versões de um prompt
     */
    listVersions: import("@trpc/server").BuildProcedure<"query", {
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
            promptId: number;
        };
        _input_out: {
            promptId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        versions: {
            id: number;
            content: string;
            changelog: string | null;
            promptId: number;
            version: number;
            createdAt: Date | null;
            createdByUserId: number;
        }[];
    }>;
    /**
     * 8. Obter versão específica
     */
    getVersion: import("@trpc/server").BuildProcedure<"query", {
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
            promptId: number;
            version: number;
        };
        _input_out: {
            promptId: number;
            version: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        version: {
            id: number;
            content: string;
            changelog: string | null;
            promptId: number;
            version: number;
            createdAt: Date | null;
            createdByUserId: number;
        };
    }>;
    /**
     * 9. Reverter para versão anterior
     */
    revertToVersion: import("@trpc/server").BuildProcedure<"mutation", {
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
            promptId: number;
            version: number;
        };
        _input_out: {
            userId: number;
            promptId: number;
            version: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        prompt: {
            description: string | null;
            userId: number;
            category: string | null;
            isPublic: boolean | null;
            id: number;
            title: string;
            content: string;
            tags: string[] | null;
            variables: unknown;
            createdAt: Date | null;
            updatedAt: Date | null;
            useCount: number | null;
            currentVersion: number | null;
        };
    }>;
    /**
     * 10. Duplicar prompt
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
            userId: number;
            promptId: number;
            newTitle?: string | undefined;
        };
        _input_out: {
            userId: number;
            promptId: number;
            newTitle?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        prompt: {
            description: string | null;
            userId: number;
            category: string | null;
            isPublic: boolean | null;
            id: number;
            title: string;
            content: string;
            tags: string[] | null;
            variables: unknown;
            createdAt: Date | null;
            updatedAt: Date | null;
            useCount: number | null;
            currentVersion: number | null;
        };
    }>;
    /**
     * 11. Listar categorias únicas
     */
    listCategories: import("@trpc/server").BuildProcedure<"query", {
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
     * 12. Estatísticas de uso
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
        _input_in: {
            promptId: number;
        };
        _input_out: {
            promptId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        stats: {
            totalVersions: number;
            currentVersion: number | null;
            useCount: number;
            isPublic: boolean | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        };
    }>;
}>;
