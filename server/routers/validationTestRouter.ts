import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { tasks, subtasks, aiModels, specializedAIs, executionLogs } from '../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';
import { orchestratorService } from '../services/orchestratorService.js';

/**
 * Validation Test Router
 * Endpoints para testar e diagnosticar o sistema de validação cruzada
 */
export const validationTestRouter = router({
  /**
   * Criar tarefa de teste para validação cruzada
   */
  createTestTask: publicProcedure
    .input(z.object({
      complexity: z.enum(['simple', 'medium', 'complex']).default('simple'),
    }))
    .mutation(async ({ input }) => {
      const testTasks = {
        simple: {
          title: 'Teste Validação: Soma Simples',
          description: 'Escreva uma função Python que soma dois números e retorna o resultado',
        },
        medium: {
          title: 'Teste Validação: Fibonacci',
          description: 'Escreva uma função Python que calcula o n-ésimo número de Fibonacci',
        },
        complex: {
          title: 'Teste Validação: API REST',
          description: 'Crie uma API REST básica com FastAPI que tenha endpoints GET e POST para gerenciar usuários',
        },
      };

      const taskData = testTasks[input.complexity];

      // Criar tarefa
      const result: any = await db.insert(tasks).values({
        ...taskData,
        userId: 1,
        status: 'pending',
        priority: 'medium',
      });

      const taskId = result[0]?.insertId || result.insertId;

      // Decompor automaticamente
      try {
        await orchestratorService.decomposeTask(taskId);
      } catch (error) {
        console.error('Erro ao decompor:', error);
      }

      return {
        taskId,
        success: true,
        message: `Tarefa de teste criada (${input.complexity}). Decomposição iniciada.`,
      };
    }),

  /**
   * Obter detalhes de validação de uma subtask
   */
  getValidationDetails: publicProcedure
    .input(z.object({
      subtaskId: z.number(),
    }))
    .query(async ({ input }) => {
      const [subtask] = await db.select()
        .from(subtasks)
        .where(eq(subtasks.id, input.subtaskId))
        .limit(1);

      if (!subtask) {
        throw new Error('Subtask não encontrada');
      }

      // Buscar logs de validação
      const logs = await db.select()
        .from(executionLogs)
        .where(and(
          eq(executionLogs.subtaskId, input.subtaskId),
          eq(executionLogs.level, 'info')
        ))
        .orderBy(desc(executionLogs.createdAt));

      // Buscar modelo executor
      const [executorModel] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.id, subtask.assignedModelId))
        .limit(1);

      // Buscar modelo reviewer (se houver)
      let reviewerModel = null;
      if (subtask.reviewedBy) {
        [reviewerModel] = await db.select()
          .from(aiModels)
          .where(eq(aiModels.id, subtask.reviewedBy))
          .limit(1);
      }

      return {
        subtask,
        executorModel: executorModel || null,
        reviewerModel,
        logs,
        validation: {
          wasValidated: !!subtask.reviewedBy,
          approved: subtask.status === 'completed',
          rejected: subtask.status === 'rejected',
          notes: subtask.reviewNotes,
        },
      };
    }),

  /**
   * Verificar configuração das IAs de validação
   */
  checkValidationConfig: publicProcedure
    .query(async () => {
      // Buscar IAs de cada categoria
      const executorAI = await db.select()
        .from(specializedAIs)
        .where(and(
          eq(specializedAIs.category, 'coding'),
          eq(specializedAIs.isActive, true)
        ))
        .limit(1);

      const validatorAI = await db.select()
        .from(specializedAIs)
        .where(and(
          eq(specializedAIs.category, 'validation'),
          eq(specializedAIs.isActive, true)
        ))
        .limit(1);

      const tiebreakerAI = await db.select()
        .from(specializedAIs)
        .where(and(
          eq(specializedAIs.category, 'analysis'),
          eq(specializedAIs.isActive, true)
        ))
        .limit(1);

      // Buscar modelos associados
      const getModelDetails = async (aiRecord: any) => {
        if (!aiRecord || !aiRecord.defaultModelId) return null;

        const [model] = await db.select()
          .from(aiModels)
          .where(eq(aiModels.id, aiRecord.defaultModelId))
          .limit(1);

        return {
          ai: aiRecord,
          model: model || null,
        };
      };

      const executor = await getModelDetails(executorAI[0] || null);
      const validator = await getModelDetails(validatorAI[0] || null);
      const tiebreaker = await getModelDetails(tiebreakerAI[0] || null);

      return {
        configured: !!(executor && validator && tiebreaker),
        executor,
        validator,
        tiebreaker,
        warnings: [
          !executor ? 'IA de execução (coding) não configurada' : null,
          !validator ? 'IA de validação não configurada' : null,
          !tiebreaker ? 'IA de desempate (analysis) não configurada' : null,
        ].filter(Boolean),
      };
    }),

  /**
   * Listar tarefas de teste recentes
   */
  listTestTasks: publicProcedure
    .query(async () => {
      const testTasks = await db.select()
        .from(tasks)
        .where(eq(tasks.userId, 1))
        .orderBy(desc(tasks.createdAt))
        .limit(10);

      const tasksWithStats = await Promise.all(
        testTasks.map(async (task) => {
          const taskSubtasks = await db.select()
            .from(subtasks)
            .where(eq(subtasks.taskId, task.id));

          const stats = {
            total: taskSubtasks.length,
            pending: taskSubtasks.filter(s => s.status === 'pending').length,
            executing: taskSubtasks.filter(s => s.status === 'executing').length,
            validating: taskSubtasks.filter(s => s.status === 'validating').length,
            completed: taskSubtasks.filter(s => s.status === 'completed').length,
            rejected: taskSubtasks.filter(s => s.status === 'rejected').length,
            failed: taskSubtasks.filter(s => s.status === 'failed').length,
          };

          return {
            ...task,
            stats,
          };
        })
      );

      return {
        tasks: tasksWithStats,
        total: tasksWithStats.length,
      };
    }),

  /**
   * Forçar execução de teste de validação
   * (cria subtask simples e executa diretamente para teste)
   */
  runQuickValidationTest: publicProcedure
    .mutation(async () => {
      // 1. Criar tarefa de teste
      const result: any = await db.insert(tasks).values({
        title: 'Teste Rápido de Validação',
        description: 'Teste automático do sistema de validação cruzada',
        userId: 1,
        status: 'executing',
        priority: 'high',
      });

      const taskId = result[0]?.insertId || result.insertId;

      // 2. Criar subtask simples
      const subtaskResult: any = await db.insert(subtasks).values({
        taskId,
        title: 'Função soma de dois números',
        description: 'Implementar função que soma dois números',
        prompt: 'Crie uma função Python chamada soma(a, b) que retorna a + b',
        assignedModelId: 1, // Modelo padrão
        status: 'pending',
      });

      const subtaskId = subtaskResult[0]?.insertId || subtaskResult.insertId;

      // 3. Executar com validação
      try {
        const success = await orchestratorService.executeSubtask(subtaskId);

        return {
          success,
          taskId,
          subtaskId,
          message: success 
            ? 'Teste executado e validado com sucesso!' 
            : 'Teste executado mas rejeitado na validação',
        };
      } catch (error: any) {
        return {
          success: false,
          taskId,
          subtaskId,
          error: error.message,
          message: 'Erro durante teste de validação',
        };
      }
    }),
});
