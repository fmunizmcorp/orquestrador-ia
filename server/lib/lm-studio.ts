/**
 * LM Studio API Integration
 * 
 * Centralized module for calling LM Studio local server
 * Default URL: http://localhost:1234/v1/chat/completions
 */

interface LMStudioMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LMStudioRequest {
  model?: string;
  messages: LMStudioMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface LMStudioResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class LMStudioClient {
  private baseUrl: string;
  private timeout: number;
  
  constructor(baseUrl: string = 'http://localhost:1234', timeout: number = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }
  
  /**
   * Check if LM Studio server is available AND has models loaded
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`${this.baseUrl}/v1/models`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return false;
      }
      
      // Check if any models are actually loaded
      try {
        const data = await response.json();
        // If data has 'data' array, check if it has models
        if (data && Array.isArray(data.data)) {
          return data.data.length > 0;
        }
        // If response is ok but structure is different, assume available
        return true;
      } catch (parseError) {
        // If can't parse JSON, but response is ok, assume available
        return true;
      }
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Generate chat completion
   */
  async chatCompletion(request: LMStudioRequest): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: request.model || 'local-model',
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: request.max_tokens || 2000,
          stream: false,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        
        // Check for specific "No models loaded" error
        if (response.status === 404 && errorText.includes('No models loaded')) {
          throw new Error('LM Studio: No models loaded. Please load a model first using LM Studio UI or CLI command: lms load <model-name>');
        }
        
        throw new Error(`LM Studio API error: ${response.status} - ${errorText}`);
      }
      
      const data: LMStudioResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from LM Studio');
      }
      
      return data.choices[0].message.content;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('LM Studio request timeout');
      }
      throw error;
    }
  }
  
  /**
   * Generate simple completion (for backward compatibility)
   * @param prompt - The user prompt
   * @param systemPrompt - Optional system prompt
   * @param modelId - Optional model ID to use (if not provided, will use first available model)
   */
  async complete(prompt: string, systemPrompt?: string, modelId?: string): Promise<string> {
    const messages: LMStudioMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });
    
    // If no modelId provided, try to get first available model
    let actualModelId = modelId;
    if (!actualModelId) {
      try {
        const modelsResponse = await fetch(`${this.baseUrl}/v1/models`, {
          signal: AbortSignal.timeout(2000),
        });
        
        if (modelsResponse.ok) {
          const modelsData = await modelsResponse.json();
          if (modelsData && Array.isArray(modelsData.data) && modelsData.data.length > 0) {
            actualModelId = modelsData.data[0].id;
            console.log(`🔄 No modelId provided, using first available model: ${actualModelId}`);
          }
        }
      } catch (error) {
        console.warn('⚠️  Failed to fetch available models, using default model name');
      }
    }
    
    return this.chatCompletion({ messages, model: actualModelId });
  }
}

// Export singleton instance
export const lmStudio = new LMStudioClient();
