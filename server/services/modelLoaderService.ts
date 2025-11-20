/**
 * Model Loader Service
 * Serviço de gerenciamento inteligente de carregamento de modelos
 * Suporta modelos LM Studio (locais) e APIs externas (OpenAI, Anthropic, etc)
 */

import { db } from '../db/index.js';
import { aiModels, aiProviders } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import axios from 'axios';

const LM_STUDIO_URL = process.env.LM_STUDIO_URL || 'http://localhost:1234/v1';

export interface ModelStatus {
  id: number;
  modelId: string;
  name: string;
  isLMStudio: boolean;
  isAPIExternal: boolean;
  isLoaded: boolean;
  isLoading: boolean;
  isActive: boolean;
  provider: string;
  error?: string;
}

class ModelLoaderService {
  private loadingModels: Map<string, boolean> = new Map();
  private failedModels: Set<string> = new Set();

  /**
   * Verifica o status atual de um modelo
   */
  async checkModelStatus(modelId: number): Promise<ModelStatus> {
    try {
      // Buscar modelo do banco com join no provider
      const result = await db
        .select({
          model: aiModels,
          provider: aiProviders,
        })
        .from(aiModels)
        .leftJoin(aiProviders, eq(aiModels.providerId, aiProviders.id))
        .where(eq(aiModels.id, modelId))
        .limit(1);

      if (!result || result.length === 0 || !result[0].model) {
        throw new Error(`Modelo ID ${modelId} não encontrado no banco de dados`);
      }

      const model = result[0].model;
      const provider = result[0].provider;
      const providerName = provider?.name?.toLowerCase() || 'lmstudio';
      const isAPIExternal = ['openai', 'anthropic', 'google', 'genspark', 'mistral'].includes(providerName);
      const isLMStudio = providerName === 'lmstudio' || provider?.type === 'local';

      // APIs externas estão sempre disponíveis (não precisam ser "carregadas")
      if (isAPIExternal) {
        return {
          id: model.id,
          modelId: model.modelId,
          name: model.name,
          isLMStudio: false,
          isAPIExternal: true,
          isLoaded: true,
          isLoading: false,
          isActive: model.isActive ?? true,
          provider: providerName,
        };
      }

      // Para LM Studio, verificar se está realmente carregado
      const isLoading = this.loadingModels.get(model.modelId) || false;
      const hasFailed = this.failedModels.has(model.modelId);

      let isLoaded = false;
      let error: string | undefined;

      try {
        // Tentar verificar se o modelo está carregado no LM Studio
        const response = await axios.get(`${LM_STUDIO_URL}/models`, { timeout: 5000 });
        const loadedModels = response.data.data || [];
        isLoaded = loadedModels.some((m: any) => m.id === model.modelId);
      } catch (err: any) {
        if (err.code === 'ECONNREFUSED') {
          error = 'LM Studio não está rodando';
        } else {
          error = 'Erro ao verificar status do modelo';
        }
      }

      return {
        id: model.id,
        modelId: model.modelId,
        name: model.name,
        isLMStudio: true,
        isAPIExternal: false,
        isLoaded,
        isLoading,
        isActive: !hasFailed && (model.isActive ?? true),
        provider: providerName,
        error,
      };
    } catch (error: any) {
      console.error('❌ Erro ao verificar status do modelo:', error);
      throw error;
    }
  }

  /**
   * Carrega um modelo no LM Studio
   */
  async loadModel(modelId: number): Promise<{ success: boolean; message: string }> {
    try {
      const result = await db
        .select({
          model: aiModels,
          provider: aiProviders,
        })
        .from(aiModels)
        .leftJoin(aiProviders, eq(aiModels.providerId, aiProviders.id))
        .where(eq(aiModels.id, modelId))
        .limit(1);

      if (!result || result.length === 0 || !result[0].model) {
        return { success: false, message: 'Modelo não encontrado' };
      }

      const model = result[0].model;
      const provider = result[0].provider;
      const providerName = provider?.name?.toLowerCase() || 'lmstudio';
      const isAPIExternal = ['openai', 'anthropic', 'google', 'genspark', 'mistral'].includes(providerName);

      // APIs externas não precisam ser carregadas
      if (isAPIExternal) {
        return { success: true, message: `Modelo ${model.name} (API externa) está sempre disponível` };
      }

      // Verificar se já está carregado
      const status = await this.checkModelStatus(modelId);
      if (status.isLoaded) {
        return { success: true, message: `Modelo ${model.name} já está carregado` };
      }

      // Verificar se já está sendo carregado
      if (this.loadingModels.get(model.modelId)) {
        return { success: false, message: `Modelo ${model.name} já está sendo carregado. Aguarde...` };
      }

      console.log(`🔄 Iniciando carregamento do modelo: ${model.name} (${model.modelId})`);
      this.loadingModels.set(model.modelId, true);

      try {
        // Tentar fazer uma requisição de teste para forçar o carregamento
        const response = await axios.post(
          `${LM_STUDIO_URL}/chat/completions`,
          {
            model: model.modelId,
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 1,
          },
          { timeout: 10000 }
        );

        // Se chegou aqui, o modelo foi carregado com sucesso
        await db
          .update(aiModels)
          .set({ isLoaded: true, isActive: true })
          .where(eq(aiModels.id, modelId));

        this.loadingModels.delete(model.modelId);
        this.failedModels.delete(model.modelId);

        console.log(`✅ Modelo ${model.name} carregado com sucesso`);
        return { success: true, message: `Modelo ${model.name} carregado com sucesso` };
      } catch (err: any) {
        this.loadingModels.delete(model.modelId);
        this.failedModels.add(model.modelId);

        await db
          .update(aiModels)
          .set({ isLoaded: false, isActive: false })
          .where(eq(aiModels.id, modelId));

        let errorMessage = `Falha ao carregar modelo ${model.name}`;
        if (err.code === 'ECONNREFUSED') {
          errorMessage = 'LM Studio não está rodando. Inicie o LM Studio e tente novamente.';
        } else if (err.response?.status === 404) {
          errorMessage = `Modelo "${model.modelId}" não encontrado no LM Studio. Verifique se o modelo está instalado.`;
        }

        console.error(`❌ ${errorMessage}`);
        return { success: false, message: errorMessage };
      }
    } catch (error: any) {
      console.error('❌ Erro ao carregar modelo:', error);
      return { success: false, message: error.message || 'Erro desconhecido' };
    }
  }

  /**
   * Aguarda até que o modelo esteja completamente carregado
   */
  async waitForModelLoad(modelId: number, maxWaitMs: number = 300000): Promise<boolean> {
    const startTime = Date.now();
    const pollInterval = 2000;

    while (Date.now() - startTime < maxWaitMs) {
      try {
        const status = await this.checkModelStatus(modelId);
        
        if (status.isLoaded) {
          return true;
        }

        if (status.error || !status.isActive) {
          return false;
        }

        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.error('Erro ao aguardar carregamento:', error);
        return false;
      }
    }

    console.log(`⏱️ Timeout aguardando carregamento do modelo ${modelId}`);
    return false;
  }

  /**
   * Descarrega um modelo do LM Studio
   */
  async unloadModel(modelId: number): Promise<{ success: boolean; message: string }> {
    try {
      const [model] = await db
        .select()
        .from(aiModels)
        .where(eq(aiModels.id, modelId))
        .limit(1);

      if (!model) {
        return { success: false, message: 'Modelo não encontrado' };
      }

      await db
        .update(aiModels)
        .set({ isLoaded: false })
        .where(eq(aiModels.id, modelId));

      this.loadingModels.delete(model.modelId);

      return { success: true, message: `Modelo ${model.name} descarregado` };
    } catch (error: any) {
      console.error('❌ Erro ao descarregar modelo:', error);
      return { success: false, message: error.message || 'Erro desconhecido' };
    }
  }

  /**
   * Lista todos os modelos disponíveis com seus status
   */
  async listAvailableModels(): Promise<ModelStatus[]> {
    try {
      const models = await db
        .select()
        .from(aiModels)
        .where(eq(aiModels.isActive, true));

      const statusPromises = models.map(model => this.checkModelStatus(model.id));
      const statuses = await Promise.all(statusPromises);

      return statuses;
    } catch (error: any) {
      console.error('❌ Erro ao listar modelos:', error);
      return [];
    }
  }

  /**
   * Sugere um modelo alternativo quando um falha
   */
  async suggestAlternativeModel(failedModelId: number): Promise<ModelStatus | null> {
    try {
      const availableModels = await this.listAvailableModels();
      
      const alternatives = availableModels.filter(
        m => m.id !== failedModelId && 
             !this.failedModels.has(m.modelId) &&
             m.isActive
      );

      if (alternatives.length === 0) {
        return null;
      }

      const externalAPIs = alternatives.filter(m => m.isAPIExternal);
      if (externalAPIs.length > 0) {
        return externalAPIs[0];
      }

      const loadedLMStudio = alternatives.filter(m => m.isLMStudio && m.isLoaded);
      if (loadedLMStudio.length > 0) {
        return loadedLMStudio[0];
      }

      return alternatives[0];
    } catch (error: any) {
      console.error('❌ Erro ao sugerir modelo alternativo:', error);
      return null;
    }
  }

  /**
   * Reseta o cache de modelos que falharam
   */
  resetFailedModels(): void {
    this.failedModels.clear();
    console.log('🔄 Cache de modelos falhados foi resetado');
  }
}

export const modelLoaderService = new ModelLoaderService();
