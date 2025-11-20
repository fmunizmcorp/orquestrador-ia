/**
 * External API Service
 * Serviço unificado para gerenciar chamadas a APIs externas de IA
 */

import axios from 'axios';
import { db } from '../db/index.js';
import { aiProviders } from '../db/schema.js';
import { eq } from 'drizzle-orm';

interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

class ExternalAPIService {
  /**
   * Busca API key do banco de dados
   */
  private async getAPIKey(provider: string): Promise<string | null> {
    try {
      const [key] = await db
        .select()
        .from(aiProviders)
        .where(eq(aiProviders.name, provider))
        .limit(1);

      return key?.apiKey || null;
    } catch (error) {
      console.error(`Erro ao buscar API key para ${provider}:`, error);
      return null;
    }
  }

  /**
   * OpenAI (ChatGPT, GPT-4)
   */
  async openaiCompletion(
    model: string,
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<string> {
    const apiKey = await this.getAPIKey('openai');
    if (!apiKey) {
      throw new Error('API key da OpenAI não configurada');
    }

    try {
      const messages: any[] = [];
      if (options.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      return response.data.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('Erro ao chamar OpenAI:', error.response?.data || error.message);
      throw new Error(`Erro na API OpenAI: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Anthropic (Claude)
   */
  async anthropicCompletion(
    model: string,
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<string> {
    const apiKey = await this.getAPIKey('anthropic');
    if (!apiKey) {
      throw new Error('API key da Anthropic não configurada');
    }

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model,
          max_tokens: options.maxTokens || 2000,
          messages: [{ role: 'user', content: prompt }],
          ...(options.systemPrompt && { system: options.systemPrompt }),
        },
        {
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      return response.data.content[0]?.text || '';
    } catch (error: any) {
      console.error('Erro ao chamar Anthropic:', error.response?.data || error.message);
      throw new Error(`Erro na API Anthropic: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Google (Gemini)
   */
  async googleCompletion(
    model: string,
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<string> {
    const apiKey = await this.getAPIKey('google');
    if (!apiKey) {
      throw new Error('API key do Google não configurada');
    }

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2000,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 60000,
        }
      );

      return response.data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error: any) {
      console.error('Erro ao chamar Google:', error.response?.data || error.message);
      throw new Error(`Erro na API Google: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Genspark
   */
  async gensparkCompletion(
    model: string,
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<string> {
    const apiKey = await this.getAPIKey('genspark');
    if (!apiKey) {
      throw new Error('API key da Genspark não configurada');
    }

    try {
      const response = await axios.post(
        'https://api.genspark.ai/v1/completions',
        {
          model,
          prompt,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      return response.data.choices[0]?.text || '';
    } catch (error: any) {
      console.error('Erro ao chamar Genspark:', error.response?.data || error.message);
      throw new Error(`Erro na API Genspark: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Mistral
   */
  async mistralCompletion(
    model: string,
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<string> {
    const apiKey = await this.getAPIKey('mistral');
    if (!apiKey) {
      throw new Error('API key da Mistral não configurada');
    }

    try {
      const messages: any[] = [];
      if (options.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const response = await axios.post(
        'https://api.mistral.ai/v1/chat/completions',
        {
          model,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      return response.data.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('Erro ao chamar Mistral:', error.response?.data || error.message);
      throw new Error(`Erro na API Mistral: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Método unificado que redireciona para o provider correto
   */
  async generateCompletion(
    provider: string,
    model: string,
    prompt: string,
    options: CompletionOptions = {}
  ): Promise<string> {
    switch (provider) {
      case 'openai':
        return this.openaiCompletion(model, prompt, options);
      case 'anthropic':
        return this.anthropicCompletion(model, prompt, options);
      case 'google':
        return this.googleCompletion(model, prompt, options);
      case 'genspark':
        return this.gensparkCompletion(model, prompt, options);
      case 'mistral':
        return this.mistralCompletion(model, prompt, options);
      default:
        throw new Error(`Provider não suportado: ${provider}`);
    }
  }
}

export const externalAPIService = new ExternalAPIService();
