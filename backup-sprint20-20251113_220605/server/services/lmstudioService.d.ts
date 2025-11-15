/**
 * LM Studio Service
 * Integração completa com LM Studio local
 * - Listar modelos disponíveis
 * - Carregar/descarregar modelos
 * - Cache de 5 minutos
 * - Leitura sob demanda (não polling)
 */
export interface ModelInfo {
    id: string;
    object: string;
    created: number;
    owned_by: string;
}
export interface LoadedModelInfo extends ModelInfo {
    isLoaded: boolean;
    size?: number;
    parameters?: string;
    quantization?: string;
}
declare class LMStudioService {
    private modelsCache;
    private lastCacheTime;
    /**
     * Lista modelos disponíveis no LM Studio
     * Usa cache de 5 minutos
     */
    listModels(forceRefresh?: boolean): Promise<LoadedModelInfo[]>;
    /**
     * Verifica se LM Studio está rodando
     */
    isRunning(): Promise<boolean>;
    /**
     * Obtém informações de um modelo específico
     */
    getModelInfo(modelId: string): Promise<LoadedModelInfo | null>;
    /**
     * Envia prompt para um modelo
     */
    generateCompletion(modelId: string, prompt: string, options?: any): Promise<string>;
    /**
     * Gera completion com streaming
     */
    generateStreamingCompletion(modelId: string, prompt: string, onChunk: (chunk: string) => void, options?: any): Promise<void>;
    /**
     * Limpa cache
     */
    clearCache(): void;
    /**
     * Alias para generateStreamingCompletion (compatibilidade)
     */
    generateCompletionStream(modelId: string, prompt: string, options: any | undefined, onChunk: (chunk: string) => void): Promise<void>;
    /**
     * Estima tokens em um texto (aproximação)
     */
    estimateTokens(text: string): number;
    /**
     * Trunca texto para caber no contexto
     */
    truncateToContext(text: string, maxTokens: number): string;
    /**
     * Divide texto longo em chunks com overlap
     */
    chunkText(text: string, chunkSize?: number, overlap?: number): string[];
    /**
     * Processa texto longo em chunks e agrega resultados
     */
    processLongText(modelId: string, text: string, instructionTemplate: (chunk: string, index: number, total: number) => string, aggregateResults?: (results: string[]) => string): Promise<string>;
    /**
     * Carrega modelo específico (se LM Studio suportar)
     */
    loadModel(modelId: string): Promise<boolean>;
    /**
     * Troca de modelo com fallback automático
     */
    switchModel(preferredModelId: string, fallbackModelIds?: string[]): Promise<{
        modelId: string;
        success: boolean;
    }>;
    /**
     * Benchmark de modelo (velocidade de geração)
     */
    benchmarkModel(modelId: string): Promise<{
        tokensPerSecond: number;
        latencyMs: number;
        success: boolean;
    }>;
    /**
     * Valida resposta do modelo (verifica se não é vazia ou inválida)
     */
    validateResponse(response: string, minLength?: number): boolean;
    /**
     * Retry com modelo diferente em caso de falha
     */
    generateWithRetry(modelId: string, prompt: string, options?: any, fallbackModelIds?: string[]): Promise<{
        result: string;
        modelUsed: string;
    }>;
    /**
     * Comparar respostas de múltiplos modelos
     */
    compareModels(modelIds: string[], prompt: string, options?: any): Promise<Array<{
        modelId: string;
        response: string;
        tokensPerSecond: number;
    }>>;
    /**
     * Recomenda modelo para tipo de tarefa
     */
    recommendModel(taskType: string): Promise<string | null>;
}
export declare const lmstudioService: LMStudioService;
export {};
