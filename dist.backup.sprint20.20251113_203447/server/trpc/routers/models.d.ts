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
        isActive: boolean | null;
        id: number;
        name: string;
        modelId: string;
        contextWindow: number | null;
        parameters: string | null;
        quantization: string | null;
        capabilities: string[] | null;
        providerId: number;
        createdAt: Date | null;
        updatedAt: Date | null;
        isLoaded: boolean | null;
        priority: number | null;
        modelPath: string | null;
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
            isActive: boolean | null;
            id: number;
            name: string;
            modelId: string;
            contextWindow: number | null;
            parameters: string | null;
            quantization: string | null;
            capabilities: string[] | null;
            providerId: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isLoaded: boolean | null;
            priority: number | null;
            modelPath: string | null;
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
            provider?: string | undefined;
            modelType?: string | undefined;
            contextWindow?: number | undefined;
            parameters?: string | undefined;
            quantization?: string | undefined;
            capabilities?: any;
        };
        _input_out: {
            name: string;
            modelId: string;
            provider: string;
            modelType?: string | undefined;
            contextWindow?: number | undefined;
            parameters?: string | undefined;
            quantization?: string | undefined;
            capabilities?: any;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        model: {
            isActive: boolean | null;
            id: number;
            name: string;
            modelId: string;
            contextWindow: number | null;
            parameters: string | null;
            quantization: string | null;
            capabilities: string[] | null;
            providerId: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isLoaded: boolean | null;
            priority: number | null;
            modelPath: string | null;
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
            isActive?: boolean | undefined;
            name?: string | undefined;
            contextWindow?: number | undefined;
            parameters?: string | undefined;
            quantization?: string | undefined;
            capabilities?: any;
        };
        _input_out: {
            id: number;
            isActive?: boolean | undefined;
            name?: string | undefined;
            contextWindow?: number | undefined;
            parameters?: string | undefined;
            quantization?: string | undefined;
            capabilities?: any;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        model: {
            isActive: boolean | null;
            id: number;
            name: string;
            modelId: string;
            contextWindow: number | null;
            parameters: string | null;
            quantization: string | null;
            capabilities: string[] | null;
            providerId: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isLoaded: boolean | null;
            priority: number | null;
            modelPath: string | null;
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
            isActive: boolean;
            id: number;
        };
        _input_out: {
            isActive: boolean;
            id: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        model: {
            isActive: boolean | null;
            id: number;
            name: string;
            modelId: string;
            contextWindow: number | null;
            parameters: string | null;
            quantization: string | null;
            capabilities: string[] | null;
            providerId: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isLoaded: boolean | null;
            priority: number | null;
            modelPath: string | null;
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
            description: string | null;
            userId: number;
            isActive: boolean | null;
            id: number;
            name: string;
            capabilities: string[] | null;
            category: string | null;
            systemPrompt: string;
            defaultModelId: number | null;
            fallbackModelIds: number[] | null;
            createdAt: Date | null;
            updatedAt: Date | null;
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
            systemPrompt?: string | undefined;
            fallbackModelIds?: number[] | undefined;
        };
        _input_out: {
            name: string;
            category: string;
            defaultModelId: number;
            description?: string | undefined;
            systemPrompt?: string | undefined;
            fallbackModelIds?: number[] | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        specializedAI: {
            description: string | null;
            userId: number;
            isActive: boolean | null;
            id: number;
            name: string;
            capabilities: string[] | null;
            category: string | null;
            systemPrompt: string;
            defaultModelId: number | null;
            fallbackModelIds: number[] | null;
            createdAt: Date | null;
            updatedAt: Date | null;
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
            description?: string | undefined;
            isActive?: boolean | undefined;
            name?: string | undefined;
            systemPrompt?: string | undefined;
            defaultModelId?: number | undefined;
            fallbackModelIds?: number[] | undefined;
        };
        _input_out: {
            id: number;
            description?: string | undefined;
            isActive?: boolean | undefined;
            name?: string | undefined;
            systemPrompt?: string | undefined;
            defaultModelId?: number | undefined;
            fallbackModelIds?: number[] | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        specializedAI: {
            description: string | null;
            userId: number;
            isActive: boolean | null;
            id: number;
            name: string;
            capabilities: string[] | null;
            category: string | null;
            systemPrompt: string;
            defaultModelId: number | null;
            fallbackModelIds: number[] | null;
            createdAt: Date | null;
            updatedAt: Date | null;
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
            isActive: boolean | null;
            id: number;
            name: string;
            modelId: string;
            contextWindow: number | null;
            parameters: string | null;
            quantization: string | null;
            capabilities: string[] | null;
            providerId: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isLoaded: boolean | null;
            priority: number | null;
            modelPath: string | null;
            sizeBytes: number | null;
        }[];
    }>;
    /**
     * 11. Discover models from LM Studio
     */
    discoverModels: import("@trpc/server").BuildProcedure<"query", {
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
        _input_in: {} | undefined;
        _input_out: {} | undefined;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        discovered: any;
        totalDiscovered: any;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        discovered: never[];
        totalDiscovered: number;
        message: string;
        error: any;
    }>;
}>;
