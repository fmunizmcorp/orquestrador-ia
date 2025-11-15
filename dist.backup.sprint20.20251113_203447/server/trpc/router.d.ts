/**
 * Main tRPC Router
 * Aggregates all sub-routers into a single API
 * 180+ endpoints across 14 routers
 */
/**
 * Main application router
 * Combines all feature routers
 */
export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        userId: number;
        req: import("express").Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
        res: import("express").Response<any, Record<string, any>>;
    };
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: any;
}>, {
    auth: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        register: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                email: string;
                password: string;
                username?: string | undefined;
            };
            _input_out: {
                name: string;
                email: string;
                password: string;
                username?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            user: {
                id: number;
                email: string;
                name: string;
                username: string | null;
            };
            token: string;
        }>;
        login: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                email: string;
                password: string;
            };
            _input_out: {
                email: string;
                password: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            user: {
                id: number;
                email: string;
                name: string;
                username: string | null;
            };
            token: string;
        }>;
        verifyToken: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                token: string;
            };
            _input_out: {
                token: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            valid: boolean;
            user: {
                id: number;
                email: string;
                name: string;
                username: string | null;
            };
            error?: undefined;
        } | {
            success: boolean;
            valid: boolean;
            error: string;
            user?: undefined;
        }>;
        refreshToken: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                token: string;
            };
            _input_out: {
                token: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            token: string;
        }>;
        logout: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            message: string;
        }>;
    }>;
    users: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            user: {
                id: number;
                openId: string;
                name: string;
                email: string;
                username: string | null;
                lastLoginAt: Date | null;
                avatarUrl: string | null;
                bio: string | null;
                preferences: unknown;
                role: "admin" | "user" | null;
                createdAt: Date | null;
                updatedAt: Date | null;
            };
        }>;
        getProfile: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            };
            _input_out: {
                userId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            profile: {
                id: number;
                openId: string;
                name: string;
                email: string;
                username: string | null;
                lastLoginAt: Date | null;
                avatarUrl: string | null;
                bio: string | null;
                preferences: unknown;
                role: "admin" | "user" | null;
                createdAt: Date | null;
                updatedAt: Date | null;
            };
        }>;
        updateProfile: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                name?: string | undefined;
                email?: string | undefined;
                username?: string | undefined;
                avatarUrl?: string | undefined;
                bio?: string | undefined;
            };
            _input_out: {
                userId: number;
                name?: string | undefined;
                email?: string | undefined;
                username?: string | undefined;
                avatarUrl?: string | undefined;
                bio?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            user: {
                id: number;
                openId: string;
                name: string;
                email: string;
                username: string | null;
                lastLoginAt: Date | null;
                avatarUrl: string | null;
                bio: string | null;
                preferences: unknown;
                role: "admin" | "user" | null;
                createdAt: Date | null;
                updatedAt: Date | null;
            };
        }>;
        changePassword: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                currentPassword: string;
                newPassword: string;
            };
            _input_out: {
                userId: number;
                currentPassword: string;
                newPassword: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                offset?: number | undefined;
            } | undefined;
            _input_out: {
                limit: number;
                offset: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../utils/pagination.js").PaginatedResponse<{
            id: number;
            openId: string;
            name: string;
            email: string;
            username: string | null;
            lastLoginAt: Date | null;
            avatarUrl: string | null;
            bio: string | null;
            preferences: unknown;
            role: "admin" | "user" | null;
            createdAt: Date | null;
            updatedAt: Date | null;
        }>>;
        search: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            users: {
                id: number;
                openId: string;
                name: string;
                email: string;
                username: string | null;
                lastLoginAt: Date | null;
                avatarUrl: string | null;
                bio: string | null;
                preferences: unknown;
                role: "admin" | "user" | null;
                createdAt: Date | null;
                updatedAt: Date | null;
            }[];
        }>;
        updatePreferences: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                preferences?: any;
            };
            _input_out: {
                userId: number;
                preferences?: any;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            preferences: unknown;
        }>;
        deleteAccount: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                password: string;
            };
            _input_out: {
                userId: number;
                password: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        getStatistics: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            };
            _input_out: {
                userId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            statistics: {
                totalTasks: number;
                completedTasks: number;
                totalProjects: number;
                totalConversations: number;
                totalTemplates: number;
                totalWorkflows: number;
            };
        }>;
        getActivity: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                limit?: number | undefined;
            };
            _input_out: {
                userId: number;
                limit: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            activities: {
                userId: number | null;
                id: number;
                action: string;
                timestamp: Date | null;
                resourceType: string | null;
                resourceId: number | null;
                changes: unknown;
                ipAddress: string | null;
                userAgent: string | null;
            }[];
        }>;
        uploadAvatar: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                avatarData: string;
            };
            _input_out: {
                userId: number;
                avatarData: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            avatarUrl: string;
        }>;
        getSessions: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            };
            _input_out: {
                userId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            sessions: {
                id: number;
                deviceName: string;
                location: string;
                ipAddress: string;
                lastActive: string;
                isCurrent: boolean;
            }[];
        }>;
        revokeSession: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                sessionId: number;
            };
            _input_out: {
                userId: number;
                sessionId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        exportData: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            };
            _input_out: {
                userId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            exportDate: string;
            user: {
                id: number;
                openId: string;
                name: string;
                email: string;
                username: string | null;
                lastLoginAt: Date | null;
                avatarUrl: string | null;
                bio: string | null;
                preferences: unknown;
                role: "admin" | "user" | null;
                createdAt: Date | null;
                updatedAt: Date | null;
            };
            tasks: {
                description: string;
                userId: number;
                status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
                id: number;
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                projectId: number | null;
                assignedUserId: number | null;
                estimatedHours: string | null;
                actualHours: string | null;
                dueDate: Date | null;
                completedAt: Date | null;
            }[];
            projects: {
                description: string | null;
                userId: number;
                status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
                id: number;
                tags: unknown;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                teamId: number | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
            }[];
            conversations: {
                userId: number;
                id: number;
                title: string | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                modelId: number | null;
                systemPrompt: string | null;
                metadata: unknown;
                aiId: number | null;
                lastMessageAt: Date | null;
                messageCount: number | null;
                isRead: boolean | null;
            }[];
        }>;
    }>;
    teams: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                offset?: number | undefined;
            } | undefined;
            _input_out: {
                limit: number;
                offset: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../utils/pagination.js").PaginatedResponse<{
            description: string | null;
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            ownerId: number;
        }>>;
        getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            team: {
                memberCount: number;
                description: string | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                ownerId: number;
            };
        }>;
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                ownerId: number;
                description?: string | undefined;
            };
            _input_out: {
                name: string;
                ownerId: number;
                description?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            team: {
                description: string | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                ownerId: number;
            };
        }>;
        update: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            };
            _input_out: {
                id: number;
                description?: string | undefined;
                name?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            team: {
                description: string | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                ownerId: number;
            };
        }>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getMembers: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                teamId: number;
            };
            _input_out: {
                teamId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            members: {
                user: {
                    id: number;
                    name: string;
                    email: string;
                    username: string | null;
                } | null;
                userId: number;
                id: number;
                role: "admin" | "owner" | "member" | "viewer" | null;
                teamId: number;
                joinedAt: Date | null;
            }[];
        }>;
        addMember: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                teamId: number;
                role?: "admin" | "owner" | "member" | "viewer" | undefined;
            };
            _input_out: {
                userId: number;
                role: "admin" | "owner" | "member" | "viewer";
                teamId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            member: {
                userId: number;
                id: number;
                role: "admin" | "owner" | "member" | "viewer" | null;
                teamId: number;
                joinedAt: Date | null;
            };
        }>;
        updateMemberRole: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                role: "admin" | "owner" | "member" | "viewer";
                memberId: number;
            };
            _input_out: {
                role: "admin" | "owner" | "member" | "viewer";
                memberId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            member: {
                userId: number;
                id: number;
                role: "admin" | "owner" | "member" | "viewer" | null;
                teamId: number;
                joinedAt: Date | null;
            };
        }>;
        removeMember: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                memberId: number;
            };
            _input_out: {
                memberId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
    }>;
    projects: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                limit?: number | undefined;
                offset?: number | undefined;
                teamId?: number | undefined;
            } | undefined;
            _input_out: {
                limit: number;
                offset: number;
                status?: "active" | "completed" | "archived" | undefined;
                teamId?: number | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../utils/pagination.js").PaginatedResponse<{
            description: string | null;
            userId: number;
            status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
            id: number;
            tags: unknown;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            teamId: number | null;
            startDate: Date | null;
            endDate: Date | null;
            budget: string | null;
            progress: number | null;
        }>>;
        getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                tags: unknown;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                teamId: number | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
            };
        }>;
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                tags: unknown;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                teamId: number | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
            };
        }>;
        update: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                tags: unknown;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                teamId: number | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
            };
        }>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getStats: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        search: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                teamId?: number | undefined;
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
                tags: unknown;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                teamId: number | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
            }[];
        }>;
        archive: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                tags: unknown;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                teamId: number | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
            };
        }>;
        restore: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                tags: unknown;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                teamId: number | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
            };
        }>;
        duplicate: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                tags: unknown;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                teamId: number | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
            };
        }>;
    }>;
    lmstudio: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        listModels: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                forceRefresh?: boolean | undefined;
            };
            _input_out: {
                forceRefresh: boolean;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            models: import("../services/lmstudioService.js").LoadedModelInfo[];
        }>;
        checkStatus: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            isRunning: boolean;
        }>;
        getModelInfo: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                modelId: string;
            };
            _input_out: {
                modelId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            model: import("../services/lmstudioService.js").LoadedModelInfo | null;
        }>;
        generateCompletion: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                modelId: string;
                prompt: string;
                timeout?: number | undefined;
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            };
            _input_out: {
                modelId: string;
                prompt: string;
                timeout: number;
                temperature: number;
                maxTokens: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            result: string;
        }>;
        loadModel: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                modelId: string;
            };
            _input_out: {
                modelId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        switchModel: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                preferredModelId: string;
                fallbackModelIds?: string[] | undefined;
            };
            _input_out: {
                fallbackModelIds: string[];
                preferredModelId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            modelId: string;
        }>;
        benchmarkModel: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                modelId: string;
            };
            _input_out: {
                modelId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            tokensPerSecond: number;
            latencyMs: number;
            success: boolean;
        }>;
        estimateTokens: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                text: string;
            };
            _input_out: {
                text: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            tokens: number;
        }>;
        compareModels: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                prompt: string;
                modelIds: string[];
                temperature?: number | undefined;
                maxTokens?: number | undefined;
            };
            _input_out: {
                prompt: string;
                temperature: number;
                maxTokens: number;
                modelIds: string[];
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            results: {
                modelId: string;
                response: string;
                tokensPerSecond: number;
            }[];
        }>;
        recommendModel: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                taskType: "code" | "chat" | "reasoning" | "analysis" | "general";
            };
            _input_out: {
                taskType: "code" | "chat" | "reasoning" | "analysis" | "general";
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            recommendedModel: string | null;
        }>;
        clearCache: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            message: string;
        }>;
        processLongText: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                text: string;
                modelId: string;
                instruction: string;
            };
            _input_out: {
                text: string;
                modelId: string;
                instruction: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            result: string;
        }>;
    }>;
    tasks: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                limit?: number | undefined;
                offset?: number | undefined;
                projectId?: number | undefined;
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
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                projectId: number | null;
                assignedUserId: number | null;
                estimatedHours: string | null;
                actualHours: string | null;
                dueDate: Date | null;
                completedAt: Date | null;
            }[];
        }>;
        getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                projectId: number | null;
                assignedUserId: number | null;
                estimatedHours: string | null;
                actualHours: string | null;
                dueDate: Date | null;
                completedAt: Date | null;
            };
            subtasks: {
                description: string | null;
                status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
                id: number;
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
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
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                projectId: number;
                description?: string | undefined;
                priority?: "low" | "medium" | "high" | "urgent" | undefined;
                assignedUserId?: number | undefined;
                estimatedHours?: number | undefined;
                dueDate?: string | undefined;
            };
            _input_out: {
                title: string;
                priority: "low" | "medium" | "high" | "urgent";
                projectId: number;
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
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                projectId: number | null;
                assignedUserId: number | null;
                estimatedHours: string | null;
                actualHours: string | null;
                dueDate: Date | null;
                completedAt: Date | null;
            };
        }>;
        update: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                title?: string | undefined;
                priority?: "low" | "medium" | "high" | "urgent" | undefined;
                assignedUserId?: number | undefined;
                estimatedHours?: number | undefined;
                actualHours?: number | undefined;
                dueDate?: string | undefined;
            };
            _input_out: {
                id: number;
                description?: string | undefined;
                status?: "planning" | "completed" | "pending" | "in_progress" | "blocked" | "cancelled" | undefined;
                title?: string | undefined;
                priority?: "low" | "medium" | "high" | "urgent" | undefined;
                assignedUserId?: number | undefined;
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
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                projectId: number | null;
                assignedUserId: number | null;
                estimatedHours: string | null;
                actualHours: string | null;
                dueDate: Date | null;
                completedAt: Date | null;
            };
        }>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        plan: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
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
        listSubtasks: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
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
        createSubtask: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
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
        updateSubtask: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
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
        executeSubtask: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        deleteSubtask: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        addDependency: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        removeDependency: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        search: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                title: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                projectId: number | null;
                assignedUserId: number | null;
                estimatedHours: string | null;
                actualHours: string | null;
                dueDate: Date | null;
                completedAt: Date | null;
            }[];
        }>;
        getStats: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        reorderSubtasks: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
    chat: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        listConversations: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        }, import("../utils/pagination.js").PaginatedResponse<{
            userId: number;
            id: number;
            title: string | null;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            modelId: number | null;
            systemPrompt: string | null;
            metadata: unknown;
            aiId: number | null;
            lastMessageAt: Date | null;
            messageCount: number | null;
            isRead: boolean | null;
        }>>;
        createConversation: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                title?: string | undefined;
                systemPrompt?: string | undefined;
            };
            _input_out: {
                userId: number;
                modelId: number;
                title?: string | undefined;
                systemPrompt?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            conversation: {
                userId: number;
                id: number;
                title: string | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                modelId: number | null;
                systemPrompt: string | null;
                metadata: unknown;
                aiId: number | null;
                lastMessageAt: Date | null;
                messageCount: number | null;
                isRead: boolean | null;
            };
        }>;
        getConversation: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                title: string | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                modelId: number | null;
                systemPrompt: string | null;
                metadata: unknown;
                aiId: number | null;
                lastMessageAt: Date | null;
                messageCount: number | null;
                isRead: boolean | null;
            };
        }>;
        updateConversation: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                title?: string | undefined;
                systemPrompt?: string | undefined;
                metadata?: any;
            };
            _input_out: {
                id: number;
                title?: string | undefined;
                systemPrompt?: string | undefined;
                metadata?: any;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            conversation: {
                userId: number;
                id: number;
                title: string | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                modelId: number | null;
                systemPrompt: string | null;
                metadata: unknown;
                aiId: number | null;
                lastMessageAt: Date | null;
                messageCount: number | null;
                isRead: boolean | null;
            };
        }>;
        deleteConversation: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        listMessages: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                offset?: number | undefined;
                conversationId?: number | undefined;
            } | undefined;
            _input_out: {
                limit: number;
                offset: number;
                conversationId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../utils/pagination.js").PaginatedResponse<{
            [x: string]: any;
        }>>;
        sendMessage: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                content: string;
                conversationId: number;
                role?: "user" | "system" | "assistant" | undefined;
                parentMessageId?: number | undefined;
            };
            _input_out: {
                content: string;
                role: "user" | "system" | "assistant";
                conversationId: number;
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
        getMessage: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        addAttachment: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        addReaction: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        deleteMessage: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        editMessage: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        searchMessages: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                conversationId?: number | undefined;
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
        getConversationStats: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        markAsRead: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
    prompts: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        }, import("../utils/pagination.js").PaginatedResponse<{
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
        getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        update: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        search: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        listVersions: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getVersion: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        revertToVersion: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        duplicate: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        listCategories: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getStats: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
    models: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                offset?: number | undefined;
                isActive?: boolean | undefined;
            } | undefined;
            _input_out: {
                limit: number;
                offset: number;
                isActive?: boolean | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../utils/pagination.js").PaginatedResponse<{
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
        getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        update: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        toggleActive: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        listSpecialized: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category?: string | undefined;
                isActive?: boolean | undefined;
            };
            _input_out: {
                category?: string | undefined;
                isActive?: boolean | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            specializedAIs: {
                description: string | null;
                userId: number;
                category: string | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                capabilities: string[] | null;
                defaultModelId: number | null;
                fallbackModelIds: number[] | null;
                systemPrompt: string;
            }[];
        }>;
        createSpecialized: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category: string;
                name: string;
                defaultModelId: number;
                description?: string | undefined;
                fallbackModelIds?: number[] | undefined;
                systemPrompt?: string | undefined;
            };
            _input_out: {
                category: string;
                name: string;
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
                description: string | null;
                userId: number;
                category: string | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                capabilities: string[] | null;
                defaultModelId: number | null;
                fallbackModelIds: number[] | null;
                systemPrompt: string;
            };
        }>;
        updateSpecialized: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                defaultModelId?: number | undefined;
                fallbackModelIds?: number[] | undefined;
                systemPrompt?: string | undefined;
            };
            _input_out: {
                id: number;
                description?: string | undefined;
                name?: string | undefined;
                isActive?: boolean | undefined;
                defaultModelId?: number | undefined;
                fallbackModelIds?: number[] | undefined;
                systemPrompt?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            specializedAI: {
                description: string | null;
                userId: number;
                category: string | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                capabilities: string[] | null;
                defaultModelId: number | null;
                fallbackModelIds: number[] | null;
                systemPrompt: string;
            };
        }>;
        search: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        discoverModels: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
    training: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        createDataset: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                data: any[];
                name: string;
                dataType: "text" | "conversation" | "qa" | "instruction";
                description?: string | undefined;
            };
            _input_out: {
                userId: number;
                data: any[];
                name: string;
                dataType: "text" | "conversation" | "qa" | "instruction";
                description?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            dataset: {
                description: string | null;
                userId: number;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean;
                metadata: unknown;
                filePath: string | null;
                datasetType: "code" | "text" | "qa" | "completion" | "chat" | null;
                format: "jsonl" | "csv" | "txt" | "parquet" | null;
                fileSize: number | null;
                recordCount: number | null;
            };
        }>;
        listDatasets: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            };
            _input_out: {
                userId?: number | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            datasets: {
                description: string | null;
                userId: number;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean;
                metadata: unknown;
                filePath: string | null;
                datasetType: "code" | "text" | "qa" | "completion" | "chat" | null;
                format: "jsonl" | "csv" | "txt" | "parquet" | null;
                fileSize: number | null;
                recordCount: number | null;
            }[];
        }>;
        getDataset: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            dataset: {
                description: string | null;
                userId: number;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean;
                metadata: unknown;
                filePath: string | null;
                datasetType: "code" | "text" | "qa" | "completion" | "chat" | null;
                format: "jsonl" | "csv" | "txt" | "parquet" | null;
                fileSize: number | null;
                recordCount: number | null;
            };
        }>;
        deleteDataset: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        validateDataset: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                data: any[];
                dataType: "text" | "conversation" | "qa" | "instruction";
            };
            _input_out: {
                data: any[];
                dataType: "text" | "conversation" | "qa" | "instruction";
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            valid: boolean;
            message: any;
        }>;
        startTraining: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                modelId: number;
                datasetId: number;
                hyperparameters: {
                    learningRate: number;
                    batchSize: number;
                    epochs: number;
                    warmupSteps?: number | undefined;
                    maxSteps?: number | undefined;
                    loraRank?: number | undefined;
                    loraAlpha?: number | undefined;
                    loraDropout?: number | undefined;
                };
                validationSplit?: number | undefined;
                earlyStopping?: boolean | undefined;
                checkpointInterval?: number | undefined;
            };
            _input_out: {
                modelId: number;
                datasetId: number;
                hyperparameters: {
                    learningRate: number;
                    batchSize: number;
                    epochs: number;
                    warmupSteps?: number | undefined;
                    maxSteps?: number | undefined;
                    loraRank?: number | undefined;
                    loraAlpha?: number | undefined;
                    loraDropout?: number | undefined;
                };
                validationSplit?: number | undefined;
                earlyStopping?: boolean | undefined;
                checkpointInterval?: number | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            job: {
                description: string | null;
                userId: number;
                status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                metadata: unknown;
                progress: string | null;
                completedAt: Date | null;
                datasetId: number;
                baseModelId: number;
                trainingType: "fine-tuning" | "lora" | "qlora" | "full" | null;
                hyperparameters: unknown;
                currentEpoch: number | null;
                totalEpochs: number | null;
                trainingLoss: string | null;
                validationLoss: string | null;
                trainingAccuracy: string | null;
                validationAccuracy: string | null;
                estimatedTimeRemaining: number | null;
                startedAt: Date | null;
                errorMessage: string | null;
                logFilePath: string | null;
            };
        }>;
        listTrainingJobs: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                status?: "completed" | "failed" | "cancelled" | "running" | undefined;
            };
            _input_out: {
                userId?: number | undefined;
                status?: "completed" | "failed" | "cancelled" | "running" | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            jobs: {
                description: string | null;
                userId: number;
                status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                metadata: unknown;
                progress: string | null;
                completedAt: Date | null;
                datasetId: number;
                baseModelId: number;
                trainingType: "fine-tuning" | "lora" | "qlora" | "full" | null;
                hyperparameters: unknown;
                currentEpoch: number | null;
                totalEpochs: number | null;
                trainingLoss: string | null;
                validationLoss: string | null;
                trainingAccuracy: string | null;
                validationAccuracy: string | null;
                estimatedTimeRemaining: number | null;
                startedAt: Date | null;
                errorMessage: string | null;
                logFilePath: string | null;
            }[];
        }>;
        getTrainingStatus: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                jobId: number;
            };
            _input_out: {
                jobId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            status: {
                description: string | null;
                userId: number;
                status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                metadata: unknown;
                progress: string | null;
                completedAt: Date | null;
                datasetId: number;
                baseModelId: number;
                trainingType: "fine-tuning" | "lora" | "qlora" | "full" | null;
                hyperparameters: unknown;
                currentEpoch: number | null;
                totalEpochs: number | null;
                trainingLoss: string | null;
                validationLoss: string | null;
                trainingAccuracy: string | null;
                validationAccuracy: string | null;
                estimatedTimeRemaining: number | null;
                startedAt: Date | null;
                errorMessage: string | null;
                logFilePath: string | null;
            };
        }>;
        cancelTraining: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                jobId: number;
            };
            _input_out: {
                jobId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        getTrainingMetrics: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                jobId: number;
            };
            _input_out: {
                jobId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            metrics: {
                currentEpoch: number | null;
                status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
                startTime: Date | null;
                endTime: Date | null;
                metadata: unknown;
            };
        }>;
        getTrainingLogs: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                jobId: number;
                limit?: number | undefined;
            };
            _input_out: {
                limit: number;
                jobId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            logs: {
                timestamp: Date;
                level: string;
                message: string;
            }[];
        }>;
        pauseTraining: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                jobId: number;
            };
            _input_out: {
                jobId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        evaluateModel: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                modelVersionId: number;
                testDatasetId: number;
            };
            _input_out: {
                modelVersionId: number;
                testDatasetId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            evaluation: import("../services/modelTrainingService.js").EvaluationResult;
        }>;
        benchmarkModel: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                modelVersionId: number;
                benchmarkType: "speed" | "accuracy" | "perplexity" | "all";
            };
            _input_out: {
                modelVersionId: number;
                benchmarkType: "speed" | "accuracy" | "perplexity" | "all";
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            benchmark: {
                type: "speed" | "accuracy" | "perplexity" | "all";
                score: number;
                timestamp: Date;
            };
        }>;
        compareModels: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                testDatasetId: number;
                modelVersionIds: number[];
            };
            _input_out: {
                testDatasetId: number;
                modelVersionIds: number[];
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            comparisons: {
                accuracy: number;
                loss: number;
                perplexity: number;
                examples: Array<{
                    input: string;
                    expected: string;
                    generated: string;
                    score: number;
                }>;
                modelVersionId: number;
            }[];
        }>;
        getModelMetrics: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                modelVersionId: number;
            };
            _input_out: {
                modelVersionId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            metrics: {
                accuracy: number;
                loss: number;
                perplexity: number;
                f1Score: number;
            };
        }>;
        exportModel: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                format: "gguf" | "safetensors" | "pytorch" | "onnx";
                modelVersionId: number;
            };
            _input_out: {
                format: "gguf" | "safetensors" | "pytorch" | "onnx";
                modelVersionId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            exportPath: string;
            message: string;
        }>;
        createFineTuningConfig: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                baseConfig: {
                    learningRate: number;
                    batchSize: number;
                    epochs: number;
                };
                advancedOptions?: any;
            };
            _input_out: {
                name: string;
                baseConfig: {
                    learningRate: number;
                    batchSize: number;
                    epochs: number;
                };
                advancedOptions?: any;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            config: {
                createdAt: Date;
                name: string;
                baseConfig: {
                    learningRate: number;
                    batchSize: number;
                    epochs: number;
                };
                advancedOptions?: any;
                id: number;
            };
        }>;
        listFineTuningConfigs: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            configs: {
                id: number;
                name: string;
                baseConfig: {
                    learningRate: number;
                    batchSize: number;
                    epochs: number;
                };
            }[];
        }>;
        estimateTrainingTime: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                batchSize: number;
                epochs: number;
                datasetSize: number;
                modelSize: "small" | "medium" | "large" | "xlarge";
            };
            _input_out: {
                batchSize: number;
                epochs: number;
                datasetSize: number;
                modelSize: "small" | "medium" | "large" | "xlarge";
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            estimate: {
                totalSteps: number;
                estimatedMinutes: number;
                estimatedHours: number;
            };
        }>;
        getHyperparameterRecommendations: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                taskType: "qa" | "classification" | "generation" | "summarization";
                datasetSize: number;
                modelSize: "small" | "medium" | "large" | "xlarge";
            };
            _input_out: {
                taskType: "qa" | "classification" | "generation" | "summarization";
                datasetSize: number;
                modelSize: "small" | "medium" | "large" | "xlarge";
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            recommendations: {
                learningRate: number;
                batchSize: number;
                epochs: number;
            } | {
                learningRate: number;
                batchSize: number;
                epochs: number;
            } | {
                learningRate: number;
                batchSize: number;
                epochs: number;
            } | {
                learningRate: number;
                batchSize: number;
                epochs: number;
            };
        }>;
        scheduleTraining: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                scheduledTime: string;
                jobConfig?: any;
            };
            _input_out: {
                scheduledTime: string;
                jobConfig?: any;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            scheduledJob: {
                status: string;
                scheduledTime: string;
                jobConfig?: any;
                id: number;
            };
        }>;
    }>;
    services: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        listServices: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                isActive?: boolean | undefined;
            };
            _input_out: {
                userId?: number | undefined;
                isActive?: boolean | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            services: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                config: unknown;
                serviceName: string;
            }[];
        }>;
        getService: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            service: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                config: unknown;
                serviceName: string;
            };
        }>;
        createService: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceName: "slack" | "discord" | "github" | "gmail" | "drive" | "sheets" | "notion";
                config?: any;
            };
            _input_out: {
                userId: number;
                serviceName: "slack" | "discord" | "github" | "gmail" | "drive" | "sheets" | "notion";
                config?: any;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            service: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                config: unknown;
                serviceName: string;
            };
        }>;
        updateService: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                config?: any;
            };
            _input_out: {
                id: number;
                isActive?: boolean | undefined;
                config?: any;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            service: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                config: unknown;
                serviceName: string;
            };
        }>;
        deleteService: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        githubListRepos: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceId: number;
                username?: string | undefined;
            };
            _input_out: {
                serviceId: number;
                username?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            repos: any[];
        }>;
        githubGetRepo: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                owner: string;
                serviceId: number;
                repo: string;
            };
            _input_out: {
                owner: string;
                serviceId: number;
                repo: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            repo: any;
        }>;
        githubListIssues: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                owner: string;
                serviceId: number;
                repo: string;
                state?: "closed" | "all" | "open" | undefined;
            };
            _input_out: {
                owner: string;
                serviceId: number;
                repo: string;
                state: "closed" | "all" | "open";
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            issues: any[];
        }>;
        githubCreateIssue: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                owner: string;
                serviceId: number;
                repo: string;
                body?: string | undefined;
                labels?: string[] | undefined;
            };
            _input_out: {
                title: string;
                owner: string;
                serviceId: number;
                repo: string;
                body?: string | undefined;
                labels?: string[] | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            issue: any;
        }>;
        githubListPullRequests: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                owner: string;
                serviceId: number;
                repo: string;
                state?: "closed" | "all" | "open" | undefined;
            };
            _input_out: {
                owner: string;
                serviceId: number;
                repo: string;
                state: "closed" | "all" | "open";
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            pullRequests: any[];
        }>;
        gmailListMessages: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceId: number;
                query?: string | undefined;
                maxResults?: number | undefined;
            };
            _input_out: {
                serviceId: number;
                maxResults: number;
                query?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            messages: any;
        }>;
        gmailGetMessage: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                messageId: string;
                serviceId: number;
            };
            _input_out: {
                messageId: string;
                serviceId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: any;
        }>;
        gmailSendMessage: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceId: number;
                body: string;
                to: string[];
                subject: string;
                cc?: string[] | undefined;
                bcc?: string[] | undefined;
            };
            _input_out: {
                serviceId: number;
                body: string;
                to: string[];
                subject: string;
                cc?: string[] | undefined;
                bcc?: string[] | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: any;
        }>;
        gmailSearchMessages: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceId: number;
                maxResults?: number | undefined;
            };
            _input_out: {
                query: string;
                serviceId: number;
                maxResults: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            messages: any;
        }>;
        gmailDeleteMessage: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                messageId: string;
                serviceId: number;
            };
            _input_out: {
                messageId: string;
                serviceId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        driveListFiles: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceId: number;
                folderId?: string | undefined;
                pageSize?: number | undefined;
            };
            _input_out: {
                serviceId: number;
                pageSize: number;
                folderId?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            files: any;
        }>;
        driveGetFile: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceId: number;
                fileId: string;
            };
            _input_out: {
                serviceId: number;
                fileId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            file: any;
        }>;
        driveUploadFile: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                content: string;
                name: string;
                serviceId: number;
                mimeType: string;
                folderId?: string | undefined;
            };
            _input_out: {
                content: string;
                name: string;
                serviceId: number;
                mimeType: string;
                folderId?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            file: any;
        }>;
        driveDeleteFile: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceId: number;
                fileId: string;
            };
            _input_out: {
                serviceId: number;
                fileId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        driveShareFile: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                email: string;
                serviceId: number;
                fileId: string;
                role?: "reader" | "writer" | "commenter" | undefined;
            };
            _input_out: {
                email: string;
                role: "reader" | "writer" | "commenter";
                serviceId: number;
                fileId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            permission: any;
        }>;
        sheetsGetSpreadsheet: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceId: number;
                spreadsheetId: string;
            };
            _input_out: {
                serviceId: number;
                spreadsheetId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            spreadsheet: any;
        }>;
        sheetsReadRange: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceId: number;
                spreadsheetId: string;
                range: string;
            };
            _input_out: {
                serviceId: number;
                spreadsheetId: string;
                range: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            data: any;
        }>;
        sheetsWriteRange: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                values: any[][];
                serviceId: number;
                spreadsheetId: string;
                range: string;
            };
            _input_out: {
                values: any[][];
                serviceId: number;
                spreadsheetId: string;
                range: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            result: any;
        }>;
        sheetsAppendRow: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                values: any[];
                serviceId: number;
                spreadsheetId: string;
                sheetName: string;
            };
            _input_out: {
                values: any[];
                serviceId: number;
                spreadsheetId: string;
                sheetName: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            result: any;
        }>;
        sheetsCreateSpreadsheet: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceId: number;
                sheetNames?: string[] | undefined;
            };
            _input_out: {
                title: string;
                serviceId: number;
                sheetNames?: string[] | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            spreadsheet: any;
        }>;
        listOAuthTokens: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            };
            _input_out: {
                userId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            tokens: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                expiresAt: Date;
                serviceId: number;
                accessToken: string;
                refreshToken: string | null;
                scope: string | null;
            }[];
        }>;
        refreshOAuthToken: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                tokenId: number;
            };
            _input_out: {
                tokenId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        revokeOAuthToken: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                tokenId: number;
            };
            _input_out: {
                tokenId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        listApiCredentials: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            };
            _input_out: {
                userId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            credentials: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                encryptedData: string;
                serviceName: string;
                credentialName: string;
            }[];
        }>;
        createApiCredential: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                encryptedData: string;
                serviceName: string;
                credentialName: string;
            };
            _input_out: {
                userId: number;
                encryptedData: string;
                serviceName: string;
                credentialName: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            credential: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                encryptedData: string;
                serviceName: string;
                credentialName: string;
            };
        }>;
        deleteApiCredential: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        testApiCredential: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            connected: boolean;
            message: string;
        }>;
    }>;
    monitoring: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        getCurrentMetrics: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            metrics: {
                cpu: number;
                memory: number;
                disk: number;
                metrics: import("../services/systemMonitorService.js").SystemMetrics;
            };
        } | {
            success: boolean;
            metrics: {
                cpu: number;
                memory: number;
                disk: number;
                metrics: null;
            };
        }>;
        getHealth: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            health: import("../services/systemMonitorService.js").SystemMetrics;
        }>;
        getMetricsHistory: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                hours?: number | undefined;
            };
            _input_out: {
                hours: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            history: {
                id: number;
                cpuUsage: string;
                memoryUsage: string;
                diskUsage: string;
                activeConnections: number | null;
                timestamp: Date | null;
            }[];
        }>;
        getApiUsage: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                hours?: number | undefined;
            };
            _input_out: {
                hours: number;
                userId?: number | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            usage: {
                userId: number | null;
                id: number;
                endpoint: string;
                timestamp: Date | null;
                method: string;
                statusCode: number;
                responseDuration: number | null;
            }[];
        }>;
        getErrorLogs: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                level?: "warning" | "error" | "critical" | undefined;
                hours?: number | undefined;
            };
            _input_out: {
                limit: number;
                hours: number;
                level?: "warning" | "error" | "critical" | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            logs: {
                stack: string | null;
                userId: number | null;
                message: string;
                id: number;
                metadata: unknown;
                level: "warning" | "error" | "critical" | null;
                timestamp: Date | null;
            }[];
        }>;
        getAuditLogs: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                action?: string | undefined;
                hours?: number | undefined;
            };
            _input_out: {
                limit: number;
                hours: number;
                userId?: number | undefined;
                action?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            logs: {
                userId: number | null;
                id: number;
                action: string;
                timestamp: Date | null;
                resourceType: string | null;
                resourceId: number | null;
                changes: unknown;
                ipAddress: string | null;
                userAgent: string | null;
            }[];
        }>;
        getServiceStatus: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            status: {
                database: boolean;
                lmstudio: boolean;
                redis: boolean;
                services: import("../services/systemMonitorService.js").SystemMetrics;
            };
        }>;
        getResourceSummary: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                hours?: number | undefined;
            };
            _input_out: {
                hours: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            summary: {
                avgCpu: number;
                avgMemory: number;
                avgDisk: number;
                maxCpu: number;
                maxMemory: number;
                maxDisk: number;
            };
        }>;
        getEndpointStats: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                hours?: number | undefined;
            };
            _input_out: {
                hours: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            stats: {
                endpoint: string;
                count: any;
                avgDuration: number;
                errorRate: number;
            }[];
        }>;
        getErrorRate: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                hours?: number | undefined;
            };
            _input_out: {
                hours: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            errorRate: {
                errors: number;
                warnings: number;
                total: number;
                rate: number;
            };
        }>;
        clearOldMetrics: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                daysToKeep?: number | undefined;
            };
            _input_out: {
                daysToKeep: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        getActiveConnections: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            connections: {
                websocket: number;
                http: number;
                total: number;
            };
        }>;
        getPerformanceMetrics: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            performance: {
                then<TResult1 = import("../services/systemMonitorService.js").SystemMetrics, TResult2 = never>(onfulfilled?: ((value: import("../services/systemMonitorService.js").SystemMetrics) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
                catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<import("../services/systemMonitorService.js").SystemMetrics | TResult>;
                finally(onfinally?: (() => void) | null | undefined): Promise<import("../services/systemMonitorService.js").SystemMetrics>;
                [Symbol.toStringTag]: string;
                uptime: number;
                nodeVersion: string;
                platform: NodeJS.Platform;
            };
        }>;
        testAlert: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                type: "email" | "slack" | "webhook";
                message: string;
            };
            _input_out: {
                type: "email" | "slack" | "webhook";
                message: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
    }>;
    workflows: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                limit?: number | undefined;
                offset?: number | undefined;
                isActive?: boolean | undefined;
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
        getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        update: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        duplicate: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        toggleActive: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        validate: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        execute: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getExecutionHistory: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                limit: number;
                id: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            executions: any[];
            total: number;
        }>;
        search: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getStats: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        export: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        import: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getTemplates: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        createFromTemplate: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        cloneStep: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                stepId: string;
            };
            _input_out: {
                workflowId: number;
                stepId: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            step: any;
            message: string;
        }>;
        reorderSteps: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
    templates: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category: string | null;
                isPublic: boolean | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                templateData: unknown;
                usageCount: number | null;
            }[];
            total: number;
            limit: number;
            offset: number;
        }>;
        getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category: string | null;
                isPublic: boolean | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                templateData: unknown;
                usageCount: number | null;
            };
        }>;
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                    systemPrompt?: string | undefined;
                    userPromptTemplate?: string | undefined;
                    examples?: {
                        input: Record<string, any>;
                        output: string;
                    }[] | undefined;
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
                isPublic: boolean;
                name: string;
                templateData: {
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
                    systemPrompt?: string | undefined;
                    userPromptTemplate?: string | undefined;
                    examples?: {
                        input: Record<string, any>;
                        output: string;
                    }[] | undefined;
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
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            template: {
                description: string | null;
                userId: number;
                category: string | null;
                isPublic: boolean | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                templateData: unknown;
                usageCount: number | null;
            };
            message: string;
        }>;
        update: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category?: string | undefined;
                isPublic?: boolean | undefined;
                name?: string | undefined;
                templateData?: {
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
                    systemPrompt?: string | undefined;
                    userPromptTemplate?: string | undefined;
                    examples?: {
                        input: Record<string, any>;
                        output: string;
                    }[] | undefined;
                    modelConfig?: {
                        temperature?: number | undefined;
                        maxTokens?: number | undefined;
                        topP?: number | undefined;
                        frequencyPenalty?: number | undefined;
                        presencePenalty?: number | undefined;
                    } | undefined;
                } | undefined;
            };
            _input_out: {
                id: number;
                description?: string | undefined;
                category?: string | undefined;
                isPublic?: boolean | undefined;
                name?: string | undefined;
                templateData?: {
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
                    systemPrompt?: string | undefined;
                    userPromptTemplate?: string | undefined;
                    examples?: {
                        input: Record<string, any>;
                        output: string;
                    }[] | undefined;
                    modelConfig?: {
                        temperature?: number | undefined;
                        maxTokens?: number | undefined;
                        topP?: number | undefined;
                        frequencyPenalty?: number | undefined;
                        presencePenalty?: number | undefined;
                    } | undefined;
                } | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            template: {
                description: string | null;
                userId: number;
                category: string | null;
                isPublic: boolean | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                templateData: unknown;
                usageCount: number | null;
            };
            message: string;
        }>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        duplicate: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category: string | null;
                isPublic: boolean | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                templateData: unknown;
                usageCount: number | null;
            };
            message: string;
        }>;
        use: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        search: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category: string | null;
                isPublic: boolean | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                templateData: unknown;
                usageCount: number | null;
            }[];
        }>;
        getStats: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getCategories: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        export: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        import: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                        systemPrompt?: string | undefined;
                        userPromptTemplate?: string | undefined;
                        examples?: {
                            input: Record<string, any>;
                            output: string;
                        }[] | undefined;
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
                        systemPrompt?: string | undefined;
                        userPromptTemplate?: string | undefined;
                        examples?: {
                            input: Record<string, any>;
                            output: string;
                        }[] | undefined;
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
                category: string | null;
                isPublic: boolean | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                templateData: unknown;
                usageCount: number | null;
            };
            message: string;
        }>;
        validateVariables: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getPopular: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category: string | null;
                isPublic: boolean | null;
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                templateData: unknown;
                usageCount: number | null;
            }[];
        }>;
    }>;
    knowledgebase: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                limit?: number | undefined;
                offset?: number | undefined;
                isActive?: boolean | undefined;
            };
            _input_out: {
                limit: number;
                offset: number;
                query?: string | undefined;
                category?: string | undefined;
                isActive?: boolean | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            items: {
                userId: number;
                category: string | null;
                id: number;
                title: string;
                content: string;
                tags: string[] | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                embedding: unknown;
            }[];
            total: number;
            limit: number;
            offset: number;
        }>;
        getById: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category: string | null;
                id: number;
                title: string;
                content: string;
                tags: string[] | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
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
        create: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category?: string | undefined;
                tags?: string[] | undefined;
                isActive?: boolean | undefined;
            };
            _input_out: {
                title: string;
                content: string;
                isActive: boolean;
                category?: string | undefined;
                tags?: string[] | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            item: {
                userId: number;
                category: string | null;
                id: number;
                title: string;
                content: string;
                tags: string[] | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                embedding: unknown;
            };
            message: string;
        }>;
        update: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category?: string | undefined;
                title?: string | undefined;
                content?: string | undefined;
                tags?: string[] | undefined;
                isActive?: boolean | undefined;
            };
            _input_out: {
                id: number;
                category?: string | undefined;
                title?: string | undefined;
                content?: string | undefined;
                tags?: string[] | undefined;
                isActive?: boolean | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            item: {
                userId: number;
                category: string | null;
                id: number;
                title: string;
                content: string;
                tags: string[] | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                embedding: unknown;
            };
            message: string;
        }>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        search: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category: string | null;
                id: number;
                title: string;
                content: string;
                tags: string[] | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                embedding: unknown;
            }[];
        }>;
        getStats: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getCategories: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getTags: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        addSource: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        removeSource: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        getSources: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        duplicate: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category: string | null;
                id: number;
                title: string;
                content: string;
                tags: string[] | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                embedding: unknown;
            };
            message: string;
        }>;
        export: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        import: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                category: string | null;
                id: number;
                title: string;
                content: string;
                tags: string[] | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                embedding: unknown;
            };
            message: string;
        }>;
        findSimilar: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                limit: number;
                id: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            similar: {
                similarityScore: number;
                userId: number;
                category: string | null;
                id: number;
                title: string;
                content: string;
                tags: string[] | null;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                embedding: unknown;
            }[];
        }>;
    }>;
    settings: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: import("./trpc.js").Context;
        meta: object;
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").DefaultDataTransformer;
    }>, {
        list: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                isPublic?: boolean | undefined;
                limit?: number | undefined;
                offset?: number | undefined;
                settingType?: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | undefined;
            };
            _input_out: {
                limit: number;
                offset: number;
                isPublic?: boolean | undefined;
                settingType?: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            settings: {
                description: string | null;
                userId: number | null;
                isPublic: boolean | null;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                settingKey: string;
                settingValue: unknown;
                settingType: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | null;
            }[];
            pagination: {
                total: number;
                limit: number;
                offset: number;
            };
        }>;
        getByKey: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                settingKey: string;
            };
            _input_out: {
                settingKey: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            description: string | null;
            userId: number | null;
            isPublic: boolean | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            settingKey: string;
            settingValue: unknown;
            settingType: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | null;
        }>;
        upsert: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                settingKey: string;
                settingValue: string | number | boolean | any[] | Record<string, any>;
                description?: string | undefined;
                isPublic?: boolean | undefined;
                settingType?: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | undefined;
            };
            _input_out: {
                settingKey: string;
                settingValue: string | number | boolean | any[] | Record<string, any>;
                description?: string | undefined;
                isPublic?: boolean | undefined;
                settingType?: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            action: string;
            settingId: number;
        }>;
        delete: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                settingKey: string;
            };
            _input_out: {
                settingKey: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
        }>;
        reset: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                settingType?: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | undefined;
            };
            _input_out: {
                settingType?: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            message: string;
        }>;
        listNotifications: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                channel?: "push" | "email" | "slack" | "discord" | "telegram" | undefined;
                eventType?: string | undefined;
            };
            _input_out: {
                channel?: "push" | "email" | "slack" | "discord" | "telegram" | undefined;
                eventType?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            preferences: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                config: unknown;
                channel: "push" | "email" | "slack" | "discord" | "telegram";
                eventType: string;
                isEnabled: boolean | null;
            }[];
        }>;
        upsertNotification: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                channel: "push" | "email" | "slack" | "discord" | "telegram";
                eventType: string;
                config?: Record<string, any> | undefined;
                isEnabled?: boolean | undefined;
            };
            _input_out: {
                channel: "push" | "email" | "slack" | "discord" | "telegram";
                eventType: string;
                config?: Record<string, any> | undefined;
                isEnabled?: boolean | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            action: string;
            id: number;
        }>;
        deleteNotification: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        }>;
        getSecurity: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            twoFactorEnabled: boolean | null;
            twoFactorSecret: string | null;
            backupCodes: string[] | null;
            sessionTimeout: number | null;
            ipWhitelist: string[] | null;
            loginNotifications: boolean | null;
            suspiciousActivityAlerts: boolean | null;
        }>;
        updateSecurity: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                twoFactorEnabled?: boolean | undefined;
                twoFactorSecret?: string | undefined;
                backupCodes?: string[] | undefined;
                sessionTimeout?: number | undefined;
                ipWhitelist?: string[] | undefined;
                loginNotifications?: boolean | undefined;
                suspiciousActivityAlerts?: boolean | undefined;
            };
            _input_out: {
                twoFactorEnabled?: boolean | undefined;
                twoFactorSecret?: string | undefined;
                backupCodes?: string[] | undefined;
                sessionTimeout?: number | undefined;
                ipWhitelist?: string[] | undefined;
                loginNotifications?: boolean | undefined;
                suspiciousActivityAlerts?: boolean | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            action: string;
        }>;
        generateBackupCodes: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            backupCodes: string[];
        }>;
        listProviders: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                type?: "local" | "api" | undefined;
                isActive?: boolean | undefined;
            };
            _input_out: {
                type?: "local" | "api" | undefined;
                isActive?: boolean | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            providers: {
                type: "local" | "api";
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                endpoint: string;
                apiKey: string | null;
                isActive: boolean | null;
                config: unknown;
            }[];
        }>;
        createProvider: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                type: "local" | "api";
                name: string;
                endpoint: string;
                apiKey?: string | undefined;
                isActive?: boolean | undefined;
                config?: Record<string, any> | undefined;
            };
            _input_out: {
                type: "local" | "api";
                name: string;
                endpoint: string;
                apiKey?: string | undefined;
                isActive?: boolean | undefined;
                config?: Record<string, any> | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            providerId: number;
        }>;
        updateProvider: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                data: {
                    type?: "local" | "api" | undefined;
                    name?: string | undefined;
                    endpoint?: string | undefined;
                    apiKey?: string | undefined;
                    isActive?: boolean | undefined;
                    config?: Record<string, any> | undefined;
                };
            };
            _input_out: {
                id: number;
                data: {
                    type?: "local" | "api" | undefined;
                    name?: string | undefined;
                    endpoint?: string | undefined;
                    apiKey?: string | undefined;
                    isActive?: boolean | undefined;
                    config?: Record<string, any> | undefined;
                };
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
        }>;
        deleteProvider: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        }>;
        testProvider: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            error: string;
            message?: undefined;
            latency?: undefined;
        } | {
            success: boolean;
            message: string;
            latency: number;
            error?: undefined;
        }>;
        listIntegrations: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            };
            _input_out: {
                isActive?: boolean | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            services: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                config: unknown;
                serviceName: string;
            }[];
        }>;
        createIntegration: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                serviceName: string;
                isActive?: boolean | undefined;
                config?: Record<string, any> | undefined;
            };
            _input_out: {
                serviceName: string;
                isActive?: boolean | undefined;
                config?: Record<string, any> | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            serviceId: number;
        }>;
        updateIntegration: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                config?: Record<string, any> | undefined;
                serviceName?: string | undefined;
            };
            _input_out: {
                id: number;
                isActive?: boolean | undefined;
                config?: Record<string, any> | undefined;
                serviceName?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
        }>;
        deleteIntegration: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        }>;
        listBackups: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                status?: "completed" | "pending" | "in_progress" | "failed" | undefined;
                limit?: number | undefined;
                backupType?: "full" | "incremental" | "differential" | "database" | "files" | undefined;
            };
            _input_out: {
                limit: number;
                status?: "completed" | "pending" | "in_progress" | "failed" | undefined;
                backupType?: "full" | "incremental" | "differential" | "database" | "files" | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            backups: {
                status: "completed" | "pending" | "in_progress" | "failed" | null;
                id: number;
                createdAt: Date | null;
                metadata: unknown;
                completedAt: Date | null;
                filePath: string | null;
                fileSize: number | null;
                errorMessage: string | null;
                backupType: "full" | "incremental" | "differential" | "database" | "files";
                duration: number | null;
            }[];
        }>;
        createBackup: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                backupType: "full" | "incremental" | "differential" | "database" | "files";
                metadata?: Record<string, any> | undefined;
            };
            _input_out: {
                backupType: "full" | "incremental" | "differential" | "database" | "files";
                metadata?: Record<string, any> | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            backupId: number;
            message: string;
        }>;
        deleteBackup: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
        }>;
        restoreBackup: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            error: string;
            message?: undefined;
        } | {
            success: boolean;
            message: string;
            error?: undefined;
        }>;
        getStatistics: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            settings: {
                byType: {
                    type: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | null;
                    count: number;
                }[];
                total: number;
            };
            notifications: {
                enabled: number;
            };
            providers: {
                active: number;
            };
            integrations: {
                active: number;
            };
            backup: {
                lastBackup: {
                    status: "completed" | "pending" | "in_progress" | "failed" | null;
                    id: number;
                    createdAt: Date | null;
                    metadata: unknown;
                    completedAt: Date | null;
                    filePath: string | null;
                    fileSize: number | null;
                    errorMessage: string | null;
                    backupType: "full" | "incremental" | "differential" | "database" | "files";
                    duration: number | null;
                };
            };
            security: {
                twoFactorEnabled: boolean;
                loginNotifications: boolean;
            };
        }>;
        exportSettings: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
            exportDate: string;
            userId: number;
            settings: {
                description: string | null;
                userId: number | null;
                isPublic: boolean | null;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                settingKey: string;
                settingValue: unknown;
                settingType: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | null;
            }[];
            notifications: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                config: unknown;
                channel: "push" | "email" | "slack" | "discord" | "telegram";
                eventType: string;
                isEnabled: boolean | null;
            }[];
            security: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                twoFactorEnabled: boolean | null;
                twoFactorSecret: string | null;
                backupCodes: string[] | null;
                sessionTimeout: number | null;
                ipWhitelist: string[] | null;
                loginNotifications: boolean | null;
                suspiciousActivityAlerts: boolean | null;
            };
            integrations: {
                userId: number;
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                config: unknown;
                serviceName: string;
            }[];
        }>;
        importSettings: import("@trpc/server").BuildProcedure<"mutation", {
            _config: import("@trpc/server").RootConfig<{
                ctx: import("./trpc.js").Context;
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
                settings?: any[] | undefined;
                notifications?: any[] | undefined;
                replaceExisting?: boolean | undefined;
            };
            _input_out: {
                replaceExisting: boolean;
                settings?: any[] | undefined;
                notifications?: any[] | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            imported: number;
            message: string;
        }>;
    }>;
}>;
/**
 * Export type definition of API for client-side usage
 */
export type AppRouter = typeof appRouter;
/**
 * ✅ Router Statistics - COMPLETE
 * - Total Routers: 16
 * - Total Endpoints: 247
 * - Coverage: Sprints 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
 *
 * Endpoints by Router:
 * 1. auth          - 5 endpoints   (login, register, verify, refresh, logout)
 * 2. users         - 14 endpoints  (profile, update, search, preferences, statistics, activity, avatar, sessions, export)
 * 3. teams         - 9 endpoints   (CRUD, members management)
 * 4. projects      - 10 endpoints  (CRUD, stats, archive, duplicate)
 * 5. tasks         - 16 endpoints  (CRUD, subtasks, dependencies, orchestration)
 * 6. chat          - 15 endpoints  (conversations, messages, attachments, reactions)
 * 7. prompts       - 12 endpoints  (CRUD, versions, search, revert)
 * 8. models        - 10 endpoints  (CRUD, specialized AIs)
 * 9. lmstudio      - 12 endpoints  (list, load, generate, benchmark, compare)
 * 10. training     - 22 endpoints  (datasets, jobs, evaluation, metrics)
 * 11. services     - 35 endpoints  (GitHub, Gmail, Drive, Sheets, OAuth, credentials)
 * 12. monitoring   - 14 endpoints  (metrics, health, logs, alerts)
 * 13. workflows    - 18 endpoints  (CRUD, execute, validate, templates, import/export)
 * 14. templates    - 14 endpoints  (CRUD, use, validate, import/export, popular)
 * 15. knowledgebase - 16 endpoints (CRUD, search, sources, tags, similar, import/export)
 * 16. settings     - 25 endpoints  (system config, notifications, security, providers, backups)
 *
 * TOTAL: 247 ENDPOINTS ✅
 *
 * Frontend Pages Status: 13/16 COMPLETE (81.25%)
 * ✅ Dashboard, Projects, Teams, Tasks, Chat, Prompts, Credentials, Workflows, Templates, KnowledgeBase, Settings, Profile, LMStudio
 * ⏳ Models, Training, Services (pending)
 */
