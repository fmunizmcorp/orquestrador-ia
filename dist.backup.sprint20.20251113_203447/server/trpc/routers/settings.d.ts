export declare const settingsRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: import("../trpc.js").Context;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
}>, {
    /**
     * Lista todas as configurações do sistema
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
            isPublic?: boolean | undefined;
            settingType?: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
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
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isPublic: boolean | null;
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
    /**
     * Busca uma configuração específica por chave
     */
    getByKey: import("@trpc/server").BuildProcedure<"query", {
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
        id: number;
        createdAt: Date | null;
        updatedAt: Date | null;
        isPublic: boolean | null;
        settingKey: string;
        settingValue: unknown;
        settingType: "user" | "system" | "ai_provider" | "notification" | "security" | "integration" | null;
    }>;
    /**
     * Cria ou atualiza uma configuração
     */
    upsert: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * Deleta uma configuração
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
    /**
     * Reseta configurações para valores padrão
     */
    reset: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * Lista preferências de notificação
     */
    listNotifications: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * Cria ou atualiza preferência de notificação
     */
    upsertNotification: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * Deleta preferência de notificação
     */
    deleteNotification: import("@trpc/server").BuildProcedure<"mutation", {
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
    }>;
    /**
     * Busca configurações de segurança do usuário
     */
    getSecurity: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * Atualiza configurações de segurança
     */
    updateSecurity: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * Gera códigos de backup para 2FA
     */
    generateBackupCodes: import("@trpc/server").BuildProcedure<"mutation", {
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
        backupCodes: string[];
    }>;
    /**
     * Lista AI providers
     */
    listProviders: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * Cria novo AI provider
     */
    createProvider: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * Atualiza AI provider
     */
    updateProvider: import("@trpc/server").BuildProcedure<"mutation", {
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
                type?: "local" | "api" | undefined;
                name?: string | undefined;
                endpoint?: string | undefined;
                apiKey?: string | undefined;
                isActive?: boolean | undefined;
                config?: Record<string, any> | undefined;
            };
            id: number;
        };
        _input_out: {
            data: {
                type?: "local" | "api" | undefined;
                name?: string | undefined;
                endpoint?: string | undefined;
                apiKey?: string | undefined;
                isActive?: boolean | undefined;
                config?: Record<string, any> | undefined;
            };
            id: number;
        };
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
    }, {
        success: boolean;
    }>;
    /**
     * Deleta AI provider
     */
    deleteProvider: import("@trpc/server").BuildProcedure<"mutation", {
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
    }>;
    /**
     * Testa conexão com AI provider
     */
    testProvider: import("@trpc/server").BuildProcedure<"mutation", {
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
        error: string;
        message?: undefined;
        latency?: undefined;
    } | {
        success: boolean;
        message: string;
        latency: number;
        error?: undefined;
    }>;
    /**
     * Lista serviços externos integrados
     */
    listIntegrations: import("@trpc/server").BuildProcedure<"query", {
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
    /**
     * Cria nova integração
     */
    createIntegration: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * Atualiza integração
     */
    updateIntegration: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * Deleta integração
     */
    deleteIntegration: import("@trpc/server").BuildProcedure<"mutation", {
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
    }>;
    /**
     * Lista backups do sistema
     */
    listBackups: import("@trpc/server").BuildProcedure<"query", {
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
            status?: "completed" | "pending" | "in_progress" | "failed" | undefined;
            backupType?: "full" | "incremental" | "differential" | "database" | "files" | undefined;
            limit?: number | undefined;
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
            duration: number | null;
            id: number;
            createdAt: Date | null;
            metadata: unknown;
            completedAt: Date | null;
            filePath: string | null;
            fileSize: number | null;
            errorMessage: string | null;
            backupType: "full" | "incremental" | "differential" | "database" | "files";
        }[];
    }>;
    /**
     * Cria novo backup
     */
    createBackup: import("@trpc/server").BuildProcedure<"mutation", {
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
    /**
     * Deleta backup
     */
    deleteBackup: import("@trpc/server").BuildProcedure<"mutation", {
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
    }>;
    /**
     * Restaura backup
     */
    restoreBackup: import("@trpc/server").BuildProcedure<"mutation", {
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
        error: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        error?: undefined;
    }>;
    /**
     * Retorna estatísticas gerais das configurações
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
                duration: number | null;
                id: number;
                createdAt: Date | null;
                metadata: unknown;
                completedAt: Date | null;
                filePath: string | null;
                fileSize: number | null;
                errorMessage: string | null;
                backupType: "full" | "incremental" | "differential" | "database" | "files";
            };
        };
        security: {
            twoFactorEnabled: boolean;
            loginNotifications: boolean;
        };
    }>;
    /**
     * Exporta todas as configurações do usuário
     */
    exportSettings: import("@trpc/server").BuildProcedure<"query", {
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
        exportDate: string;
        userId: number;
        settings: {
            description: string | null;
            userId: number | null;
            id: number;
            createdAt: Date | null;
            updatedAt: Date | null;
            isPublic: boolean | null;
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
    /**
     * Importa configurações do usuário
     */
    importSettings: import("@trpc/server").BuildProcedure<"mutation", {
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
