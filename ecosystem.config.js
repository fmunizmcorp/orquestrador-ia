/**
 * PM2 Ecosystem Configuration
 * Sprint 70: Otimização de Memória e Performance
 * 
 * Configurações:
 * - Limite de memória: 80% do disponível (~640MB para sistema de 800MB)
 * - Auto-restart on memory limit
 * - Error logging detalhado
 * - Environment variables otimizadas
 */

module.exports = {
  apps: [{
    name: 'orquestrador-v3',
    script: 'dist/server/index.js',
    
    // Configurações de execução
    instances: 1,
    exec_mode: 'fork',
    
    // Limite de memória - 80% do disponível
    // Se sistema tem 800MB, limite = 640MB
    // Se sistema tem 1GB, limite = 819MB
    max_memory_restart: '640M',
    
    // Auto-restart configurações
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Logging
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
      
      // Otimizações Node.js
      NODE_OPTIONS: '--max-old-space-size=512',  // Heap limit 512MB
      UV_THREADPOOL_SIZE: 4,  // Threads para I/O assíncrono
      
      // Redis configuration
      REDIS_HOST: 'localhost',
      REDIS_PORT: 6379,
      REDIS_ENABLED: true,
      
      // Cache configuration
      CACHE_ENABLED: true,
      CACHE_TTL: 300,  // 5 minutes
      
      // Memory optimization
      GC_ENABLED: true,
      GC_INTERVAL: 60000,  // Force GC every 60s
    },
    
    // Development environment
    env_development: {
      NODE_ENV: 'development',
      PORT: 3001,
      NODE_OPTIONS: '--max-old-space-size=256',
    },
    
    // Monitoring
    instance_var: 'INSTANCE_ID',
    
    // Kill timeout
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Graceful shutdown
    shutdown_with_message: false,
  }]
};
