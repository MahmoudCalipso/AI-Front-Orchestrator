import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  GitConfigUpdate,
  GitRepoInit,
  GitCloneRequest,
  GitCommitRequest,
  GitBranchCreate,
  GitMergeRequest,
  GitRemoteCreate,
  GitConflictResolve,
  GitStatus,
  GitBranchesResponse,
  GitHistoryResponse,
  GitDiffResponse,
  StandardResponse
} from '../../models/git/git.model';

/**
 * Git Service
 * Handles Git repository operations, configuration, and credentials
 */
@Injectable({
  providedIn: 'root'
})
export class GitService extends BaseApiService {

  // ==================== Configuration ====================

  /**
   * Set Git credentials for a provider
   * POST /git/config/{provider}
   */
  setGitConfig(provider: string, config: GitConfigUpdate): Observable<StandardResponse> {
    return this.post<StandardResponse>(`/git/config/${provider}`, config);
  }

  /**
   * Delete Git credentials for a provider
   * DELETE /git/config/{provider}
   */
  deleteGitConfig(provider: string): Observable<{ status: string; provider: string; message: string }> {
    return this.delete<{ status: string; provider: string; message: string }>(`/git/config/${provider}`);
  }

  /**
   * Validate Git credentials for a provider
   * POST /git/validate/{provider}
   */
  validateGitCredentials(provider: string): Observable<{ valid: boolean; provider: string; message: string }> {
    return this.post<{ valid: boolean; provider: string; message: string }>(`/git/validate/${provider}`, {});
  }

  /**
   * Get general Git configuration
   * GET /git/config
   */
  getGitConfig(): Observable<{ config: Record<string, any> }> {
    return this.get<{ config: Record<string, any> }>('/git/config');
  }

  // ==================== Repository Operations ====================

  /**
   * Initialize a new Git repository
   * POST /git/repositories/init
   */
  initRepository(request: GitRepoInit): Observable<StandardResponse> {
    return this.post<StandardResponse>('/git/repositories/init', request);
  }

  /**
   * Clone a Git repository
   * POST /git/repositories/clone
   */
  cloneRepository(request: GitCloneRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>('/git/repositories/clone', request, {
      timeout: 300000 // 5 minutes for clone
    });
  }

  /**
   * Push changes to remote
   * POST /git/repositories/{repo_id}/push
   */
  pushRepository(repoId: string, request: GitCommitRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>(`/git/repositories/${repoId}/push`, request);
  }

  /**
   * Pull latest changes
   * POST /git/repositories/{repo_id}/pull
   */
  pullRepository(repoId: string, localPath: string): Observable<StandardResponse> {
    return this.post<StandardResponse>(`/git/repositories/${repoId}/pull`, { local_path: localPath });
  }

  /**
   * Get repository status
   * GET /git/repositories/{repo_id}/status
   */
  getRepositoryStatus(repoId: string, localPath: string): Observable<GitStatus> {
    return this.get<GitStatus>(`/git/repositories/${repoId}/status`, { local_path: localPath });
  }

  /**
   * List branches
   * GET /git/repositories/{repo_id}/branches
   */
  listBranches(
    repoId: string,
    localPath: string,
    params?: { page?: number; page_size?: number }
  ): Observable<GitBranchesResponse> {
    return this.get<GitBranchesResponse>(`/git/repositories/${repoId}/branches`, {
      local_path: localPath,
      ...params
    });
  }

  /**
   * Checkout a branch
   * POST /git/repositories/{repo_id}/checkout
   */
  checkoutBranch(repoId: string, request: GitBranchCreate): Observable<StandardResponse> {
    return this.post<StandardResponse>(`/git/repositories/${repoId}/checkout`, request);
  }

  /**
   * Get commit history
   * GET /git/repositories/{repo_id}/log
   */
  getHistory(repoId: string, localPath: string, limit: number = 50): Observable<GitHistoryResponse> {
    return this.get<GitHistoryResponse>(`/git/repositories/${repoId}/log`, {
      local_path: localPath,
      limit
    });
  }

  /**
   * Get repository diff
   * GET /git/repositories/{repo_id}/diff
   */
  getDiff(repoId: string, localPath: string, cached: boolean = false): Observable<GitDiffResponse> {
    return this.get<GitDiffResponse>(`/git/repositories/${repoId}/diff`, {
      local_path: localPath,
      cached
    });
  }

  /**
   * Fetch from remote
   * POST /git/repositories/{repo_id}/fetch
   */
  fetchRepository(repoId: string, localPath: string): Observable<StandardResponse> {
    return this.post<StandardResponse>(`/git/repositories/${repoId}/fetch`, {}, {
      headers: { 'X-Local-Path': localPath }
    });
  }

  /**
   * Merge branches
   * POST /git/repositories/{repo_id}/merge
   */
  mergeBranches(repoId: string, request: GitMergeRequest): Observable<StandardResponse> {
    return this.post<StandardResponse>(`/git/repositories/${repoId}/merge`, request);
  }

  /**
   * Create remote repository
   * POST /git/repositories/{repo_id}/remote
   */
  createRemoteRepository(repoId: string, request: GitRemoteCreate): Observable<StandardResponse> {
    return this.post<StandardResponse>(`/git/repositories/${repoId}/remote`, request);
  }

  /**
   * Resolve conflict using AI
   * POST /git/repositories/{repo_id}/resolve
   */
  resolveConflictAI(repoId: string, request: GitConflictResolve): Observable<StandardResponse> {
    return this.post<StandardResponse>(`/git/repositories/${repoId}/resolve`, request, {
      timeout: 60000
    });
  }
}
