// Solution Entity Models

import { UUID, Timestamp, Metadata } from '../types/common.types';

export interface Solution {
  id: UUID;
  user_id: UUID;
  name: string;
  description?: string;
  project_ids: UUID[]; // List of project UUIDs
  created_at: Timestamp;
  updated_at: Timestamp;
  metadata?: Metadata;
}

export interface SolutionProject {
  solution_id: UUID;
  project_id: UUID;
  project_type: 'frontend' | 'backend' | 'mobile' | 'api' | 'database' | 'infrastructure';
  added_at: Timestamp;
  configuration?: SolutionProjectConfig;
}

export interface SolutionProjectConfig {
  dependencies: string[];
  environment_variables: { [key: string]: string };
  ports: number[];
  health_checks: HealthCheck[];
  scaling_config?: ScalingConfig;
}

export interface HealthCheck {
  type: 'http' | 'tcp' | 'command';
  endpoint?: string;
  port?: number;
  command?: string;
  interval_seconds: number;
  timeout_seconds: number;
  retries: number;
}

export interface ScalingConfig {
  min_instances: number;
  max_instances: number;
  cpu_threshold: number;
  memory_threshold: number;
  scaling_policy: 'cpu' | 'memory' | 'requests';
}

export interface SolutionDeployment {
  id: UUID;
  solution_id: UUID;
  version: string;
  environment: 'development' | 'staging' | 'production';
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rollback';
  deployed_at?: Timestamp;
  deployed_by: UUID;
  config: DeploymentConfig;
  logs?: string[];
}

export interface DeploymentConfig {
  target_platform: 'kubernetes' | 'docker-compose' | 'aws' | 'azure' | 'gcp';
  region?: string;
  resources: ResourceRequirements;
  networking: NetworkingConfig;
  secrets: { [key: string]: string };
}

export interface ResourceRequirements {
  cpu_cores: number;
  memory_gb: number;
  storage_gb: number;
  gpu_required?: boolean;
}

export interface NetworkingConfig {
  domain?: string;
  ssl_enabled: boolean;
  load_balancer: boolean;
  ingress_rules: IngressRule[];
}

export interface IngressRule {
  host: string;
  paths: string[];
  service_name: string;
  service_port: number;
}
