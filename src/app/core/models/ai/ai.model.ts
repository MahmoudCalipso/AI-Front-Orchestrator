/**
 * AI Models
 * All AI-related DTOs matching backend Python models
 */

import { ModelStatus } from '../common/enums';
import { OrchestrationRequest, OrchestrationResponseDTO as OrchestrationResponse } from '../orchestrate/orchestrate.dtos';
import { SecurityScanRequest } from '../security/security.model';

// ==================== Model Info ====================
export interface ModelInfoDTO {
  id: string; // Mapping name to id for trackBy
  name: string;
  family: string;
  type?: string; // Mapping family to type for UI
  size: string;
  context_length: number;
  capabilities: string[];
  specialization: string;
  status: ModelStatus;
  loaded?: boolean; // Derived from status
  quantization?: string[];
}

export interface ModelSummaryDTO {
  name: string;
  provider: string;
  is_local: boolean;
  size?: string;
}

export interface ModelListResponseDTO {
  models: ModelSummaryDTO[];
  total: number;
}

// ==================== Inference ====================
export interface InferenceParametersDTO {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  stop_sequences?: string[];
  stream?: boolean;
}

export interface InferenceRequest {
  prompt: string;
  task_type?: TaskType;
  model?: string;
  parameters?: InferenceParametersDTO;
  context?: Record<string, any>;
  system_prompt?: string;
}

export interface InferenceResponseDTO {
  request_id: string;
  model: string;
  runtime: string;
  output: string;
  tokens_used: number;
  processing_time: number;
  metadata?: Record<string, any>;
}

// Orchestration models moved to orchestrate.model.ts

// ==================== Swarm ====================
export interface SwarmResponseDTO {
  status: string;
  type: string;
  decomposition?: Record<string, any>[];
  worker_results?: Record<string, any>;
  migrated_files?: Record<string, string>;
  generated_files?: Record<string, string>;
  agent?: string;
}

// ==================== AI Operations ====================
export interface AnalyzeCodeRequest {
  code: string;
  language?: string;
  analysis_type?: string;
}

export interface FixCodeRequest {
  code: string;
  language?: string;
  issue: string;
}

export interface TestCodeRequest {
  code: string;
  language?: string;
  test_framework?: string;
}

export interface OptimizeCodeRequest {
  code: string;
  language?: string;
  optimization_goal?: string;
}

export interface RefactorCodeRequest {
  code: string;
  language?: string;
  refactoring_goal?: string;
}

export interface ExplainCodeRequest {
  code: string;
  language?: string;
}



// ==================== Compatibility Aliases ====================
export type ModelInfo = ModelInfoDTO;
export type SwarmResponse = SwarmResponseDTO;

export {
  OrchestrationRequest,
  OrchestrationResponse,
  SecurityScanRequest
};


