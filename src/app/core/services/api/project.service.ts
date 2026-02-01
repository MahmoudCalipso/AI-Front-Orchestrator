import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
import {
  ProjectUpdateRequest,
  ProjectSearchRequest,
  ProjectAnalyzeRequest,
  ProjectAddFeatureRequest
} from '../../models/project/project.requests';
import { ProjectCreateRequest, ProjectResponse as ProjectModel } from '../../models/project/project.model';
import {
  ProjectResponseDTO,
  ProjectResponseBackend,
  ProjectListResponseDTO as ProjectListResponse
} from '../../models/project/project.responses';
import {
  OrchestrationRequest as WorkflowRequest,
  OrchestrationResponseDTO as WorkflowResponse
} from '../../models/orchestrate/orchestrate.dtos';

// Use strict types from models
type Project = ProjectResponseDTO;
type ProjectResponse = ProjectResponseBackend;

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
   * Create a new project
   * POST /api/v1/projects
   */
  createProject(request: ProjectCreateRequest): Observable<ProjectResponse> {
    return this.post<BaseResponse<ProjectResponse>>('projects', request).pipe(
      map(res => res.data!)
    );
  }

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
      map(res => res.data || { projects: [], total: 0, page: 1, page_size: 10 })
    );
  }

  /**
   * Get project details
   * GET /api/v1/projects/{project_id}
   */
  getProject(projectId: string): Observable<Project> {
    return this.get<BaseResponse<Project>>(`projects/${projectId}`).pipe(
      map(res => res.data!)
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
   * Analyze project structure
   * POST /api/v1/projects/analyze
   */
  analyzeProject(request: ProjectAnalyzeRequest): Observable<Project> {
    return this.post<BaseResponse<Project>>('projects/analyze', request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Add feature to project
   * POST /api/v1/projects/add-feature
   */
  addFeature(request: ProjectAddFeatureRequest): Observable<Project> {
    return this.post<BaseResponse<Project>>('projects/add-feature', request).pipe(
      map(res => res.data!)
    );
  }

  // ==================== Workflows ====================

  /**
   * Execute a complete project workflow
   * POST /api/v1/projects/{project_id}/workflow
   */
  executeWorkflow(projectId: string, request?: WorkflowRequest): Observable<WorkflowResponse> {
    return this.post<BaseResponse<WorkflowResponse>>(`projects/${projectId}/workflow`, request || {}).pipe(
      map(res => res.data!)
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
      map(res => res.data!)
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
  /**
   * Sync project with remote source
   * POST /api/v1/projects/{project_id}/sync
   */
  syncProject(projectId: string): Observable<any> {
    return this.post<BaseResponse<any>>(`projects/${projectId}/sync`, {}).pipe(
      map(res => res.data)
    );
  }
  /**
   * Open a project
   * POST /api/v1/projects/{project_id}/open
   */
  openProject(projectId: string, request?: any): Observable<any> {
    return this.post<BaseResponse<any>>(`projects/${projectId}/open`, request || {}).pipe(
      map(res => res.data)
    );
  }
}
