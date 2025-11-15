/**
 * Workflows tRPC Router
 * SPRINT 12 - Workflow Management & Execution
 * 18 endpoints para gerenciamento completo de workflows e execuções
 */
export declare const workflowsRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1. Listar todos os workflows
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
            limit?: number | undefined;
            offset?: number | undefined;
        };
        _input_out: {
            limit: number;
            offset: number;
            query?: string | undefined;
            isActive?: boolean | undefined;
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
            isActive: boolean | null;
            steps: unknown;
        }[];
        total: number;
        limit: number;
        offset: number;
    }>;
    /**
     * 2. Obter workflow por ID
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
        workflow: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            steps: unknown;
        };
    }>;
    /**
     * 3. Criar novo workflow
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
            steps: {
                type: "task" | "notification" | "condition" | "loop" | "parallel" | "ai_generation" | "api_call";
                id: string;
                name: string;
                description?: string | undefined;
                config?: Record<string, any> | undefined;
                nextStepId?: string | null | undefined;
                conditionalSteps?: {
                    condition: string;
                    nextStepId: string;
                }[] | undefined;
            }[];
            description?: string | undefined;
            isActive?: boolean | undefined;
        };
        _input_out: {
            name: string;
            isActive: boolean;
            steps: {
                type: "task" | "notification" | "condition" | "loop" | "parallel" | "ai_generation" | "api_call";
                id: string;
                name: string;
                description?: string | undefined;
                config?: Record<string, any> | undefined;
                nextStepId?: string | null | undefined;
                conditionalSteps?: {
                    condition: string;
                    nextStepId: string;
                }[] | undefined;
            }[];
            description?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        workflow: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            steps: unknown;
        };
        message: string;
    }>;
    /**
     * 4. Atualizar workflow
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
            isActive?: boolean | undefined;
            steps?: {
                type: "task" | "notification" | "condition" | "loop" | "parallel" | "ai_generation" | "api_call";
                id: string;
                name: string;
                description?: string | undefined;
                config?: Record<string, any> | undefined;
                nextStepId?: string | null | undefined;
                conditionalSteps?: {
                    condition: string;
                    nextStepId: string;
                }[] | undefined;
            }[] | undefined;
        };
        _input_out: {
            id: number;
            description?: string | undefined;
            name?: string | undefined;
            isActive?: boolean | undefined;
            steps?: {
                type: "task" | "notification" | "condition" | "loop" | "parallel" | "ai_generation" | "api_call";
                id: string;
                name: string;
                description?: string | undefined;
                config?: Record<string, any> | undefined;
                nextStepId?: string | null | undefined;
                conditionalSteps?: {
                    condition: string;
                    nextStepId: string;
                }[] | undefined;
            }[] | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        workflow: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            steps: unknown;
        };
        message: string;
    }>;
    /**
     * 5. Deletar workflow
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
     * 6. Duplicar workflow
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
        workflow: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            steps: unknown;
        };
        message: string;
    }>;
    /**
     * 7. Ativar/Desativar workflow
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
        workflow: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            steps: unknown;
        };
        message: string;
    }>;
    /**
     * 8. Validar workflow (verificar se steps são válidos)
     */
    validate: import("@trpc/server").BuildProcedure<"query", {
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
            steps: {
                type: "task" | "notification" | "condition" | "loop" | "parallel" | "ai_generation" | "api_call";
                id: string;
                name: string;
                description?: string | undefined;
                config?: Record<string, any> | undefined;
                nextStepId?: string | null | undefined;
                conditionalSteps?: {
                    condition: string;
                    nextStepId: string;
                }[] | undefined;
            }[];
        };
        _input_out: {
            steps: {
                type: "task" | "notification" | "condition" | "loop" | "parallel" | "ai_generation" | "api_call";
                id: string;
                name: string;
                description?: string | undefined;
                config?: Record<string, any> | undefined;
                nextStepId?: string | null | undefined;
                conditionalSteps?: {
                    condition: string;
                    nextStepId: string;
                }[] | undefined;
            }[];
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        valid: boolean;
        errors: string[];
        initialSteps: string[];
    }>;
    /**
     * 9. Executar workflow (simulação básica)
     */
    execute: import("@trpc/server").BuildProcedure<"mutation", {
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
            context?: Record<string, any> | undefined;
        };
        _input_out: {
            id: number;
            context?: Record<string, any> | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        execution: {
            workflowId: number;
            workflowName: string;
            status: string;
            startedAt: string;
            completedAt: string;
            steps: any[];
            context: Record<string, any>;
        };
        message: string;
    }>;
    /**
     * 10. Obter histórico de execuções (simulado via logs)
     */
    getExecutionHistory: import("@trpc/server").BuildProcedure<"query", {
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
        executions: any[];
        total: number;
    }>;
    /**
     * 11. Buscar workflows
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
            isActive?: boolean | undefined;
        };
        _input_out: {
            query: string;
            isActive?: boolean | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        workflows: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            steps: unknown;
        }[];
    }>;
    /**
     * 12. Estatísticas de workflows
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
            averageSteps: number;
        };
    }>;
    /**
     * 13. Exportar workflow (JSON)
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
            steps: unknown;
            version: string;
            exportedAt: string;
        };
    }>;
    /**
     * 14. Importar workflow (JSON)
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
                steps: {
                    type: "task" | "notification" | "condition" | "loop" | "parallel" | "ai_generation" | "api_call";
                    id: string;
                    name: string;
                    description?: string | undefined;
                    config?: Record<string, any> | undefined;
                    nextStepId?: string | null | undefined;
                    conditionalSteps?: {
                        condition: string;
                        nextStepId: string;
                    }[] | undefined;
                }[];
                description?: string | undefined;
            };
        };
        _input_out: {
            data: {
                name: string;
                steps: {
                    type: "task" | "notification" | "condition" | "loop" | "parallel" | "ai_generation" | "api_call";
                    id: string;
                    name: string;
                    description?: string | undefined;
                    config?: Record<string, any> | undefined;
                    nextStepId?: string | null | undefined;
                    conditionalSteps?: {
                        condition: string;
                        nextStepId: string;
                    }[] | undefined;
                }[];
                description?: string | undefined;
            };
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        workflow: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            steps: unknown;
        };
        message: string;
    }>;
    /**
     * 15. Obter templates de workflow predefinidos
     */
    getTemplates: import("@trpc/server").BuildProcedure<"query", {
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
        templates: ({
            id: string;
            name: string;
            description: string;
            steps: ({
                id: string;
                name: string;
                type: "condition";
                description: string;
                conditionalSteps: {
                    condition: string;
                    nextStepId: string;
                }[];
                nextStepId?: undefined;
            } | {
                id: string;
                name: string;
                type: "task";
                description: string;
                nextStepId: null;
                conditionalSteps?: undefined;
            })[];
        } | {
            id: string;
            name: string;
            description: string;
            steps: ({
                id: string;
                name: string;
                type: "task";
                description: string;
                nextStepId: string;
            } | {
                id: string;
                name: string;
                type: "ai_generation";
                description: string;
                nextStepId: string;
            } | {
                id: string;
                name: string;
                type: "task";
                description: string;
                nextStepId: null;
            })[];
        } | {
            id: string;
            name: string;
            description: string;
            steps: ({
                id: string;
                name: string;
                type: "task";
                description: string;
                nextStepId: string;
                config?: undefined;
            } | {
                id: string;
                name: string;
                type: "parallel";
                description: string;
                config: {
                    parallelSteps: string[];
                };
                nextStepId: string;
            } | {
                id: string;
                name: string;
                type: "task";
                description: string;
                nextStepId: null;
                config?: undefined;
            })[];
        })[];
    }>;
    /**
     * 16. Criar workflow a partir de template
     */
    createFromTemplate: import("@trpc/server").BuildProcedure<"mutation", {
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
            templateId: string;
            description?: string | undefined;
        };
        _input_out: {
            name: string;
            templateId: string;
            description?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        workflow: {
            description: string | null;
            userId: number;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            steps: unknown;
        };
        message: string;
    }>;
    /**
     * 17. Clonar step de workflow
     */
    cloneStep: import("@trpc/server").BuildProcedure<"mutation", {
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
            stepId: string;
            workflowId: number;
        };
        _input_out: {
            stepId: string;
            workflowId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        step: any;
        message: string;
    }>;
    /**
     * 18. Reordenar steps de workflow
     */
    reorderSteps: import("@trpc/server").BuildProcedure<"mutation", {
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
            workflowId: number;
            stepIds: string[];
        };
        _input_out: {
            workflowId: number;
            stepIds: string[];
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: string;
    }>;
}>;
