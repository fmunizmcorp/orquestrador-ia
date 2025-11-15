/**
 * Users tRPC Router
 * User management endpoints
 * 8 endpoints
 */
export declare const usersRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1. Get user by ID
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
    /**
     * 2. Get current user profile
     */
    getProfile: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * 3. Update user profile
     */
    updateProfile: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * 4. Change password
     */
    changePassword: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * 5. List users
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
            limit?: number | undefined;
            offset?: number | undefined;
        } | undefined;
        _input_out: {
            limit: number;
            offset: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, import("../../utils/pagination.js").PaginatedResponse<{
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
    /**
     * 6. Search users
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
    /**
     * 7. Update user preferences
     */
    updatePreferences: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * 8. Delete user account
     */
    deleteAccount: import("@trpc/server").BuildProcedure<"mutation", {
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
