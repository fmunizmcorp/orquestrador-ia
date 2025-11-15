/**
 * Prompts tRPC Router
 * SPRINT 9 - Prompt Management
 * 9+ endpoints para gerenciamento de templates de prompts
 */
import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { prompts, promptVersions } from '../../db/schema.js';
import { eq, desc, and, like, or, sql } from 'drizzle-orm';
import pino from 'pino';
import { env, isDevelopment } from '../../config/env.js';
import { handleDatabaseError, } from '../../utils/errors.js';
import { paginationInputSchema, createPaginatedResponse, applyPagination, } from '../../utils/pagination.js';
const logger = pino({ level: env.LOG_LEVEL, transport: isDevelopment ? { target: 'pino-pretty' } : undefined });
export const promptsRouter = router({
    /**
     * 1. Listar todos os prompts
     */
    list: publicProcedure
        .input(z.object({
        userId: z.number().optional(),
        category: z.string().optional(),
        isPublic: z.boolean().optional(),
    }).merge(paginationInputSchema).optional().default({ limit: 50, offset: 0 }))
        .query(async ({ input }) => {
        try {
            const conditions = [];
            if (input.userId) {
                conditions.push(eq(prompts.userId, input.userId));
            }
            if (input.category) {
                conditions.push(eq(prompts.category, input.category));
            }
            if (input.isPublic !== undefined) {
                conditions.push(eq(prompts.isPublic, input.isPublic));
            }
            // Count total
            const [{ count: total }] = await db
                .select({ count: sql `count(*)` })
                .from(prompts)
                .where(conditions.length > 0 ? and(...conditions) : undefined);
            // Get paginated results
            const { limit, offset } = applyPagination(input);
            const query = conditions.length > 0
                ? db.select().from(prompts).where(and(...conditions))
                : db.select().from(prompts);
            const allPrompts = await query
                .orderBy(desc(prompts.createdAt))
                .limit(limit)
                .offset(offset);
            return createPaginatedResponse(allPrompts, total || 0, input);
        }
        catch (error) {
            logger.error({ error }, 'Error listing prompts');
            if (error && typeof error === 'object' && 'code' in error) {
                throw error;
            }
            throw handleDatabaseError(error, {
                resourceType: 'Prompt',
                suggestion: 'Tente novamente ou contate o suporte',
            });
        }
    }),
    /**
     * 2. Obter prompt específico
     */
    getById: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .query(async ({ input }) => {
        const [prompt] = await db.select()
            .from(prompts)
            .where(eq(prompts.id, input.id))
            .limit(1);
        if (!prompt) {
            throw new Error('Prompt não encontrado');
        }
        // Buscar versões
        const versions = await db.select()
            .from(promptVersions)
            .where(eq(promptVersions.promptId, input.id))
            .orderBy(desc(promptVersions.version));
        return { success: true, prompt, versions };
    }),
    /**
     * 3. Criar novo prompt
     */
    create: publicProcedure
        .input(z.object({
        userId: z.number(),
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        content: z.string().min(1),
        category: z.string().optional(),
        tags: z.union([z.string(), z.array(z.string())]).optional(),
        variables: z.array(z.string()).optional(),
        isPublic: z.boolean().optional().default(false),
    }))
        .mutation(async ({ input }) => {
        // Normalizar tags: sempre converter para array
        const tagsArray = typeof input.tags === 'string'
            ? input.tags.split(',').map(t => t.trim()).filter(Boolean)
            : input.tags || [];
        const result = await db.insert(prompts).values({
            userId: input.userId,
            title: input.title,
            description: input.description,
            content: input.content,
            category: input.category,
            tags: tagsArray,
            variables: input.variables,
            isPublic: input.isPublic,
            currentVersion: 1,
        });
        const promptId = result[0]?.insertId || result.insertId;
        const [prompt] = await db.select().from(prompts).where(eq(prompts.id, promptId)).limit(1);
        // Criar primeira versão
        await db.insert(promptVersions).values({
            promptId: prompt.id,
            version: 1,
            content: input.content,
            changelog: 'Versão inicial',
            createdByUserId: input.userId,
        });
        return { success: true, prompt };
    }),
    /**
     * 4. Atualizar prompt
     */
    update: publicProcedure
        .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        tags: z.union([z.string(), z.array(z.string())]).optional(),
        variables: z.array(z.string()).optional(),
        isPublic: z.boolean().optional(),
        changelog: z.string().optional(),
        userId: z.number(), // Para criar versão
    }))
        .mutation(async ({ input }) => {
        const { id, userId, changelog, ...updates } = input;
        // Se content mudou, criar nova versão
        if (input.content) {
            const [current] = await db.select()
                .from(prompts)
                .where(eq(prompts.id, id))
                .limit(1);
            if (current && current.content !== input.content) {
                const newVersion = (current.currentVersion || 1) + 1;
                await db.insert(promptVersions).values({
                    promptId: id,
                    version: newVersion,
                    content: input.content,
                    changelog: changelog || 'Atualização',
                    createdByUserId: userId,
                });
                // currentVersion is managed automatically
            }
        }
        // Normalizar tags: sempre converter para array
        const updateData = { ...updates, updatedAt: new Date() };
        if (input.tags) {
            updateData.tags = typeof input.tags === 'string'
                ? input.tags.split(',').map(t => t.trim()).filter(Boolean)
                : input.tags;
        }
        if (input.variables) {
            updateData.variables = input.variables;
        }
        await db.update(prompts)
            .set(updateData)
            .where(eq(prompts.id, id));
        const [updated] = await db.select().from(prompts).where(eq(prompts.id, id)).limit(1);
        return { success: true, prompt: updated };
    }),
    /**
     * 5. Deletar prompt
     */
    delete: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .mutation(async ({ input }) => {
        await db.delete(prompts).where(eq(prompts.id, input.id));
        return { success: true, message: 'Prompt deletado' };
    }),
    /**
     * 6. Buscar prompts
     */
    search: publicProcedure
        .input(z.object({
        query: z.string().min(1),
        userId: z.number().optional(),
        limit: z.number().min(1).max(50).optional().default(20),
    }))
        .query(async ({ input }) => {
        const conditions = [
            or(like(prompts.title, `%${input.query}%`), like(prompts.description, `%${input.query}%`), like(prompts.content, `%${input.query}%`))
        ];
        if (input.userId) {
            conditions.push(eq(prompts.userId, input.userId));
        }
        const results = await db.select().from(prompts)
            .where(and(...conditions))
            .limit(input.limit);
        return { success: true, prompts: results };
    }),
    /**
     * 7. Listar versões de um prompt
     */
    listVersions: publicProcedure
        .input(z.object({
        promptId: z.number(),
    }))
        .query(async ({ input }) => {
        const versions = await db.select()
            .from(promptVersions)
            .where(eq(promptVersions.promptId, input.promptId))
            .orderBy(desc(promptVersions.version));
        return { success: true, versions };
    }),
    /**
     * 8. Obter versão específica
     */
    getVersion: publicProcedure
        .input(z.object({
        promptId: z.number(),
        version: z.number(),
    }))
        .query(async ({ input }) => {
        const [version] = await db.select()
            .from(promptVersions)
            .where(and(eq(promptVersions.promptId, input.promptId), eq(promptVersions.version, input.version)))
            .limit(1);
        if (!version) {
            throw new Error('Versão não encontrada');
        }
        return { success: true, version };
    }),
    /**
     * 9. Reverter para versão anterior
     */
    revertToVersion: publicProcedure
        .input(z.object({
        promptId: z.number(),
        version: z.number(),
        userId: z.number(),
    }))
        .mutation(async ({ input }) => {
        // Buscar versão antiga
        const [oldVersion] = await db.select()
            .from(promptVersions)
            .where(and(eq(promptVersions.promptId, input.promptId), eq(promptVersions.version, input.version)))
            .limit(1);
        if (!oldVersion) {
            throw new Error('Versão não encontrada');
        }
        // Buscar prompt atual
        const [current] = await db.select()
            .from(prompts)
            .where(eq(prompts.id, input.promptId))
            .limit(1);
        if (!current) {
            throw new Error('Prompt não encontrado');
        }
        const newVersion = (current.currentVersion || 1) + 1;
        // Criar nova versão com conteúdo antigo
        await db.insert(promptVersions).values({
            promptId: input.promptId,
            version: newVersion,
            content: oldVersion.content || '',
            changelog: `Revertido para versão ${input.version}`,
            createdByUserId: input.userId,
        });
        // Atualizar prompt
        await db.update(prompts)
            .set({
            content: oldVersion.content,
            currentVersion: newVersion,
            updatedAt: new Date(),
        })
            .where(eq(prompts.id, input.promptId));
        const [updated] = await db.select().from(prompts).where(eq(prompts.id, input.promptId)).limit(1);
        return { success: true, prompt: updated };
    }),
    /**
     * 10. Duplicar prompt
     */
    duplicate: publicProcedure
        .input(z.object({
        promptId: z.number(),
        userId: z.number(),
        newTitle: z.string().optional(),
    }))
        .mutation(async ({ input }) => {
        const [original] = await db.select()
            .from(prompts)
            .where(eq(prompts.id, input.promptId))
            .limit(1);
        if (!original) {
            throw new Error('Prompt original não encontrado');
        }
        const result = await db.insert(prompts).values({
            userId: input.userId,
            title: input.newTitle || `${original.title} (cópia)`,
            description: original.description,
            content: original.content,
            category: original.category,
            tags: original.tags,
            variables: original.variables,
            isPublic: false,
            currentVersion: 1,
        });
        const dupId = result[0]?.insertId || result.insertId;
        const [duplicate] = await db.select().from(prompts).where(eq(prompts.id, dupId)).limit(1);
        // Criar primeira versão do duplicado
        await db.insert(promptVersions).values({
            promptId: duplicate.id,
            version: 1,
            content: original.content || '',
            changelog: `Duplicado de "${original.title}"`,
            createdByUserId: input.userId,
        });
        return { success: true, prompt: duplicate };
    }),
    /**
     * 11. Listar categorias únicas
     */
    listCategories: publicProcedure
        .query(async () => {
        const allPrompts = await db.select().from(prompts);
        const categories = [...new Set(allPrompts.map(p => p.category).filter(Boolean))];
        return { success: true, categories };
    }),
    /**
     * 12. Estatísticas de uso
     */
    getStats: publicProcedure
        .input(z.object({
        promptId: z.number(),
    }))
        .query(async ({ input }) => {
        const [prompt] = await db.select()
            .from(prompts)
            .where(eq(prompts.id, input.promptId))
            .limit(1);
        if (!prompt) {
            throw new Error('Prompt não encontrado');
        }
        const versions = await db.select()
            .from(promptVersions)
            .where(eq(promptVersions.promptId, input.promptId));
        return {
            success: true,
            stats: {
                totalVersions: versions.length,
                currentVersion: prompt.currentVersion,
                useCount: prompt.useCount || 0,
                isPublic: prompt.isPublic,
                createdAt: prompt.createdAt,
                updatedAt: prompt.updatedAt,
            },
        };
    }),
});
