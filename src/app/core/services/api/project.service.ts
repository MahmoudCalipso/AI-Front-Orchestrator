import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  Project,
  ProjectListResponse,
  CreateProjectRequest,
  OpenProjectRequest,
  OpenProjectResponse,
  AIUpdateRequest,
  AIInlineUpdateRequest,
  WorkflowRequest,
  WorkflowResponse,
  WorkflowStatus,
  BuildRequest,
  RunRequest,
  ProjectLogsResponse
} from '../../models/project/project.model';
import { ApiResponse } from '../../models/common/api-response.model';

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
   * GET /user/{user_id}/projects
   */
  listUserProjects(
    userId: string,
    params?: { status?: string; page?: number; page_size?: number }
  ): Observable<ProjectListResponse> {
    return this.get<ProjectListResponse>(`/user/${userId}/projects`, params);
  }

  /**
   * Get project details
   * GET /user/{user_id}/projects/{project_id}
   */
  getUserProject(userId: string, projectId: string): Observable<Project> {
    return this.get<Project>(`/user/${userId}/projects/${projectId}`);
  }

  /**
   * Create a new project
   * POST /user/{user_id}/projects
   */
  createProject(userId: string, request: CreateProjectRequest): Observable<Project> {
    return this.post<Project>(`/user/${userId}/projects`, request);
  }

  /**
   * Delete a project
   * DELETE /user/{user_id}/projects/{project_id}
   */
  deleteProject(userId: string, projectId: string): Observable<ApiResponse> {
    return this.delete<ApiResponse>(`/user/${userId}/projects/${projectId}`);
  }

  // ==================== Project Operations ====================

  /**
   * Open a project (clone from Git and load in IDE)
   * POST /projects/{project_id}/open
   */
  openProject(projectId: string, request?: OpenProjectRequest): Observable<OpenProjectResponse> {
    return this.post<OpenProjectResponse>(`/projects/${projectId}/open`, request || {});
  }

  /**
   * Sync project with Git remote (pull)
   * POST /projects/{project_id}/sync
   */
  syncProject(projectId: string): Observable<{ status: string; commit: string }> {
    return this.post<{ status: string; commit: string }>(`/projects/${projectId}/sync`, {});
  }

  /**
   * Apply AI updates via chat prompt
   * POST /projects/{project_id}/ai-update
   */
  aiUpdateProject(projectId: string, request: AIUpdateRequest): Observable<ApiResponse> {
    return this.post<ApiResponse>(`/projects/${projectId}/ai-update`, request, {
      timeout: 120000 // 2 minutes for AI operations
    });
  }

  /**
   * Apply AI inline updates to a specific file
   * POST /projects/{project_id}/files/{file_path}/ai-update
   */
  aiInlineUpdate(
    projectId: string,
    filePath: string,
    request: AIInlineUpdateRequest
  ): Observable<ApiResponse> {
    return this.post<ApiResponse>(
      `/projects/${projectId}/files/${encodeURIComponent(filePath)}/ai-update`,
      request,
      { timeout: 60000 }
    );
  }

  // ==================== Workflows ====================

  /**
   * Execute a complete project workflow
   * POST /projects/{project_id}/workflow
   */
  executeWorkflow(projectId: string, request?: WorkflowRequest): Observable<WorkflowResponse> {
    return this.post<WorkflowResponse>(`/projects/${projectId}/workflow`, request || {});
  }

  /**
   * Get workflow status
   * GET /projects/{project_id}/workflow/{workflow_id}
   */
  getWorkflowStatus(projectId: string, workflowId: string): Observable<WorkflowStatus> {
    return this.get<WorkflowStatus>(`/projects/${projectId}/workflow/${workflowId}`);
  }

  // ==================== Build & Run ====================

  /**
   * Build a project
   * POST /projects/{project_id}/build
   */
  buildProject(projectId: string, request?: BuildRequest): Observable<ApiResponse> {
    return this.post<ApiResponse>(`/projects/${projectId}/build`, request || {}, {
      timeout: 300000 // 5 minutes for build
    });
  }

  /**
   * Run a project
   * POST /projects/{project_id}/run
   */
  runProject(projectId: string, request?: RunRequest): Observable<ApiResponse> {
    return this.post<ApiResponse>(`/projects/${projectId}/run`, request || {});
  }

  /**
   * Stop a running project
   * POST /projects/{project_id}/stop
   */
  stopProject(projectId: string): Observable<ApiResponse> {
    return this.post<ApiResponse>(`/projects/${projectId}/stop`, {});
  }

  /**
   * Get project runtime logs
   * GET /projects/{project_id}/logs
   */
  getProjectLogs(projectId: string, lines: number = 100): Observable<ProjectLogsResponse> {
    return this.get<ProjectLogsResponse>(`/projects/${projectId}/logs`, { lines });
  }
}
