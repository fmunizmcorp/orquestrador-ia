/**
 * Projects tRPC Router
 * Project management endpoints
 * 10 endpoints
 */
export declare const projectsRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1. List all projects
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
            status?: "active" | "completed" | "archived" | undefined;
            teamId?: number | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined;
        _input_out: {
            limit: number;
            offset: number;
            status?: "active" | "completed" | "archived" | undefined;
            teamId?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("../../utils/pagination.js").PaginatedResponse<{
        description: string | null;
        userId: number;
        status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
        id: number;
        name: string;
        createdAt: Date | null;
        updatedAt: Date | null;
        isActive: boolean | null;
        teamId: number | null;
        startDate: Date | null;
        endDate: Date | null;
        budget: string | null;
        progress: number | null;
        tags: unknown;
    }>>;
    /**
     * 2. Get project by ID
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
        project: {
            tasksCount: number;
            completedTasks: number;
            description: string | null;
            userId: number;
            status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            teamId: number | null;
            startDate: Date | null;
            endDate: Date | null;
            budget: string | null;
            progress: number | null;
            tags: unknown;
        };
    }>;
    /**
     * 3. Create new project
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
            description?: string | undefined;
            teamId?: number | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            budget?: number | undefined;
        };
        _input_out: {
            name: string;
            description?: string | undefined;
            teamId?: number | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            budget?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        project: {
            description: string | null;
            userId: number;
            status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            teamId: number | null;
            startDate: Date | null;
            endDate: Date | null;
            budget: string | null;
            progress: number | null;
            tags: unknown;
        };
    }>;
    /**
     * 4. Update project
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
            status?: "active" | "completed" | "archived" | undefined;
            name?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            budget?: number | undefined;
        };
        _input_out: {
            id: number;
            description?: string | undefined;
            status?: "active" | "completed" | "archived" | undefined;
            name?: string | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
            budget?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        project: {
            description: string | null;
            userId: number;
            status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            teamId: number | null;
            startDate: Date | null;
            endDate: Date | null;
            budget: string | null;
            progress: number | null;
            tags: unknown;
        };
    }>;
    /**
     * 5. Delete project
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
     * 6. Get project statistics
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
            id: number;
        };
        _input_out: {
            id: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        stats: {
            totalTasks: number;
            completedTasks: number;
            inProgressTasks: number;
            pendingTasks: number;
            blockedTasks: number;
            completionRate: number;
            estimatedHours: number;
            actualHours: number;
        };
    }>;
    /**
     * 7. Search projects
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
            teamId?: number | undefined;
            limit?: number | undefined;
        };
        _input_out: {
            query: string;
            limit: number;
            teamId?: number | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        projects: {
            description: string | null;
            userId: number;
            status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            teamId: number | null;
            startDate: Date | null;
            endDate: Date | null;
            budget: string | null;
            progress: number | null;
            tags: unknown;
        }[];
    }>;
    /**
     * 8. Archive project
     */
    archive: import("@trpc/server").BuildProcedure<"mutation", {
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
        project: {
            description: string | null;
            userId: number;
            status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            teamId: number | null;
            startDate: Date | null;
            endDate: Date | null;
            budget: string | null;
            progress: number | null;
            tags: unknown;
        };
    }>;
    /**
     * 9. Restore project
     */
    restore: import("@trpc/server").BuildProcedure<"mutation", {
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
        project: {
            description: string | null;
            userId: number;
            status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            teamId: number | null;
            startDate: Date | null;
            endDate: Date | null;
            budget: string | null;
            progress: number | null;
            tags: unknown;
        };
    }>;
    /**
     * 10. Duplicate project
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
        project: {
            description: string | null;
            userId: number;
            status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            teamId: number | null;
            startDate: Date | null;
            endDate: Date | null;
            budget: string | null;
            progress: number | null;
            tags: unknown;
        };
    }>;
}>;
