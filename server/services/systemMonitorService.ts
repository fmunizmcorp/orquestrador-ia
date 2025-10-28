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

class SystemMonitorService {
  private readonly DEFAULT_LIMITS: ResourceLimits = {
    cpuMax: 80,
    ramMax: 90,
    vramMax: 95,
    diskMax: 85,
  };

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

      return {
        cpu,
        memory,
        gpu,
        disk,
        network,
        processes: processInfo,
      };
    } catch (error) {
      console.error('Erro ao coletar métricas do sistema:', error);
      throw error;
    }
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
