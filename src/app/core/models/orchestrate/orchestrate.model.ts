/**
 * Orchestrate Models
 * All Orchestration-related DTOs matching backend Python models
 */

// ==================== Orchestration Request ====================
export interface OrchestrationRequest {
  project_id: string;
  task_type: string;
  context?: OrchestrationContext;
  parameters?: Record<string, any>;
  agent_selection?: AgentSelection;
}

// ==================== Orchestration Context ====================
export interface OrchestrationContext {
  files?: FileContext[];
  current_file?: string;
  selection?: SelectionContext;
  workspace_state?: Record<string, any>;
  user_preferences?: Record<string, any>;
}

// ==================== File Context ====================
export interface FileContext {
  path: string;
  content?: string;
  language?: string;
  is_modified?: boolean;
}

// ==================== Selection Context ====================
export interface SelectionContext {
  file_path: string;
  start_line: number;
  end_line: number;
  start_column?: number;
  end_column?: number;
  selected_text?: string;
}

// ==================== Agent Selection ====================
export interface AgentSelection {
  mode: string;
  preferred_agent?: string;
  fallback_agents?: string[];
  max_parallel_agents?: number;
}

// ==================== Orchestration Response ====================
export interface OrchestrationResponseDTO {
  orchestration_id: string;
  project_id: string;
  task_type: string;
  status: string;
  started_at: string;
  completed_at?: string;
  duration?: number;
  agent_results: AgentResult[];
  summary: OrchestrationSummary;
  error?: string;
}

// ==================== Agent Result ====================
export interface AgentResult {
  agent_id: string;
  agent_name: string;
  status: string;
  started_at: string;
  completed_at?: string;
  output?: string;
  artifacts?: Artifact[];
  error?: string;
}

// ==================== Artifact ====================
export interface Artifact {
  type: string;
  name: string;
  content?: string;
  file_path?: string;
  metadata?: Record<string, any>;
}

// ==================== Orchestration Summary ====================
export interface OrchestrationSummary {
  total_agents: number;
  successful_agents: number;
  failed_agents: number;
  total_artifacts: number;
  total_duration: number;
}

// ==================== Orchestration List ====================
export interface OrchestrationListResponseDTO {
  orchestrations: OrchestrationResponseDTO[];
  total: number;
  page: number;
  page_size: number;
}

// ==================== Orchestration Status ====================
export enum OrchestrationStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// ==================== Agent Selection Mode ====================
export enum AgentSelectionMode {
  AUTO = 'auto',
  MANUAL = 'manual',
  PARALLEL = 'parallel',
  SEQUENTIAL = 'sequential'
}

// ==================== Agent Result Status ====================
export enum AgentResultStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped'
}

// ==================== Artifact Type ====================
export enum ArtifactType {
  CODE = 'code',
  DOCUMENTATION = 'documentation',
  TEST = 'test',
  CONFIGURATION = 'configuration',
  ANALYSIS = 'analysis',
  DIAGNOSTIC = 'diagnostic'
}
