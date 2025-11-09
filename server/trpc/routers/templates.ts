/**
 * Templates tRPC Router
 * SPRINT 14 - Template Management & Usage
 * 14 endpoints para gerenciamento completo de templates de IA
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { aiTemplates } from '../../db/schema.js';
import { eq, and, desc, like, or } from 'drizzle-orm';

// Validação de template data
const templateDataSchema = z.object({
  systemPrompt: z.string().optional(),
  userPromptTemplate: z.string().optional(),
  variables: z.array(z.object({
    name: z.string(),
    type: z.enum(['text', 'number', 'boolean', 'select']),
    label: z.string(),
    description: z.string().optional(),
    defaultValue: z.any().optional(),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(), // Para type='select'
  })).optional(),
  examples: z.array(z.object({
    input: z.record(z.any()),
    output: z.string(),
  })).optional(),
  tags: z.array(z.string()).optional(),
  modelConfig: z.object({
    temperature: z.number().optional(),
    maxTokens: z.number().optional(),
    topP: z.number().optional(),
    frequencyPenalty: z.number().optional(),
    presencePenalty: z.number().optional(),
  }).optional(),
});

export const templatesRouter = router({
  /**
   * 1. Listar todos os templates
   */
  list: publicProcedure
    .input(z.object({
      query: z.string().optional(),
      category: z.string().optional(),
      isPublic: z.boolean().optional(),
      limit: z.number().min(1).max(100).optional().default(50),
      offset: z.number().min(0).optional().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const conditions = [];

      // Filtrar por userId ou templates públicos
      if (input.isPublic) {
        conditions.push(eq(aiTemplates.isPublic, true));
      } else {
        conditions.push(eq(aiTemplates.userId, ctx.userId || 1));
      }

      if (input.query) {
        conditions.push(
          or(
            like(aiTemplates.name, `%${input.query}%`),
            like(aiTemplates.description, `%${input.query}%`)
          )!
        );
      }

      if (input.category) {
        conditions.push(eq(aiTemplates.category, input.category));
      }

      const query = conditions.length > 0
        ? db.select().from(aiTemplates).where(and(...conditions))
        : db.select().from(aiTemplates);

      const items = await query
        .orderBy(desc(aiTemplates.usageCount), desc(aiTemplates.createdAt))
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
   * 2. Obter template por ID
   */
  getById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const [template] = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.id, input.id))
        .limit(1);

      if (!template) {
        throw new Error('Template não encontrado');
      }

      return {
        success: true,
        template,
      };
    }),

  /**
   * 3. Criar novo template
   */
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      category: z.string().optional(),
      templateData: templateDataSchema,
      isPublic: z.boolean().optional().default(false),
    }))
    .mutation(async ({ input, ctx }) => {
      const result: any = await db.insert(aiTemplates).values({
        userId: ctx.userId || 1,
        name: input.name,
        description: input.description || '',
        category: input.category || 'general',
        templateData: input.templateData,
        isPublic: input.isPublic,
        usageCount: 0,
      } as any);

      const templateId = result[0]?.insertId || result.insertId;
      const [template] = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.id, templateId))
        .limit(1);

      return {
        success: true,
        template,
        message: 'Template criado com sucesso',
      };
    }),

  /**
   * 4. Atualizar template
   */
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      templateData: templateDataSchema.optional(),
      isPublic: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      await db.update(aiTemplates)
        .set({
          ...updates,
          updatedAt: new Date(),
        } as any)
        .where(eq(aiTemplates.id, id));

      const [updated] = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.id, id))
        .limit(1);

      return {
        success: true,
        template: updated,
        message: 'Template atualizado com sucesso',
      };
    }),

  /**
   * 5. Deletar template
   */
  delete: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.delete(aiTemplates).where(eq(aiTemplates.id, input.id));

      return {
        success: true,
        message: 'Template deletado com sucesso',
      };
    }),

  /**
   * 6. Duplicar template
   */
  duplicate: publicProcedure
    .input(z.object({
      id: z.number(),
      newName: z.string().min(1).max(255).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const [original] = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.id, input.id))
        .limit(1);

      if (!original) {
        throw new Error('Template não encontrado');
      }

      const result: any = await db.insert(aiTemplates).values({
        userId: ctx.userId || 1,
        name: input.newName || `${original.name} (Cópia)`,
        description: original.description,
        category: original.category,
        templateData: original.templateData,
        isPublic: false, // Duplicatas começam privadas
        usageCount: 0,
      } as any);

      const templateId = result[0]?.insertId || result.insertId;
      const [template] = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.id, templateId))
        .limit(1);

      return {
        success: true,
        template,
        message: 'Template duplicado com sucesso',
      };
    }),

  /**
   * 7. Usar template (incrementar contador de uso)
   */
  use: publicProcedure
    .input(z.object({
      id: z.number(),
      variables: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const [template] = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.id, input.id))
        .limit(1);

      if (!template) {
        throw new Error('Template não encontrado');
      }

      // Incrementar contador de uso
      await db.update(aiTemplates)
        .set({
          usageCount: (template.usageCount || 0) + 1,
        } as any)
        .where(eq(aiTemplates.id, input.id));

      // Processar template com variáveis
      const templateData = template.templateData as any;
      let processedPrompt = templateData.userPromptTemplate || '';

      if (input.variables) {
        Object.entries(input.variables).forEach(([key, value]) => {
          processedPrompt = processedPrompt.replace(
            new RegExp(`{{${key}}}`, 'g'),
            String(value)
          );
        });
      }

      return {
        success: true,
        processedPrompt,
        systemPrompt: templateData.systemPrompt,
        modelConfig: templateData.modelConfig,
        message: 'Template processado com sucesso',
      };
    }),

  /**
   * 8. Buscar templates
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      category: z.string().optional(),
      isPublic: z.boolean().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const conditions = [
        or(
          like(aiTemplates.name, `%${input.query}%`),
          like(aiTemplates.description, `%${input.query}%`)
        )!,
      ];

      if (input.isPublic) {
        conditions.push(eq(aiTemplates.isPublic, true));
      } else {
        conditions.push(eq(aiTemplates.userId, ctx.userId || 1));
      }

      if (input.category) {
        conditions.push(eq(aiTemplates.category, input.category));
      }

      const results = await db.select()
        .from(aiTemplates)
        .where(and(...conditions))
        .orderBy(desc(aiTemplates.usageCount))
        .limit(20);

      return {
        success: true,
        templates: results,
      };
    }),

  /**
   * 9. Estatísticas de templates
   */
  getStats: publicProcedure
    .query(async ({ ctx }) => {
      const allTemplates = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.userId, ctx.userId || 1));

      // Agrupar por categoria
      const categoryCounts: Record<string, number> = {};
      allTemplates.forEach((template) => {
        const cat = template.category || 'general';
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });

      const stats = {
        total: allTemplates.length,
        public: allTemplates.filter((t) => t.isPublic).length,
        private: allTemplates.filter((t) => !t.isPublic).length,
        totalUsage: allTemplates.reduce((sum, t) => sum + (t.usageCount || 0), 0),
        categories: categoryCounts,
        mostUsed: allTemplates
          .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
          .slice(0, 5)
          .map((t) => ({ id: t.id, name: t.name, usageCount: t.usageCount })),
      };

      return {
        success: true,
        stats,
      };
    }),

  /**
   * 10. Listar categorias
   */
  getCategories: publicProcedure
    .query(async ({ ctx }) => {
      const templates = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.userId, ctx.userId || 1));

      const categories = Array.from(
        new Set(templates.map((t) => t.category).filter(Boolean))
      );

      return {
        success: true,
        categories: categories.sort(),
      };
    }),

  /**
   * 11. Exportar template (JSON)
   */
  export: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const [template] = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.id, input.id))
        .limit(1);

      if (!template) {
        throw new Error('Template não encontrado');
      }

      const exportData = {
        name: template.name,
        description: template.description,
        category: template.category,
        templateData: template.templateData,
        version: '1.0',
        exportedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: exportData,
      };
    }),

  /**
   * 12. Importar template (JSON)
   */
  import: publicProcedure
    .input(z.object({
      data: z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        category: z.string().optional(),
        templateData: templateDataSchema,
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      const result: any = await db.insert(aiTemplates).values({
        userId: ctx.userId || 1,
        name: input.data.name,
        description: input.data.description || '',
        category: input.data.category || 'general',
        templateData: input.data.templateData,
        isPublic: false,
        usageCount: 0,
      } as any);

      const templateId = result[0]?.insertId || result.insertId;
      const [template] = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.id, templateId))
        .limit(1);

      return {
        success: true,
        template,
        message: 'Template importado com sucesso',
      };
    }),

  /**
   * 13. Validar variáveis do template
   */
  validateVariables: publicProcedure
    .input(z.object({
      id: z.number(),
      variables: z.record(z.any()),
    }))
    .query(async ({ input }) => {
      const [template] = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.id, input.id))
        .limit(1);

      if (!template) {
        throw new Error('Template não encontrado');
      }

      const templateData = template.templateData as any;
      const requiredVariables = templateData.variables?.filter((v: any) => v.required) || [];
      const errors: string[] = [];

      // Verificar variáveis obrigatórias
      requiredVariables.forEach((varDef: any) => {
        if (!(varDef.name in input.variables)) {
          errors.push(`Variável obrigatória ausente: ${varDef.name}`);
        }
      });

      // Validar tipos
      templateData.variables?.forEach((varDef: any) => {
        if (varDef.name in input.variables) {
          const value = input.variables[varDef.name];
          const actualType = typeof value;

          if (varDef.type === 'number' && actualType !== 'number') {
            errors.push(`Variável ${varDef.name} deve ser número`);
          }
          if (varDef.type === 'boolean' && actualType !== 'boolean') {
            errors.push(`Variável ${varDef.name} deve ser booleano`);
          }
          if (varDef.type === 'select' && varDef.options && !varDef.options.includes(value)) {
            errors.push(`Valor inválido para ${varDef.name}. Opções: ${varDef.options.join(', ')}`);
          }
        }
      });

      return {
        success: errors.length === 0,
        valid: errors.length === 0,
        errors,
      };
    }),

  /**
   * 14. Obter templates públicos populares
   */
  getPopular: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).optional().default(10),
    }))
    .query(async ({ input }) => {
      const templates = await db.select()
        .from(aiTemplates)
        .where(eq(aiTemplates.isPublic, true))
        .orderBy(desc(aiTemplates.usageCount))
        .limit(input.limit);

      return {
        success: true,
        templates,
      };
    }),
});
