/**
 * Lifecycle Models
 * All Lifecycle-related DTOs matching backend Python models
 */

// ==================== Lifecycle Request ====================
export interface LifecycleRequest {
  project_id: string;
  action: string;
  environment?: string;
  parameters?: Record<string, any>;
}

// ==================== Lifecycle Response ====================
export interface LifecycleResponseDTO {
  lifecycle_id: string;
  project_id: string;
  action: string;
  status: string;
  started_at: string;
  completed_at?: string;
  duration?: number;
  logs?: string[];
  error?: string;
  result?: Record<string, any>;
}

// ==================== Lifecycle List ====================
export interface LifecycleListResponseDTO {
  lifecycles: LifecycleResponseDTO[];
  total: number;
  page: number;
  page_size: number;
}

// ==================== Environment Config ====================
export interface EnvironmentConfig {
  name: string;
  type: string;
  variables: EnvironmentVariable[];
  services: ServiceConfig[];
}

// ==================== Environment Variable ====================
export interface EnvironmentVariable {
  name: string;
  value: string;
  is_secret: boolean;
  description?: string;
}

// ==================== Service Config ====================
export interface ServiceConfig {
  name: string;
  type: string;
  config: Record<string, any>;
  dependencies?: string[];
}

// ==================== Deployment Config ====================
export interface LifecycleDeploymentConfig {
  environment: string;
  strategy: string;
  replicas: number;
  resources?: ResourceConfig;
  health_check?: HealthCheckConfig;
}

// ==================== Resource Config ====================
export interface ResourceConfig {
  cpu?: string;
  memory?: string;
  storage?: string;
}

// ==================== Health Check Config ====================
export interface HealthCheckConfig {
  enabled: boolean;
  path?: string;
  interval?: number;
  timeout?: number;
  retries?: number;
}

// ==================== Lifecycle Action ====================
export enum LifecycleAction {
  INITIALIZE = 'initialize',
  BUILD = 'build',
  DEPLOY = 'deploy',
  START = 'start',
  STOP = 'stop',
  RESTART = 'restart',
  SCALE = 'scale',
  ROLLBACK = 'rollback',
  CLEANUP = 'cleanup'
}

// ==================== Lifecycle Status ====================
export enum LifecycleStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// ==================== Environment Type ====================
export enum EnvironmentType {
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
  TESTING = 'testing'
}

// ==================== Deployment Strategy ====================
export enum DeploymentStrategy {
  ROLLING = 'rolling',
  BLUE_GREEN = 'blue_green',
  CANARY = 'canary',
  RECREATE = 'recreate'
}

// ==================== Pipeline Config ====================
export interface PipelineConfig {
  project_id: string;
  stages: PipelineStage[];
  triggers?: PipelineTrigger[];
  variables?: Record<string, string>;
}

export interface PipelineStage {
  name: string;
  action: LifecycleAction | string;
  parameters?: Record<string, any>;
  ignore_errors?: boolean;
}

export interface PipelineTrigger {
  type: string;
  event: string;
  branch?: string;
}

// ==================== Compatibility Aliases ====================
export type LifecycleExecuteRequest = LifecycleRequest;
export type LifecycleExecuteResponse = LifecycleResponseDTO;
