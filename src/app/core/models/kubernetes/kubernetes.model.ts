/**
 * Kubernetes deployment models
 */

export interface KubernetesGenerateRequest {
    project_path: string;
    service_name: string;
    replicas?: number;
    port?: number;
    environment?: { [key: string]: string };
    resources?: ResourceRequirements;
    ingress?: IngressConfig;
}

export interface ResourceRequirements {
    limits?: {
        cpu?: string;
        memory?: string;
    };
    requests?: {
        cpu?: string;
        memory?: string;
    };
}

export interface IngressConfig {
    enabled: boolean;
    host?: string;
    path?: string;
    tls?: boolean;
}

export interface KubernetesGenerateResponse {
    manifests: {
        deployment: string;
        service: string;
        ingress?: string;
        configmap?: string;
    };
    files_created: string[];
    success: boolean;
}

export interface DeploymentStatus {
    name: string;
    namespace: string;
    replicas: number;
    ready_replicas: number;
    available_replicas: number;
    status: 'Running' | 'Pending' | 'Failed' | 'Unknown';
    created_at: string;
    updated_at: string;
}

export interface PodInfo {
    name: string;
    namespace: string;
    status: string;
    node: string;
    ip: string;
    containers: ContainerInfo[];
    created_at: string;
}

export interface ContainerInfo {
    name: string;
    image: string;
    ready: boolean;
    restart_count: number;
    state: string;
}

export interface ServiceInfo {
    name: string;
    namespace: string;
    type: 'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName';
    cluster_ip: string;
    external_ip?: string;
    ports: ServicePort[];
}

export interface ServicePort {
    name?: string;
    port: number;
    target_port: number;
    protocol: string;
    node_port?: number;
}

export interface ClusterInfo {
    name: string;
    version: string;
    nodes: number;
    namespaces: string[];
    status: 'Healthy' | 'Degraded' | 'Unavailable';
}
