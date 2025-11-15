/**
 * Models tRPC Router
 * AI Model management endpoints
 * 10 endpoints
 */
export declare const modelsRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1. List all AI models
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
            isActive?: boolean | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined;
        _input_out: {
            limit: number;
            offset: number;
            isActive?: boolean | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("../../utils/pagination.js").PaginatedResponse<{
        id: number;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        isActive: boolean | null;
        providerId: number;
        modelId: string;
        capabilities: string[] | null;
        contextWindow: number | null;
        isLoaded: boolean | null;
        priority: number | null;
        modelPath: string | null;
        quantization: string | null;
        parameters: string | null;
        sizeBytes: number | null;
    }>>;
    /**
     * 2. Get model by ID
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
        model: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            providerId: number;
            modelId: string;
            capabilities: string[] | null;
            contextWindow: number | null;
            isLoaded: boolean | null;
            priority: number | null;
            modelPath: string | null;
            quantization: string | null;
            parameters: string | null;
            sizeBytes: number | null;
        };
    }>;
    /**
     * 3. Create new model
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
            name: string;
            modelId: string;
            capabilities?: any;
            contextWindow?: number | undefined;
            quantization?: string | undefined;
            parameters?: string | undefined;
            provider?: string | undefined;
            modelType?: string | undefined;
        };
        _input_out: {
            name: string;
            modelId: string;
            provider: string;
            capabilities?: any;
            contextWindow?: number | undefined;
            quantization?: string | undefined;
            parameters?: string | undefined;
            modelType?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        model: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            providerId: number;
            modelId: string;
            capabilities: string[] | null;
            contextWindow: number | null;
            isLoaded: boolean | null;
            priority: number | null;
            modelPath: string | null;
            quantization: string | null;
            parameters: string | null;
            sizeBytes: number | null;
        };
    }>;
    /**
     * 4. Update model
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
            name?: string | undefined;
            isActive?: boolean | undefined;
            capabilities?: any;
            contextWindow?: number | undefined;
            quantization?: string | undefined;
            parameters?: string | undefined;
        };
        _input_out: {
            id: number;
            name?: string | undefined;
            isActive?: boolean | undefined;
            capabilities?: any;
            contextWindow?: number | undefined;
            quantization?: string | undefined;
            parameters?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        model: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            providerId: number;
            modelId: string;
            capabilities: string[] | null;
            contextWindow: number | null;
            isLoaded: boolean | null;
            priority: number | null;
            modelPath: string | null;
            quantization: string | null;
            parameters: string | null;
            sizeBytes: number | null;
        };
    }>;
    /**
     * 5. Delete model
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
     * 6. Toggle model active status
     */
    toggleActive: import("@trpc/server").BuildProcedure<"mutation", {
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
            isActive: boolean;
        };
        _input_out: {
            id: number;
            isActive: boolean;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        model: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            providerId: number;
            modelId: string;
            capabilities: string[] | null;
            contextWindow: number | null;
            isLoaded: boolean | null;
            priority: number | null;
            modelPath: string | null;
            quantization: string | null;
            parameters: string | null;
            sizeBytes: number | null;
        };
    }>;
    /**
     * 7. List specialized AIs
     */
    listSpecialized: import("@trpc/server").BuildProcedure<"query", {
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
            isActive?: boolean | undefined;
            category?: string | undefined;
        };
        _input_out: {
            isActive?: boolean | undefined;
            category?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        specializedAIs: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            capabilities: string[] | null;
            userId: number;
            description: string | null;
            category: string | null;
            defaultModelId: number | null;
            fallbackModelIds: number[] | null;
            systemPrompt: string;
        }[];
    }>;
    /**
     * 8. Create specialized AI
     */
    createSpecialized: import("@trpc/server").BuildProcedure<"mutation", {
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
            name: string;
            category: string;
            defaultModelId: number;
            description?: string | undefined;
            fallbackModelIds?: number[] | undefined;
            systemPrompt?: string | undefined;
        };
        _input_out: {
            name: string;
            category: string;
            defaultModelId: number;
            description?: string | undefined;
            fallbackModelIds?: number[] | undefined;
            systemPrompt?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        specializedAI: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            capabilities: string[] | null;
            userId: number;
            description: string | null;
            category: string | null;
            defaultModelId: number | null;
            fallbackModelIds: number[] | null;
            systemPrompt: string;
        };
    }>;
    /**
     * 9. Update specialized AI
     */
    updateSpecialized: import("@trpc/server").BuildProcedure<"mutation", {
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
            name?: string | undefined;
            isActive?: boolean | undefined;
            description?: string | undefined;
            defaultModelId?: number | undefined;
            fallbackModelIds?: number[] | undefined;
            systemPrompt?: string | undefined;
        };
        _input_out: {
            id: number;
            name?: string | undefined;
            isActive?: boolean | undefined;
            description?: string | undefined;
            defaultModelId?: number | undefined;
            fallbackModelIds?: number[] | undefined;
            systemPrompt?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        specializedAI: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            capabilities: string[] | null;
            userId: number;
            description: string | null;
            category: string | null;
            defaultModelId: number | null;
            fallbackModelIds: number[] | null;
            systemPrompt: string;
        };
    }>;
    /**
     * 10. Search models
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
            limit?: number | undefined;
        };
        _input_out: {
            query: string;
            limit: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        models: {
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            providerId: number;
            modelId: string;
            capabilities: string[] | null;
            contextWindow: number | null;
            isLoaded: boolean | null;
            priority: number | null;
            modelPath: string | null;
            quantization: string | null;
            parameters: string | null;
            sizeBytes: number | null;
        }[];
    }>;
}>;
