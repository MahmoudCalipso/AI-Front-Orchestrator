import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
import {
  ProjectResponse,
  ProjectListResponse,
  ProjectCreateRequest,
  WorkflowRequest,
  WorkflowResponse
} from '../../models/project/project.model';

// Use strict types from models
type Project = ProjectResponse;

/**
 * Project Service
 * Handles project lifecycle, git sync, AI updates, and workflows
 * Refactored to match OpenAPI v1 endpoints
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseApiService {

  // ==================== Project Lifecycle ====================

  /**
   * List projects with optional filtering
   * GET /api/v1/projects
   */
  listProjects(
    params?: {
      user_id?: string;
      search?: string;
      status?: string;
      name?: string;
      framework?: string;
      language?: string;
      page?: number;
      page_size?: number;
      tenant_id?: string;
    }
  ): Observable<ProjectListResponse> {
    return this.get<BaseResponse<ProjectListResponse>>('projects', params).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get project details
   * GET /api/v1/projects/{project_id}
   */
  getProject(projectId: string): Observable<Project> {
    return this.get<BaseResponse<Project>>(`projects/${projectId}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Delete a project
   * DELETE /api/v1/projects/{project_id}
   */
  deleteProject(projectId: string): Observable<any> {
    return this.delete<BaseResponse<any>>(`projects/${projectId}`).pipe(
      map(res => res.data)
    );
  }

  // ==================== Project Operations ====================

  /**
   * Open a project (clone from Git and load in IDE)
   * POST /api/v1/projects/{project_id}/open
   */
  openProject(projectId: string, request?: any): Observable<any> {
    return this.post<BaseResponse<any>>(`projects/${projectId}/open`, request || {}).pipe(
      map(res => res.data)
    );
  }

  /**
   * Sync project with Git remote (pull)
   * POST /api/v1/projects/{project_id}/sync
   */
  syncProject(projectId: string): Observable<any> {
    return this.post<BaseResponse<any>>(`projects/${projectId}/sync`, {}).pipe(
      map(res => res.data)
    );
  }

  /**
   * Apply AI updates via chat prompt
   * POST /api/v1/projects/{project_id}/ai-update
   */
  aiUpdateProject(projectId: string, request: any): Observable<any> {
    return this.post<BaseResponse<any>>(`projects/${projectId}/ai-update`, request, {
      timeout: 120000 // 2 minutes for AI operations
    }).pipe(
      map(res => res.data)
    );
  }

  // ==================== Workflows ====================

  /**
   * Execute a complete project workflow
   * POST /api/v1/projects/{project_id}/workflow
   */
  executeWorkflow(projectId: string, request?: WorkflowRequest): Observable<WorkflowResponse> {
    return this.post<BaseResponse<WorkflowResponse>>(`projects/${projectId}/workflow`, request || {}).pipe(
      map(res => res.data)
    );
  }

  // ==================== Build & Run ====================

  /**
   * Build a project
   * POST /api/v1/projects/{project_id}/build
   */
  buildProject(projectId: string, request?: any): Observable<any> {
    return this.post<BaseResponse<any>>(`projects/${projectId}/build`, request || {}, {
      timeout: 300000 // 5 minutes for build
    }).pipe(
      map(res => res.data)
    );
  }

  /**
   * Run a project
   * POST /api/v1/projects/{project_id}/run
   */
  runProject(projectId: string, request?: any): Observable<any> {
    return this.post<BaseResponse<any>>(`projects/${projectId}/run`, request || {}).pipe(
      map(res => res.data)
    );
  }

  /**
   * Stop a running project
   * POST /api/v1/projects/{project_id}/stop
   */
  stopProject(projectId: string): Observable<any> {
    return this.post<BaseResponse<any>>(`projects/${projectId}/stop`, {}).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get project runtime logs
   * GET /api/v1/projects/{project_id}/logs
   */
  getProjectLogs(projectId: string, lines: number = 100): Observable<any> {
    return this.get<BaseResponse<any>>(`projects/${projectId}/logs`, { lines }).pipe(
      map(res => res.data)
    );
  }
}
