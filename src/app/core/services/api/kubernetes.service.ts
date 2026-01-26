import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    KubernetesGenerateRequest,
    KubernetesGenerateResponse,
    DeploymentStatus,
    PodInfo,
    ServiceInfo,
    ClusterInfo
} from '../../models/kubernetes/kubernetes.model';
import { ApiResponse } from '../../models/common/api-response.model';

/**
 * Kubernetes Service
 * Handles Kubernetes deployment and management operations
 */
@Injectable({
    providedIn: 'root'
})
export class KubernetesService extends BaseApiService {

    /**
     * Generate Kubernetes manifests for a project
     * POST /api/kubernetes/generate
     */
    generateManifests(request: KubernetesGenerateRequest): Observable<KubernetesGenerateResponse> {
        return this.post<KubernetesGenerateResponse>('/api/kubernetes/generate', request);
    }

    /**
     * Deploy to Kubernetes cluster
     * POST /api/kubernetes/deploy
     */
    deploy(projectPath: string, namespace?: string): Observable<ApiResponse> {
        return this.post<ApiResponse>('/api/kubernetes/deploy', {
            project_path: projectPath,
            namespace: namespace || 'default'
        });
    }

    /**
     * Get deployment status
     * GET /api/kubernetes/deployments/{namespace}/{name}
     */
    getDeploymentStatus(namespace: string, name: string): Observable<DeploymentStatus> {
        return this.get<DeploymentStatus>(`/api/kubernetes/deployments/${namespace}/${name}`);
    }

    /**
     * List all deployments in namespace
     * GET /api/kubernetes/deployments/{namespace}
     */
    listDeployments(namespace: string = 'default'): Observable<DeploymentStatus[]> {
        return this.get<DeploymentStatus[]>(`/api/kubernetes/deployments/${namespace}`);
    }

    /**
     * Get pod information
     * GET /api/kubernetes/pods/{namespace}/{name}
     */
    getPod(namespace: string, name: string): Observable<PodInfo> {
        return this.get<PodInfo>(`/api/kubernetes/pods/${namespace}/${name}`);
    }

    /**
     * List all pods in namespace
     * GET /api/kubernetes/pods/{namespace}
     */
    listPods(namespace: string = 'default'): Observable<PodInfo[]> {
        return this.get<PodInfo[]>(`/api/kubernetes/pods/${namespace}`);
    }

    /**
     * Get pod logs
     * GET /api/kubernetes/pods/{namespace}/{name}/logs
     */
    getPodLogs(namespace: string, name: string, container?: string): Observable<string> {
        const params = container ? { container } : {};
        return this.get<string>(`/api/kubernetes/pods/${namespace}/${name}/logs`, params);
    }

    /**
     * Get service information
     * GET /api/kubernetes/services/{namespace}/{name}
     */
    getService(namespace: string, name: string): Observable<ServiceInfo> {
        return this.get<ServiceInfo>(`/api/kubernetes/services/${namespace}/${name}`);
    }

    /**
     * List all services in namespace
     * GET /api/kubernetes/services/{namespace}
     */
    listServices(namespace: string = 'default'): Observable<ServiceInfo[]> {
        return this.get<ServiceInfo[]>(`/api/kubernetes/services/${namespace}`);
    }

    /**
     * Get cluster information
     * GET /api/kubernetes/cluster
     */
    getClusterInfo(): Observable<ClusterInfo> {
        return this.get<ClusterInfo>('/api/kubernetes/cluster');
    }

    /**
     * Delete deployment
     * DELETE /api/kubernetes/deployments/{namespace}/{name}
     */
    deleteDeployment(namespace: string, name: string): Observable<ApiResponse> {
        return this.delete<ApiResponse>(`/api/kubernetes/deployments/${namespace}/${name}`);
    }

    /**
     * Scale deployment
     * PATCH /api/kubernetes/deployments/{namespace}/{name}/scale
     */
    scaleDeployment(namespace: string, name: string, replicas: number): Observable<ApiResponse> {
        return this.patch<ApiResponse>(`/api/kubernetes/deployments/${namespace}/${name}/scale`, {
            replicas
        });
    }
    /**
     * Get all namespaces
     * GET /api/kubernetes/namespaces
     */
    getNamespaces(): Observable<string[]> {
        return this.get<string[]>('/api/kubernetes/namespaces');
    }

    /**
     * Get unified resources for a namespace
     */
    getResources(namespace: string): Observable<any[]> {
        return this.get<any[]>(`/api/kubernetes/resources/${namespace}`);
    }
}
