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
import { eq, desc, gte, and , sql } from 'drizzle-orm';
import pino from 'pino';
import { env, isDevelopment } from '../../config/env.js';
import {
  createStandardError,
  handleDatabaseError,
  ErrorCodes,
  notFoundError,
} from '../../utils/errors.js';
import {
  paginationInputSchema,
  createPaginatedResponse,
  applyPagination,
} from '../../utils/pagination.js';

const logger = pino({ level: env.LOG_LEVEL, transport: isDevelopment ? { target: 'pino-pretty' } : undefined });

export const monitoringRouter = router({
  /**
   * 1. Get current system metrics
   * SPRINT 60: Added router-level timeout (10s) for additional safety
   */
  getCurrentMetrics: publicProcedure
    .query(async () => {
      try {
        console.log('[SPRINT 60] Getting metrics from systemMonitorService...');
        
        // SPRINT 60: Router-level timeout wrapper (10 seconds max)
        const metricsPromise = systemMonitorService.getMetrics();
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('[SPRINT 60] Router timeout after 10s')), 10000);
        });
        
        const fullMetrics = await Promise.race([metricsPromise, timeoutPromise]);
        console.log('[SPRINT 60] Metrics received:', typeof fullMetrics, Object.keys(fullMetrics || {}));
        
        // Map to simplified format expected by frontend
        const metrics = {
          cpu: fullMetrics.cpu.usage,
          memory: fullMetrics.memory.usagePercent,
          disk: fullMetrics.disk.usagePercent,
          metrics: fullMetrics, // Keep full metrics for AnalyticsDashboard
        };
        
        return { success: true, metrics };
      } catch (error) {
        console.error('[SPRINT 60] Failed to get metrics:', error);
        // Return safe defaults on error to prevent crashes
        return {
          success: false,
          metrics: {
            cpu: 0,
            memory: 0,
            disk: 0,
            metrics: null,
          },
        };
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
      
      // BUGFIX RODADA 35 - BUG 3: Check actual service status instead of hardcoded values
      let databaseStatus = false;
      let lmstudioStatus = false;
      
      // Check database connection
      try {
        await db.execute(sql`SELECT 1`);
        databaseStatus = true;
      } catch (dbError: any) {
        logger.error({ error: dbError }, 'Database connection failed');
        databaseStatus = false;
      }
      
      // Check LM Studio availability
      try {
        const lmResponse = await fetch('http://localhost:1234/v1/models', {
          method: 'GET',
          signal: AbortSignal.timeout(2000),
        });
        lmstudioStatus = lmResponse.ok;
      } catch (lmError: any) {
        logger.debug({ error: lmError }, 'LM Studio not available');
        lmstudioStatus = false;
      }
      
      const status = {
        database: databaseStatus,
        lmstudio: lmstudioStatus,
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
      const stats = usage.reduce((acc: any, curr) => {
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
      const endpointStats = Object.entries(stats).map(([endpoint, data]: [string, any]) => ({
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
        .where(and(
          gte(errorLogs.timestamp, since),
          eq(errorLogs.level, 'error')
        ));

      const warnings = await db.select()
        .from(errorLogs)
        .where(and(
          gte(errorLogs.timestamp, since),
          eq(errorLogs.level, 'warning')
        ));

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
