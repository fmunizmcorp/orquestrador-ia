/**
 * Environment Configuration with Validation
 * Validates and exports environment variables with type safety
 */
import { z } from 'zod';
// Environment schema
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3000'),
    DATABASE_URL: z.string().optional(),
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().default('3306'),
    DB_USER: z.string().default('root'),
    DB_PASSWORD: z.string().default(''),
    DB_NAME: z.string().default('orquestrador'),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    JWT_SECRET: z.string().default('your-secret-key-change-in-production'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
});
// Parse and validate environment
const parseEnv = () => {
    try {
        return envSchema.parse(process.env);
    }
    catch (error) {
        console.error('❌ Invalid environment variables:', error);
        throw new Error('Environment validation failed');
    }
};
// Export validated environment
export const env = parseEnv();
// Export helper flags
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
