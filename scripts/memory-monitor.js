/**
 * Memory Monitor & Garbage Collector
 * Sprint 70: Sistema de monitoramento de memória com GC forçado
 * 
 * Features:
 * - Monitora uso de memória a cada 30s
 * - Força GC quando memória > 70%
 * - Logs detalhados
 * - Alertas quando memória > 80%
 */

const os = require('os');
const fs = require('fs');
const path = require('path');

// Configurações
const CONFIG = {
  CHECK_INTERVAL: 30000,  // 30 segundos
  WARNING_THRESHOLD: 0.70,  // 70% de uso
  CRITICAL_THRESHOLD: 0.80,  // 80% de uso
  GC_THRESHOLD: 0.70,  // Força GC quando > 70%
  LOG_FILE: path.join(__dirname, '../logs/memory-monitor.log'),
};

// Criar diretório de logs se não existir
const logsDir = path.dirname(CONFIG.LOG_FILE);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Formata bytes para formato legível
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Log com timestamp
 */
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  // Console output
  console.log(logMessage.trim());
  
  // File output
  try {
    fs.appendFileSync(CONFIG.LOG_FILE, logMessage);
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
}

/**
 * Obtém estatísticas de memória
 */
function getMemoryStats() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const usagePercent = (usedMem / totalMem) * 100;
  
  // Node.js heap memory
  const heapStats = process.memoryUsage();
  const heapUsedPercent = (heapStats.heapUsed / heapStats.heapTotal) * 100;
  
  return {
    system: {
      total: totalMem,
      free: freeMem,
      used: usedMem,
      usagePercent: usagePercent,
    },
    heap: {
      total: heapStats.heapTotal,
      used: heapStats.heapUsed,
      usagePercent: heapUsedPercent,
      external: heapStats.external,
      rss: heapStats.rss,
    },
  };
}

/**
 * Força garbage collection
 */
function forceGC() {
  if (global.gc) {
    const beforeMem = process.memoryUsage().heapUsed;
    global.gc();
    const afterMem = process.memoryUsage().heapUsed;
    const freed = beforeMem - afterMem;
    
    log(`GC forced. Freed: ${formatBytes(freed)}`, 'GC');
    return freed;
  } else {
    log('GC not available. Run with --expose-gc flag', 'WARN');
    return 0;
  }
}

/**
 * Monitora memória e toma ações se necessário
 */
function checkMemory() {
  const stats = getMemoryStats();
  const usagePercent = stats.system.usagePercent;
  const heapPercent = stats.heap.usagePercent;
  
  // Log estado atual
  const status = `System: ${formatBytes(stats.system.used)}/${formatBytes(stats.system.total)} (${usagePercent.toFixed(1)}%) | Heap: ${formatBytes(stats.heap.used)}/${formatBytes(stats.heap.total)} (${heapPercent.toFixed(1)}%)`;
  
  // Determinar nível de log
  let level = 'INFO';
  if (usagePercent >= CONFIG.CRITICAL_THRESHOLD * 100) {
    level = 'CRITICAL';
  } else if (usagePercent >= CONFIG.WARNING_THRESHOLD * 100) {
    level = 'WARN';
  }
  
  log(status, level);
  
  // Força GC se necessário
  if (usagePercent >= CONFIG.GC_THRESHOLD * 100 || heapPercent >= CONFIG.GC_THRESHOLD * 100) {
    log('Memory threshold exceeded, forcing GC...', 'WARN');
    forceGC();
    
    // Verifica memória após GC
    const afterStats = getMemoryStats();
    log(`After GC: ${formatBytes(afterStats.system.used)}/${formatBytes(afterStats.system.total)} (${afterStats.system.usagePercent.toFixed(1)}%)`, 'INFO');
  }
  
  // Alerta crítico
  if (usagePercent >= CONFIG.CRITICAL_THRESHOLD * 100) {
    log('⚠️  CRITICAL: Memory usage above 80%! System may become unstable!', 'CRITICAL');
  }
  
  return stats;
}

/**
 * Inicia monitoramento
 */
function startMonitoring() {
  log('Memory monitoring started', 'INFO');
  log(`Thresholds: WARNING=${CONFIG.WARNING_THRESHOLD * 100}%, CRITICAL=${CONFIG.CRITICAL_THRESHOLD * 100}%, GC=${CONFIG.GC_THRESHOLD * 100}%`, 'INFO');
  log(`Check interval: ${CONFIG.CHECK_INTERVAL / 1000}s`, 'INFO');
  
  // Check inicial
  checkMemory();
  
  // Monitoramento periódico
  setInterval(() => {
    checkMemory();
  }, CONFIG.CHECK_INTERVAL);
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', () => {
  log('Memory monitor shutting down...', 'INFO');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Memory monitor shutting down...', 'INFO');
  process.exit(0);
});

// Iniciar monitoramento
if (require.main === module) {
  startMonitoring();
}

module.exports = { checkMemory, forceGC, getMemoryStats };
