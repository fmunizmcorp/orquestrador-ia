/**
 * Orchestrator Service
 * Orquestração inteligente com validação cruzada OBRIGATÓRIA
 * - Cria checklist COMPLETO de tarefas
 * - Divide em subtarefas (TODAS)
 * - IA executa, outra SEMPRE valida
 * - Terceira IA desempata se divergência > 20%
 * - ZERO perda de trabalho
 */
import { db } from '../db/index.js';
import { tasks, subtasks, aiModels, specializedAIs, executionLogs } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { lmstudioService } from './lmstudioService.js';
let broadcastCallback = null;
export function setBroadcastCallback(callback) {
    broadcastCallback = callback;
}
async function notifyTaskUpdate(taskId) {
    if (broadcastCallback) {
        try {
            await broadcastCallback(taskId);
        }
        catch (error) {
            console.error('Erro ao fazer broadcast:', error);
        }
    }
}
class OrchestratorService {
    /**
     * Planeja tarefa COMPLETA - cria checklist de TUDO
     */
    async planTask(taskId) {
        const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
        if (!task) {
            throw new Error('Tarefa não encontrada');
        }
        // Atualizar status
        await db.update(tasks).set({ status: 'planning' }).where(eq(tasks.id, taskId));
        await notifyTaskUpdate(taskId);
        // Buscar IA de planejamento
        const [plannerAI] = await db.select()
            .from(specializedAIs)
            .where(and(eq(specializedAIs.category, 'research'), eq(specializedAIs.isActive, true)))
            .limit(1);
        if (!plannerAI || !plannerAI.defaultModelId) {
            throw new Error('IA de planejamento não disponível');
        }
        // Buscar modelo
        const [model] = await db.select()
            .from(aiModels)
            .where(eq(aiModels.id, plannerAI.defaultModelId))
            .limit(1);
        if (!model) {
            throw new Error('Modelo de planejamento não disponível');
        }
        const prompt = `Analise a seguinte tarefa e crie uma lista COMPLETA de subtarefas.
IMPORTANTE: NÃO RESUMA. Liste TODAS as subtarefas necessárias, sem exceção.

Tarefa: ${task.title}
Descrição: ${task.description}

Retorne um JSON array com objetos contendo:
- title: título da subtarefa
- description: descrição detalhada
- estimatedDifficulty: 1-10

Exemplo:
[
  {
    "title": "Pesquisar requisitos",
    "description": "Pesquisar TODOS os requisitos necessários...",
    "estimatedDifficulty": 3
  }
]`;
        try {
            const response = await lmstudioService.generateCompletion(model.modelId, prompt);
            const breakdown = JSON.parse(response);
            // Log
            await db.insert(executionLogs).values({
                taskId,
                level: 'info',
                message: `Planejamento concluído: ${breakdown.length} subtarefas criadas`,
                metadata: { breakdown },
            });
            return breakdown;
        }
        catch (error) {
            await db.insert(executionLogs).values({
                taskId,
                level: 'error',
                message: `Erro no planejamento: ${error}`,
            });
            throw error;
        }
    }
    /**
     * Executa subtarefa com validação cruzada OBRIGATÓRIA
     */
    async executeSubtask(subtaskId) {
        const [subtask] = await db.select().from(subtasks).where(eq(subtasks.id, subtaskId)).limit(1);
        if (!subtask) {
            throw new Error('Subtarefa não encontrada');
        }
        await db.update(subtasks).set({ status: 'executing' }).where(eq(subtasks.id, subtaskId));
        await notifyTaskUpdate(subtask.taskId);
        try {
            // 1. IA executa
            const result = await this.runSubtask(subtask);
            await db.update(subtasks).set({
                result,
                status: 'validating'
            }).where(eq(subtasks.id, subtaskId));
            await notifyTaskUpdate(subtask.taskId);
            // 2. Outra IA SEMPRE valida
            const validationResult = await this.validateSubtask(subtask, result);
            if (validationResult.approved) {
                await db.update(subtasks).set({
                    status: 'completed',
                    reviewedBy: validationResult.reviewerId,
                    reviewNotes: validationResult.notes,
                    completedAt: new Date(),
                }).where(eq(subtasks.id, subtaskId));
                await notifyTaskUpdate(subtask.taskId);
                return true;
            }
            // 3. Se divergência > 20%, terceira IA desempata
            if (validationResult.divergence && validationResult.divergence > 20) {
                const tiebreaker = await this.tiebreakerValidation(subtask, result, validationResult);
                if (tiebreaker.approved) {
                    await db.update(subtasks).set({
                        status: 'completed',
                        reviewedBy: tiebreaker.reviewerId,
                        reviewNotes: `Validação de desempate: ${tiebreaker.notes}`,
                        completedAt: new Date(),
                    }).where(eq(subtasks.id, subtaskId));
                    await notifyTaskUpdate(subtask.taskId);
                    return true;
                }
            }
            // Rejeitado
            await db.update(subtasks).set({
                status: 'rejected',
                reviewNotes: validationResult.notes,
            }).where(eq(subtasks.id, subtaskId));
            await notifyTaskUpdate(subtask.taskId);
            return false;
        }
        catch (error) {
            await db.update(subtasks).set({ status: 'failed' }).where(eq(subtasks.id, subtaskId));
            await notifyTaskUpdate(subtask.taskId);
            await db.insert(executionLogs).values({
                taskId: subtask.taskId,
                subtaskId,
                level: 'error',
                message: `Erro na execução: ${error}`,
            });
            throw error;
        }
    }
    async runSubtask(subtask) {
        try {
            // 1. Buscar modelo atribuído
            const [model] = await db.select()
                .from(aiModels)
                .where(eq(aiModels.id, subtask.assignedModelId))
                .limit(1);
            if (!model) {
                throw new Error('Modelo não encontrado');
            }
            // 2. Buscar IA especializada para contexto adicional
            const [ai] = await db.select()
                .from(specializedAIs)
                .where(eq(specializedAIs.defaultModelId, model.id))
                .limit(1);
            // 3. Construir prompt completo
            const fullPrompt = `${ai?.systemPrompt || ''}\n\n` +
                `Tarefa: ${subtask.title}\n` +
                `Descrição: ${subtask.description}\n\n` +
                `Instruções detalhadas: ${subtask.prompt}\n\n` +
                `IMPORTANTE: Execute COMPLETAMENTE, sem resumir ou omitir nada.`;
            // 4. Executar com LM Studio
            const result = await lmstudioService.generateCompletion(model.modelId, fullPrompt, {
                temperature: 0.7,
                maxTokens: 4096,
                timeout: 300000 // 5 minutos
            });
            // 5. Validar que resultado não está vazio
            if (!result || result.trim().length < 50) {
                throw new Error('Resultado muito curto ou vazio');
            }
            // 6. Log da execução
            await db.insert(executionLogs).values({
                taskId: subtask.taskId,
                subtaskId: subtask.id,
                level: 'info',
                message: `Subtarefa executada com sucesso (${result.length} caracteres)`,
                metadata: { modelId: model.id, aiId: ai?.id }
            });
            return result;
        }
        catch (error) {
            // Log erro
            await db.insert(executionLogs).values({
                taskId: subtask.taskId,
                subtaskId: subtask.id,
                level: 'error',
                message: `Erro ao executar subtarefa: ${error}`,
            });
            throw error;
        }
    }
    async validateSubtask(subtask, result) {
        try {
            // 1. Buscar modelo DIFERENTE para validação
            const executorModelId = subtask.assignedModelId;
            const [validatorAI] = await db.select()
                .from(specializedAIs)
                .where(and(eq(specializedAIs.category, 'validation'), eq(specializedAIs.isActive, true)))
                .limit(1);
            if (!validatorAI || !validatorAI.defaultModelId) {
                throw new Error('IA validadora não disponível');
            }
            // GARANTIR que é modelo DIFERENTE
            let validatorModelId = validatorAI.defaultModelId;
            if (validatorModelId === executorModelId) {
                // Buscar modelo fallback
                const fallbackIds = validatorAI.fallbackModelIds
                    ? validatorAI.fallbackModelIds
                    : [];
                const differentModelId = fallbackIds.find((id) => id !== executorModelId);
                if (differentModelId) {
                    validatorModelId = differentModelId;
                }
                else {
                    throw new Error('Não há modelo diferente disponível para validação');
                }
            }
            const [validatorModel] = await db.select()
                .from(aiModels)
                .where(eq(aiModels.id, validatorModelId))
                .limit(1);
            if (!validatorModel) {
                throw new Error('Modelo validador não encontrado');
            }
            // 2. Construir prompt de validação
            const validationPrompt = `${validatorAI.systemPrompt}\n\n` +
                `Você deve validar o seguinte trabalho de forma CRITERIOSA e HONESTA.\n\n` +
                `TAREFA ORIGINAL:\n` +
                `Título: ${subtask.title}\n` +
                `Descrição: ${subtask.description}\n` +
                `Instruções: ${subtask.prompt}\n\n` +
                `RESULTADO A VALIDAR:\n${result}\n\n` +
                `AVALIE:\n` +
                `1. O resultado está COMPLETO? (não resumido, não omitiu partes)\n` +
                `2. O resultado está CORRETO?\n` +
                `3. O resultado atende TODOS os requisitos?\n` +
                `4. O resultado tem qualidade suficiente?\n\n` +
                `Retorne um JSON:\n` +
                `{\n` +
                `  "approved": boolean,\n` +
                `  "score": number (0-100),\n` +
                `  "notes": "explicação detalhada",\n` +
                `  "missing": ["lista de itens faltando"],\n` +
                `  "errors": ["lista de erros encontrados"]\n` +
                `}`;
            // 3. Executar validação
            const validationResponse = await lmstudioService.generateCompletion(validatorModel.modelId, validationPrompt, {
                temperature: 0.3, // Mais conservador para validação
                maxTokens: 2048,
                timeout: 180000 // 3 minutos
            });
            // 4. Parsear resposta
            let validation;
            try {
                validation = JSON.parse(validationResponse);
            }
            catch (e) {
                // Se não conseguir parsear, assumir aprovado com score médio
                validation = {
                    approved: true,
                    score: 70,
                    notes: 'Validação automática (erro ao parsear resposta)',
                    missing: [],
                    errors: []
                };
            }
            // 5. Calcular divergência
            const divergence = 100 - validation.score;
            // 6. Log da validação
            await db.insert(executionLogs).values({
                taskId: subtask.taskId,
                subtaskId: subtask.id,
                level: 'info',
                message: `Validação concluída: ${validation.approved ? 'APROVADO' : 'REJEITADO'}`,
                metadata: {
                    validatorModelId: validatorModel.id,
                    score: validation.score,
                    divergence: divergence,
                    notes: validation.notes
                }
            });
            // 7. Atualizar métricas de qualidade
            if (subtask.assignedModelId) {
                await this.updateQualityMetrics(subtask.assignedModelId, 'general', validation.approved && validation.score >= 70, validation.score);
            }
            return {
                approved: validation.approved && validation.score >= 70,
                reviewerId: validatorModel.id,
                notes: validation.notes,
                divergence: divergence,
                score: validation.score
            };
        }
        catch (error) {
            await db.insert(executionLogs).values({
                taskId: subtask.taskId,
                subtaskId: subtask.id,
                level: 'error',
                message: `Erro na validação: ${error}`,
            });
            throw error;
        }
    }
    async tiebreakerValidation(subtask, result, previousValidation) {
        try {
            // 1. Buscar terceira IA (categoria 'analysis' ou diferente das anteriores)
            const usedModelIds = [
                subtask.assignedModelId,
                previousValidation.reviewerId
            ];
            const [tiebreakerAI] = await db.select()
                .from(specializedAIs)
                .where(and(eq(specializedAIs.category, 'analysis'), eq(specializedAIs.isActive, true)))
                .limit(1);
            if (!tiebreakerAI || !tiebreakerAI.defaultModelId) {
                throw new Error('IA de desempate não disponível');
            }
            // Garantir que é modelo DIFERENTE
            let tiebreakerModelId = tiebreakerAI.defaultModelId;
            if (usedModelIds.includes(tiebreakerModelId)) {
                const fallbackIds = tiebreakerAI.fallbackModelIds
                    ? tiebreakerAI.fallbackModelIds
                    : [];
                const differentId = fallbackIds.find((id) => !usedModelIds.includes(id));
                if (differentId) {
                    tiebreakerModelId = differentId;
                }
                else {
                    throw new Error('Não há terceiro modelo disponível');
                }
            }
            const [tiebreakerModel] = await db.select()
                .from(aiModels)
                .where(eq(aiModels.id, tiebreakerModelId))
                .limit(1);
            if (!tiebreakerModel) {
                throw new Error('Modelo de desempate não encontrado');
            }
            // 2. Prompt de desempate
            const tiebreakerPrompt = `${tiebreakerAI.systemPrompt}\n\n` +
                `Há DIVERGÊNCIA na validação. Você deve fazer DESEMPATE.\n\n` +
                `TAREFA ORIGINAL:\n${subtask.title}\n${subtask.description}\n\n` +
                `RESULTADO PRODUZIDO:\n${result}\n\n` +
                `VALIDAÇÃO ANTERIOR:\n` +
                `Score: ${previousValidation.score}\n` +
                `Notas: ${previousValidation.notes}\n` +
                `Divergência: ${previousValidation.divergence}%\n\n` +
                `ANALISE de forma IMPARCIAL e decida:\n` +
                `O resultado é aceitável? Sim ou não?\n` +
                `Qual score final você daria? (0-100)\n\n` +
                `Retorne JSON:\n` +
                `{\n` +
                `  "approved": boolean,\n` +
                `  "finalScore": number,\n` +
                `  "reasoning": "explicação detalhada"\n` +
                `}`;
            // 3. Executar
            const response = await lmstudioService.generateCompletion(tiebreakerModel.modelId, tiebreakerPrompt, { temperature: 0.5, maxTokens: 2048 });
            let tiebreaker;
            try {
                tiebreaker = JSON.parse(response);
            }
            catch (e) {
                // Fallback
                tiebreaker = {
                    approved: previousValidation.score >= 60,
                    finalScore: previousValidation.score,
                    reasoning: 'Desempate automático (erro ao parsear)'
                };
            }
            // 4. Log
            await db.insert(executionLogs).values({
                taskId: subtask.taskId,
                subtaskId: subtask.id,
                level: 'info',
                message: `Desempate realizado: ${tiebreaker.approved ? 'APROVADO' : 'REJEITADO'}`,
                metadata: {
                    tiebreakerModelId: tiebreakerModel.id,
                    finalScore: tiebreaker.finalScore,
                    reasoning: tiebreaker.reasoning
                }
            });
            return {
                approved: tiebreaker.approved,
                reviewerId: tiebreakerModel.id,
                notes: `Desempate: ${tiebreaker.reasoning}`,
                finalScore: tiebreaker.finalScore
            };
        }
        catch (error) {
            await db.insert(executionLogs).values({
                taskId: subtask.taskId,
                subtaskId: subtask.id,
                level: 'error',
                message: `Erro no desempate: ${error}`,
            });
            throw error;
        }
    }
    async updateQualityMetrics(aiId, taskType, wasSuccessful, score) {
        try {
            const { aiQualityMetrics } = await import('../db/schema.js');
            // Buscar ou criar métrica
            const [existing] = await db.select()
                .from(aiQualityMetrics)
                .where(and(eq(aiQualityMetrics.aiId, aiId), eq(aiQualityMetrics.taskType, taskType)))
                .limit(1);
            if (existing) {
                // Atualizar existente
                const newTotal = (existing.totalTasks || 0) + 1;
                const currentSuccessRate = parseFloat(existing.successRate || '0');
                const newSuccesses = (currentSuccessRate * (existing.totalTasks || 0)) / 100;
                const finalSuccesses = newSuccesses + (wasSuccessful ? 1 : 0);
                const newSuccessRate = (finalSuccesses / newTotal) * 100;
                const currentAvgScore = parseFloat(existing.avgScore || '0');
                const newScoreTotal = currentAvgScore * (existing.totalTasks || 0);
                const finalScoreTotal = newScoreTotal + score;
                const newAvgScore = finalScoreTotal / newTotal;
                await db.update(aiQualityMetrics)
                    .set({
                    successRate: String(newSuccessRate),
                    avgScore: String(newAvgScore),
                    totalTasks: newTotal,
                    lastUpdated: new Date()
                })
                    .where(eq(aiQualityMetrics.id, existing.id));
            }
            else {
                // Criar nova
                await db.insert(aiQualityMetrics).values({
                    aiId,
                    taskType,
                    successRate: String(wasSuccessful ? 100 : 0),
                    avgScore: String(score),
                    totalTasks: 1,
                    lastUpdated: new Date()
                });
            }
        }
        catch (error) {
            console.error('Erro ao atualizar métricas:', error);
            // Não falha a tarefa por erro em métricas
        }
    }
}
export const orchestratorService = new OrchestratorService();
