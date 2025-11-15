/**
 * Orchestrator Service
 * Orquestração inteligente com validação cruzada OBRIGATÓRIA
 * - Cria checklist COMPLETO de tarefas
 * - Divide em subtarefas (TODAS)
 * - IA executa, outra SEMPRE valida
 * - Terceira IA desempata se divergência > 20%
 * - ZERO perda de trabalho
 */
interface TaskBreakdown {
    title: string;
    description: string;
    estimatedDifficulty: number;
    assignedAI?: number;
}
type BroadcastCallback = (taskId: number) => Promise<void>;
export declare function setBroadcastCallback(callback: BroadcastCallback): void;
declare class OrchestratorService {
    /**
     * Planeja tarefa COMPLETA - cria checklist de TUDO
     */
    planTask(taskId: number): Promise<TaskBreakdown[]>;
    /**
     * Executa subtarefa com validação cruzada OBRIGATÓRIA
     */
    executeSubtask(subtaskId: number): Promise<boolean>;
    private runSubtask;
    private validateSubtask;
    private tiebreakerValidation;
    private updateQualityMetrics;
}
export declare const orchestratorService: OrchestratorService;
export {};
