/**
 * Language configuration
 */
export interface Language {
  name: string;
  framework?: string;
  version?: string;
  features?: string[];
}

/**
 * Database configuration
 */
export interface DatabaseConfig {
  type: 'postgresql' | 'mysql' | 'mongodb' | 'redis' | 'elasticsearch' | 'cassandra';
  version?: string;
  host?: string;
  port?: number;
  enableBackup?: boolean;
  replication?: boolean;
}

/**
 * Frontend configuration
 */
export interface FrontendConfig {
  framework: 'react' | 'nextjs' | 'vue' | 'angular' | 'svelte';
  version?: string;
  typescript?: boolean;
  ssr?: boolean;
  styling?: 'css' | 'scss' | 'tailwind' | 'styled-project-generation';
  ui_library?: string;
}

/**
 * Architecture patterns
 */
export interface ArchitectureConfig {
  patterns: ('microservices' | 'monolithic' | 'api-first' | 'event-driven' | 'serverless')[];
  microservices?: boolean;
  api_gateway?: boolean;
  message_queue?: string;
  service_mesh?: boolean;
}

/**
 * Security configuration
 */
export interface SecurityConfig {
  enable_authentication?: boolean;
  enable_authorization?: boolean;
  auth_provider?: 'jwt' | 'oauth2' | 'saml' | 'custom';
  enable_rate_limiting?: boolean;
  enable_encryption?: boolean;
  pci_compliance?: boolean;
  gdpr_compliance?: boolean;
  hipaa_compliance?: boolean;
}

/**
 * Scalability configuration
 */
export interface ScalabilityConfig {
  enable_caching?: boolean;
  cache_provider?: 'redis' | 'memcached' | 'in-memory';
  enable_load_balancing?: boolean;
  load_balancer_type?: 'nginx' | 'haproxy' | 'aws-elb';
  enable_cdn?: boolean;
  cdn_provider?: 'cloudflare' | 'aws-cloudfront' | 'fastly';
  auto_scaling?: boolean;
  horizontal_scaling?: boolean;
}

/**
 * Integrations configuration
 */
export interface IntegrationsConfig {
  payment_gateway?: boolean;
  payment_provider?: 'stripe' | 'paypal' | 'square';
  email_service?: boolean;
  email_provider?: 'sendgrid' | 'mailgun' | 'ses';
  sms_service?: boolean;
  analytics?: boolean;
  monitoring?: boolean;
  logging?: boolean;
  erp?: boolean;
  crm?: boolean;
}

/**
 * Deployment configuration
 */
export interface DeploymentConfig {
  strategy: 'docker' | 'kubernetes' | 'serverless' | 'vm';
  cloud_provider?: 'aws' | 'azure' | 'gcp' | 'on-premise';
  generate_ci_cd?: boolean;
  ci_cd_platform?: 'github-actions' | 'gitlab-ci' | 'jenkins' | 'circleci';
  container_registry?: string;
  orchestration?: string;
}

/**
 * Project generation request
 */
export interface GenerationRequest {
  project_name: string;
  description: string;
  languages?: Language[];
  database?: DatabaseConfig;
  frontend?: FrontendConfig;
  architecture?: ArchitectureConfig;
  security?: SecurityConfig;
  scalability?: ScalabilityConfig;
  integrations?: IntegrationsConfig;
  deployment?: DeploymentConfig;
  custom_requirements?: string[];
}

/**
 * Project generation response
 */
export interface GenerationResponse {
  project_id: string;
  project_name: string;
  status: 'success' | 'failed' | 'partial';
  files: GeneratedFile[];
  structure: ProjectStructure;
  deployment_files?: string[];
  documentation?: string;
  warnings?: string[];
  errors?: string[];
  execution_time: number;
  timestamp: string;
}

/**
 * Generated file
 */
export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  size: number;
  type: 'source' | 'config' | 'test' | 'documentation';
}

/**
 * Project structure
 */
export interface ProjectStructure {
  root: string;
  directories: string[];
  files: string[];
  tree: any;
}

/**
 * Description analysis request
 */
export interface AnalysisRequest {
  description: string;
  context?: string;
  requirements?: string[];
}

/**
 * Description analysis response
 */
export interface AnalysisResponse {
  project_type: string;
  languages: Language[];
  database: DatabaseConfig;
  frontend?: FrontendConfig;
  architecture: ArchitectureConfig;
  security: SecurityConfig;
  scalability: ScalabilityConfig;
  integrations: IntegrationsConfig;
  deployment: DeploymentConfig;
  detected_features: string[];
  recommendations: string[];
  estimated_complexity: 'low' | 'medium' | 'high' | 'very-high';
  estimated_time: string;
  confidence: number;
}

/**
 * Entity generation request
 */
export interface EntityGenerationRequest {
  entities: EntityDefinition[];
  project_name: string;
  target_language: string;
  framework?: string;
  include_crud?: boolean;
  include_validation?: boolean;
  include_tests?: boolean;
}

/**
 * Entity definition
 */
export interface EntityDefinition {
  name: string;
  fields: EntityField[];
  relationships?: EntityRelationship[];
  validations?: any;
}

/**
 * Entity field
 */
export interface EntityField {
  name: string;
  type: string;
  required?: boolean;
  unique?: boolean;
  default?: any;
  validation?: any;
}

/**
 * Entity relationship
 */
export interface EntityRelationship {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  target: string;
  foreignKey?: string;
}
