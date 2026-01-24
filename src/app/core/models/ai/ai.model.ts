/**
 * AI Model information
 */
export interface AIModel {
  name: string;
  provider: string;
  type: 'chat' | 'code' | 'embedding';
  context_length: number;
  loaded: boolean;
  memory_usage?: number;
  parameters?: Record<string, any>;
}

/**
 * AI Models list response
 */
export interface AIModelsResponse {
  models: AIModel[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Inference request
 */
export interface InferenceRequest {
  prompt: string;
  task_type: TaskType;
  model?: string;
  parameters?: InferenceParameters;
  context?: Record<string, any>;
}

export type TaskType =
  | 'code_generation'
  | 'code_completion'
  | 'code_explanation'
  | 'code_review'
  | 'code_fix'
  | 'code_refactor'
  | 'code_test'
  | 'code_optimize'
  | 'chat'
  | 'analysis';

/**
 * Inference parameters
 */
export interface InferenceParameters {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
  stop_sequences?: string[];
  stream?: boolean;
}

/**
 * Inference response
 */
export interface InferenceResponse {
  output: string;
  model: string;
  task_type: string;
  tokens_used: number;
  latency_ms: number;
  metadata?: Record<string, any>;
}

/**
 * Code fix request
 */
export interface FixCodeRequest {
  code: string;
  issue: string;
  language: string;
}

/**
 * Code analysis request
 */
export interface AnalyzeCodeRequest {
  code: string;
  analysis_type: AnalysisType;
  language: string;
}

export type AnalysisType = 'quality' | 'security' | 'performance' | 'complexity' | 'all';

/**
 * Test generation request
 */
export interface TestCodeRequest {
  code: string;
  language: string;
  test_framework?: string;
}

/**
 * Code optimization request
 */
export interface OptimizeCodeRequest {
  code: string;
  optimization_goal: OptimizationGoal;
  language: string;
}

export type OptimizationGoal = 'performance' | 'readability' | 'memory' | 'all';

/**
 * Code documentation request
 */
export interface DocumentCodeRequest {
  code: string;
  language: string;
  style?: 'jsdoc' | 'docstring' | 'markdown';
}

/**
 * Code review request
 */
export interface ReviewCodeRequest {
  code: string;
  language: string;
  focus_areas?: string[];
}

/**
 * Code explanation request
 */
export interface ExplainCodeRequest {
  code: string;
  language: string;
  detail_level?: 'brief' | 'detailed' | 'comprehensive';
}

/**
 * Code refactor request
 */
export interface RefactorCodeRequest {
  code: string;
  refactoring_goal: string;
  language: string;
}

/**
 * Standard response
 */
export interface StandardResponse {
  status: 'success' | 'failed';
  result?: any;
  message?: string;
}

/**
 * Swarm response (for generation/migration)
 */
export interface SwarmResponse {
  status: string;
  project_id?: string;
  files_generated?: number;
  agents_used?: string[];
  duration_ms?: number;
  result?: any;
}

/**
 * Project generation request
 */
export interface GenerateProjectRequest {
  project_name: string;
  description: string;
  language: string;
  framework?: string;
  database?: string;
  features?: string[];
  architecture?: string;
}

/**
 * Project migration request
 */
export interface MigrateProjectRequest {
  source_path: string;
  source_language: string;
  source_framework?: string;
  target_language: string;
  target_framework?: string;
  preserve_logic?: boolean;
}
