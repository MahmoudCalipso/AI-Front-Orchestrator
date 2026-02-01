/**
 * Generation Models
 * All Generation-related DTOs matching backend Python models
 */

import { ArchitecturePattern } from '../backend/types/enums';

// ==================== Generation ====================
export interface DescriptionAnalysisResponseDTO {
  analysis: Record<string, any>;
  generated_config: Record<string, any>;
  summary: string;
  project_type?: string;
  estimated_complexity?: string;
  estimated_time?: string;
}

export type AnalysisResponse = DescriptionAnalysisResponseDTO;

export interface GenerationResponse {
  project_id: string;
  status: string;
  message?: string;
}

// ==================== Generation Request ====================
export interface GenerationRequest {
  project_name?: string;
  description?: string;
  project_type?: string;
  languages?: string[] | LanguageFrameworkSpec[];
  frontend?: FrontendConfig;
  template?: TemplateSource;
  database?: GenerationDatabaseConfig;
  entities?: EntityDefinition[];
  security?: SecurityConfig;
  architecture?: ArchitectureConfig;
  scalability?: ScalabilityConfig;
  integrations?: IntegrationConfig;
  deployment?: GenerationDeploymentConfig;
  stack_components?: StackComponents;
  features?: string[];
  technical_requirements?: string[];
  git?: GitActionConfig;
  requirements?: string;
  user_id?: string;
  kubernetes?: KubernetesConfig;
  target_language?: string;
  framework?: string;
  include_crud?: boolean;
  include_validation?: boolean;
  include_tests?: boolean;
}

// ==================== Entity Definition ====================
export interface EntityDefinition {
  name: string;
  table_name?: string;
  description?: string;
  fields: EntityField[];
  relationships?: Record<string, any>[];
  features?: string[];
}

export interface EntityField {
  name: string;
  type: string;
  length?: number;
  projected_name?: string;
  description?: string;
  nullable?: boolean;
  unique?: boolean;
  primary_key?: boolean;
  auto_increment?: boolean;
  foreign_key?: string;
  default_value?: any;
  validations?: ValidationRule[];
}

export interface ValidationRule {
  type: string;
  value?: any;
  message?: string;
  condition?: string;
}

// ==================== Configuration ====================
export interface FrontendConfig {
  framework: string;
  version: string;
  ssr?: boolean;
  typescript?: boolean;
}

export interface ArchitectureConfig {
  patterns?: string[];
  microservices?: boolean;
  api_first?: boolean;
  event_driven?: boolean;
  serverless?: boolean;
}

export interface ScalabilityConfig {
  requirements?: string[];
  enable_caching?: boolean;
  enable_load_balancing?: boolean;
  enable_cdn?: boolean;
  enable_auto_scaling?: boolean;
  enable_horizontal_scaling?: boolean;
}

export interface SecurityConfig {
  auth_provider?: string;
  enable_rbac?: boolean;
  enable_audit_logs?: boolean;
  enable_rate_limiting?: boolean;
  enable_cors?: boolean;
  enable_ssl?: boolean;
  scan_dependencies?: boolean;
}

export interface IntegrationConfig {
  required?: string[];
  payment_gateway?: boolean;
  email_service?: boolean;
  sms_service?: boolean;
  analytics?: boolean;
  erp?: boolean;
  crm?: boolean;
  logistics?: boolean;
  social_media?: boolean;
}

export interface GenerationDeploymentConfig {
  strategy?: string;
  generate_dockerfile?: boolean;
  generate_docker_compose?: boolean;
  generate_kubernetes?: boolean;
  generate_ci_cd?: boolean;
}

export interface StackComponents {
  cache?: string;
  message_queue?: string;
  search_engine?: string;
}

export interface TemplateSource {
  url?: string;
  git_repo?: string;
  local_path?: string;
  figma_file?: string;
}

export interface LanguageFrameworkSpec {
  name: string;
  framework: string;
  version: string;
}

export interface GenerationDatabaseConfig {
  type: string;
  connection_string?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database_name?: string;
  generate_from_schema?: boolean;
}

export interface GitActionConfig {
  provider?: string;
  repository_name?: string;
  repository_owner?: string;
  repository_url?: string;
  branch?: string;
  commit_message?: string;
  create_repo?: boolean;
  private?: boolean;
  credentials?: GitCredential;
}

export interface GitCredential {
  username?: string;
  token?: string;
  ssh_key?: string;
}

export interface KubernetesConfig {
  enabled?: boolean;
  environment?: string;
  namespace?: string;
  replicas?: number;
  generate_helm_chart?: boolean;
  ingress_domain?: string;
  monitoring_enabled?: boolean;
}



// ==================== Compatibility Aliases ====================
export type AnalysisRequest = GenerationRequest;
export type EntityGenerationRequest = GenerationRequest;
