/**
 * LLM Inference request
 */
export interface InferenceRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  stream?: boolean;
  context?: string;
}

/**
 * LLM Inference response
 */
export interface InferenceResponse {
  response: string;
  model: string;
  tokens_used: number;
  finish_reason: 'stop' | 'length' | 'content_filter';
  execution_time: number;
  timestamp: string;
}

/**
 * Streaming inference chunk
 */
export interface InferenceChunk {
  delta: string;
  finish_reason?: 'stop' | 'length' | 'content_filter';
  tokens?: number;
}

/**
 * Model information
 */
export interface ModelInfo {
  name: string;
  provider: 'ollama' | 'openai' | 'anthropic' | 'custom';
  family: string;
  size: string;
  parameters: number;
  context_window: number;
  capabilities: string[];
  loaded: boolean;
  memory_usage?: number;
  performance?: ModelPerformance;
}

/**
 * Model performance metrics
 */
export interface ModelPerformance {
  average_tokens_per_second: number;
  average_latency: number;
  total_requests: number;
  success_rate: number;
}

/**
 * Available models list
 */
export interface ModelsListResponse {
  models: ModelInfo[];
  total: number;
  loaded_models: string[];
  available_memory: number;
}

/**
 * Model load request
 */
export interface ModelLoadRequest {
  model_name: string;
  preload?: boolean;
  offload_other?: boolean;
}

/**
 * Model load response
 */
export interface ModelLoadResponse {
  success: boolean;
  model_name: string;
  loaded: boolean;
  memory_used: number;
  load_time: number;
  message?: string;
}

/**
 * Model discovery request
 */
export interface ModelDiscoveryRequest {
  provider?: string;
  family?: string;
  min_parameters?: number;
  max_parameters?: number;
}

/**
 * Model discovery response
 */
export interface ModelDiscoveryResponse {
  discovered_models: ModelInfo[];
  total: number;
  providers: string[];
}

/**
 * Chat message
 */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

/**
 * Chat completion request
 */
export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

/**
 * Chat completion response
 */
export interface ChatCompletionResponse {
  message: ChatMessage;
  model: string;
  tokens_used: number;
  finish_reason: string;
}
