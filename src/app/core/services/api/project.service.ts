import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
import {
  ProjectResponse, // Updated name from Project
  ProjectListResponse,
  CreateProjectRequest, // Updated name from ProjectCreateRequest in local model alias? No, I defined ProjectCreateRequest in project.model.ts
  ProjectCreateRequest as RequestDTO, // avoiding conflict if any, but I defined it as ProjectCreateRequest
  ProjectProtectionRequest,
  WorkflowRequest,
  WorkflowResponse
} from '../../models/project/project.model';

// Alias for convenience if needed, but better to use imported names
type Project = ProjectResponse;

/**
 * Project Service
 * Handles project lifecycle, git sync, AI updates, and workflows
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseApiService {

  // ==================== User Projects ====================

  /**
   * List all projects for a user
   * GET /api/v1/projects (or user specfiic?)
   * Using existing path: /user/{userId}/projects
   * OpenAPI might have /api/v1/projects
   */
  listUserProjects(
    userId: string, // params reserved
    params?: { status?: string; page?: number; page_size?: number }
  ): Observable<ProjectListResponse> {
    // Assuming backend endpoint is /api/v1/projects based on openapi.json ProjectListResponseDTO context typically implying a listing
    // But keeping existing logic if not sure.
    // Actually, ProjectListResponseDTO implies generic list.
    // I'll stick to the existing path but use BaseResponse wrapper.
    return this.get<BaseResponse<ProjectListResponse>>(`user/${userId}/projects`, params).pipe(
      map(res => res.data)
    );
  }

  /**
   * Get project details
   * GET /api/v1/projects/{project_id}
   */
  getUserProject(userId: string, projectId: string): Observable<Project> {
    // Usually /projects/{id} is enough if IDs are UUIDs.
    // If previous was sub-resource, it might differ.
    // I'll use the path from previous code but sanitized for BaseApi
    return this.get<BaseResponse<Project>>(`user/${userId}/projects/${projectId}`).pipe(
      map(res => res.data)
    );
  }

  /**
   * Create a new project
   * POST /api/v1/projects
   */
  createProject(userId: string, request: RequestDTO): Observable<Project> {
    return this.post<BaseResponse<Project>>(`user/${userId}/projects`, request).pipe(
      map(res => res.data)
    );
  }

  /**
   * Delete a project
   * DELETE /api/v1/projects/{project_id}
   */
  deleteProject(userId: string, projectId: string): Observable<any> {
    return this.delete<BaseResponse<any>>(`user/${userId}/projects/${projectId}`).pipe(
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
  syncProject(projectId: string): Observable<{ status: string; commit: string }> {
    return this.post<BaseResponse<{ status: string; commit: string }>>(`projects/${projectId}/sync`, {}).pipe(
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

  /**
   * Apply AI inline updates to a specific file
   * POST /api/v1/projects/{project_id}/files/{file_path}/ai-update
   */
  aiInlineUpdate(
    projectId: string,
    filePath: string,
    request: any
  ): Observable<any> {
    return this.post<BaseResponse<any>>(
      `projects/${projectId}/files/${encodeURIComponent(filePath)}/ai-update`,
      request,
      { timeout: 60000 }
    ).pipe(
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

  /**
   * Get workflow status
   * GET /api/v1/projects/{project_id}/workflow/{workflow_id}
   */
  getWorkflowStatus(projectId: string, workflowId: string): Observable<any> {
    return this.get<BaseResponse<any>>(`projects/${projectId}/workflow/${workflowId}`).pipe(
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
