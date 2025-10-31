/**
 * LM Studio Service
 * Integração completa com LM Studio local
 * - Listar modelos disponíveis
 * - Carregar/descarregar modelos
 * - Cache de 5 minutos
 * - Leitura sob demanda (não polling)
 */

import axios from 'axios';

const LM_STUDIO_URL = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

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

class LMStudioService {
  private modelsCache: LoadedModelInfo[] | null = null;
  private lastCacheTime: number = 0;

  /**
   * Lista modelos disponíveis no LM Studio
   * Usa cache de 5 minutos
   */
  async listModels(forceRefresh: boolean = false): Promise<LoadedModelInfo[]> {
    try {
      // Verificar cache
      const now = Date.now();
      if (!forceRefresh && this.modelsCache && (now - this.lastCacheTime) < CACHE_DURATION) {
        return this.modelsCache;
      }

      // Buscar modelos do LM Studio
      const response = await axios.get(`${LM_STUDIO_URL}/models`, {
        timeout: 5000,
      });

      const models: LoadedModelInfo[] = response.data.data.map((model: ModelInfo) => ({
        ...model,
        isLoaded: true, // Se está na lista, está carregado
      }));

      // Atualizar cache
      this.modelsCache = models;
      this.lastCacheTime = now;

      return models;
    } catch (error) {
      console.error('Erro ao listar modelos do LM Studio:', error);
      
      // Retornar cache antigo se disponível
      if (this.modelsCache) {
        console.warn('Usando cache antigo de modelos');
        return this.modelsCache;
      }

      return [];
    }
  }

  /**
   * Verifica se LM Studio está rodando
   */
  async isRunning(): Promise<boolean> {
    try {
      await axios.get(`${LM_STUDIO_URL}/models`, { timeout: 2000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém informações de um modelo específico
   */
  async getModelInfo(modelId: string): Promise<LoadedModelInfo | null> {
    try {
      const models = await this.listModels();
      return models.find(m => m.id === modelId) || null;
    } catch (error) {
      console.error('Erro ao buscar informações do modelo:', error);
      return null;
    }
  }

  /**
   * Envia prompt para um modelo
   */
  async generateCompletion(modelId: string, prompt: string, options: any = {}): Promise<string> {
    try {
      const response = await axios.post(`${LM_STUDIO_URL}/chat/completions`, {
        model: modelId,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        stream: false,
      }, {
        timeout: options.timeout || 60000,
      });

      return response.data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Erro ao gerar completion:', error);
      throw new Error('Falha ao gerar resposta do modelo');
    }
  }

  /**
   * Gera completion com streaming
   */
  async generateStreamingCompletion(
    modelId: string,
    prompt: string,
    onChunk: (chunk: string) => void,
    options: any = {}
  ): Promise<void> {
    try {
      const response = await axios.post(`${LM_STUDIO_URL}/chat/completions`, {
        model: modelId,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2048,
        stream: true,
      }, {
        timeout: options.timeout || 120000,
        responseType: 'stream',
      });

      response.data.on('data', (chunk: Buffer) => {
        const lines = chunk.toString().split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Ignorar erros de parsing
            }
          }
        }
      });

      return new Promise((resolve, reject) => {
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });
    } catch (error) {
      console.error('Erro ao gerar streaming completion:', error);
      throw new Error('Falha ao gerar resposta com streaming');
    }
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.modelsCache = null;
    this.lastCacheTime = 0;
  }

  /**
   * Alias para generateStreamingCompletion (compatibilidade)
   */
  async generateCompletionStream(
    modelId: string,
    prompt: string,
    options: any = {},
    onChunk: (chunk: string) => void
  ): Promise<void> {
    return this.generateStreamingCompletion(modelId, prompt, onChunk, options);
  }

  /**
   * Estima tokens em um texto (aproximação)
   */
  estimateTokens(text: string): number {
    // Estimativa aproximada: 1 token ≈ 4 caracteres
    // Para inglês: ~0.75 palavras por token
    const charEstimate = text.length / 4;
    const wordEstimate = text.split(/\s+/).length / 0.75;
    
    // Usar média
    return Math.round((charEstimate + wordEstimate) / 2);
  }

  /**
   * Trunca texto para caber no contexto
   */
  truncateToContext(text: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokens(text);
    
    if (estimatedTokens <= maxTokens) {
      return text;
    }

    // Calcular % a remover
    const ratio = maxTokens / estimatedTokens;
    const targetLength = Math.floor(text.length * ratio);
    
    // Truncar e adicionar indicador
    return text.substring(0, targetLength) + '\n\n[... truncado para caber no contexto ...]';
  }

  /**
   * Divide texto longo em chunks com overlap
   */
  chunkText(text: string, chunkSize: number = 2000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
      const endIndex = Math.min(startIndex + chunkSize, text.length);
      chunks.push(text.substring(startIndex, endIndex));
      
      // Próximo chunk começa com overlap
      startIndex = endIndex - overlap;
      
      // Se o overlap faria começar antes do fim, parar
      if (startIndex + overlap >= text.length) {
        break;
      }
    }

    return chunks;
  }

  /**
   * Processa texto longo em chunks e agrega resultados
   */
  async processLongText(
    modelId: string,
    text: string,
    instructionTemplate: (chunk: string, index: number, total: number) => string,
    aggregateResults?: (results: string[]) => string
  ): Promise<string> {
    // Dividir em chunks
    const chunks = this.chunkText(text, 3000, 300);
    const results: string[] = [];

    // Processar cada chunk
    for (let i = 0; i < chunks.length; i++) {
      const prompt = instructionTemplate(chunks[i], i + 1, chunks.length);
      
      const result = await this.generateCompletion(modelId, prompt, {
        temperature: 0.3,
        maxTokens: 2048,
      });

      results.push(result);
    }

    // Agregar resultados
    if (aggregateResults) {
      return aggregateResults(results);
    }

    return results.join('\n\n---\n\n');
  }

  /**
   * Carrega modelo específico (se LM Studio suportar)
   */
  async loadModel(modelId: string): Promise<boolean> {
    try {
      // Testar se modelo responde
      await this.generateCompletion(modelId, 'test', {
        maxTokens: 1,
        temperature: 0,
      });

      console.log(`✅ Modelo ${modelId} carregado com sucesso`);
      return true;
    } catch (error) {
      console.error(`❌ Falha ao carregar modelo ${modelId}:`, error);
      return false;
    }
  }

  /**
   * Troca de modelo com fallback automático
   */
  async switchModel(
    preferredModelId: string,
    fallbackModelIds: string[] = []
  ): Promise<{ modelId: string; success: boolean }> {
    // Tentar modelo preferido
    if (await this.loadModel(preferredModelId)) {
      return { modelId: preferredModelId, success: true };
    }

    // Tentar fallbacks
    for (const fallbackId of fallbackModelIds) {
      if (await this.loadModel(fallbackId)) {
        console.log(`⚠️  Usando fallback: ${fallbackId}`);
        return { modelId: fallbackId, success: true };
      }
    }

    throw new Error('Nenhum modelo disponível (preferido ou fallbacks)');
  }

  /**
   * Benchmark de modelo (velocidade de geração)
   */
  async benchmarkModel(modelId: string): Promise<{
    tokensPerSecond: number;
    latencyMs: number;
    success: boolean;
  }> {
    try {
      const testPrompt = 'Generate exactly 100 tokens of text about artificial intelligence.';
      const startTime = Date.now();

      const result = await this.generateCompletion(modelId, testPrompt, {
        temperature: 0.7,
        maxTokens: 100,
      });

      const endTime = Date.now();
      const durationMs = endTime - startTime;
      const estimatedTokens = this.estimateTokens(result);
      const tokensPerSecond = (estimatedTokens / durationMs) * 1000;

      return {
        tokensPerSecond,
        latencyMs: durationMs,
        success: true,
      };
    } catch (error) {
      console.error('Erro ao fazer benchmark:', error);
      return {
        tokensPerSecond: 0,
        latencyMs: 0,
        success: false,
      };
    }
  }

  /**
   * Valida resposta do modelo (verifica se não é vazia ou inválida)
   */
  validateResponse(response: string, minLength: number = 10): boolean {
    if (!response || typeof response !== 'string') {
      return false;
    }

    const trimmed = response.trim();
    
    if (trimmed.length < minLength) {
      return false;
    }

    // Verificar se não é apenas erro ou placeholder
    const invalidPatterns = [
      /^error/i,
      /^failed/i,
      /^\[.*\]$/,
      /^null$/i,
      /^undefined$/i,
    ];

    return !invalidPatterns.some(pattern => pattern.test(trimmed));
  }

  /**
   * Retry com modelo diferente em caso de falha
   */
  async generateWithRetry(
    modelId: string,
    prompt: string,
    options: any = {},
    fallbackModelIds: string[] = []
  ): Promise<{ result: string; modelUsed: string }> {
    // Tentar modelo principal
    try {
      const result = await this.generateCompletion(modelId, prompt, options);
      
      if (this.validateResponse(result)) {
        return { result, modelUsed: modelId };
      }
    } catch (error) {
      console.warn(`Falha com modelo ${modelId}:`, error);
    }

    // Tentar fallbacks
    for (const fallbackId of fallbackModelIds) {
      try {
        console.log(`🔄 Tentando fallback: ${fallbackId}`);
        const result = await this.generateCompletion(fallbackId, prompt, options);
        
        if (this.validateResponse(result)) {
          return { result, modelUsed: fallbackId };
        }
      } catch (error) {
        console.warn(`Falha com fallback ${fallbackId}:`, error);
      }
    }

    throw new Error('Falha em todos os modelos (principal e fallbacks)');
  }

  /**
   * Comparar respostas de múltiplos modelos
   */
  async compareModels(
    modelIds: string[],
    prompt: string,
    options: any = {}
  ): Promise<Array<{ modelId: string; response: string; tokensPerSecond: number }>> {
    const results = await Promise.all(
      modelIds.map(async (modelId) => {
        const startTime = Date.now();
        
        try {
          const response = await this.generateCompletion(modelId, prompt, options);
          const durationMs = Date.now() - startTime;
          const tokens = this.estimateTokens(response);
          const tokensPerSecond = (tokens / durationMs) * 1000;

          return {
            modelId,
            response,
            tokensPerSecond,
          };
        } catch (error) {
          return {
            modelId,
            response: `Erro: ${error}`,
            tokensPerSecond: 0,
          };
        }
      })
    );

    return results;
  }

  /**
   * Recomenda modelo para tipo de tarefa
   */
  async recommendModel(taskType: string): Promise<string | null> {
    try {
      const models = await this.listModels();
      
      if (models.length === 0) {
        return null;
      }

      // Lógica simples de recomendação
      // Priorizar modelos maiores para tarefas complexas
      const complexTasks = ['code', 'reasoning', 'analysis'];
      
      if (complexTasks.includes(taskType)) {
        // Ordenar por parâmetros (maior primeiro)
        const sorted = models.sort((a, b) => {
          const aParams = parseInt(a.parameters || '0');
          const bParams = parseInt(b.parameters || '0');
          return bParams - aParams;
        });
        
        return sorted[0]?.id || null;
      }

      // Para tarefas simples, qualquer modelo serve
      return models[0]?.id || null;
    } catch (error) {
      console.error('Erro ao recomendar modelo:', error);
      return null;
    }
  }
}

export const lmstudioService = new LMStudioService();
