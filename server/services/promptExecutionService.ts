/**
 * Prompt Execution Service
 * Executa prompts salvos contra modelos de IA
 */

import { db } from '../db/index.js';
import { prompts, aiModels } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { withErrorHandling } from '../middleware/errorHandler.js';
import { lmstudioService } from './lmstudioService.js';

export interface ExecutePromptParams {
  promptId: number;
  modelId?: number;
  variables?: Record<string, any>;
  temperature?: number;
  maxTokens?: number;
}

export interface ExecutionResult {
  promptId?: number;
  modelId: number;
  input: string;
  output: string;
  executionTime: number;
}

export interface ExecuteDirectParams {
  content: string;
  modelId?: number;
  temperature?: number;
  maxTokens?: number;
}

class PromptExecutionService {
  /**
   * Substituir variáveis no prompt
   */
  private replaceVariables(content: string, variables: Record<string, any>): string {
    let result = content;
    
    for (const [key, value] of Object.entries(variables)) {
      // Suporta {{variable}} e {variable}
      const regex1 = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      const regex2 = new RegExp(`\\{${key}\\}`, 'g');
      
      result = result.replace(regex1, String(value));
      result = result.replace(regex2, String(value));
    }
    
    return result;
  }

  /**
   * Executar prompt salvo
   */
  async executePrompt(params: ExecutePromptParams): Promise<ExecutionResult & { promptId: number }> {
    return withErrorHandling(async () => {
      const startTime = Date.now();

      // 1. Buscar prompt
      const [prompt] = await db.select()
        .from(prompts)
        .where(eq(prompts.id, params.promptId))
        .limit(1);

      if (!prompt) {
        throw new Error('Prompt não encontrado');
      }

      // 2. Incrementar useCount
      await db.update(prompts)
        .set({ useCount: (prompt.useCount || 0) + 1 })
        .where(eq(prompts.id, params.promptId));

      // 3. Substituir variáveis
      const variables = {
        ...(prompt.variables as Record<string, any> || {}),
        ...(params.variables || {}),
      };

      const processedContent = this.replaceVariables(prompt.content, variables);

      // 4. Determinar modelo
      let modelId = params.modelId;
      if (!modelId) {
        // Buscar modelo padrão ativo
        const [defaultModel] = await db.select()
          .from(aiModels)
          .where(eq(aiModels.isActive, true))
          .limit(1);

        if (!defaultModel) {
          throw new Error('Nenhum modelo ativo encontrado');
        }

        modelId = defaultModel.id;
      }

      // 5. Buscar informações do modelo
      const [model] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.id, modelId))
        .limit(1);

      if (!model) {
        throw new Error('Modelo não encontrado');
      }

      console.log(`🚀 Executando prompt "${prompt.title}" com modelo ${model.name}`);
      console.log(`📝 Content: ${processedContent.substring(0, 100)}...`);

      // 6. Executar contra IA
      let output: string;

      try {
        output = await lmstudioService.generateCompletion(
          model.modelId, // LM Studio model identifier
          processedContent,
          {
            temperature: params.temperature || 0.7,
            maxTokens: params.maxTokens || 2000,
          }
        );

        console.log(`✅ Resposta recebida: ${output.substring(0, 100)}...`);
      } catch (error: any) {
        console.error('❌ Erro ao executar IA:', error);
        throw new Error(`Erro ao executar modelo: ${error.message}`);
      }

      const executionTime = Date.now() - startTime;

      // TODO: Criar tabela promptExecutions para histórico
      // Por enquanto apenas retornamos o resultado

      return {
        promptId: params.promptId,
        modelId,
        input: processedContent,
        output,
        executionTime,
      };
    }, { name: 'executePrompt' });
  }

  /**
   * Executar prompt direto (sem salvar)
   */
  async executeDirect(params: ExecuteDirectParams): Promise<ExecutionResult> {
    return withErrorHandling(async () => {
      const startTime = Date.now();

      // 1. Determinar modelo
      let modelId = params.modelId;
      if (!modelId) {
        const [defaultModel] = await db.select()
          .from(aiModels)
          .where(eq(aiModels.isActive, true))
          .limit(1);

        if (!defaultModel) {
          throw new Error('Nenhum modelo ativo encontrado');
        }

        modelId = defaultModel.id;
      }

      // 2. Buscar modelo
      const [model] = await db.select()
        .from(aiModels)
        .where(eq(aiModels.id, modelId))
        .limit(1);

      if (!model) {
        throw new Error('Modelo não encontrado');
      }

      console.log(`🚀 Executando prompt direto com modelo ${model.name}`);

      // 3. Executar
      let output: string;

      try {
        output = await lmstudioService.generateCompletion(
          model.modelId,
          params.content,
          {
            temperature: params.temperature || 0.7,
            maxTokens: params.maxTokens || 2000,
          }
        );
      } catch (error: any) {
        throw new Error(`Erro ao executar modelo: ${error.message}`);
      }

      const executionTime = Date.now() - startTime;

      return {
        modelId,
        input: params.content,
        output,
        executionTime,
      };
    }, { name: 'executeDirect' });
  }

  /**
   * Executar prompt com múltiplos modelos (comparação)
   */
  async executeMultiple(
    promptId: number,
    modelIds: number[],
    variables?: Record<string, any>
  ): Promise<Array<{
    modelId: number;
    modelName: string;
    output: string;
    executionTime: number;
  }>> {
    return withErrorHandling(async () => {
      // Buscar prompt
      const [prompt] = await db.select()
        .from(prompts)
        .where(eq(prompts.id, promptId))
        .limit(1);

      if (!prompt) {
        throw new Error('Prompt não encontrado');
      }

      // Substituir variáveis
      const vars = { ...(prompt.variables as Record<string, any> || {}), ...(variables || {}) };
      const processedContent = this.replaceVariables(prompt.content, vars);

      // Executar em paralelo
      const results = await Promise.all(
        modelIds.map(async (modelId) => {
          try {
            const result = await this.executePrompt({
              promptId,
              modelId,
              variables,
            });

            const [model] = await db.select()
              .from(aiModels)
              .where(eq(aiModels.id, modelId))
              .limit(1);

            return {
              modelId,
              modelName: model?.name || 'Unknown',
              output: result.output,
              executionTime: result.executionTime,
            };
          } catch (error: any) {
            return {
              modelId,
              modelName: 'Error',
              output: `Erro: ${error.message}`,
              executionTime: 0,
            };
          }
        })
      );

      return results;
    }, { name: 'executeMultiple' });
  }

  /**
   * Testar prompt (execução de teste sem salvar log)
   */
  async testPrompt(
    content: string,
    variables?: Record<string, any>,
    modelId?: number
  ): Promise<{
    input: string;
    output: string;
    executionTime: number;
  }> {
    return withErrorHandling(async () => {
      const startTime = Date.now();

      // Substituir variáveis
      const processedContent = variables 
        ? this.replaceVariables(content, variables)
        : content;

      // Executar
      const result = await this.executeDirect({
        content: processedContent,
        modelId,
      });

      return {
        input: processedContent,
        output: result.output,
        executionTime: Date.now() - startTime,
      };
    }, { name: 'testPrompt' });
  }
}

export const promptExecutionService = new PromptExecutionService();
