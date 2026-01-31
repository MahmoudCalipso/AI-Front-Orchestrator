import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    LifecycleExecuteRequest,
    LifecycleExecuteResponse,
    PipelineConfig
} from '../../models/lifecycle/lifecycle.model';
import { ApiResponse } from '../../models/common/api-response.model';

/**
 * Lifecycle Service
 * Handles lifecycle automation and CI/CD operations
 */
@Injectable({
    providedIn: 'root'
})
export class LifecycleService extends BaseApiService {

    /**
     * Execute lifecycle workflow
     * POST /api/v1/lifecycle/execute
     */
    executeWorkflow(request: LifecycleExecuteRequest): Observable<LifecycleExecuteResponse> {
        return this.post<LifecycleExecuteResponse>('lifecycle/execute', request, {
            timeout: 300000 // 5 minutes
        });
    }

    /**
     * Get execution status
     * GET /api/lifecycle/execution/{execution_id}
     */
    getExecutionStatus(executionId: string): Observable<LifecycleExecuteResponse> {
        return this.get<LifecycleExecuteResponse>(`/api/lifecycle/execution/${executionId}`);
    }

    /**
     * Cancel execution
     * POST /api/lifecycle/execution/{execution_id}/cancel
     */
    cancelExecution(executionId: string): Observable<ApiResponse> {
        return this.post<ApiResponse>(`/api/lifecycle/execution/${executionId}/cancel`, {});
    }

    /**
     * Get pipeline configuration
     * GET /api/lifecycle/pipeline/{project_path}
     */
    getPipelineConfig(projectPath: string): Observable<PipelineConfig> {
        return this.get<PipelineConfig>('/api/lifecycle/pipeline', { project_path: projectPath });
    }

    /**
     * Save pipeline configuration
     * POST /api/lifecycle/pipeline
     */
    savePipelineConfig(projectPath: string, config: PipelineConfig): Observable<ApiResponse> {
        return this.post<ApiResponse>('/api/lifecycle/pipeline', {
            project_path: projectPath,
            config
        });
    }

    /**
     * List executions for a project
     * GET /api/lifecycle/executions/{project_path}
     */
    listExecutions(projectPath: string, limit: number = 20): Observable<LifecycleExecuteResponse[]> {
        return this.get<LifecycleExecuteResponse[]>('/api/lifecycle/executions', {
            project_path: projectPath,
            limit
        });
    }
}
