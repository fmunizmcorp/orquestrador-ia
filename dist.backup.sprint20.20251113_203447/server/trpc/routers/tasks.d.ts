/**
 * Tasks tRPC Router
 * SPRINT 7 - Task Management
 * 15+ endpoints para gerenciamento completo de tarefas e subtarefas
 */
export declare const tasksRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1. Listar todas as tarefas
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
            status?: "planning" | "completed" | "pending" | "in_progress" | "blocked" | "cancelled" | undefined;
            projectId?: number | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
        };
        _input_out: {
            limit: number;
            offset: number;
            status?: "planning" | "completed" | "pending" | "in_progress" | "blocked" | "cancelled" | undefined;
            projectId?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        tasks: {
            description: string;
            userId: number;
            status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            priority: "low" | "medium" | "high" | "urgent" | null;
            projectId: number | null;
            assignedUserId: number | null;
            title: string;
            estimatedHours: string | null;
            actualHours: string | null;
            dueDate: Date | null;
            completedAt: Date | null;
        }[];
    }>;
    /**
     * 2. Obter detalhes de tarefa específica
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
        task: {
            description: string;
            userId: number;
            status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            priority: "low" | "medium" | "high" | "urgent" | null;
            projectId: number | null;
            assignedUserId: number | null;
            title: string;
            estimatedHours: string | null;
            actualHours: string | null;
            dueDate: Date | null;
            completedAt: Date | null;
        };
        subtasks: {
            description: string | null;
            status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            title: string;
            completedAt: Date | null;
            taskId: number;
            assignedModelId: number | null;
            prompt: string;
            result: string | null;
            orderIndex: number | null;
            estimatedDifficulty: "medium" | "easy" | "hard" | "expert" | null;
            reviewedBy: number | null;
            reviewNotes: string | null;
        }[];
        dependencies: {
            id: number;
            createdAt: Date | null;
            taskId: number;
            dependsOnTaskId: number;
            dependencyType: "finish_to_start" | "start_to_start" | "finish_to_finish" | "start_to_finish" | null;
        }[];
    }>;
    /**
     * 3. Criar nova tarefa
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
            projectId: number;
            title: string;
            description?: string | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            assignedUserId?: number | undefined;
            estimatedHours?: number | undefined;
            dueDate?: string | undefined;
        };
        _input_out: {
            priority: "low" | "medium" | "high" | "urgent";
            projectId: number;
            title: string;
            description?: string | undefined;
            assignedUserId?: number | undefined;
            estimatedHours?: number | undefined;
            dueDate?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        task: {
            description: string;
            userId: number;
            status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            priority: "low" | "medium" | "high" | "urgent" | null;
            projectId: number | null;
            assignedUserId: number | null;
            title: string;
            estimatedHours: string | null;
            actualHours: string | null;
            dueDate: Date | null;
            completedAt: Date | null;
        };
    }>;
    /**
     * 4. Atualizar tarefa
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
            status?: "planning" | "completed" | "pending" | "in_progress" | "blocked" | "cancelled" | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            assignedUserId?: number | undefined;
            title?: string | undefined;
            estimatedHours?: number | undefined;
            actualHours?: number | undefined;
            dueDate?: string | undefined;
        };
        _input_out: {
            id: number;
            description?: string | undefined;
            status?: "planning" | "completed" | "pending" | "in_progress" | "blocked" | "cancelled" | undefined;
            priority?: "low" | "medium" | "high" | "urgent" | undefined;
            assignedUserId?: number | undefined;
            title?: string | undefined;
            estimatedHours?: number | undefined;
            actualHours?: number | undefined;
            dueDate?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        task: {
            description: string;
            userId: number;
            status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            priority: "low" | "medium" | "high" | "urgent" | null;
            projectId: number | null;
            assignedUserId: number | null;
            title: string;
            estimatedHours: string | null;
            actualHours: string | null;
            dueDate: Date | null;
            completedAt: Date | null;
        };
    }>;
    /**
     * 5. Deletar tarefa
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
     * 6. Planejar tarefa (gerar subtarefas com IA)
     */
    plan: import("@trpc/server").BuildProcedure<"mutation", {
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
        subtasks: {
            description: string | null;
            status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            title: string;
            completedAt: Date | null;
            taskId: number;
            assignedModelId: number | null;
            prompt: string;
            result: string | null;
            orderIndex: number | null;
            estimatedDifficulty: "medium" | "easy" | "hard" | "expert" | null;
            reviewedBy: number | null;
            reviewNotes: string | null;
        }[];
    }>;
    /**
     * 7. Listar subtarefas de uma tarefa
     */
    listSubtasks: import("@trpc/server").BuildProcedure<"query", {
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
            taskId: number;
        };
        _input_out: {
            taskId: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        subtasks: {
            description: string | null;
            status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            title: string;
            completedAt: Date | null;
            taskId: number;
            assignedModelId: number | null;
            prompt: string;
            result: string | null;
            orderIndex: number | null;
            estimatedDifficulty: "medium" | "easy" | "hard" | "expert" | null;
            reviewedBy: number | null;
            reviewNotes: string | null;
        }[];
    }>;
    /**
     * 8. Criar subtarefa manualmente
     */
    createSubtask: import("@trpc/server").BuildProcedure<"mutation", {
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
            taskId: number;
            description?: string | undefined;
            assignedModelId?: number | undefined;
            orderIndex?: number | undefined;
        };
        _input_out: {
            title: string;
            taskId: number;
            description?: string | undefined;
            assignedModelId?: number | undefined;
            orderIndex?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        subtask: {
            description: string | null;
            status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            title: string;
            completedAt: Date | null;
            taskId: number;
            assignedModelId: number | null;
            prompt: string;
            result: string | null;
            orderIndex: number | null;
            estimatedDifficulty: "medium" | "easy" | "hard" | "expert" | null;
            reviewedBy: number | null;
            reviewNotes: string | null;
        };
    }>;
    /**
     * 9. Atualizar subtarefa
     */
    updateSubtask: import("@trpc/server").BuildProcedure<"mutation", {
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
            status?: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | undefined;
            title?: string | undefined;
            result?: string | undefined;
            reviewNotes?: string | undefined;
        };
        _input_out: {
            id: number;
            description?: string | undefined;
            status?: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | undefined;
            title?: string | undefined;
            result?: string | undefined;
            reviewNotes?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        subtask: {
            description: string | null;
            status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            title: string;
            completedAt: Date | null;
            taskId: number;
            assignedModelId: number | null;
            prompt: string;
            result: string | null;
            orderIndex: number | null;
            estimatedDifficulty: "medium" | "easy" | "hard" | "expert" | null;
            reviewedBy: number | null;
            reviewNotes: string | null;
        };
    }>;
    /**
     * 10. Executar subtarefa com orquestração
     */
    executeSubtask: import("@trpc/server").BuildProcedure<"mutation", {
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
        approved: boolean;
        message: string;
    }>;
    /**
     * 11. Deletar subtarefa
     */
    deleteSubtask: import("@trpc/server").BuildProcedure<"mutation", {
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
     * 12. Adicionar dependência entre tarefas
     */
    addDependency: import("@trpc/server").BuildProcedure<"mutation", {
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
            taskId: number;
            dependsOnTaskId: number;
            dependencyType?: "finish_to_start" | "start_to_start" | "finish_to_finish" | "start_to_finish" | undefined;
        };
        _input_out: {
            taskId: number;
            dependsOnTaskId: number;
            dependencyType: "finish_to_start" | "start_to_start" | "finish_to_finish" | "start_to_finish";
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        dependency: {
            id: number;
            createdAt: Date | null;
            taskId: number;
            dependsOnTaskId: number;
            dependencyType: "finish_to_start" | "start_to_start" | "finish_to_finish" | "start_to_finish" | null;
        };
    }>;
    /**
     * 13. Remover dependência
     */
    removeDependency: import("@trpc/server").BuildProcedure<"mutation", {
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
     * 14. Buscar tarefas
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
            projectId?: number | undefined;
        };
        _input_out: {
            query: string;
            projectId?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        tasks: {
            description: string;
            userId: number;
            status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            priority: "low" | "medium" | "high" | "urgent" | null;
            projectId: number | null;
            assignedUserId: number | null;
            title: string;
            estimatedHours: string | null;
            actualHours: string | null;
            dueDate: Date | null;
            completedAt: Date | null;
        }[];
    }>;
    /**
     * 15. Estatísticas de tarefas
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
            projectId?: number | undefined;
        };
        _input_out: {
            projectId?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        stats: {
            total: number;
            pending: number;
            planning: number;
            inProgress: number;
            completed: number;
            blocked: number;
            cancelled: number;
            completionRate: number;
        };
    }>;
    /**
     * 16. Reordenar subtarefas
     */
    reorderSubtasks: import("@trpc/server").BuildProcedure<"mutation", {
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
            taskId: number;
            subtaskIds: number[];
        };
        _input_out: {
            taskId: number;
            subtaskIds: number[];
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: string;
    }>;
}>;
