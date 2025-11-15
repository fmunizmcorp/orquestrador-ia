/**
 * Environment Configuration with Validation
 * Validates and exports environment variables with type safety
 */
export declare const env: {
    DB_HOST: string;
    DB_PORT: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    LOG_LEVEL: "debug" | "info" | "error" | "fatal" | "warn" | "trace";
    JWT_SECRET: string;
    CORS_ORIGIN: string;
    DATABASE_URL?: string | undefined;
};
export declare const isDevelopment: boolean;
export declare const isProduction: boolean;
export declare const isTest: boolean;
