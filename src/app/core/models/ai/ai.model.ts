/**
 * AI Models matching OpenAPI definitions
 */

import { ProjectCreateRequest, ProjectResponse } from '../project/project.model';

/**
 * Task type enumeration
 */
export type TaskType =
  | 'code_generation'
  | 'code_review'
  | 'reasoning'
  | 'quick_query'
  | 'creative_writing'
  | 'data_analysis'
  | 'documentation'
  | 'chat'
  | 'embedding';

/**
 * Model capabilities
 */
export interface ModelInfo {
  name: string;
  family: string;
  size: string;
  context_length: number;
  capabilities: string[];
  specialization: string;
  status: 'available' | 'loading' | 'loaded' | 'unloading' | 'error' | 'unavailable';
  quantization?: string[];
}

/**
 * Orchestration execution mode
 */
export type ExecutionMode = 'sequential' | 'parallel' | 'hierarchical';

/**
 * Agent selection mode
 */
export type AgentSelectionMode = 'auto' | 'manual';

/**
 * Orchestration Request
 */
export interface OrchestrationRequest {
  prompt: string;
  context?: OrchestrationContext;
  agent_selection?: AgentSelectionMode;
  specific_agents?: string[];
  execution_mode?: ExecutionMode;
  stream?: boolean;
  max_iterations?: number;
}

/**
 * Orchestration Context
 */
export interface OrchestrationContext {
  code?: string;
  files?: FileContext[];
  conversation_history?: MessageDTO[];
  external_context?: Record<string, any>;
}

/**
 * File Context
 */
export interface FileContext {
  path: string;
  content: string;
  language?: string;
}

/**
 * Message DTO from conversation history
 */
export interface MessageDTO {
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp?: string;
}

/**
 * Orchestration Response DTO
 */
export interface OrchestrationResponse {
  execution_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  message: string;
  result_url: string;
  websocket_url?: string;
  estimated_duration_ms?: number;
  timestamp: string;
}

/**
 * Swarm Response DTO
 */
export interface SwarmResponse {
  status: string;
  type: string;
  decomposition?: any[]; // Detailed step breakdown
  worker_results?: Record<string, any>;
  migrated_files?: Record<string, string>;
  generated_files?: Record<string, string>;
  agent?: string;
}

/**
 * Optimize Code Request
 */
export interface OptimizeCodeRequest {
  code: string;
  language?: string;
  optimization_goal?: 'performance' | 'memory_usage' | 'readability';
}

/**
 * Refactor Code Request
 */
export interface RefactorCodeRequest {
  code: string;
  language?: string;
  refactoring_goal: string;
}

/**
 * Test Code Request
 */
export interface TestCodeRequest {
  code: string;
  language?: string;
  test_framework?: string;
}

/**
 * Update Agent Request
 */
export interface UpdateAgentRequest {
  display_name?: string;
  description?: string;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
  tools?: string[];
  metadata?: Record<string, any>;
}

/**
 * Security Scan Request
 */
export interface SecurityScanRequest {
  project_path: string;
  language?: string;
  type?: 'all' | 'sast' | 'dast' | 'dependencies';
}

// Re-export specific types if needed by consumers of ai.model specifically, or they can import from project
export type { ProjectCreateRequest, ProjectResponse };

/**
 * Code operation request types (for backward compatibility)
 */
export interface FixCodeRequest {
  code: string;
  language: string;
  issue?: string;
}

export interface AnalyzeCodeRequest {
  code: string;
  language: string;
  analysis_type?: 'security' | 'performance' | 'quality' | 'all';
}
