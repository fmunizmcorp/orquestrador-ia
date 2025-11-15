/**
 * Circuit Breaker Pattern
 * Protege contra falhas em cascata em serviços externos
 */
export var CircuitState;
(function (CircuitState) {
    CircuitState["CLOSED"] = "CLOSED";
    CircuitState["OPEN"] = "OPEN";
    CircuitState["HALF_OPEN"] = "HALF_OPEN";
})(CircuitState || (CircuitState = {}));
export class CircuitBreaker {
    constructor(name, config) {
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: CircuitState.CLOSED
        });
        Object.defineProperty(this, "failureCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "successCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "nextAttempt", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Date.now()
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.name = name;
        this.config = {
            resetTimeout: 60000, // 1 minute default
            ...config,
        };
    }
    /**
     * Execute function with circuit breaker protection
     */
    async execute(fn) {
        // Check circuit state
        if (this.state === CircuitState.OPEN) {
            if (Date.now() < this.nextAttempt) {
                throw new Error(`Circuit breaker ${this.name} is OPEN. Service unavailable.`);
            }
            // Try to recover - move to half-open
            this.state = CircuitState.HALF_OPEN;
            console.log(`🔄 Circuit breaker ${this.name}: OPEN -> HALF_OPEN (attempting recovery)`);
        }
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure();
            throw error;
        }
    }
    onSuccess() {
        this.failureCount = 0;
        if (this.state === CircuitState.HALF_OPEN) {
            this.successCount++;
            if (this.successCount >= this.config.successThreshold) {
                this.state = CircuitState.CLOSED;
                this.successCount = 0;
                console.log(`✅ Circuit breaker ${this.name}: HALF_OPEN -> CLOSED (service recovered)`);
            }
        }
    }
    onFailure() {
        this.failureCount++;
        this.successCount = 0;
        if (this.failureCount >= this.config.failureThreshold) {
            this.state = CircuitState.OPEN;
            this.nextAttempt = Date.now() + this.config.timeout;
            console.error(`🔴 Circuit breaker ${this.name}: OPENING (too many failures)`);
        }
    }
    /**
     * Manually reset circuit breaker
     */
    reset() {
        this.state = CircuitState.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        console.log(`🔄 Circuit breaker ${this.name}: Manually reset to CLOSED`);
    }
    /**
     * Get current status
     */
    getStatus() {
        return {
            name: this.name,
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            nextAttempt: this.state === CircuitState.OPEN ? new Date(this.nextAttempt).toISOString() : null,
        };
    }
    /**
     * Check if circuit is allowing requests
     */
    isAvailable() {
        if (this.state === CircuitState.CLOSED)
            return true;
        if (this.state === CircuitState.HALF_OPEN)
            return true;
        if (this.state === CircuitState.OPEN && Date.now() >= this.nextAttempt)
            return true;
        return false;
    }
}
/**
 * Circuit Breaker Manager
 * Manages multiple circuit breakers
 */
export class CircuitBreakerManager {
    constructor() {
        Object.defineProperty(this, "breakers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    /**
     * Get or create circuit breaker
     */
    getBreaker(name, config) {
        let breaker = this.breakers.get(name);
        if (!breaker) {
            if (!config) {
                throw new Error(`Circuit breaker ${name} not found and no config provided`);
            }
            breaker = new CircuitBreaker(name, config);
            this.breakers.set(name, breaker);
        }
        return breaker;
    }
    /**
     * Get status of all breakers
     */
    getAllStatus() {
        const statuses = {};
        for (const [name, breaker] of this.breakers.entries()) {
            statuses[name] = breaker.getStatus();
        }
        return statuses;
    }
    /**
     * Reset all breakers
     */
    resetAll() {
        for (const breaker of this.breakers.values()) {
            breaker.reset();
        }
    }
    /**
     * Get metrics
     */
    getMetrics() {
        const total = this.breakers.size;
        let open = 0;
        let halfOpen = 0;
        let closed = 0;
        for (const breaker of this.breakers.values()) {
            const status = breaker.getStatus();
            switch (status.state) {
                case CircuitState.OPEN:
                    open++;
                    break;
                case CircuitState.HALF_OPEN:
                    halfOpen++;
                    break;
                case CircuitState.CLOSED:
                    closed++;
                    break;
            }
        }
        return {
            total,
            open,
            halfOpen,
            closed,
            healthy: closed,
            unhealthy: open + halfOpen,
        };
    }
}
// Global circuit breaker manager
export const circuitBreakerManager = new CircuitBreakerManager();
// Pre-configured circuit breakers
export const lmStudioBreaker = circuitBreakerManager.getBreaker('lmstudio', {
    failureThreshold: 3,
    successThreshold: 2,
    timeout: 30000, // 30 seconds
    resetTimeout: 60000,
});
export const externalAPIBreaker = circuitBreakerManager.getBreaker('external-api', {
    failureThreshold: 5,
    successThreshold: 3,
    timeout: 60000, // 1 minute
    resetTimeout: 120000,
});
