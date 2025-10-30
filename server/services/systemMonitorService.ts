/**
 * System Monitor Service
 * Monitoramento completo de recursos do sistema
 * - CPU, RAM, GPU/VRAM, Disco, Rede
 * - Temperatura GPU/CPU
 * - Compatível com NVIDIA, AMD, Intel, Apple Silicon
 * - Limites automáticos e balanceamento
 */

import si from 'systeminformation';

interface SystemMetrics {
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

interface MetricsHistory {
  timestamp: number;
  metrics: SystemMetrics;
}

interface Alert {
  id: string;
  level: 'warning' | 'critical';
  message: string;
  timestamp: number;
  resolved: boolean;
}

class SystemMonitorService {
  private readonly DEFAULT_LIMITS: ResourceLimits = {
    cpuMax: 80,
    ramMax: 90,
    vramMax: 95,
    diskMax: 85,
  };

  // Histórico de métricas (últimos 100 registros)
  private metricsHistory: MetricsHistory[] = [];
  private readonly MAX_HISTORY = 100;

  // Alertas ativos
  private alerts = new Map<string, Alert>();
  private alertIdCounter = 0;

  /**
   * Coleta métricas completas do sistema
   */
  async getMetrics(): Promise<SystemMetrics> {
    try {
      const [
        cpuData,
        memData,
        cpuTemp,
        diskData,
        networkData,
        processes,
        graphics,
      ] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.cpuTemperature(),
        si.fsSize(),
        si.networkStats(),
        si.processes(),
        si.graphics(),
      ]);

      // CPU
      const cpu = {
        usage: parseFloat(cpuData.currentLoad.toFixed(2)),
        temperature: cpuTemp.main || null,
        cores: cpuData.cpus.length,
        speed: cpuData.cpus[0]?.load || 0,
      };

      // Memória
      const memory = {
        total: memData.total,
        used: memData.used,
        free: memData.free,
        usagePercent: parseFloat(((memData.used / memData.total) * 100).toFixed(2)),
      };

      // GPU
      const gpu = graphics.controllers.map(controller => ({
        vendor: controller.vendor || 'Unknown',
        model: controller.model || 'Unknown',
        vramTotal: controller.vram || 0,
        vramUsed: controller.vramDynamic || 0,
        vramFree: (controller.vram || 0) - (controller.vramDynamic || 0),
        vramUsagePercent: controller.vram
          ? parseFloat(((controller.vramDynamic || 0) / controller.vram * 100).toFixed(2))
          : 0,
        temperature: controller.temperatureGpu || null,
        utilization: controller.utilizationGpu || null,
        clockSpeed: controller.clockCore || null,
        powerUsage: controller.powerDraw || null,
      }));

      // Disco (principal)
      const mainDisk = diskData.find(d => d.mount === '/') || diskData[0];
      const disk = mainDisk ? {
        total: mainDisk.size,
        used: mainDisk.used,
        free: mainDisk.available,
        usagePercent: parseFloat(mainDisk.use.toFixed(2)),
      } : {
        total: 0,
        used: 0,
        free: 0,
        usagePercent: 0,
      };

      // Rede
      const network = {
        rx: networkData[0]?.rx_sec || 0,
        tx: networkData[0]?.tx_sec || 0,
      };

      // Verificar processos LM Studio
      const lmstudioProc = processes.list.find(p =>
        p.name.toLowerCase().includes('lmstudio') ||
        p.name.toLowerCase().includes('llama') ||
        p.command.toLowerCase().includes('lmstudio')
      );

      const processInfo = {
        lmstudio: !!lmstudioProc,
        pid: lmstudioProc?.pid,
        cpuUsage: lmstudioProc?.cpu,
        memUsage: lmstudioProc?.mem,
      };

      const metrics = {
        cpu,
        memory,
        gpu,
        disk,
        network,
        processes: processInfo,
      };

      // Adicionar ao histórico
      this.addToHistory(metrics);

      // Verificar e criar alertas
      await this.checkAndCreateAlerts(metrics);

      return metrics;
    } catch (error) {
      console.error('Erro ao coletar métricas do sistema:', error);
      throw error;
    }
  }

  /**
   * Adicionar métricas ao histórico
   */
  private addToHistory(metrics: SystemMetrics): void {
    this.metricsHistory.push({
      timestamp: Date.now(),
      metrics,
    });

    // Manter apenas MAX_HISTORY
    if (this.metricsHistory.length > this.MAX_HISTORY) {
      this.metricsHistory.shift();
    }
  }

  /**
   * Obter histórico de métricas
   */
  getHistory(minutes?: number): MetricsHistory[] {
    if (!minutes) {
      return this.metricsHistory;
    }

    const cutoff = Date.now() - (minutes * 60 * 1000);
    return this.metricsHistory.filter(h => h.timestamp >= cutoff);
  }

  /**
   * Calcular médias do histórico
   */
  getAverages(minutes: number = 10): {
    cpu: number;
    memory: number;
    disk: number;
    gpu: number[];
  } {
    const history = this.getHistory(minutes);
    
    if (history.length === 0) {
      return { cpu: 0, memory: 0, disk: 0, gpu: [] };
    }

    const cpuSum = history.reduce((sum, h) => sum + h.metrics.cpu.usage, 0);
    const memSum = history.reduce((sum, h) => sum + h.metrics.memory.usagePercent, 0);
    const diskSum = history.reduce((sum, h) => sum + h.metrics.disk.usagePercent, 0);

    const gpuCount = history[0].metrics.gpu.length;
    const gpuSums = new Array(gpuCount).fill(0);
    
    history.forEach(h => {
      h.metrics.gpu.forEach((gpu, idx) => {
        gpuSums[idx] += gpu.vramUsagePercent;
      });
    });

    return {
      cpu: cpuSum / history.length,
      memory: memSum / history.length,
      disk: diskSum / history.length,
      gpu: gpuSums.map(sum => sum / history.length),
    };
  }

  /**
   * Verificar e criar alertas
   */
  private async checkAndCreateAlerts(metrics: SystemMetrics): Promise<void> {
    const limits = this.DEFAULT_LIMITS;

    // CPU
    if (metrics.cpu.usage > limits.cpuMax) {
      this.createAlert('critical', `CPU em ${metrics.cpu.usage.toFixed(1)}%`);
    } else if (metrics.cpu.usage > limits.cpuMax - 10) {
      this.createAlert('warning', `CPU elevada: ${metrics.cpu.usage.toFixed(1)}%`);
    } else {
      this.resolveAlert('cpu');
    }

    // RAM
    if (metrics.memory.usagePercent > limits.ramMax) {
      this.createAlert('critical', `RAM em ${metrics.memory.usagePercent.toFixed(1)}%`);
    } else if (metrics.memory.usagePercent > limits.ramMax - 10) {
      this.createAlert('warning', `RAM elevada: ${metrics.memory.usagePercent.toFixed(1)}%`);
    } else {
      this.resolveAlert('memory');
    }

    // GPU
    metrics.gpu.forEach((gpu, idx) => {
      const key = `gpu-${idx}`;
      if (gpu.vramUsagePercent > limits.vramMax) {
        this.createAlert('critical', `VRAM GPU ${idx} em ${gpu.vramUsagePercent.toFixed(1)}%`, key);
      } else if (gpu.vramUsagePercent > limits.vramMax - 5) {
        this.createAlert('warning', `VRAM GPU ${idx} elevada: ${gpu.vramUsagePercent.toFixed(1)}%`, key);
      } else {
        this.resolveAlert(key);
      }
    });

    // Disco
    if (metrics.disk.usagePercent > limits.diskMax) {
      this.createAlert('critical', `Disco em ${metrics.disk.usagePercent.toFixed(1)}%`);
    } else if (metrics.disk.usagePercent > limits.diskMax - 10) {
      this.createAlert('warning', `Disco elevado: ${metrics.disk.usagePercent.toFixed(1)}%`);
    } else {
      this.resolveAlert('disk');
    }
  }

  /**
   * Criar alerta
   */
  private createAlert(level: 'warning' | 'critical', message: string, key?: string): void {
    const alertKey = key || message.split(' ')[0].toLowerCase();
    
    // Se já existe, apenas atualizar timestamp
    if (this.alerts.has(alertKey)) {
      const alert = this.alerts.get(alertKey)!;
      alert.timestamp = Date.now();
      alert.resolved = false;
      alert.message = message;
      alert.level = level;
      return;
    }

    // Criar novo
    this.alerts.set(alertKey, {
      id: `alert-${this.alertIdCounter++}`,
      level,
      message,
      timestamp: Date.now(),
      resolved: false,
    });

    console.log(`⚠️  [${level.toUpperCase()}] ${message}`);
  }

  /**
   * Resolver alerta
   */
  private resolveAlert(key: string): void {
    if (this.alerts.has(key)) {
      const alert = this.alerts.get(key)!;
      alert.resolved = true;
      
      // Remover após 5 minutos resolvido
      setTimeout(() => {
        this.alerts.delete(key);
      }, 300000);
    }
  }

  /**
   * Obter alertas ativos
   */
  getAlerts(includeResolved: boolean = false): Alert[] {
    const alerts = Array.from(this.alerts.values());
    
    if (includeResolved) {
      return alerts;
    }

    return alerts.filter(a => !a.resolved);
  }

  /**
   * Limpar todos os alertas
   */
  clearAlerts(): void {
    this.alerts.clear();
  }

  /**
   * Verifica se recursos estão dentro dos limites
   */
  async checkLimits(customLimits?: Partial<ResourceLimits>): Promise<{
    safe: boolean;
    warnings: string[];
    critical: string[];
  }> {
    const limits = { ...this.DEFAULT_LIMITS, ...customLimits };
    const metrics = await this.getMetrics();

    const warnings: string[] = [];
    const critical: string[] = [];

    // CPU
    if (metrics.cpu.usage > limits.cpuMax) {
      critical.push(`CPU em ${metrics.cpu.usage}% (limite: ${limits.cpuMax}%)`);
    } else if (metrics.cpu.usage > limits.cpuMax - 10) {
      warnings.push(`CPU em ${metrics.cpu.usage}% (próximo do limite)`);
    }

    // RAM
    if (metrics.memory.usagePercent > limits.ramMax) {
      critical.push(`RAM em ${metrics.memory.usagePercent}% (limite: ${limits.ramMax}%)`);
    } else if (metrics.memory.usagePercent > limits.ramMax - 10) {
      warnings.push(`RAM em ${metrics.memory.usagePercent}% (próximo do limite)`);
    }

    // VRAM
    metrics.gpu.forEach((gpu, idx) => {
      if (gpu.vramUsagePercent > limits.vramMax) {
        critical.push(`VRAM GPU ${idx} em ${gpu.vramUsagePercent}% (limite: ${limits.vramMax}%)`);
      } else if (gpu.vramUsagePercent > limits.vramMax - 5) {
        warnings.push(`VRAM GPU ${idx} em ${gpu.vramUsagePercent}% (próximo do limite)`);
      }
    });

    // Disco
    if (metrics.disk.usagePercent > limits.diskMax) {
      critical.push(`Disco em ${metrics.disk.usagePercent}% (limite: ${limits.diskMax}%)`);
    } else if (metrics.disk.usagePercent > limits.diskMax - 10) {
      warnings.push(`Disco em ${metrics.disk.usagePercent}% (próximo do limite)`);
    }

    return {
      safe: critical.length === 0,
      warnings,
      critical,
    };
  }

  /**
   * Sugere ações de balanceamento
   */
  async suggestActions(): Promise<string[]> {
    const { safe, critical } = await this.checkLimits();
    const suggestions: string[] = [];

    if (!safe) {
      for (const issue of critical) {
        if (issue.includes('CPU')) {
          suggestions.push('Pausar novas tarefas até CPU normalizar');
          suggestions.push('Considerar usar modelos menores');
        }
        if (issue.includes('RAM')) {
          suggestions.push('Descarregar modelos não utilizados');
          suggestions.push('Limpar cache de memória');
        }
        if (issue.includes('VRAM')) {
          suggestions.push('Usar modelo com quantização mais agressiva');
          suggestions.push('Alternar para API externa temporariamente');
        }
        if (issue.includes('Disco')) {
          suggestions.push('Limpar logs antigos');
          suggestions.push('Compactar arquivos temporários');
          suggestions.push('Remover modelos não utilizados');
        }
      }
    }

    return [...new Set(suggestions)]; // Remove duplicatas
  }

  /**
   * Monitora continuamente (para uso com WebSocket)
   */
  async* monitorContinuous(intervalMs: number = 10000): AsyncGenerator<SystemMetrics> {
    while (true) {
      yield await this.getMetrics();
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  /**
   * Obtém estatísticas de GPU específica
   */
  async getGPUStats(gpuIndex: number = 0): Promise<SystemMetrics['gpu'][0] | null> {
    try {
      const metrics = await this.getMetrics();
      return metrics.gpu[gpuIndex] || null;
    } catch (error) {
      console.error('Erro ao buscar stats de GPU:', error);
      return null;
    }
  }

  /**
   * Health check do sistema
   */
  async healthCheck(): Promise<{
    healthy: boolean;
    issues: string[];
    metrics: SystemMetrics;
  }> {
    const metrics = await this.getMetrics();
    const { safe, critical, warnings } = await this.checkLimits();

    return {
      healthy: safe,
      issues: [...critical, ...warnings],
      metrics,
    };
  }
}

export const systemMonitorService = new SystemMonitorService();
