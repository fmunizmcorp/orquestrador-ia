/**
 * Templates tRPC Router
 * SPRINT 14 - Template Management & Usage
 * 14 endpoints para gerenciamento completo de templates de IA
 */
export declare const templatesRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1. Listar todos os templates
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
            category?: string | undefined;
            isPublic?: boolean | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
        };
        _input_out: {
            limit: number;
            offset: number;
            query?: string | undefined;
            category?: string | undefined;
            isPublic?: boolean | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        items: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            category: string | null;
            templateData: unknown;
            isPublic: boolean | null;
            usageCount: number | null;
        }[];
        total: number;
        limit: number;
        offset: number;
    }>;
    /**
     * 2. Obter template por ID
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
        template: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            category: string | null;
            templateData: unknown;
            isPublic: boolean | null;
            usageCount: number | null;
        };
    }>;
    /**
     * 3. Criar novo template
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
            templateData: {
                systemPrompt?: string | undefined;
                tags?: string[] | undefined;
                variables?: {
                    type: "number" | "boolean" | "text" | "select";
                    name: string;
                    label: string;
                    description?: string | undefined;
                    options?: string[] | undefined;
                    defaultValue?: any;
                    required?: boolean | undefined;
                }[] | undefined;
                examples?: {
                    input: Record<string, any>;
                    output: string;
                }[] | undefined;
                userPromptTemplate?: string | undefined;
                modelConfig?: {
                    temperature?: number | undefined;
                    maxTokens?: number | undefined;
                    topP?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    presencePenalty?: number | undefined;
                } | undefined;
            };
            description?: string | undefined;
            category?: string | undefined;
            isPublic?: boolean | undefined;
        };
        _input_out: {
            name: string;
            templateData: {
                systemPrompt?: string | undefined;
                tags?: string[] | undefined;
                variables?: {
                    type: "number" | "boolean" | "text" | "select";
                    name: string;
                    label: string;
                    description?: string | undefined;
                    options?: string[] | undefined;
                    defaultValue?: any;
                    required?: boolean | undefined;
                }[] | undefined;
                examples?: {
                    input: Record<string, any>;
                    output: string;
                }[] | undefined;
                userPromptTemplate?: string | undefined;
                modelConfig?: {
                    temperature?: number | undefined;
                    maxTokens?: number | undefined;
                    topP?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    presencePenalty?: number | undefined;
                } | undefined;
            };
            isPublic: boolean;
            description?: string | undefined;
            category?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        template: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            category: string | null;
            templateData: unknown;
            isPublic: boolean | null;
            usageCount: number | null;
        };
        message: string;
    }>;
    /**
     * 4. Atualizar template
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
            description?: string | undefined;
            name?: string | undefined;
            category?: string | undefined;
            templateData?: {
                systemPrompt?: string | undefined;
                tags?: string[] | undefined;
                variables?: {
                    type: "number" | "boolean" | "text" | "select";
                    name: string;
                    label: string;
                    description?: string | undefined;
                    options?: string[] | undefined;
                    defaultValue?: any;
                    required?: boolean | undefined;
                }[] | undefined;
                examples?: {
                    input: Record<string, any>;
                    output: string;
                }[] | undefined;
                userPromptTemplate?: string | undefined;
                modelConfig?: {
                    temperature?: number | undefined;
                    maxTokens?: number | undefined;
                    topP?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    presencePenalty?: number | undefined;
                } | undefined;
            } | undefined;
            isPublic?: boolean | undefined;
        };
        _input_out: {
            id: number;
            description?: string | undefined;
            name?: string | undefined;
            category?: string | undefined;
            templateData?: {
                systemPrompt?: string | undefined;
                tags?: string[] | undefined;
                variables?: {
                    type: "number" | "boolean" | "text" | "select";
                    name: string;
                    label: string;
                    description?: string | undefined;
                    options?: string[] | undefined;
                    defaultValue?: any;
                    required?: boolean | undefined;
                }[] | undefined;
                examples?: {
                    input: Record<string, any>;
                    output: string;
                }[] | undefined;
                userPromptTemplate?: string | undefined;
                modelConfig?: {
                    temperature?: number | undefined;
                    maxTokens?: number | undefined;
                    topP?: number | undefined;
                    frequencyPenalty?: number | undefined;
                    presencePenalty?: number | undefined;
                } | undefined;
            } | undefined;
            isPublic?: boolean | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        template: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            category: string | null;
            templateData: unknown;
            isPublic: boolean | null;
            usageCount: number | null;
        };
        message: string;
    }>;
    /**
     * 5. Deletar template
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
     * 6. Duplicar template
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
            newName?: string | undefined;
        };
        _input_out: {
            id: number;
            newName?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        template: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            category: string | null;
            templateData: unknown;
            isPublic: boolean | null;
            usageCount: number | null;
        };
        message: string;
    }>;
    /**
     * 7. Usar template (incrementar contador de uso)
     */
    use: import("@trpc/server").BuildProcedure<"mutation", {
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
            variables?: Record<string, any> | undefined;
        };
        _input_out: {
            id: number;
            variables?: Record<string, any> | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        processedPrompt: any;
        systemPrompt: any;
        modelConfig: any;
        message: string;
    }>;
    /**
     * 8. Buscar templates
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
            isPublic?: boolean | undefined;
        };
        _input_out: {
            query: string;
            category?: string | undefined;
            isPublic?: boolean | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        templates: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            category: string | null;
            templateData: unknown;
            isPublic: boolean | null;
            usageCount: number | null;
        }[];
    }>;
    /**
     * 9. Estatísticas de templates
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
            public: number;
            private: number;
            totalUsage: number;
            categories: Record<string, number>;
            mostUsed: {
                id: number;
                name: string;
                usageCount: number | null;
            }[];
        };
    }>;
    /**
     * 10. Listar categorias
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
     * 11. Exportar template (JSON)
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
            name: string;
            description: string | null;
            category: string | null;
            templateData: unknown;
            version: string;
            exportedAt: string;
        };
    }>;
    /**
     * 12. Importar template (JSON)
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
                name: string;
                templateData: {
                    systemPrompt?: string | undefined;
                    tags?: string[] | undefined;
                    variables?: {
                        type: "number" | "boolean" | "text" | "select";
                        name: string;
                        label: string;
                        description?: string | undefined;
                        options?: string[] | undefined;
                        defaultValue?: any;
                        required?: boolean | undefined;
                    }[] | undefined;
                    examples?: {
                        input: Record<string, any>;
                        output: string;
                    }[] | undefined;
                    userPromptTemplate?: string | undefined;
                    modelConfig?: {
                        temperature?: number | undefined;
                        maxTokens?: number | undefined;
                        topP?: number | undefined;
                        frequencyPenalty?: number | undefined;
                        presencePenalty?: number | undefined;
                    } | undefined;
                };
                description?: string | undefined;
                category?: string | undefined;
            };
        };
        _input_out: {
            data: {
                name: string;
                templateData: {
                    systemPrompt?: string | undefined;
                    tags?: string[] | undefined;
                    variables?: {
                        type: "number" | "boolean" | "text" | "select";
                        name: string;
                        label: string;
                        description?: string | undefined;
                        options?: string[] | undefined;
                        defaultValue?: any;
                        required?: boolean | undefined;
                    }[] | undefined;
                    examples?: {
                        input: Record<string, any>;
                        output: string;
                    }[] | undefined;
                    userPromptTemplate?: string | undefined;
                    modelConfig?: {
                        temperature?: number | undefined;
                        maxTokens?: number | undefined;
                        topP?: number | undefined;
                        frequencyPenalty?: number | undefined;
                        presencePenalty?: number | undefined;
                    } | undefined;
                };
                description?: string | undefined;
                category?: string | undefined;
            };
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        template: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            category: string | null;
            templateData: unknown;
            isPublic: boolean | null;
            usageCount: number | null;
        };
        message: string;
    }>;
    /**
     * 13. Validar variáveis do template
     */
    validateVariables: import("@trpc/server").BuildProcedure<"query", {
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
            variables: Record<string, any>;
        };
        _input_out: {
            id: number;
            variables: Record<string, any>;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        valid: boolean;
        errors: string[];
    }>;
    /**
     * 14. Obter templates públicos populares
     */
    getPopular: import("@trpc/server").BuildProcedure<"query", {
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
            limit?: number | undefined;
        };
        _input_out: {
            limit: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        templates: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            category: string | null;
            templateData: unknown;
            isPublic: boolean | null;
            usageCount: number | null;
        }[];
    }>;
}>;
