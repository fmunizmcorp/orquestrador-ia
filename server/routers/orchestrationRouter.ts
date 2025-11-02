import { router, publicProcedure } from '../trpc.js';
import { db } from '../db/index.js';
import { tasks, subtasks, executionLogs } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { idSchema } from '../utils/validation.js';
import { z } from 'zod';

// Import orchestrator service
import { orchestratorService } from '../services/orchestratorService.js';

/**
 * Orchestration Router
 * Endpoints para orquestração de tarefas com validação cruzada
 */
export const orchestrationRouter = router({
  /**
   * Criar tarefa E iniciar decomposição automática
   */
  createTask: publicProcedure
    .input(z.object({
      title: z.string().min(1).max(200),
      description: z.string().min(1),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
      projectId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      // 1. Criar tarefa
      const result: any = await db.insert(tasks).values({
        ...input,
        userId: 1, // Usuário padrão
        status: 'pending',
      });

      const taskId = result[0]?.insertId || result.insertId;

      // 2. Log de criação
      await db.insert(executionLogs).values({
        taskId,
        level: 'info',
        message: `Tarefa criada: ${input.title}`,
      });

      // 3. Iniciar decomposição automática em background
      // (não aguarda para retornar rápido ao usuário)
      orchestratorService.decomposeTask(taskId).catch(error => {
        console.error(`Erro ao decompor tarefa ${taskId}:`, error);
      });

      return { 
        id: taskId, 
        success: true,
        message: 'Tarefa criada. Decomposição iniciada em background.'
      };
    }),

  /**
   * Decompor tarefa manualmente (força nova decomposição)
   */
  decomposeTask: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: taskId }) => {
      try {
        const breakdown = await orchestratorService.decomposeTask(taskId);
        
        return {
          success: true,
          subtasksCount: breakdown.length,
          message: `Tarefa decomposta em ${breakdown.length} subtarefas`,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  /**
   * Executar subtarefa com validação cruzada
   */
  executeSubtask: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: subtaskId }) => {
      try {
        const success = await orchestratorService.executeSubtask(subtaskId);
        
        return {
          success,
          message: success 
            ? 'Subtarefa executada e validada com sucesso' 
            : 'Subtarefa rejeitada na validação',
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  /**
   * Executar TODAS as subtasks pendentes de uma tarefa
   */
  executeAllSubtasks: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: taskId }) => {
      // Buscar subtasks pendentes
      const pendingSubtasks = await db.select()
        .from(subtasks)
        .where(eq(subtasks.taskId, taskId));

      const results = [];
      
      for (const subtask of pendingSubtasks) {
        if (subtask.status === 'pending' || subtask.status === 'failed') {
          try {
            const success = await orchestratorService.executeSubtask(subtask.id);
            results.push({
              subtaskId: subtask.id,
              success,
              title: subtask.title,
            });
          } catch (error: any) {
            results.push({
              subtaskId: subtask.id,
              success: false,
              error: error.message,
              title: subtask.title,
            });
          }
        }
      }

      return {
        success: true,
        totalSubtasks: results.length,
        completed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results,
      };
    }),

  /**
   * Obter status detalhado da tarefa
   */
  getTaskStatus: publicProcedure
    .input(idSchema)
    .query(async ({ input: taskId }) => {
      const [task] = await db.select()
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .limit(1);

      if (!task) {
        throw new Error('Tarefa não encontrada');
      }

      // Buscar subtasks
      const taskSubtasks = await db.select()
        .from(subtasks)
        .where(eq(subtasks.taskId, taskId))
        .orderBy(subtasks.createdAt);

      // Buscar logs
      const logs = await db.select()
        .from(executionLogs)
        .where(eq(executionLogs.taskId, taskId))
        .orderBy(executionLogs.createdAt)
        .limit(50);

      // Calcular estatísticas
      const stats = {
        total: taskSubtasks.length,
        pending: taskSubtasks.filter(s => s.status === 'pending').length,
        executing: taskSubtasks.filter(s => s.status === 'executing').length,
        validating: taskSubtasks.filter(s => s.status === 'validating').length,
        completed: taskSubtasks.filter(s => s.status === 'completed').length,
        rejected: taskSubtasks.filter(s => s.status === 'rejected').length,
        failed: taskSubtasks.filter(s => s.status === 'failed').length,
      };

      const progress = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100) 
        : 0;

      return {
        task,
        subtasks: taskSubtasks,
        logs,
        stats,
        progress,
      };
    }),

  /**
   * Obter resultado de uma subtarefa
   */
  getSubtaskResult: publicProcedure
    .input(idSchema)
    .query(async ({ input: subtaskId }) => {
      const [subtask] = await db.select()
        .from(subtasks)
        .where(eq(subtasks.id, subtaskId))
        .limit(1);

      if (!subtask) {
        throw new Error('Subtarefa não encontrada');
      }

      // Buscar logs específicos da subtask
      const logs = await db.select()
        .from(executionLogs)
        .where(eq(executionLogs.subtaskId, subtaskId))
        .orderBy(executionLogs.createdAt);

      return {
        subtask,
        logs,
      };
    }),

  /**
   * Reexecutar subtarefa rejeitada ou falha
   */
  retrySubtask: publicProcedure
    .input(idSchema)
    .mutation(async ({ input: subtaskId }) => {
      // Reset status
      await db.update(subtasks)
        .set({ 
          status: 'pending',
          result: null,
          reviewedBy: null,
          reviewNotes: null,
        })
        .where(eq(subtasks.id, subtaskId));

      // Executar novamente
      try {
        const success = await orchestratorService.executeSubtask(subtaskId);
        
        return {
          success,
          message: success 
            ? 'Subtarefa reexecutada e validada com sucesso' 
            : 'Subtarefa rejeitada novamente',
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),
});
