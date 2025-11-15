/**
 * Tasks tRPC Router
 * SPRINT 7 - Task Management
 * 15+ endpoints para gerenciamento completo de tarefas e subtarefas
 */
import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { db } from '../../db/index.js';
import { tasks, subtasks, taskDependencies } from '../../db/schema.js';
import { eq, and, desc, asc, or, like } from 'drizzle-orm';
import { orchestratorService } from '../../services/orchestratorService.js';
export const tasksRouter = router({
    /**
     * 1. Listar todas as tarefas
     */
    list: publicProcedure
        .input(z.object({
        projectId: z.number().optional(),
        status: z.enum(['pending', 'planning', 'in_progress', 'completed', 'blocked', 'cancelled']).optional(),
        limit: z.number().min(1).max(100).optional().default(50),
        offset: z.number().min(0).optional().default(0),
    }))
        .query(async ({ input }) => {
        const conditions = [];
        if (input.projectId) {
            conditions.push(eq(tasks.projectId, input.projectId));
        }
        if (input.status) {
            conditions.push(eq(tasks.status, input.status));
        }
        const query = conditions.length > 0
            ? db.select().from(tasks).where(and(...conditions))
            : db.select().from(tasks);
        const allTasks = await query
            .orderBy(desc(tasks.createdAt))
            .limit(input.limit)
            .offset(input.offset);
        return { success: true, tasks: allTasks };
    }),
    /**
     * 2. Obter detalhes de tarefa específica
     */
    getById: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .query(async ({ input }) => {
        const [task] = await db.select()
            .from(tasks)
            .where(eq(tasks.id, input.id))
            .limit(1);
        if (!task) {
            throw new Error('Tarefa não encontrada');
        }
        // Buscar subtarefas
        const taskSubtasks = await db.select()
            .from(subtasks)
            .where(eq(subtasks.taskId, input.id))
            .orderBy(asc(subtasks.orderIndex));
        // Buscar dependências
        const dependencies = await db.select()
            .from(taskDependencies)
            .where(or(eq(taskDependencies.taskId, input.id), eq(taskDependencies.dependsOnTaskId, input.id)));
        return {
            success: true,
            task,
            subtasks: taskSubtasks,
            dependencies,
        };
    }),
    /**
     * 3. Criar nova tarefa
     */
    create: publicProcedure
        .input(z.object({
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        projectId: z.number(),
        assignedUserId: z.number().optional(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional().default('medium'),
        estimatedHours: z.number().optional(),
        dueDate: z.string().optional(),
    }))
        .mutation(async ({ input }) => {
        const result = await db.insert(tasks).values({
            userId: 1, // TODO: Get from context
            title: input.title,
            description: input.description,
            projectId: input.projectId,
            assignedUserId: input.assignedUserId,
            priority: input.priority,
            status: 'pending',
            estimatedHours: input.estimatedHours,
            dueDate: input.dueDate ? new Date(input.dueDate) : null,
        });
        const taskId = result[0]?.insertId || result.insertId;
        const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
        return { success: true, task };
    }),
    /**
     * 4. Atualizar tarefa
     */
    update: publicProcedure
        .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        status: z.enum(['pending', 'planning', 'in_progress', 'completed', 'blocked', 'cancelled']).optional(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
        assignedUserId: z.number().optional(),
        estimatedHours: z.number().optional(),
        actualHours: z.number().optional(),
        dueDate: z.string().optional(),
    }))
        .mutation(async ({ input }) => {
        const { id, dueDate, ...updates } = input;
        await db.update(tasks)
            .set({
            ...updates,
            dueDate: dueDate ? new Date(dueDate) : null,
            updatedAt: new Date(),
        })
            .where(eq(tasks.id, id));
        const [updated] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
        return { success: true, task: updated };
    }),
    /**
     * 5. Deletar tarefa
     */
    delete: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .mutation(async ({ input }) => {
        await db.delete(tasks).where(eq(tasks.id, input.id));
        return { success: true, message: 'Tarefa deletada' };
    }),
    /**
     * 6. Planejar tarefa (gerar subtarefas com IA)
     */
    plan: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .mutation(async ({ input }) => {
        const breakdown = await orchestratorService.planTask(input.id);
        // Criar subtarefas no banco
        const createdSubtasks = [];
        for (let i = 0; i < breakdown.length; i++) {
            const result = await db.insert(subtasks).values({
                taskId: input.id,
                title: breakdown[i].title,
                description: breakdown[i].description,
                prompt: breakdown[i].description || breakdown[i].title,
                status: 'pending',
                orderIndex: i,
                estimatedDifficulty: breakdown[i].estimatedDifficulty,
            });
            const subId = result[0]?.insertId || result.insertId;
            const [subtask] = await db.select().from(subtasks).where(eq(subtasks.id, subId)).limit(1);
            createdSubtasks.push(subtask);
        }
        // Atualizar status da tarefa
        await db.update(tasks)
            .set({ status: 'in_progress' })
            .where(eq(tasks.id, input.id));
        return { success: true, subtasks: createdSubtasks };
    }),
    /**
     * 7. Listar subtarefas de uma tarefa
     */
    listSubtasks: publicProcedure
        .input(z.object({
        taskId: z.number(),
    }))
        .query(async ({ input }) => {
        const taskSubtasks = await db.select()
            .from(subtasks)
            .where(eq(subtasks.taskId, input.taskId))
            .orderBy(asc(subtasks.orderIndex));
        return { success: true, subtasks: taskSubtasks };
    }),
    /**
     * 8. Criar subtarefa manualmente
     */
    createSubtask: publicProcedure
        .input(z.object({
        taskId: z.number(),
        title: z.string().min(1).max(255),
        description: z.string().optional(),
        assignedModelId: z.number().optional(),
        orderIndex: z.number().optional(),
    }))
        .mutation(async ({ input }) => {
        const result = await db.insert(subtasks).values({
            taskId: input.taskId,
            title: input.title,
            description: input.description,
            prompt: input.description || input.title,
            assignedModelId: input.assignedModelId,
            status: 'pending',
            orderIndex: input.orderIndex || 0,
        });
        const subId = result[0]?.insertId || result.insertId;
        const [subtask] = await db.select().from(subtasks).where(eq(subtasks.id, subId)).limit(1);
        return { success: true, subtask };
    }),
    /**
     * 9. Atualizar subtarefa
     */
    updateSubtask: publicProcedure
        .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(['pending', 'executing', 'validating', 'completed', 'failed', 'rejected']).optional(),
        result: z.string().optional(),
        reviewNotes: z.string().optional(),
    }))
        .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.update(subtasks)
            .set(updates)
            .where(eq(subtasks.id, id));
        const [updated] = await db.select().from(subtasks).where(eq(subtasks.id, id)).limit(1);
        return { success: true, subtask: updated };
    }),
    /**
     * 10. Executar subtarefa com orquestração
     */
    executeSubtask: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .mutation(async ({ input }) => {
        const approved = await orchestratorService.executeSubtask(input.id);
        return {
            success: true,
            approved,
            message: approved ? 'Subtarefa aprovada' : 'Subtarefa rejeitada'
        };
    }),
    /**
     * 11. Deletar subtarefa
     */
    deleteSubtask: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .mutation(async ({ input }) => {
        await db.delete(subtasks).where(eq(subtasks.id, input.id));
        return { success: true, message: 'Subtarefa deletada' };
    }),
    /**
     * 12. Adicionar dependência entre tarefas
     */
    addDependency: publicProcedure
        .input(z.object({
        taskId: z.number(),
        dependsOnTaskId: z.number(),
        dependencyType: z.enum(['finish_to_start', 'start_to_start', 'finish_to_finish', 'start_to_finish']).optional().default('finish_to_start'),
    }))
        .mutation(async ({ input }) => {
        const result = await db.insert(taskDependencies).values({
            taskId: input.taskId,
            dependsOnTaskId: input.dependsOnTaskId,
            dependencyType: input.dependencyType,
        });
        const depId = result[0]?.insertId || result.insertId;
        const [dependency] = await db.select().from(taskDependencies).where(eq(taskDependencies.id, depId)).limit(1);
        return { success: true, dependency };
    }),
    /**
     * 13. Remover dependência
     */
    removeDependency: publicProcedure
        .input(z.object({
        id: z.number(),
    }))
        .mutation(async ({ input }) => {
        await db.delete(taskDependencies).where(eq(taskDependencies.id, input.id));
        return { success: true, message: 'Dependência removida' };
    }),
    /**
     * 14. Buscar tarefas
     */
    search: publicProcedure
        .input(z.object({
        query: z.string().min(1),
        projectId: z.number().optional(),
    }))
        .query(async ({ input }) => {
        const conditions = [
            or(like(tasks.title, `%${input.query}%`), like(tasks.description, `%${input.query}%`))
        ];
        if (input.projectId) {
            conditions.push(eq(tasks.projectId, input.projectId));
        }
        const results = await db.select().from(tasks)
            .where(and(...conditions))
            .limit(20);
        return { success: true, tasks: results };
    }),
    /**
     * 15. Estatísticas de tarefas
     */
    getStats: publicProcedure
        .input(z.object({
        projectId: z.number().optional(),
    }))
        .query(async ({ input }) => {
        const query = input.projectId
            ? db.select().from(tasks).where(eq(tasks.projectId, input.projectId))
            : db.select().from(tasks);
        const allTasks = await query;
        const stats = {
            total: allTasks.length,
            pending: allTasks.filter(t => t.status === 'pending').length,
            planning: allTasks.filter(t => t.status === 'planning').length,
            inProgress: allTasks.filter(t => t.status === 'in_progress').length,
            completed: allTasks.filter(t => t.status === 'completed').length,
            blocked: allTasks.filter(t => t.status === 'blocked').length,
            cancelled: allTasks.filter(t => t.status === 'cancelled').length,
            completionRate: allTasks.length > 0
                ? (allTasks.filter(t => t.status === 'completed').length / allTasks.length) * 100
                : 0,
        };
        return { success: true, stats };
    }),
    /**
     * 16. Reordenar subtarefas
     */
    reorderSubtasks: publicProcedure
        .input(z.object({
        taskId: z.number(),
        subtaskIds: z.array(z.number()),
    }))
        .mutation(async ({ input }) => {
        // Atualizar orderIndex de cada subtarefa
        for (let i = 0; i < input.subtaskIds.length; i++) {
            await db.update(subtasks)
                .set({ orderIndex: i })
                .where(and(eq(subtasks.id, input.subtaskIds[i]), eq(subtasks.taskId, input.taskId)));
        }
        return { success: true, message: 'Subtarefas reordenadas' };
    }),
});
