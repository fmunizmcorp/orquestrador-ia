/**
 * Users tRPC Router
 * User management endpoints
 * 14 endpoints
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
    /**
     * 9. Get user statistics
     */
    getStatistics: import("@trpc/server").BuildProcedure<"query", {
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
        statistics: {
            totalTasks: number;
            completedTasks: number;
            totalProjects: number;
            totalConversations: number;
            totalTemplates: number;
            totalWorkflows: number;
        };
    }>;
    /**
     * 10. Get user activity (recent actions)
     */
    getActivity: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * 11. Upload avatar (returns URL)
     */
    uploadAvatar: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * 12. Get user sessions (active devices)
     */
    getSessions: import("@trpc/server").BuildProcedure<"query", {
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
        sessions: {
            id: number;
            deviceName: string;
            location: string;
            ipAddress: string;
            lastActive: string;
            isCurrent: boolean;
        }[];
    }>;
    /**
     * 13. Revoke session
     */
    revokeSession: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * 14. Export user data
     */
    exportData: import("@trpc/server").BuildProcedure<"query", {
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
        conversations: {
            userId: number;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isActive: boolean | null;
            modelId: number | null;
            systemPrompt: string | null;
            metadata: unknown;
            title: string | null;
            aiId: number | null;
            lastMessageAt: Date | null;
            messageCount: number | null;
            isRead: boolean | null;
        }[];
    }>;
}>;
