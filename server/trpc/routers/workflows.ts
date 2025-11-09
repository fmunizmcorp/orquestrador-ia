/**
 * Workflows tRPC Router
 * SPRINT 12 - Workflow Management & Execution
 * 18 endpoints para gerenciamento completo de workflows e execuções
 */

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { aiWorkflows } from '../../db/schema.js';
import { eq, and, desc, like, or } from 'drizzle-orm';

// Validação de steps de workflow
const workflowStepSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255),
  type: z.enum(['task', 'condition', 'loop', 'parallel', 'ai_generation', 'api_call', 'notification']),
  description: z.string().optional(),
  config: z.record(z.any()).optional(),
  nextStepId: z.string().optional().nullable(),
  conditionalSteps: z.array(z.object({
    condition: z.string(),
    nextStepId: z.string(),
  })).optional(),
});

const workflowExecutionStepSchema = z.object({
  stepId: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'failed', 'skipped']),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  result: z.any().optional(),
  error: z.string().optional(),
});

export const workflowsRouter = router({
  /**
   * 1. Listar todos os workflows
   */
  list: publicProcedure
    .input(z.object({
      query: z.string().optional(),
      isActive: z.boolean().optional(),
      limit: z.number().min(1).max(100).optional().default(50),
      offset: z.number().min(0).optional().default(0),
    }))
    .query(async ({ input, ctx }) => {
      const conditions = [];
      
      // Single-user mode: filtrar por userId 1
      conditions.push(eq(aiWorkflows.userId, ctx.userId || 1));

      if (input.query) {
        conditions.push(
          or(
            like(aiWorkflows.name, `%${input.query}%`),
            like(aiWorkflows.description, `%${input.query}%`)
          )!
        );
      }

      if (input.isActive !== undefined) {
        conditions.push(eq(aiWorkflows.isActive, input.isActive));
      }

      const query = conditions.length > 0
        ? db.select().from(aiWorkflows).where(and(...conditions))
        : db.select().from(aiWorkflows);

      const items = await query
        .orderBy(desc(aiWorkflows.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const total = items.length; // Simplified count

      return {
        success: true,
        items,
        total,
        limit: input.limit,
        offset: input.offset,
      };
    }),

  /**
   * 2. Obter workflow por ID
   */
  getById: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, input.id))
        .limit(1);

      if (!workflow) {
        throw new Error('Workflow não encontrado');
      }

      return {
        success: true,
        workflow,
      };
    }),

  /**
   * 3. Criar novo workflow
   */
  create: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      steps: z.array(workflowStepSchema),
      isActive: z.boolean().optional().default(true),
    }))
    .mutation(async ({ input, ctx }) => {
      const result: any = await db.insert(aiWorkflows).values({
        userId: ctx.userId || 1,
        name: input.name,
        description: input.description || '',
        steps: input.steps,
        isActive: input.isActive,
      } as any);

      const workflowId = result[0]?.insertId || result.insertId;
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, workflowId))
        .limit(1);

      return {
        success: true,
        workflow,
        message: 'Workflow criado com sucesso',
      };
    }),

  /**
   * 4. Atualizar workflow
   */
  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      steps: z.array(workflowStepSchema).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;

      await db.update(aiWorkflows)
        .set({
          ...updates,
          updatedAt: new Date(),
        } as any)
        .where(eq(aiWorkflows.id, id));

      const [updated] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, id))
        .limit(1);

      return {
        success: true,
        workflow: updated,
        message: 'Workflow atualizado com sucesso',
      };
    }),

  /**
   * 5. Deletar workflow
   */
  delete: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      await db.delete(aiWorkflows).where(eq(aiWorkflows.id, input.id));

      return {
        success: true,
        message: 'Workflow deletado com sucesso',
      };
    }),

  /**
   * 6. Duplicar workflow
   */
  duplicate: publicProcedure
    .input(z.object({
      id: z.number(),
      newName: z.string().min(1).max(255).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const [original] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, input.id))
        .limit(1);

      if (!original) {
        throw new Error('Workflow não encontrado');
      }

      const result: any = await db.insert(aiWorkflows).values({
        userId: ctx.userId || 1,
        name: input.newName || `${original.name} (Cópia)`,
        description: original.description,
        steps: original.steps,
        isActive: false, // Duplicatas começam inativas
      } as any);

      const workflowId = result[0]?.insertId || result.insertId;
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, workflowId))
        .limit(1);

      return {
        success: true,
        workflow,
        message: 'Workflow duplicado com sucesso',
      };
    }),

  /**
   * 7. Ativar/Desativar workflow
   */
  toggleActive: publicProcedure
    .input(z.object({
      id: z.number(),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      await db.update(aiWorkflows)
        .set({
          isActive: input.isActive,
          updatedAt: new Date(),
        } as any)
        .where(eq(aiWorkflows.id, input.id));

      const [updated] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, input.id))
        .limit(1);

      return {
        success: true,
        workflow: updated,
        message: input.isActive ? 'Workflow ativado' : 'Workflow desativado',
      };
    }),

  /**
   * 8. Validar workflow (verificar se steps são válidos)
   */
  validate: publicProcedure
    .input(z.object({
      steps: z.array(workflowStepSchema),
    }))
    .query(async ({ input }) => {
      const errors: string[] = [];
      const stepIds = new Set<string>();

      // Verificar IDs únicos
      input.steps.forEach((step) => {
        if (stepIds.has(step.id)) {
          errors.push(`Step ID duplicado: ${step.id}`);
        }
        stepIds.add(step.id);
      });

      // Verificar referências válidas
      input.steps.forEach((step) => {
        if (step.nextStepId && !stepIds.has(step.nextStepId)) {
          errors.push(`Step ${step.id} referencia nextStepId inválido: ${step.nextStepId}`);
        }
        if (step.conditionalSteps) {
          step.conditionalSteps.forEach((cond) => {
            if (!stepIds.has(cond.nextStepId)) {
              errors.push(`Step ${step.id} referencia conditionalStep inválido: ${cond.nextStepId}`);
            }
          });
        }
      });

      // Verificar que existe pelo menos um step inicial (sem predecessores)
      const referencedIds = new Set<string>();
      input.steps.forEach((step) => {
        if (step.nextStepId) referencedIds.add(step.nextStepId);
        if (step.conditionalSteps) {
          step.conditionalSteps.forEach((cond) => referencedIds.add(cond.nextStepId));
        }
      });

      const initialSteps = input.steps.filter((step) => !referencedIds.has(step.id));
      if (initialSteps.length === 0) {
        errors.push('Workflow deve ter pelo menos um step inicial');
      }

      return {
        success: errors.length === 0,
        valid: errors.length === 0,
        errors,
        initialSteps: initialSteps.map((s) => s.id),
      };
    }),

  /**
   * 9. Executar workflow (simulação básica)
   */
  execute: publicProcedure
    .input(z.object({
      id: z.number(),
      context: z.record(z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, input.id))
        .limit(1);

      if (!workflow) {
        throw new Error('Workflow não encontrado');
      }

      if (!workflow.isActive) {
        throw new Error('Workflow está inativo');
      }

      const steps = workflow.steps as any[];
      const executionSteps: any[] = [];
      const startTime = new Date().toISOString();

      // Simular execução sequencial dos steps
      for (const step of steps) {
        const execStep = {
          stepId: step.id,
          status: 'completed' as const,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          result: {
            message: `Step ${step.name} executado com sucesso`,
            type: step.type,
          },
        };
        executionSteps.push(execStep);
      }

      const endTime = new Date().toISOString();

      return {
        success: true,
        execution: {
          workflowId: workflow.id,
          workflowName: workflow.name,
          status: 'completed',
          startedAt: startTime,
          completedAt: endTime,
          steps: executionSteps,
          context: input.context || {},
        },
        message: 'Workflow executado com sucesso',
      };
    }),

  /**
   * 10. Obter histórico de execuções (simulado via logs)
   */
  getExecutionHistory: publicProcedure
    .input(z.object({
      id: z.number(),
      limit: z.number().min(1).max(50).optional().default(10),
    }))
    .query(async ({ input }) => {
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, input.id))
        .limit(1);

      if (!workflow) {
        throw new Error('Workflow não encontrado');
      }

      // Simulação: retornar histórico vazio por enquanto
      // TODO: Implementar tabela de executions no schema
      const executions: any[] = [];

      return {
        success: true,
        executions,
        total: 0,
      };
    }),

  /**
   * 11. Buscar workflows
   */
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1),
      isActive: z.boolean().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const conditions = [
        eq(aiWorkflows.userId, ctx.userId || 1),
        or(
          like(aiWorkflows.name, `%${input.query}%`),
          like(aiWorkflows.description, `%${input.query}%`)
        )!,
      ];

      if (input.isActive !== undefined) {
        conditions.push(eq(aiWorkflows.isActive, input.isActive));
      }

      const results = await db.select()
        .from(aiWorkflows)
        .where(and(...conditions))
        .orderBy(desc(aiWorkflows.createdAt))
        .limit(20);

      return {
        success: true,
        workflows: results,
      };
    }),

  /**
   * 12. Estatísticas de workflows
   */
  getStats: publicProcedure
    .query(async ({ ctx }) => {
      const allWorkflows = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.userId, ctx.userId || 1));

      const stats = {
        total: allWorkflows.length,
        active: allWorkflows.filter((w) => w.isActive).length,
        inactive: allWorkflows.filter((w) => !w.isActive).length,
        averageSteps: allWorkflows.length > 0
          ? allWorkflows.reduce((sum, w) => sum + ((w.steps as any[])?.length || 0), 0) / allWorkflows.length
          : 0,
      };

      return {
        success: true,
        stats,
      };
    }),

  /**
   * 13. Exportar workflow (JSON)
   */
  export: publicProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, input.id))
        .limit(1);

      if (!workflow) {
        throw new Error('Workflow não encontrado');
      }

      const exportData = {
        name: workflow.name,
        description: workflow.description,
        steps: workflow.steps,
        version: '1.0',
        exportedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: exportData,
      };
    }),

  /**
   * 14. Importar workflow (JSON)
   */
  import: publicProcedure
    .input(z.object({
      data: z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        steps: z.array(workflowStepSchema),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      const result: any = await db.insert(aiWorkflows).values({
        userId: ctx.userId || 1,
        name: input.data.name,
        description: input.data.description || '',
        steps: input.data.steps,
        isActive: false, // Importações começam inativas
      } as any);

      const workflowId = result[0]?.insertId || result.insertId;
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, workflowId))
        .limit(1);

      return {
        success: true,
        workflow,
        message: 'Workflow importado com sucesso',
      };
    }),

  /**
   * 15. Obter templates de workflow predefinidos
   */
  getTemplates: publicProcedure
    .query(async () => {
      const templates = [
        {
          id: 'simple-task',
          name: 'Tarefa Simples',
          description: 'Workflow básico com uma sequência linear de steps',
          steps: [
            {
              id: 'step1',
              name: 'Iniciar',
              type: 'task' as const,
              description: 'Step inicial',
              nextStepId: 'step2',
            },
            {
              id: 'step2',
              name: 'Processar',
              type: 'task' as const,
              description: 'Processamento principal',
              nextStepId: 'step3',
            },
            {
              id: 'step3',
              name: 'Finalizar',
              type: 'task' as const,
              description: 'Step final',
              nextStepId: null,
            },
          ],
        },
        {
          id: 'conditional',
          name: 'Workflow Condicional',
          description: 'Workflow com branches condicionais',
          steps: [
            {
              id: 'step1',
              name: 'Verificar Condição',
              type: 'condition' as const,
              description: 'Avaliar condição',
              conditionalSteps: [
                { condition: 'success', nextStepId: 'step2' },
                { condition: 'failure', nextStepId: 'step3' },
              ],
            },
            {
              id: 'step2',
              name: 'Caminho Sucesso',
              type: 'task' as const,
              description: 'Executar em caso de sucesso',
              nextStepId: null,
            },
            {
              id: 'step3',
              name: 'Caminho Falha',
              type: 'task' as const,
              description: 'Executar em caso de falha',
              nextStepId: null,
            },
          ],
        },
        {
          id: 'ai-processing',
          name: 'Processamento com IA',
          description: 'Workflow com geração de conteúdo por IA',
          steps: [
            {
              id: 'step1',
              name: 'Preparar Input',
              type: 'task' as const,
              description: 'Preparar dados para IA',
              nextStepId: 'step2',
            },
            {
              id: 'step2',
              name: 'Gerar com IA',
              type: 'ai_generation' as const,
              description: 'Processar com modelo de IA',
              nextStepId: 'step3',
            },
            {
              id: 'step3',
              name: 'Validar Resultado',
              type: 'task' as const,
              description: 'Validar output da IA',
              nextStepId: null,
            },
          ],
        },
        {
          id: 'parallel-processing',
          name: 'Processamento Paralelo',
          description: 'Workflow com steps executados em paralelo',
          steps: [
            {
              id: 'step1',
              name: 'Iniciar',
              type: 'task' as const,
              description: 'Step inicial',
              nextStepId: 'parallel1',
            },
            {
              id: 'parallel1',
              name: 'Processos Paralelos',
              type: 'parallel' as const,
              description: 'Executar múltiplos processos simultaneamente',
              config: {
                parallelSteps: ['task1', 'task2', 'task3'],
              },
              nextStepId: 'step2',
            },
            {
              id: 'step2',
              name: 'Consolidar',
              type: 'task' as const,
              description: 'Consolidar resultados',
              nextStepId: null,
            },
          ],
        },
      ];

      return {
        success: true,
        templates,
      };
    }),

  /**
   * 16. Criar workflow a partir de template
   */
  createFromTemplate: publicProcedure
    .input(z.object({
      templateId: z.string(),
      name: z.string().min(1).max(255),
      description: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Buscar template (simulado)
      const templates: Record<string, any> = {
        'simple-task': [
          { id: 'step1', name: 'Iniciar', type: 'task', nextStepId: 'step2' },
          { id: 'step2', name: 'Processar', type: 'task', nextStepId: 'step3' },
          { id: 'step3', name: 'Finalizar', type: 'task', nextStepId: null },
        ],
        'conditional': [
          { id: 'step1', name: 'Verificar Condição', type: 'condition', conditionalSteps: [
            { condition: 'success', nextStepId: 'step2' },
            { condition: 'failure', nextStepId: 'step3' },
          ]},
          { id: 'step2', name: 'Caminho Sucesso', type: 'task', nextStepId: null },
          { id: 'step3', name: 'Caminho Falha', type: 'task', nextStepId: null },
        ],
      };

      const templateSteps = templates[input.templateId];
      if (!templateSteps) {
        throw new Error('Template não encontrado');
      }

      const result: any = await db.insert(aiWorkflows).values({
        userId: ctx.userId || 1,
        name: input.name,
        description: input.description || '',
        steps: templateSteps,
        isActive: false,
      } as any);

      const workflowId = result[0]?.insertId || result.insertId;
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, workflowId))
        .limit(1);

      return {
        success: true,
        workflow,
        message: 'Workflow criado a partir do template',
      };
    }),

  /**
   * 17. Clonar step de workflow
   */
  cloneStep: publicProcedure
    .input(z.object({
      workflowId: z.number(),
      stepId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, input.workflowId))
        .limit(1);

      if (!workflow) {
        throw new Error('Workflow não encontrado');
      }

      const steps = workflow.steps as any[];
      const stepToClone = steps.find((s) => s.id === input.stepId);

      if (!stepToClone) {
        throw new Error('Step não encontrado');
      }

      // Criar novo ID único
      const newId = `${stepToClone.id}_clone_${Date.now()}`;
      const clonedStep = {
        ...stepToClone,
        id: newId,
        name: `${stepToClone.name} (Cópia)`,
      };

      // Adicionar step clonado
      const updatedSteps = [...steps, clonedStep];

      await db.update(aiWorkflows)
        .set({
          steps: updatedSteps,
          updatedAt: new Date(),
        } as any)
        .where(eq(aiWorkflows.id, input.workflowId));

      return {
        success: true,
        step: clonedStep,
        message: 'Step clonado com sucesso',
      };
    }),

  /**
   * 18. Reordenar steps de workflow
   */
  reorderSteps: publicProcedure
    .input(z.object({
      workflowId: z.number(),
      stepIds: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      const [workflow] = await db.select()
        .from(aiWorkflows)
        .where(eq(aiWorkflows.id, input.workflowId))
        .limit(1);

      if (!workflow) {
        throw new Error('Workflow não encontrado');
      }

      const steps = workflow.steps as any[];
      const reorderedSteps = input.stepIds
        .map((id) => steps.find((s) => s.id === id))
        .filter((s) => s !== undefined);

      await db.update(aiWorkflows)
        .set({
          steps: reorderedSteps,
          updatedAt: new Date(),
        } as any)
        .where(eq(aiWorkflows.id, input.workflowId));

      return {
        success: true,
        message: 'Steps reordenados com sucesso',
      };
    }),
});
