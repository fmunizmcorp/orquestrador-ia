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
   * Check if LM Studio server is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      
      const response = await fetch(`${this.baseUrl}/v1/models`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
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
   */
  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: LMStudioMessage[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });
    
    return this.chatCompletion({ messages });
  }
}

// Export singleton instance
export const lmStudio = new LMStudioClient();
