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
export declare class LMStudioClient {
    private baseUrl;
    private timeout;
    constructor(baseUrl?: string, timeout?: number);
    /**
     * Check if LM Studio server is available AND has models loaded
     */
    isAvailable(): Promise<boolean>;
    /**
     * Generate chat completion
     */
    chatCompletion(request: LMStudioRequest): Promise<string>;
    /**
     * Generate simple completion (for backward compatibility)
     * @param prompt - The user prompt
     * @param systemPrompt - Optional system prompt
     * @param modelId - Optional model ID to use (if not provided, will use first available model)
     */
    complete(prompt: string, systemPrompt?: string, modelId?: string): Promise<string>;
}
export declare const lmStudio: LMStudioClient;
export {};
