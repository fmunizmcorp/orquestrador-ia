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
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            description: string | null;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                description: string | null;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                description: string | null;
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
                name?: string | undefined;
                description?: string | undefined;
            };
            _input_out: {
                id: number;
                name?: string | undefined;
                description?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            team: {
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                description: string | null;
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
                id: number;
                role: "admin" | "owner" | "member" | "viewer" | null;
                userId: number;
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
                role: "admin" | "owner" | "member" | "viewer";
                userId: number;
                teamId: number;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            member: {
                id: number;
                role: "admin" | "owner" | "member" | "viewer" | null;
                userId: number;
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
                id: number;
                role: "admin" | "owner" | "member" | "viewer" | null;
                userId: number;
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
                teamId?: number | undefined;
                status?: "active" | "completed" | "archived" | undefined;
                limit?: number | undefined;
                offset?: number | undefined;
            } | undefined;
            _input_out: {
                limit: number;
                offset: number;
                teamId?: number | undefined;
                status?: "active" | "completed" | "archived" | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, import("../utils/pagination.js").PaginatedResponse<{
            id: number;
            name: string;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            userId: number;
            description: string | null;
            teamId: number | null;
            status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
            startDate: Date | null;
            endDate: Date | null;
            budget: string | null;
            progress: number | null;
            tags: unknown;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                userId: number;
                description: string | null;
                teamId: number | null;
                status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
                tags: unknown;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                userId: number;
                description: string | null;
                teamId: number | null;
                status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
                tags: unknown;
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
                description?: string | undefined;
                status?: "active" | "completed" | "archived" | undefined;
                startDate?: string | undefined;
                endDate?: string | undefined;
                budget?: number | undefined;
            };
            _input_out: {
                id: number;
                name?: string | undefined;
                description?: string | undefined;
                status?: "active" | "completed" | "archived" | undefined;
                startDate?: string | undefined;
                endDate?: string | undefined;
                budget?: number | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            project: {
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                userId: number;
                description: string | null;
                teamId: number | null;
                status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
                tags: unknown;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                userId: number;
                description: string | null;
                teamId: number | null;
                status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
                tags: unknown;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                userId: number;
                description: string | null;
                teamId: number | null;
                status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
                tags: unknown;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                userId: number;
                description: string | null;
                teamId: number | null;
                status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
                tags: unknown;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                userId: number;
                description: string | null;
                teamId: number | null;
                status: "planning" | "active" | "on_hold" | "completed" | "archived" | null;
                startDate: Date | null;
                endDate: Date | null;
                budget: string | null;
                progress: number | null;
                tags: unknown;
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
                projectId?: number | undefined;
                status?: "planning" | "completed" | "pending" | "in_progress" | "blocked" | "cancelled" | undefined;
                limit?: number | undefined;
                offset?: number | undefined;
            };
            _input_out: {
                limit: number;
                offset: number;
                projectId?: number | undefined;
                status?: "planning" | "completed" | "pending" | "in_progress" | "blocked" | "cancelled" | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            tasks: {
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                userId: number;
                description: string;
                projectId: number | null;
                status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
                assignedUserId: number | null;
                title: string;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                userId: number;
                description: string;
                projectId: number | null;
                status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
                assignedUserId: number | null;
                title: string;
                estimatedHours: string | null;
                actualHours: string | null;
                dueDate: Date | null;
                completedAt: Date | null;
            };
            subtasks: {
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                description: string | null;
                status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
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
                projectId: number;
                title: string;
                priority?: "low" | "medium" | "high" | "urgent" | undefined;
                description?: string | undefined;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                userId: number;
                description: string;
                projectId: number | null;
                status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
                assignedUserId: number | null;
                title: string;
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
                priority?: "low" | "medium" | "high" | "urgent" | undefined;
                description?: string | undefined;
                status?: "planning" | "completed" | "pending" | "in_progress" | "blocked" | "cancelled" | undefined;
                assignedUserId?: number | undefined;
                title?: string | undefined;
                estimatedHours?: number | undefined;
                actualHours?: number | undefined;
                dueDate?: string | undefined;
            };
            _input_out: {
                id: number;
                priority?: "low" | "medium" | "high" | "urgent" | undefined;
                description?: string | undefined;
                status?: "planning" | "completed" | "pending" | "in_progress" | "blocked" | "cancelled" | undefined;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                userId: number;
                description: string;
                projectId: number | null;
                status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
                assignedUserId: number | null;
                title: string;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                description: string | null;
                status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                description: string | null;
                status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                description: string | null;
                status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                description: string | null;
                status: "completed" | "pending" | "executing" | "validating" | "failed" | "rejected" | null;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                priority: "low" | "medium" | "high" | "urgent" | null;
                userId: number;
                description: string;
                projectId: number | null;
                status: "planning" | "completed" | "pending" | "in_progress" | "executing" | "validating" | "blocked" | "failed" | "cancelled" | "paused" | null;
                assignedUserId: number | null;
                title: string;
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
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            modelId: number | null;
            userId: number;
            systemPrompt: string | null;
            metadata: unknown;
            title: string | null;
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
                modelId: number;
                userId: number;
                systemPrompt?: string | undefined;
                title?: string | undefined;
            };
            _input_out: {
                modelId: number;
                userId: number;
                systemPrompt?: string | undefined;
                title?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            conversation: {
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                modelId: number | null;
                userId: number;
                systemPrompt: string | null;
                metadata: unknown;
                title: string | null;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                modelId: number | null;
                userId: number;
                systemPrompt: string | null;
                metadata: unknown;
                title: string | null;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                modelId: number | null;
                userId: number;
                systemPrompt: string | null;
                metadata: unknown;
                title: string | null;
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
                role?: "user" | "assistant" | "system" | undefined;
                parentMessageId?: number | undefined;
            };
            _input_out: {
                role: "user" | "assistant" | "system";
                content: string;
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
                id: number;
                createdAt: Date | null;
                userId: number;
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
                id: number;
                createdAt: Date | null;
                userId: number;
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
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            userId: number;
            description: string | null;
            category: string | null;
            tags: string[] | null;
            title: string;
            isPublic: boolean | null;
            content: string;
            variables: unknown;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
                description: string | null;
                category: string | null;
                tags: string[] | null;
                title: string;
                isPublic: boolean | null;
                content: string;
                variables: unknown;
                useCount: number | null;
                currentVersion: number | null;
            };
            versions: {
                id: number;
                createdAt: Date | null;
                content: string;
                promptId: number;
                version: number;
                changelog: string | null;
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
                tags?: string[] | undefined;
                isPublic?: boolean | undefined;
                variables?: string[] | undefined;
            };
            _input_out: {
                userId: number;
                title: string;
                isPublic: boolean;
                content: string;
                description?: string | undefined;
                category?: string | undefined;
                tags?: string[] | undefined;
                variables?: string[] | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            prompt: {
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
                description: string | null;
                category: string | null;
                tags: string[] | null;
                title: string;
                isPublic: boolean | null;
                content: string;
                variables: unknown;
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
                id: number;
                userId: number;
                description?: string | undefined;
                category?: string | undefined;
                tags?: string[] | undefined;
                title?: string | undefined;
                isPublic?: boolean | undefined;
                content?: string | undefined;
                variables?: string[] | undefined;
                changelog?: string | undefined;
            };
            _input_out: {
                id: number;
                userId: number;
                description?: string | undefined;
                category?: string | undefined;
                tags?: string[] | undefined;
                title?: string | undefined;
                isPublic?: boolean | undefined;
                content?: string | undefined;
                variables?: string[] | undefined;
                changelog?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            prompt: {
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
                description: string | null;
                category: string | null;
                tags: string[] | null;
                title: string;
                isPublic: boolean | null;
                content: string;
                variables: unknown;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
                description: string | null;
                category: string | null;
                tags: string[] | null;
                title: string;
                isPublic: boolean | null;
                content: string;
                variables: unknown;
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
                createdAt: Date | null;
                content: string;
                promptId: number;
                version: number;
                changelog: string | null;
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
                createdAt: Date | null;
                content: string;
                promptId: number;
                version: number;
                changelog: string | null;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
                description: string | null;
                category: string | null;
                tags: string[] | null;
                title: string;
                isPublic: boolean | null;
                content: string;
                variables: unknown;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
                description: string | null;
                category: string | null;
                tags: string[] | null;
                title: string;
                isPublic: boolean | null;
                content: string;
                variables: unknown;
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
                name: string;
                dataType: "text" | "conversation" | "qa" | "instruction";
                data: any[];
                userId: number;
                description?: string | undefined;
            };
            _input_out: {
                name: string;
                dataType: "text" | "conversation" | "qa" | "instruction";
                data: any[];
                userId: number;
                description?: string | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            dataset: {
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean;
                userId: number;
                description: string | null;
                metadata: unknown;
                filePath: string | null;
                datasetType: "text" | "code" | "qa" | "completion" | "chat" | null;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean;
                userId: number;
                description: string | null;
                metadata: unknown;
                filePath: string | null;
                datasetType: "text" | "code" | "qa" | "completion" | "chat" | null;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean;
                userId: number;
                description: string | null;
                metadata: unknown;
                filePath: string | null;
                datasetType: "text" | "code" | "qa" | "completion" | "chat" | null;
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
                dataType: "text" | "conversation" | "qa" | "instruction";
                data: any[];
            };
            _input_out: {
                dataType: "text" | "conversation" | "qa" | "instruction";
                data: any[];
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
                description: string | null;
                metadata: unknown;
                status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
                description: string | null;
                metadata: unknown;
                status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
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
                id: number;
                name: string;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
                description: string | null;
                metadata: unknown;
                status: "completed" | "pending" | "validating" | "failed" | "cancelled" | "preparing" | "training" | null;
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
                modelSize: "medium" | "small" | "large" | "xlarge";
            };
            _input_out: {
                batchSize: number;
                epochs: number;
                datasetSize: number;
                modelSize: "medium" | "small" | "large" | "xlarge";
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
                modelSize: "medium" | "small" | "large" | "xlarge";
            };
            _input_out: {
                taskType: "qa" | "classification" | "generation" | "summarization";
                datasetSize: number;
                modelSize: "medium" | "small" | "large" | "xlarge";
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
                isActive?: boolean | undefined;
                userId?: number | undefined;
            };
            _input_out: {
                isActive?: boolean | undefined;
                userId?: number | undefined;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            services: {
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                config: unknown;
                userId: number;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                config: unknown;
                userId: number;
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
                serviceName: "slack" | "github" | "gmail" | "drive" | "sheets" | "notion" | "discord";
                config?: any;
            };
            _input_out: {
                userId: number;
                serviceName: "slack" | "github" | "gmail" | "drive" | "sheets" | "notion" | "discord";
                config?: any;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, {
            success: boolean;
            service: {
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                config: unknown;
                userId: number;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                isActive: boolean | null;
                config: unknown;
                userId: number;
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
                name: string;
                content: string;
                serviceId: number;
                mimeType: string;
                folderId?: string | undefined;
            };
            _input_out: {
                name: string;
                content: string;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
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
                id: number;
                createdAt: Date | null;
                updatedAt: Date | null;
                userId: number;
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
            metrics: import("../services/systemMonitorService.js").SystemMetrics;
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
                id: number;
                endpoint: string;
                userId: number | null;
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
                level?: "warning" | "error" | "critical" | undefined;
                limit?: number | undefined;
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
                id: number;
                userId: number | null;
                metadata: unknown;
                level: "warning" | "error" | "critical" | null;
                message: string;
                timestamp: Date | null;
                stack: string | null;
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
                action?: string | undefined;
                limit?: number | undefined;
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
                id: number;
                userId: number | null;
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
}>;
/**
 * Export type definition of API for client-side usage
 */
export type AppRouter = typeof appRouter;
/**
 * ✅ Router Statistics - COMPLETE
 * - Total Routers: 12
 * - Total Endpoints: 168+
 * - Coverage: Sprints 4, 5, 7, 8, 9, 10, 11, 13
 *
 * Endpoints by Router:
 * 1. auth         - 5 endpoints   (login, register, verify, refresh, logout)
 * 2. users        - 8 endpoints   (profile, update, search, preferences)
 * 3. teams        - 9 endpoints   (CRUD, members management)
 * 4. projects     - 10 endpoints  (CRUD, stats, archive, duplicate)
 * 5. tasks        - 16 endpoints  (CRUD, subtasks, dependencies, orchestration)
 * 6. chat         - 15 endpoints  (conversations, messages, attachments, reactions)
 * 7. prompts      - 12 endpoints  (CRUD, versions, search, revert)
 * 8. models       - 10 endpoints  (CRUD, specialized AIs)
 * 9. lmstudio     - 12 endpoints  (list, load, generate, benchmark, compare)
 * 10. training    - 22 endpoints  (datasets, jobs, evaluation, metrics)
 * 11. services    - 35 endpoints  (GitHub, Gmail, Drive, Sheets, OAuth, credentials)
 * 12. monitoring  - 14 endpoints  (metrics, health, logs, alerts)
 *
 * TOTAL: 168 ENDPOINTS ✅
 */
