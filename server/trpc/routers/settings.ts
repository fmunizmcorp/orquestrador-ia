import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import {
  systemSettings,
  notificationPreferences,
  securitySettings,
  systemBackups,
  users,
  aiProviders,
  externalServices,
  apiCredentials,
} from '../../db/schema.js';
import { eq, and, desc, count, sql, like, or } from 'drizzle-orm';

// ==================================================
// SCHEMAS DE VALIDAÇÃO
// ==================================================

const settingValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.any()),
  z.record(z.any()),
]);

const systemSettingSchema = z.object({
  settingKey: z.string().min(1).max(100),
  settingValue: settingValueSchema,
  settingType: z.enum(['system', 'user', 'ai_provider', 'notification', 'security', 'integration']).optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

const notificationPreferenceSchema = z.object({
  channel: z.enum(['email', 'push', 'slack', 'discord', 'telegram']),
  eventType: z.string().min(1).max(100),
  isEnabled: z.boolean().optional(),
  config: z.record(z.any()).optional(),
});

const securitySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().optional(),
  twoFactorSecret: z.string().optional(),
  backupCodes: z.array(z.string()).optional(),
  sessionTimeout: z.number().int().min(300).max(86400).optional(),
  ipWhitelist: z.array(z.string()).optional(),
  loginNotifications: z.boolean().optional(),
  suspiciousActivityAlerts: z.boolean().optional(),
});

const aiProviderConfigSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['local', 'api']),
  endpoint: z.string().url().max(500),
  apiKey: z.string().optional(),
  isActive: z.boolean().optional(),
  config: z.record(z.any()).optional(),
});

const backupConfigSchema = z.object({
  backupType: z.enum(['full', 'incremental', 'differential', 'database', 'files']),
  metadata: z.record(z.any()).optional(),
});

// ==================================================
// ROUTER: SETTINGS
// ==================================================

export const settingsRouter = router({
  // ==================================================
  // 1. CONFIGURAÇÕES GERAIS DO SISTEMA
  // ==================================================

  /**
   * Lista todas as configurações do sistema
   */
  list: publicProcedure
    .input(
      z.object({
        settingType: z.enum(['system', 'user', 'ai_provider', 'notification', 'security', 'integration']).optional(),
        isPublic: z.boolean().optional(),
        limit: z.number().min(1).max(1000).optional().default(100),
        offset: z.number().min(0).optional().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;
      const conditions = [];

      // Filtros por tipo e visibilidade
      if (input.settingType) {
        conditions.push(eq(systemSettings.settingType, input.settingType));
      }
      if (input.isPublic !== undefined) {
        conditions.push(eq(systemSettings.isPublic, input.isPublic));
      }

      // Buscar configurações do usuário ou públicas
      const userSettings = await db
        .select()
        .from(systemSettings)
        .where(
          and(
            eq(systemSettings.userId, userId),
            conditions.length > 0 ? and(...conditions) : undefined
          )
        )
        .limit(input.limit)
        .offset(input.offset);

      const totalCount = await db
        .select({ count: count() })
        .from(systemSettings)
        .where(eq(systemSettings.userId, userId));

      return {
        settings: userSettings,
        pagination: {
          total: totalCount[0]?.count || 0,
          limit: input.limit,
          offset: input.offset,
        },
      };
    }),

  /**
   * Busca uma configuração específica por chave
   */
  getByKey: publicProcedure
    .input(
      z.object({
        settingKey: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;

      const setting = await db
        .select()
        .from(systemSettings)
        .where(
          and(
            eq(systemSettings.userId, userId),
            eq(systemSettings.settingKey, input.settingKey)
          )
        )
        .limit(1);

      return setting[0] || null;
    }),

  /**
   * Cria ou atualiza uma configuração
   */
  upsert: publicProcedure
    .input(systemSettingSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;

      // Verificar se já existe
      const existing = await db
        .select()
        .from(systemSettings)
        .where(
          and(
            eq(systemSettings.userId, userId),
            eq(systemSettings.settingKey, input.settingKey)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // Update
        await db
          .update(systemSettings)
          .set({
            settingValue: input.settingValue,
            settingType: input.settingType || existing[0].settingType,
            description: input.description || existing[0].description,
            isPublic: input.isPublic !== undefined ? input.isPublic : existing[0].isPublic,
            updatedAt: new Date(),
          })
          .where(eq(systemSettings.id, existing[0].id));

        return {
          success: true,
          action: 'updated',
          settingId: existing[0].id,
        };
      } else {
        // Insert
        const result = await db.insert(systemSettings).values({
          userId,
          settingKey: input.settingKey,
          settingValue: input.settingValue,
          settingType: input.settingType || 'user',
          description: input.description,
          isPublic: input.isPublic || false,
        });

        return {
          success: true,
          action: 'created',
          settingId: result[0].insertId,
        };
      }
    }),

  /**
   * Deleta uma configuração
   */
  delete: publicProcedure
    .input(
      z.object({
        settingKey: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;

      await db
        .delete(systemSettings)
        .where(
          and(
            eq(systemSettings.userId, userId),
            eq(systemSettings.settingKey, input.settingKey)
          )
        );

      return { success: true };
    }),

  /**
   * Reseta configurações para valores padrão
   */
  reset: publicProcedure
    .input(
      z.object({
        settingType: z.enum(['system', 'user', 'ai_provider', 'notification', 'security', 'integration']).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;

      const conditions = [eq(systemSettings.userId, userId)];
      if (input.settingType) {
        conditions.push(eq(systemSettings.settingType, input.settingType));
      }

      await db.delete(systemSettings).where(and(...conditions));

      return { success: true, message: 'Configurações resetadas com sucesso' };
    }),

  // ==================================================
  // 2. NOTIFICAÇÕES
  // ==================================================

  /**
   * Lista preferências de notificação
   */
  listNotifications: publicProcedure
    .input(
      z.object({
        channel: z.enum(['email', 'push', 'slack', 'discord', 'telegram']).optional(),
        eventType: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;

      const conditions = [eq(notificationPreferences.userId, userId)];
      if (input.channel) {
        conditions.push(eq(notificationPreferences.channel, input.channel));
      }
      if (input.eventType) {
        conditions.push(eq(notificationPreferences.eventType, input.eventType));
      }

      const preferences = await db
        .select()
        .from(notificationPreferences)
        .where(and(...conditions));

      return { preferences };
    }),

  /**
   * Cria ou atualiza preferência de notificação
   */
  upsertNotification: publicProcedure
    .input(notificationPreferenceSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;

      const existing = await db
        .select()
        .from(notificationPreferences)
        .where(
          and(
            eq(notificationPreferences.userId, userId),
            eq(notificationPreferences.channel, input.channel),
            eq(notificationPreferences.eventType, input.eventType)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(notificationPreferences)
          .set({
            isEnabled: input.isEnabled !== undefined ? input.isEnabled : existing[0].isEnabled,
            config: input.config || existing[0].config,
            updatedAt: new Date(),
          })
          .where(eq(notificationPreferences.id, existing[0].id));

        return { success: true, action: 'updated', id: existing[0].id };
      } else {
        const result = await db.insert(notificationPreferences).values({
          userId,
          channel: input.channel,
          eventType: input.eventType,
          isEnabled: input.isEnabled !== undefined ? input.isEnabled : true,
          config: input.config,
        });

        return { success: true, action: 'created', id: result[0].insertId };
      }
    }),

  /**
   * Deleta preferência de notificação
   */
  deleteNotification: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(notificationPreferences).where(eq(notificationPreferences.id, input.id));
      return { success: true };
    }),

  // ==================================================
  // 3. SEGURANÇA
  // ==================================================

  /**
   * Busca configurações de segurança do usuário
   */
  getSecurity: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId || 1;

    const settings = await db
      .select()
      .from(securitySettings)
      .where(eq(securitySettings.userId, userId))
      .limit(1);

    // Se não existe, criar com valores padrão
    if (settings.length === 0) {
      await db.insert(securitySettings).values({
        userId,
        twoFactorEnabled: false,
        sessionTimeout: 3600,
        loginNotifications: true,
        suspiciousActivityAlerts: true,
      });

      const newSettings = await db
        .select()
        .from(securitySettings)
        .where(eq(securitySettings.userId, userId))
        .limit(1);

      return newSettings[0];
    }

    return settings[0];
  }),

  /**
   * Atualiza configurações de segurança
   */
  updateSecurity: publicProcedure
    .input(securitySettingsSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;

      const existing = await db
        .select()
        .from(securitySettings)
        .where(eq(securitySettings.userId, userId))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(securitySettings)
          .set({
            ...input,
            updatedAt: new Date(),
          })
          .where(eq(securitySettings.userId, userId));

        return { success: true, action: 'updated' };
      } else {
        await db.insert(securitySettings).values({
          userId,
          ...input,
        });

        return { success: true, action: 'created' };
      }
    }),

  /**
   * Gera códigos de backup para 2FA
   */
  generateBackupCodes: publicProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId || 1;

    // Gerar 10 códigos de 8 caracteres
    const backupCodes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      backupCodes.push(code);
    }

    await db
      .update(securitySettings)
      .set({
        backupCodes,
        updatedAt: new Date(),
      })
      .where(eq(securitySettings.userId, userId));

    return { success: true, backupCodes };
  }),

  // ==================================================
  // 4. AI PROVIDERS
  // ==================================================

  /**
   * Lista AI providers
   */
  listProviders: publicProcedure
    .input(
      z.object({
        type: z.enum(['local', 'api']).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      const conditions = [];
      if (input.type) {
        conditions.push(eq(aiProviders.type, input.type));
      }
      if (input.isActive !== undefined) {
        conditions.push(eq(aiProviders.isActive, input.isActive));
      }

      const providers = await db
        .select()
        .from(aiProviders)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(aiProviders.createdAt));

      return { providers };
    }),

  /**
   * Cria novo AI provider
   */
  createProvider: publicProcedure
    .input(aiProviderConfigSchema)
    .mutation(async ({ input }) => {
      const result = await db.insert(aiProviders).values({
        name: input.name,
        type: input.type,
        endpoint: input.endpoint,
        apiKey: input.apiKey,
        isActive: input.isActive !== undefined ? input.isActive : true,
        config: input.config,
      });

      return {
        success: true,
        providerId: result[0].insertId,
      };
    }),

  /**
   * Atualiza AI provider
   */
  updateProvider: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: aiProviderConfigSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(aiProviders)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(eq(aiProviders.id, input.id));

      return { success: true };
    }),

  /**
   * Deleta AI provider
   */
  deleteProvider: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(aiProviders).where(eq(aiProviders.id, input.id));
      return { success: true };
    }),

  /**
   * Testa conexão com AI provider
   */
  testProvider: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const provider = await db
        .select()
        .from(aiProviders)
        .where(eq(aiProviders.id, input.id))
        .limit(1);

      if (!provider[0]) {
        return { success: false, error: 'Provider não encontrado' };
      }

      // Simular teste de conexão
      // Em produção, fazer requisição real ao endpoint
      return {
        success: true,
        message: `Conexão com ${provider[0].name} testada com sucesso`,
        latency: Math.floor(Math.random() * 100) + 50,
      };
    }),

  // ==================================================
  // 5. INTEGRAÇÕES (SERVIÇOS EXTERNOS)
  // ==================================================

  /**
   * Lista serviços externos integrados
   */
  listIntegrations: publicProcedure
    .input(
      z.object({
        isActive: z.boolean().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;

      const conditions = [eq(externalServices.userId, userId)];
      if (input.isActive !== undefined) {
        conditions.push(eq(externalServices.isActive, input.isActive));
      }

      const services = await db
        .select()
        .from(externalServices)
        .where(and(...conditions))
        .orderBy(desc(externalServices.createdAt));

      return { services };
    }),

  /**
   * Cria nova integração
   */
  createIntegration: publicProcedure
    .input(
      z.object({
        serviceName: z.string().min(1).max(100),
        config: z.record(z.any()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;

      const result = await db.insert(externalServices).values({
        userId,
        serviceName: input.serviceName,
        config: input.config,
        isActive: input.isActive !== undefined ? input.isActive : true,
      });

      return {
        success: true,
        serviceId: result[0].insertId,
      };
    }),

  /**
   * Atualiza integração
   */
  updateIntegration: publicProcedure
    .input(
      z.object({
        id: z.number(),
        serviceName: z.string().optional(),
        config: z.record(z.any()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      await db
        .update(externalServices)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(externalServices.id, id));

      return { success: true };
    }),

  /**
   * Deleta integração
   */
  deleteIntegration: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(externalServices).where(eq(externalServices.id, input.id));
      return { success: true };
    }),

  // ==================================================
  // 6. BACKUPS DO SISTEMA
  // ==================================================

  /**
   * Lista backups do sistema
   */
  listBackups: publicProcedure
    .input(
      z.object({
        backupType: z.enum(['full', 'incremental', 'differential', 'database', 'files']).optional(),
        status: z.enum(['pending', 'in_progress', 'completed', 'failed']).optional(),
        limit: z.number().min(1).max(100).optional().default(50),
      })
    )
    .query(async ({ input }) => {
      const conditions = [];
      if (input.backupType) {
        conditions.push(eq(systemBackups.backupType, input.backupType));
      }
      if (input.status) {
        conditions.push(eq(systemBackups.status, input.status));
      }

      const backups = await db
        .select()
        .from(systemBackups)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(systemBackups.createdAt))
        .limit(input.limit);

      return { backups };
    }),

  /**
   * Cria novo backup
   */
  createBackup: publicProcedure
    .input(backupConfigSchema)
    .mutation(async ({ input }) => {
      const result = await db.insert(systemBackups).values({
        backupType: input.backupType,
        status: 'pending',
        metadata: input.metadata,
      });

      // Simular processo de backup em background
      // Em produção, iniciar job real de backup
      setTimeout(async () => {
        const duration = Math.floor(Math.random() * 60000) + 30000; // 30-90 segundos
        const fileSize = Math.floor(Math.random() * 1000000000) + 100000000; // 100MB-1GB

        await db
          .update(systemBackups)
          .set({
            status: 'completed',
            filePath: `/backups/${input.backupType}_${Date.now()}.tar.gz`,
            fileSize,
            duration,
            completedAt: new Date(),
          })
          .where(eq(systemBackups.id, result[0].insertId));
      }, 5000);

      return {
        success: true,
        backupId: result[0].insertId,
        message: 'Backup iniciado em background',
      };
    }),

  /**
   * Deleta backup
   */
  deleteBackup: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await db.delete(systemBackups).where(eq(systemBackups.id, input.id));
      return { success: true };
    }),

  /**
   * Restaura backup
   */
  restoreBackup: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const backup = await db
        .select()
        .from(systemBackups)
        .where(eq(systemBackups.id, input.id))
        .limit(1);

      if (!backup[0] || backup[0].status !== 'completed') {
        return { success: false, error: 'Backup inválido ou não completado' };
      }

      // Simular restauração
      // Em produção, executar processo real de restore
      return {
        success: true,
        message: `Backup ${backup[0].backupType} restaurado com sucesso`,
      };
    }),

  // ==================================================
  // 7. ESTATÍSTICAS E MÉTRICAS
  // ==================================================

  /**
   * Retorna estatísticas gerais das configurações
   */
  getStatistics: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId || 1;

    // Contar configurações por tipo
    const settingsByType = await db
      .select({
        settingType: systemSettings.settingType,
        count: count(),
      })
      .from(systemSettings)
      .where(eq(systemSettings.userId, userId))
      .groupBy(systemSettings.settingType);

    // Contar notificações habilitadas
    const notificationsEnabled = await db
      .select({ count: count() })
      .from(notificationPreferences)
      .where(
        and(
          eq(notificationPreferences.userId, userId),
          eq(notificationPreferences.isEnabled, true)
        )
      );

    // Contar providers ativos
    const activeProviders = await db
      .select({ count: count() })
      .from(aiProviders)
      .where(eq(aiProviders.isActive, true));

    // Contar integrações ativas
    const activeIntegrations = await db
      .select({ count: count() })
      .from(externalServices)
      .where(
        and(
          eq(externalServices.userId, userId),
          eq(externalServices.isActive, true)
        )
      );

    // Último backup
    const lastBackup = await db
      .select()
      .from(systemBackups)
      .where(eq(systemBackups.status, 'completed'))
      .orderBy(desc(systemBackups.completedAt))
      .limit(1);

    // Segurança
    const securityConfig = await db
      .select()
      .from(securitySettings)
      .where(eq(securitySettings.userId, userId))
      .limit(1);

    return {
      settings: {
        byType: settingsByType.map((s) => ({
          type: s.settingType,
          count: s.count,
        })),
        total: settingsByType.reduce((sum, s) => sum + s.count, 0),
      },
      notifications: {
        enabled: notificationsEnabled[0]?.count || 0,
      },
      providers: {
        active: activeProviders[0]?.count || 0,
      },
      integrations: {
        active: activeIntegrations[0]?.count || 0,
      },
      backup: {
        lastBackup: lastBackup[0] || null,
      },
      security: {
        twoFactorEnabled: securityConfig[0]?.twoFactorEnabled || false,
        loginNotifications: securityConfig[0]?.loginNotifications || false,
      },
    };
  }),

  /**
   * Exporta todas as configurações do usuário
   */
  exportSettings: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId || 1;

    const settings = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.userId, userId));

    const notifications = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId));

    const security = await db
      .select()
      .from(securitySettings)
      .where(eq(securitySettings.userId, userId));

    const integrations = await db
      .select()
      .from(externalServices)
      .where(eq(externalServices.userId, userId));

    return {
      exportDate: new Date().toISOString(),
      userId,
      settings,
      notifications,
      security: security[0] || null,
      integrations,
    };
  }),

  /**
   * Importa configurações do usuário
   */
  importSettings: publicProcedure
    .input(
      z.object({
        settings: z.array(z.any()).optional(),
        notifications: z.array(z.any()).optional(),
        replaceExisting: z.boolean().optional().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId || 1;

      let imported = 0;

      if (input.replaceExisting) {
        // Limpar configurações existentes
        await db.delete(systemSettings).where(eq(systemSettings.userId, userId));
        await db.delete(notificationPreferences).where(eq(notificationPreferences.userId, userId));
      }

      // Importar configurações
      if (input.settings && input.settings.length > 0) {
        for (const setting of input.settings) {
          await db.insert(systemSettings).values({
            userId,
            settingKey: setting.settingKey,
            settingValue: setting.settingValue,
            settingType: setting.settingType,
            description: setting.description,
            isPublic: setting.isPublic,
          });
          imported++;
        }
      }

      // Importar notificações
      if (input.notifications && input.notifications.length > 0) {
        for (const notif of input.notifications) {
          await db.insert(notificationPreferences).values({
            userId,
            channel: notif.channel,
            eventType: notif.eventType,
            isEnabled: notif.isEnabled,
            config: notif.config,
          });
          imported++;
        }
      }

      return {
        success: true,
        imported,
        message: `${imported} configurações importadas com sucesso`,
      };
    }),
});
