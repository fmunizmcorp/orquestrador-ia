/**
 * Circuit Breaker Pattern
 * Protege contra falhas em cascata em serviços externos
 */
export declare enum CircuitState {
    CLOSED = "CLOSED",// Normal operation
    OPEN = "OPEN",// Failing, reject requests
    HALF_OPEN = "HALF_OPEN"
}
export interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    resetTimeout?: number;
}
export declare class CircuitBreaker {
    private state;
    private failureCount;
    private successCount;
    private nextAttempt;
    private config;
    private name;
    constructor(name: string, config: CircuitBreakerConfig);
    /**
     * Execute function with circuit breaker protection
     */
    execute<T>(fn: () => Promise<T>): Promise<T>;
    private onSuccess;
    private onFailure;
    /**
     * Manually reset circuit breaker
     */
    reset(): void;
    /**
     * Get current status
     */
    getStatus(): {
        name: string;
        state: CircuitState;
        failureCount: number;
        successCount: number;
        nextAttempt: string | null;
    };
    /**
     * Check if circuit is allowing requests
     */
    isAvailable(): boolean;
}
/**
 * Circuit Breaker Manager
 * Manages multiple circuit breakers
 */
export declare class CircuitBreakerManager {
    private breakers;
    /**
     * Get or create circuit breaker
     */
    getBreaker(name: string, config?: CircuitBreakerConfig): CircuitBreaker;
    /**
     * Get status of all breakers
     */
    getAllStatus(): any;
    /**
     * Reset all breakers
     */
    resetAll(): void;
    /**
     * Get metrics
     */
    getMetrics(): {
        total: number;
        open: number;
        halfOpen: number;
        closed: number;
        healthy: number;
        unhealthy: number;
    };
}
export declare const circuitBreakerManager: CircuitBreakerManager;
export declare const lmStudioBreaker: CircuitBreaker;
export declare const externalAPIBreaker: CircuitBreaker;
