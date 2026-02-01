/**
 * Kubernetes Models
 * All Kubernetes-related DTOs matching backend Python models
 */

// ==================== Kubernetes Config ====================
export interface KubernetesConfigDTO {
  project_id: string;
  enabled: boolean;
  namespace?: string;
  replicas?: number;
  generate_helm_chart?: boolean;
  ingress_domain?: string;
  monitoring_enabled?: boolean;
  resources?: KubernetesResources;
  environment?: string;
}

// ==================== Kubernetes Resources ====================
export interface KubernetesResources {
  requests?: ResourceLimits;
  limits?: ResourceLimits;
}

// ==================== Resource Limits ====================
export interface ResourceLimits {
  cpu?: string;
  memory?: string;
}

// ==================== Kubernetes Deployment ====================
export interface KubernetesDeploymentDTO {
  id: string;
  project_id: string;
  name: string;
  namespace: string;
  status: string;
  replicas: number;
  available_replicas: number;
  created_at: string;
  updated_at: string;
}

// ==================== Kubernetes Service ====================
export interface KubernetesServiceDTO {
  id: string;
  project_id: string;
  name: string;
  namespace: string;
  type: string;
  cluster_ip?: string;
  external_ip?: string;
  ports: ServicePort[];
  created_at: string;
}

// ==================== Service Port ====================
export interface ServicePort {
  name?: string;
  port: number;
  target_port: number;
  protocol: string;
}

// ==================== Kubernetes Pod ====================
export interface KubernetesPodDTO {
  id: string;
  project_id: string;
  name: string;
  namespace: string;
  status: string;
  phase: string;
  node_name?: string;
  pod_ip?: string;
  created_at: string;
  started_at?: string;
}

// ==================== Kubernetes Ingress ====================
export interface KubernetesIngressDTO {
  id: string;
  project_id: string;
  name: string;
  namespace: string;
  host: string;
  paths: IngressPath[];
  created_at: string;
}

// ==================== Ingress Path ====================
export interface IngressPath {
  path: string;
  path_type: string;
  service_name: string;
  service_port: number;
}

// ==================== Kubernetes Status ====================
export enum KubernetesStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  UNKNOWN = 'unknown'
}

// ==================== Pod Phase ====================
export enum PodPhase {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  UNKNOWN = 'unknown'
}

// ==================== Service Type ====================
export enum ServiceType {
  CLUSTER_IP = 'ClusterIP',
  NODE_PORT = 'NodePort',
  LOAD_BALANCER = 'LoadBalancer',
  EXTERNAL_NAME = 'ExternalName'
}
// ==================== Compatibility Aliases ====================
export type DeploymentStatus = KubernetesDeploymentDTO;
export type PodInfo = KubernetesPodDTO;
export type ServiceInfo = KubernetesServiceDTO;

export interface ClusterInfo {
  version: string;
  nodes: number;
  namespaces: string[];
  status: string;
  capacity?: Record<string, string>;
  allocatable?: Record<string, string>;
}

export interface KubernetesGenerateRequest {
  project_id?: string;
  project_path?: string;
  options?: Record<string, any>;
  service_name?: string;
  replicas?: number;
  port?: number;
}

export interface KubernetesGenerateResponse {
  manifests: Record<string, string>;
  helm_chart?: string;
}
