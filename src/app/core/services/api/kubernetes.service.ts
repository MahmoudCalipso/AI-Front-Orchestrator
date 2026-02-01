import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    KubernetesGenerateRequest,
    KubernetesGenerateResponse,
    DeploymentStatus,
    PodInfo,
    ServiceInfo,
    ClusterInfo
} from '../../models/kubernetes/kubernetes.model';
import { BaseResponse } from '../../models/index';

/**
 * Kubernetes Service
 * Handles Kubernetes manifest generation and cluster management
 */
@Injectable({
    providedIn: 'root'
})
export class KubernetesService extends BaseApiService {

    /**
     * Generate Kubernetes manifests for a project
     * POST /api/v1/kubernetes/generate
     */
    generateManifests(request: KubernetesGenerateRequest): Observable<KubernetesGenerateResponse> {
        return this.post<BaseResponse<KubernetesGenerateResponse>>('kubernetes/generate', request).pipe(
            map(res => res.data!)
        );
    }

    /**
     * Get cluster information
     * GET /api/v1/kubernetes/cluster
     */
    getClusterInfo(): Observable<ClusterInfo> {
        return this.get<BaseResponse<ClusterInfo>>('kubernetes/cluster').pipe(
            map(res => res.data!)
        );
    }

    /**
     * List deployments in a namespace
     * GET /api/v1/kubernetes/deployments/{namespace}
     */
    listDeployments(namespace: string): Observable<DeploymentStatus[]> {
        return this.get<BaseResponse<DeploymentStatus[]>>(`kubernetes/deployments/${namespace}`).pipe(
            map(res => res.data || [])
        );
    }

    /**
     * List pods in a namespace
     * GET /api/v1/kubernetes/pods/{namespace}
     */
    listPods(namespace: string): Observable<PodInfo[]> {
        return this.get<BaseResponse<PodInfo[]>>(`kubernetes/pods/${namespace}`).pipe(
            map(res => res.data || [])
        );
    }

    /**
     * List services in a namespace
     * GET /api/v1/kubernetes/services/{namespace}
     */
    listServices(namespace: string): Observable<ServiceInfo[]> {
        return this.get<BaseResponse<ServiceInfo[]>>(`kubernetes/services/${namespace}`).pipe(
            map(res => res.data || [])
        );
    }

    /**
     * Deploy application to Kubernetes
     * POST /api/v1/kubernetes/deploy
     */
    deploy(projectPath: string, namespace?: string): Observable<any> {
        return this.post<BaseResponse<any>>('kubernetes/deploy', {
            project_path: projectPath,
            namespace: namespace || 'default'
        }).pipe(map(res => res.data!));
    }

    /**
     * Scale a deployment
     * POST /api/v1/kubernetes/deployments/{namespace}/{name}/scale
     */
    scaleDeployment(namespace: string, name: string, replicas: number): Observable<any> {
        return this.post<BaseResponse<any>>(`kubernetes/deployments/${namespace}/${name}/scale`, {
            replicas
        }).pipe(map(res => res.data!));
    }

    /**
     * Delete a deployment
     * DELETE /api/v1/kubernetes/deployments/{namespace}/{name}
     */
    deleteDeployment(namespace: string, name: string): Observable<any> {
        return this.delete<BaseResponse<any>>(`kubernetes/deployments/${namespace}/${name}`).pipe(
            map(res => res.data!)
        );
    }

    /**
     * Get pod logs
     * GET /api/v1/kubernetes/pods/{namespace}/{name}/logs
     */
    getPodLogs(namespace: string, name: string): Observable<string> {
        return this.get<BaseResponse<string>>(`kubernetes/pods/${namespace}/${name}/logs`).pipe(
            map(res => res.data!)
        );
    }
}
