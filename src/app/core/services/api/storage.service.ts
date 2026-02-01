import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
import {
  StorageStats,
  ProjectsListResponse,
  ProjectDetails,
  ArchiveProjectRequest,
  ArchiveProjectResponse,
  CleanupRequest,
  CleanupResponse,
  BackupRequest,
  BackupResponse,
  RestoreRequest,
  RestoreResponse
} from '../../models/storage/storage.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService extends BaseApiService {

  /**
   * Get storage statistics
   * GET /api/v1/storage/stats
   */
  getStorageStats(): Observable<StorageStats> {
    return this.get<BaseResponse<StorageStats>>('storage/stats').pipe(
      map(res => res.data!)
    );
  }

  /**
   * List stored projects
   * GET /api/v1/storage/projects
   */
  listProjects(params?: { page?: number; pageSize?: number; status?: string }): Observable<ProjectsListResponse> {
    // Mapping params if needed, BaseApiService handles query params object
    return this.get<BaseResponse<ProjectsListResponse>>('storage/projects', params).pipe(
      map(res => res.data || { projects: [], total: 0, page: 1, page_size: 20 })
    );
  }

  /**
   * Get project details
   * GET /api/v1/storage/projects/{project_id}
   */
  getProjectDetails(projectId: string): Observable<ProjectDetails> {
    return this.get<BaseResponse<ProjectDetails>>(`storage/projects/${projectId}`).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Delete project
   * DELETE /api/v1/storage/projects/{project_id}
   */
  deleteProject(projectId: string): Observable<void> {
    return this.delete<BaseResponse<void>>(`storage/projects/${projectId}`).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Archive project
   * POST /api/v1/storage/archive/{project_id}
   */
  archiveProject(projectId: string, request?: ArchiveProjectRequest): Observable<ArchiveProjectResponse> {
    return this.post<BaseResponse<ArchiveProjectResponse>>(`storage/archive/${projectId}`, request || {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Cleanup old projects
   * POST /api/v1/storage/cleanup
   */
  cleanupProjects(request: CleanupRequest): Observable<CleanupResponse> {
    return this.post<BaseResponse<CleanupResponse>>('storage/cleanup', request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Backup project
   * POST /api/v1/storage/backup/{project_id}
   */
  backupProject(projectId: string, request?: BackupRequest): Observable<BackupResponse> {
    return this.post<BaseResponse<BackupResponse>>(`storage/backup/${projectId}`, request || {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Restore project from backup
   * POST /api/v1/storage/restore
   */
  restoreProject(request: RestoreRequest): Observable<RestoreResponse> {
    return this.post<BaseResponse<RestoreResponse>>('storage/restore', request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Download project as ZIP
   * GET /api/v1/storage/projects/{project_id}/download
   * Returns Blob
   */
  downloadProject(projectId: string): Observable<Blob> {
    // For blob, we usually go direct or handle in BaseApi if supported.
    // BaseApiService doesn't seem to have specific blob wrapper helper shown, so sticking to HttpClient but using baseUrl
    // And constructing full path manually to be safe or use buildUrl logic if exposed
    // But buildUrl is protected.
    // I will assume simple concatenation for now, matching the previous logic but with /api/v1
    return this.http.get(`${this.baseUrl}/api/v1/storage/projects/${projectId}/download`, {
      responseType: 'blob'
    });
  }
}
