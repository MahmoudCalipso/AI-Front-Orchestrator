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

import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    KubernetesGenerateRequest,
    KubernetesGenerateResponse
} from '../../models/kubernetes/kubernetes.model';
import { BaseResponse } from '../../models/index';

/**
 * Kubernetes Service
 * Handles Kubernetes manifest generation.
 * Note: Direct deployment/management endpoints are not currently exposed in OpenAPI.
 * Use LifecycleService for E2E execution.
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
            map(res => res.data)
        );
    }

    // Legacy/Unverified methods commented out until backend implementation is confirmed via OpenAPI
    /*
    deploy(projectPath: string, namespace?: string): Observable<any> {
        return this.post<BaseResponse<any>>('api/kubernetes/deploy', {
            project_path: projectPath,
            namespace: namespace || 'default'
        }).pipe(map(res => res.data));
    }

    getDeploymentStatus(namespace: string, name: string): Observable<any> {
        return this.get<BaseResponse<any>>(`api/kubernetes/deployments/${namespace}/${name}`).pipe(map(res => res.data));
    }
    
    // ... other cluster management methods not in OpenAPI
    */
}
