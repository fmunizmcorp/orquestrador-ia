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

interface ModelInfo {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

interface LoadedModelInfo extends ModelInfo {
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
