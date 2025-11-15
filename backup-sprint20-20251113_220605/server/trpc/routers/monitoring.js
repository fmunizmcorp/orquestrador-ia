/**
 * Monitoring tRPC Router
 * System monitoring and metrics endpoints
 * 14 endpoints
 */
import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { systemMonitorService } from '../../services/systemMonitorService.js';
import { db } from '../../db/index.js';
import { systemMetrics, apiUsage, errorLogs, auditLogs } from '../../db/schema.js';
import { eq, desc, gte, and } from 'drizzle-orm';
import pino from 'pino';
import { env, isDevelopment } from '../../config/env.js';
const logger = pino({ level: env.LOG_LEVEL, transport: isDevelopment ? { target: 'pino-pretty' } : undefined });
export const monitoringRouter = router({
    /**
     * 1. Get current system metrics
     */
    getCurrentMetrics: publicProcedure
        .query(async () => {
        try {
            console.log('[DEBUG] Getting metrics from systemMonitorService...');
            const metrics = await systemMonitorService.getMetrics();
            console.log('[DEBUG] Metrics received:', typeof metrics, Object.keys(metrics || {}));
            return { success: true, metrics };
        }
        catch (error) {
            console.error('[ERROR] Failed to get metrics:', error);
            throw error;
        }
    }),
    /**
     * 2. Get system health
     */
    getHealth: publicProcedure
        .query(async () => {
        const health = await systemMonitorService.getMetrics();
        return { success: true, health };
    }),
    /**
     * 3. Get metrics history
     */
    getMetricsHistory: publicProcedure
        .input(z.object({
        hours: z.number().min(1).max(168).optional().default(24),
    }))
        .query(async ({ input }) => {
        const since = new Date(Date.now() - input.hours * 60 * 60 * 1000);
        const history = await db.select()
            .from(systemMetrics)
            .where(gte(systemMetrics.timestamp, since))
            .orderBy(desc(systemMetrics.timestamp))
            .limit(1000);
        return { success: true, history };
    }),
    /**
     * 4. Get API usage stats
     */
    getApiUsage: publicProcedure
        .input(z.object({
        userId: z.number().optional(),
        hours: z.number().min(1).max(168).optional().default(24),
    }))
        .query(async ({ input }) => {
        const since = new Date(Date.now() - input.hours * 60 * 60 * 1000);
        const conditions = [gte(apiUsage.timestamp, since)];
        if (input.userId) {
            conditions.push(eq(apiUsage.userId, input.userId));
        }
        const usage = await db.select().from(apiUsage)
            .where(and(...conditions))
            .orderBy(desc(apiUsage.timestamp))
            .limit(1000);
        return { success: true, usage };
    }),
    /**
     * 5. Get error logs
     */
    getErrorLogs: publicProcedure
        .input(z.object({
        level: z.enum(['error', 'warning', 'critical']).optional(),
        hours: z.number().min(1).max(168).optional().default(24),
        limit: z.number().min(1).max(1000).optional().default(100),
    }))
        .query(async ({ input }) => {
        const since = new Date(Date.now() - input.hours * 60 * 60 * 1000);
        const conditions = [gte(errorLogs.timestamp, since)];
        if (input.level) {
            conditions.push(eq(errorLogs.level, input.level));
        }
        const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
        const logs = await db.select().from(errorLogs)
            .where(whereClause)
            .orderBy(desc(errorLogs.timestamp))
            .limit(input.limit);
        return { success: true, logs };
    }),
    /**
     * 6. Get audit logs
     */
    getAuditLogs: publicProcedure
        .input(z.object({
        userId: z.number().optional(),
        action: z.string().optional(),
        hours: z.number().min(1).max(168).optional().default(24),
        limit: z.number().min(1).max(1000).optional().default(100),
    }))
        .query(async ({ input }) => {
        const since = new Date(Date.now() - input.hours * 60 * 60 * 1000);
        const conditions = [gte(auditLogs.timestamp, since)];
        if (input.userId) {
            conditions.push(eq(auditLogs.userId, input.userId));
        }
        if (input.action) {
            conditions.push(eq(auditLogs.action, input.action));
        }
        const logs = await db.select().from(auditLogs)
            .where(and(...conditions))
            .orderBy(desc(auditLogs.timestamp))
            .limit(input.limit);
        return { success: true, logs };
    }),
    /**
     * 7. Get service status
     */
    getServiceStatus: publicProcedure
        .query(async () => {
        const metrics = await systemMonitorService.getMetrics();
        const status = {
            database: true,
            lmstudio: false,
            redis: false,
            services: metrics,
        };
        return { success: true, status };
    }),
    /**
     * 8. Get resource usage summary
     */
    getResourceSummary: publicProcedure
        .input(z.object({
        hours: z.number().min(1).max(168).optional().default(24),
    }))
        .query(async ({ input }) => {
        const since = new Date(Date.now() - input.hours * 60 * 60 * 1000);
        const history = await db.select()
            .from(systemMetrics)
            .where(gte(systemMetrics.timestamp, since))
            .limit(1000);
        if (history.length === 0) {
            return {
                success: true,
                summary: {
                    avgCpu: 0,
                    avgMemory: 0,
                    avgDisk: 0,
                    maxCpu: 0,
                    maxMemory: 0,
                    maxDisk: 0,
                },
            };
        }
        const summary = {
            avgCpu: history.reduce((sum, m) => sum + parseFloat(m.cpuUsage || '0'), 0) / history.length,
            avgMemory: history.reduce((sum, m) => sum + parseFloat(m.memoryUsage || '0'), 0) / history.length,
            avgDisk: history.reduce((sum, m) => sum + parseFloat(m.diskUsage || '0'), 0) / history.length,
            maxCpu: Math.max(...history.map(m => parseFloat(m.cpuUsage || '0'))),
            maxMemory: Math.max(...history.map(m => parseFloat(m.memoryUsage || '0'))),
            maxDisk: Math.max(...history.map(m => parseFloat(m.diskUsage || '0'))),
        };
        return { success: true, summary };
    }),
    /**
     * 9. Get API endpoint statistics
     */
    getEndpointStats: publicProcedure
        .input(z.object({
        hours: z.number().min(1).max(168).optional().default(24),
    }))
        .query(async ({ input }) => {
        const since = new Date(Date.now() - input.hours * 60 * 60 * 1000);
        const usage = await db.select()
            .from(apiUsage)
            .where(gte(apiUsage.timestamp, since))
            .limit(10000);
        // Aggregate by endpoint
        const stats = usage.reduce((acc, curr) => {
            const endpoint = curr.endpoint || 'unknown';
            if (!acc[endpoint]) {
                acc[endpoint] = {
                    count: 0,
                    totalDuration: 0,
                    errors: 0,
                };
            }
            acc[endpoint].count++;
            acc[endpoint].totalDuration += curr.responseDuration || 0;
            if (curr.statusCode && curr.statusCode >= 400) {
                acc[endpoint].errors++;
            }
            return acc;
        }, {});
        // Calculate averages
        const endpointStats = Object.entries(stats).map(([endpoint, data]) => ({
            endpoint,
            count: data.count,
            avgDuration: data.totalDuration / data.count,
            errorRate: (data.errors / data.count) * 100,
        }));
        return { success: true, stats: endpointStats };
    }),
    /**
     * 10. Get error rate
     */
    getErrorRate: publicProcedure
        .input(z.object({
        hours: z.number().min(1).max(168).optional().default(24),
    }))
        .query(async ({ input }) => {
        const since = new Date(Date.now() - input.hours * 60 * 60 * 1000);
        const errors = await db.select()
            .from(errorLogs)
            .where(and(gte(errorLogs.timestamp, since), eq(errorLogs.level, 'error')));
        const warnings = await db.select()
            .from(errorLogs)
            .where(and(gte(errorLogs.timestamp, since), eq(errorLogs.level, 'warning')));
        const total = errors.length + warnings.length;
        return {
            success: true,
            errorRate: {
                errors: errors.length,
                warnings: warnings.length,
                total,
                rate: total / input.hours, // per hour
            },
        };
    }),
    /**
     * 11. Clear old metrics
     */
    clearOldMetrics: publicProcedure
        .input(z.object({
        daysToKeep: z.number().min(1).max(365).optional().default(30),
    }))
        .mutation(async ({ input }) => {
        const cutoff = new Date(Date.now() - input.daysToKeep * 24 * 60 * 60 * 1000);
        // Note: In production, this would need proper permissions
        await db.delete(systemMetrics)
            .where(gte(systemMetrics.timestamp, cutoff));
        return { success: true, message: 'Old metrics cleared' };
    }),
    /**
     * 12. Get active connections
     */
    getActiveConnections: publicProcedure
        .query(async () => {
        // This would track WebSocket connections in production
        return {
            success: true,
            connections: {
                websocket: 0,
                http: 0,
                total: 0,
            },
        };
    }),
    /**
     * 13. Get performance metrics
     */
    getPerformanceMetrics: publicProcedure
        .query(async () => {
        const metrics = systemMonitorService.getMetrics();
        return {
            success: true,
            performance: {
                uptime: process.uptime(),
                nodeVersion: process.version,
                platform: process.platform,
                ...metrics,
            },
        };
    }),
    /**
     * 14. Test alert system
     */
    testAlert: publicProcedure
        .input(z.object({
        type: z.enum(['email', 'slack', 'webhook']),
        message: z.string(),
    }))
        .mutation(async ({ input }) => {
        // Simulate alert
        return {
            success: true,
            message: `Alert sent via ${input.type}`,
        };
    }),
});
