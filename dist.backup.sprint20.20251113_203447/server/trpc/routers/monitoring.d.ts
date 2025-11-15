/**
 * Monitoring tRPC Router
 * System monitoring and metrics endpoints
 * 14 endpoints
 */
export declare const monitoringRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * 1. Get current system metrics
     */
    getCurrentMetrics: import("@trpc/server").BuildProcedure<"query", {
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
        metrics: {
            cpu: number;
            memory: number;
            disk: number;
            metrics: import("../../services/systemMonitorService.js").SystemMetrics;
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
    /**
     * 2. Get system health
     */
    getHealth: import("@trpc/server").BuildProcedure<"query", {
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
        health: import("../../services/systemMonitorService.js").SystemMetrics;
    }>;
    /**
     * 3. Get metrics history
     */
    getMetricsHistory: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * 4. Get API usage stats
     */
    getApiUsage: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * 5. Get error logs
     */
    getErrorLogs: import("@trpc/server").BuildProcedure<"query", {
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
            level?: "warning" | "critical" | "error" | undefined;
            hours?: number | undefined;
            limit?: number | undefined;
        };
        _input_out: {
            hours: number;
            limit: number;
            level?: "warning" | "critical" | "error" | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        logs: {
            level: "warning" | "critical" | "error" | null;
            message: string;
            stack: string | null;
            userId: number | null;
            id: number;
            metadata: unknown;
            timestamp: Date | null;
        }[];
    }>;
    /**
     * 6. Get audit logs
     */
    getAuditLogs: import("@trpc/server").BuildProcedure<"query", {
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
            userId?: number | undefined;
            hours?: number | undefined;
            limit?: number | undefined;
            action?: string | undefined;
        };
        _input_out: {
            hours: number;
            limit: number;
            userId?: number | undefined;
            action?: string | undefined;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        logs: {
            userId: number | null;
            action: string;
            id: number;
            timestamp: Date | null;
            resourceType: string | null;
            resourceId: number | null;
            changes: unknown;
            ipAddress: string | null;
            userAgent: string | null;
        }[];
    }>;
    /**
     * 7. Get service status
     */
    getServiceStatus: import("@trpc/server").BuildProcedure<"query", {
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
        status: {
            database: boolean;
            lmstudio: boolean;
            redis: boolean;
            services: import("../../services/systemMonitorService.js").SystemMetrics;
        };
    }>;
    /**
     * 8. Get resource usage summary
     */
    getResourceSummary: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * 9. Get API endpoint statistics
     */
    getEndpointStats: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * 10. Get error rate
     */
    getErrorRate: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * 11. Clear old metrics
     */
    clearOldMetrics: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * 12. Get active connections
     */
    getActiveConnections: import("@trpc/server").BuildProcedure<"query", {
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
        connections: {
            websocket: number;
            http: number;
            total: number;
        };
    }>;
    /**
     * 13. Get performance metrics
     */
    getPerformanceMetrics: import("@trpc/server").BuildProcedure<"query", {
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
        performance: {
            then<TResult1 = import("../../services/systemMonitorService.js").SystemMetrics, TResult2 = never>(onfulfilled?: ((value: import("../../services/systemMonitorService.js").SystemMetrics) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
            catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<import("../../services/systemMonitorService.js").SystemMetrics | TResult>;
            finally(onfinally?: (() => void) | null | undefined): Promise<import("../../services/systemMonitorService.js").SystemMetrics>;
            [Symbol.toStringTag]: string;
            uptime: number;
            nodeVersion: string;
            platform: NodeJS.Platform;
        };
    }>;
    /**
     * 14. Test alert system
     */
    testAlert: import("@trpc/server").BuildProcedure<"mutation", {
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
            message: string;
            type: "email" | "slack" | "webhook";
        };
        _input_out: {
            message: string;
            type: "email" | "slack" | "webhook";
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
        message: string;
    }>;
}>;
