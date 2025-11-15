/**
 * Knowledge Base tRPC Router
 * SPRINT 15 - Knowledge Management System
 * 16 endpoints para gerenciamento completo de base de conhecimento
 */
import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { knowledgeBase, knowledgeSources } from '../../db/schema.js';
import { eq, and, desc, like, or } from 'drizzle-orm';
export const knowledgebaseRouter = router({
    /**
     * 1. Listar todos os itens da base de conhecimento
     */
    list: publicProcedure
        .input(z.object({
        query: z.string().optional(),
        category: z.string().optional(),
        isActive: z.boolean().optional(),
        limit: z.number().min(1).max(100).optional().default(50),
        offset: z.number().min(0).optional().default(0),
    }))
        .query(async ({ input, ctx }) => {
        const conditions = [
            eq(knowledgeBase.userId, ctx.userId || 1),
        ];
        if (input.query) {
            conditions.push(or(like(knowledgeBase.title, `%${input.query}%`), like(knowledgeBase.content, `%${input.query}%`)));
        }
        if (input.category) {
            conditions.push(eq(knowledgeBase.category, input.category));
        }
        if (input.isActive !== undefined) {
            conditions.push(eq(knowledgeBase.isActive, input.isActive));
        }
        const query = conditions.length > 0
            ? db.select().from(knowledgeBase).where(and(...conditions))
            : db.select().from(knowledgeBase);
        const items = await query
            .orderBy(desc(knowledgeBase.createdAt))
            .limit(input.limit)
            .offset(input.offset);
        const total = items.length;
        return {
            success: true,
            items,
            total,
            limit: input.limit,
            offset: input.offset,
        };
    }),
    /**
     * 2. Obter item por ID
     */
    getById: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .query(async ({ input }) => {
        const [item] = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.id, input.id))
            .limit(1);
        if (!item) {
            throw new Error('Item não encontrado');
        }
        // Buscar sources associadas
        const sources = await db.select()
            .from(knowledgeSources)
            .where(eq(knowledgeSources.knowledgeBaseId, input.id));
        return {
            success: true,
            item,
            sources,
        };
    }),
    /**
     * 3. Criar novo item
     */
    create: publicProcedure
        .input(z.object({
        title: z.string().min(1).max(500),
        content: z.string().min(1),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        isActive: z.boolean().optional().default(true),
    }))
        .mutation(async ({ input, ctx }) => {
        const result = await db.insert(knowledgeBase).values({
            userId: ctx.userId || 1,
            title: input.title,
            content: input.content,
            category: input.category || 'general',
            tags: input.tags || [],
            isActive: input.isActive,
        });
        const itemId = result[0]?.insertId || result.insertId;
        const [item] = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.id, itemId))
            .limit(1);
        return {
            success: true,
            item,
            message: 'Item criado com sucesso',
        };
    }),
    /**
     * 4. Atualizar item
     */
    update: publicProcedure
        .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(500).optional(),
        content: z.string().min(1).optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
    }))
        .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.update(knowledgeBase)
            .set({
            ...updates,
            updatedAt: new Date(),
        })
            .where(eq(knowledgeBase.id, id));
        const [updated] = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.id, id))
            .limit(1);
        return {
            success: true,
            item: updated,
            message: 'Item atualizado com sucesso',
        };
    }),
    /**
     * 5. Deletar item
     */
    delete: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .mutation(async ({ input }) => {
        await db.delete(knowledgeBase).where(eq(knowledgeBase.id, input.id));
        return {
            success: true,
            message: 'Item deletado com sucesso',
        };
    }),
    /**
     * 6. Buscar na base de conhecimento
     */
    search: publicProcedure
        .input(z.object({
        query: z.string().min(1),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
    }))
        .query(async ({ input, ctx }) => {
        const conditions = [
            eq(knowledgeBase.userId, ctx.userId || 1),
            or(like(knowledgeBase.title, `%${input.query}%`), like(knowledgeBase.content, `%${input.query}%`)),
        ];
        if (input.category) {
            conditions.push(eq(knowledgeBase.category, input.category));
        }
        const results = await db.select()
            .from(knowledgeBase)
            .where(and(...conditions))
            .orderBy(desc(knowledgeBase.createdAt))
            .limit(20);
        return {
            success: true,
            results,
        };
    }),
    /**
     * 7. Obter estatísticas
     */
    getStats: publicProcedure
        .query(async ({ ctx }) => {
        const allItems = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.userId, ctx.userId || 1));
        // Agrupar por categoria
        const categoryCounts = {};
        allItems.forEach((item) => {
            const cat = item.category || 'general';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
        // Contar tags
        const tagCounts = {};
        allItems.forEach((item) => {
            const itemTags = item.tags;
            if (itemTags && Array.isArray(itemTags)) {
                itemTags.forEach((tag) => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            }
        });
        const stats = {
            total: allItems.length,
            active: allItems.filter((i) => i.isActive).length,
            inactive: allItems.filter((i) => !i.isActive).length,
            categories: categoryCounts,
            tags: tagCounts,
            totalTags: Object.keys(tagCounts).length,
            mostUsedTags: Object.entries(tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([tag, count]) => ({ tag, count })),
        };
        return {
            success: true,
            stats,
        };
    }),
    /**
     * 8. Listar categorias
     */
    getCategories: publicProcedure
        .query(async ({ ctx }) => {
        const items = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.userId, ctx.userId || 1));
        const categories = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
        return {
            success: true,
            categories: categories.sort(),
        };
    }),
    /**
     * 9. Listar tags
     */
    getTags: publicProcedure
        .query(async ({ ctx }) => {
        const items = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.userId, ctx.userId || 1));
        const tagsSet = new Set();
        items.forEach((item) => {
            const itemTags = item.tags;
            if (itemTags && Array.isArray(itemTags)) {
                itemTags.forEach((tag) => tagsSet.add(tag));
            }
        });
        return {
            success: true,
            tags: Array.from(tagsSet).sort(),
        };
    }),
    /**
     * 10. Adicionar source a um item
     */
    addSource: publicProcedure
        .input(z.object({
        knowledgeBaseId: z.number(),
        sourceType: z.string().optional(),
        sourceUrl: z.string().optional(),
        sourceData: z.record(z.any()).optional(),
    }))
        .mutation(async ({ input }) => {
        const result = await db.insert(knowledgeSources).values({
            knowledgeBaseId: input.knowledgeBaseId,
            sourceType: input.sourceType,
            sourceUrl: input.sourceUrl,
            sourceData: input.sourceData,
            lastSync: new Date(),
        });
        const sourceId = result[0]?.insertId || result.insertId;
        const [source] = await db.select()
            .from(knowledgeSources)
            .where(eq(knowledgeSources.id, sourceId))
            .limit(1);
        return {
            success: true,
            source,
            message: 'Source adicionada com sucesso',
        };
    }),
    /**
     * 11. Remover source
     */
    removeSource: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .mutation(async ({ input }) => {
        await db.delete(knowledgeSources).where(eq(knowledgeSources.id, input.id));
        return {
            success: true,
            message: 'Source removida com sucesso',
        };
    }),
    /**
     * 12. Listar sources de um item
     */
    getSources: publicProcedure
        .input(z.object({
        knowledgeBaseId: z.number(),
    }))
        .query(async ({ input }) => {
        const sources = await db.select()
            .from(knowledgeSources)
            .where(eq(knowledgeSources.knowledgeBaseId, input.knowledgeBaseId))
            .orderBy(desc(knowledgeSources.createdAt));
        return {
            success: true,
            sources,
        };
    }),
    /**
     * 13. Duplicar item
     */
    duplicate: publicProcedure
        .input(z.object({
        id: z.number(),
        newTitle: z.string().min(1).max(500).optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const [original] = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.id, input.id))
            .limit(1);
        if (!original) {
            throw new Error('Item não encontrado');
        }
        const result = await db.insert(knowledgeBase).values({
            userId: ctx.userId || 1,
            title: input.newTitle || `${original.title} (Cópia)`,
            content: original.content,
            category: original.category,
            tags: original.tags,
            isActive: original.isActive,
        });
        const itemId = result[0]?.insertId || result.insertId;
        const [item] = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.id, itemId))
            .limit(1);
        return {
            success: true,
            item,
            message: 'Item duplicado com sucesso',
        };
    }),
    /**
     * 14. Exportar item
     */
    export: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .query(async ({ input }) => {
        const [item] = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.id, input.id))
            .limit(1);
        if (!item) {
            throw new Error('Item não encontrado');
        }
        const sources = await db.select()
            .from(knowledgeSources)
            .where(eq(knowledgeSources.knowledgeBaseId, input.id));
        const exportData = {
            title: item.title,
            content: item.content,
            category: item.category,
            tags: item.tags,
            sources: sources.map((s) => ({
                sourceType: s.sourceType,
                sourceUrl: s.sourceUrl,
                sourceData: s.sourceData,
            })),
            exportedAt: new Date().toISOString(),
        };
        return {
            success: true,
            data: exportData,
        };
    }),
    /**
     * 15. Importar item
     */
    import: publicProcedure
        .input(z.object({
        data: z.object({
            title: z.string().min(1).max(500),
            content: z.string().min(1),
            category: z.string().optional(),
            tags: z.array(z.string()).optional(),
            sources: z.array(z.object({
                sourceType: z.string().optional(),
                sourceUrl: z.string().optional(),
                sourceData: z.record(z.any()).optional(),
            })).optional(),
        }),
    }))
        .mutation(async ({ input, ctx }) => {
        const result = await db.insert(knowledgeBase).values({
            userId: ctx.userId || 1,
            title: input.data.title,
            content: input.data.content,
            category: input.data.category || 'general',
            tags: input.data.tags || [],
            isActive: true,
        });
        const itemId = result[0]?.insertId || result.insertId;
        // Importar sources se existirem
        if (input.data.sources && input.data.sources.length > 0) {
            for (const source of input.data.sources) {
                await db.insert(knowledgeSources).values({
                    knowledgeBaseId: itemId,
                    sourceType: source.sourceType,
                    sourceUrl: source.sourceUrl,
                    sourceData: source.sourceData,
                    lastSync: new Date(),
                });
            }
        }
        const [item] = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.id, itemId))
            .limit(1);
        return {
            success: true,
            item,
            message: 'Item importado com sucesso',
        };
    }),
    /**
     * 16. Buscar itens similares (por tags)
     */
    findSimilar: publicProcedure
        .input(z.object({
        id: z.number(),
        limit: z.number().min(1).max(10).optional().default(5),
    }))
        .query(async ({ input, ctx }) => {
        const [item] = await db.select()
            .from(knowledgeBase)
            .where(eq(knowledgeBase.id, input.id))
            .limit(1);
        if (!item) {
            throw new Error('Item não encontrado');
        }
        const itemTags = item.tags;
        if (!itemTags || itemTags.length === 0) {
            return {
                success: true,
                similar: [],
            };
        }
        // Buscar itens com tags em comum
        const allItems = await db.select()
            .from(knowledgeBase)
            .where(and(eq(knowledgeBase.userId, ctx.userId || 1), eq(knowledgeBase.isActive, true)));
        // Calcular score de similaridade
        const itemsWithScore = allItems
            .filter((i) => i.id !== input.id)
            .map((i) => {
            const iTags = i.tags;
            if (!iTags || iTags.length === 0)
                return { item: i, score: 0 };
            const commonTags = iTags.filter((tag) => itemTags.includes(tag));
            const score = commonTags.length;
            return { item: i, score };
        })
            .filter((i) => i.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, input.limit);
        return {
            success: true,
            similar: itemsWithScore.map((i) => ({
                ...i.item,
                similarityScore: i.score,
            })),
        };
    }),
});
