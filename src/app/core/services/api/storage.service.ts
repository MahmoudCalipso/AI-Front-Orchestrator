import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
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
   * GET /api/storage/stats
   */
  getStorageStats(): Observable<StorageStats> {
    return this.get<StorageStats>('/api/storage/stats');
  }

  /**
   * List stored projects
   * GET /api/storage/projects
   */
  listProjects(params?: { page?: number; pageSize?: number; status?: string }): Observable<ProjectsListResponse> {
    return this.get<ProjectsListResponse>('/api/storage/projects', params);
  }

  /**
   * Get project details
   * GET /api/storage/projects/{project_id}
   */
  getProjectDetails(projectId: string): Observable<ProjectDetails> {
    return this.get<ProjectDetails>(`/api/storage/projects/${projectId}`);
  }

  /**
   * Delete project
   * DELETE /api/storage/projects/{project_id}
   */
  deleteProject(projectId: string): Observable<void> {
    return this.delete<void>(`/api/storage/projects/${projectId}`);
  }

  /**
   * Archive project
   * POST /api/storage/archive/{project_id}
   */
  archiveProject(projectId: string, request?: ArchiveProjectRequest): Observable<ArchiveProjectResponse> {
    return this.post<ArchiveProjectResponse>(`/api/storage/archive/${projectId}`, request || {});
  }

  /**
   * Cleanup old projects
   * POST /api/storage/cleanup
   */
  cleanupProjects(request: CleanupRequest): Observable<CleanupResponse> {
    return this.post<CleanupResponse>('/api/storage/cleanup', request);
  }

  /**
   * Backup project
   * POST /api/storage/backup/{project_id}
   */
  backupProject(projectId: string, request?: BackupRequest): Observable<BackupResponse> {
    return this.post<BackupResponse>(`/api/storage/backup/${projectId}`, request || {});
  }

  /**
   * Restore project from backup
   * POST /api/storage/restore
   */
  restoreProject(request: RestoreRequest): Observable<RestoreResponse> {
    return this.post<RestoreResponse>('/api/storage/restore', request);
  }

  /**
   * Download project as ZIP
   * GET /api/storage/projects/{project_id}/download
   */
  downloadProject(projectId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/api/storage/projects/${projectId}/download`, {
      responseType: 'blob'
    });
  }
}
