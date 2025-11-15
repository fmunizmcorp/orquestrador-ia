/**
 * System Monitor Service
 * Monitoramento completo de recursos do sistema
 * - CPU, RAM, GPU/VRAM, Disco, Rede
 * - Temperatura GPU/CPU
 * - Compatível com NVIDIA, AMD, Intel, Apple Silicon
 * - Limites automáticos e balanceamento
 */
export interface SystemMetrics {
    cpu: {
        usage: number;
        temperature: number | null;
        cores: number;
        speed: number;
    };
    memory: {
        total: number;
        used: number;
        free: number;
        usagePercent: number;
    };
    gpu: {
        vendor: string;
        model: string;
        vramTotal: number;
        vramUsed: number;
        vramFree: number;
        vramUsagePercent: number;
        temperature: number | null;
        utilization: number | null;
        clockSpeed: number | null;
        powerUsage: number | null;
    }[];
    disk: {
        total: number;
        used: number;
        free: number;
        usagePercent: number;
    };
    network: {
        rx: number;
        tx: number;
    };
    processes: {
        lmstudio: boolean;
        pid?: number;
        cpuUsage?: number;
        memUsage?: number;
    };
}
interface ResourceLimits {
    cpuMax: number;
    ramMax: number;
    vramMax: number;
    diskMax: number;
}
export interface MetricsHistory {
    timestamp: number;
    metrics: SystemMetrics;
}
export interface Alert {
    id: string;
    level: 'warning' | 'critical';
    message: string;
    timestamp: number;
    resolved: boolean;
}
declare class SystemMonitorService {
    private readonly DEFAULT_LIMITS;
    private metricsHistory;
    private readonly MAX_HISTORY;
    private alerts;
    private alertIdCounter;
    private metricsCache;
    private cacheTimestamp;
    private readonly CACHE_TTL;
    /**
     * Coleta métricas completas do sistema (com cache)
     */
    getMetrics(): Promise<SystemMetrics>;
    /**
     * Coleta métricas do sistema (sem cache - método privado)
     */
    private collectMetrics;
    /**
     * Adicionar métricas ao histórico
     */
    private addToHistory;
    /**
     * Obter histórico de métricas
     */
    getHistory(minutes?: number): MetricsHistory[];
    /**
     * Calcular médias do histórico
     */
    getAverages(minutes?: number): {
        cpu: number;
        memory: number;
        disk: number;
        gpu: number[];
    };
    /**
     * Verificar e criar alertas
     */
    private checkAndCreateAlerts;
    /**
     * Criar alerta
     */
    private createAlert;
    /**
     * Resolver alerta
     */
    private resolveAlert;
    /**
     * Obter alertas ativos
     */
    getAlerts(includeResolved?: boolean): Alert[];
    /**
     * Limpar todos os alertas
     */
    clearAlerts(): void;
    /**
     * Verifica se recursos estão dentro dos limites
     */
    checkLimits(customLimits?: Partial<ResourceLimits>): Promise<{
        safe: boolean;
        warnings: string[];
        critical: string[];
    }>;
    /**
     * Sugere ações de balanceamento
     */
    suggestActions(): Promise<string[]>;
    /**
     * Monitora continuamente (para uso com WebSocket)
     */
    monitorContinuous(intervalMs?: number): AsyncGenerator<SystemMetrics>;
    /**
     * Obtém estatísticas de GPU específica
     */
    getGPUStats(gpuIndex?: number): Promise<SystemMetrics['gpu'][0] | null>;
    /**
     * Health check do sistema
     */
    healthCheck(): Promise<{
        healthy: boolean;
        issues: string[];
        metrics: SystemMetrics;
    }>;
}
export declare const systemMonitorService: SystemMonitorService;
export {};
