import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
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
  GitDiffResponse
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
   * POST /api/v1/git/config/{provider}
   */
  setGitConfig(provider: string, config: GitConfigUpdate): Observable<any> {
    return this.post<BaseResponse<any>>(`git/config/${provider}`, config).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Delete Git credentials for a provider
   * DELETE /api/v1/git/config/{provider}
   */
  deleteGitConfig(provider: string): Observable<{ status: string; provider: string; message: string }> {
    return this.delete<BaseResponse<{ status: string; provider: string; message: string }>>(`git/config/${provider}`).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Validate Git credentials for a provider
   * POST /api/v1/git/validate/{provider}
   */
  validateGitCredentials(provider: string): Observable<{ valid: boolean; provider: string; message: string }> {
    return this.post<BaseResponse<{ valid: boolean; provider: string; message: string }>>(`git/validate/${provider}`, {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get general Git configuration
   * GET /api/v1/git/config
   */
  getGitConfig(): Observable<{ config: Record<string, any> }> {
    return this.get<BaseResponse<{ config: Record<string, any> }>>('git/config').pipe(
      map(res => res.data!)
    );
  }

  // ==================== Repository Operations ====================

  /**
   * Initialize a new Git repository
   * POST /api/v1/git/repositories/init
   */
  initRepository(request: GitRepoInit): Observable<any> {
    return this.post<BaseResponse<any>>('git/repositories/init', request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Clone a Git repository
   * POST /api/v1/git/repositories/clone
   */
  cloneRepository(request: GitCloneRequest): Observable<any> {
    return this.post<BaseResponse<any>>('git/repositories/clone', request, {
      timeout: 300000 // 5 minutes for clone
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Push changes to remote
   * POST /api/v1/git/repositories/{repo_id}/push
   */
  pushRepository(repoId: string, request: GitCommitRequest): Observable<any> {
    return this.post<BaseResponse<any>>(`git/repositories/${repoId}/push`, request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Pull latest changes
   * POST /api/v1/git/repositories/{repo_id}/pull
   */
  pullRepository(repoId: string, localPath: string): Observable<any> {
    return this.post<BaseResponse<any>>(`git/repositories/${repoId}/pull`, { local_path: localPath }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get repository status
   * GET /api/v1/git/repositories/{repo_id}/status
   */
  getRepositoryStatus(repoId: string, localPath: string): Observable<GitStatus> {
    return this.get<BaseResponse<GitStatus>>(`git/repositories/${repoId}/status`, { local_path: localPath }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * List branches
   * GET /api/v1/git/repositories/{repo_id}/branches
   */
  listBranches(
    repoId: string,
    localPath: string,
    params?: { page?: number; page_size?: number }
  ): Observable<GitBranchesResponse> {
    return this.get<BaseResponse<GitBranchesResponse>>(`git/repositories/${repoId}/branches`, {
      local_path: localPath,
      ...params
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Checkout a branch
   * POST /api/v1/git/repositories/{repo_id}/checkout
   */
  checkoutBranch(repoId: string, request: GitBranchCreate): Observable<any> {
    return this.post<BaseResponse<any>>(`git/repositories/${repoId}/checkout`, request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get commit history
   * GET /api/v1/git/repositories/{repo_id}/log
   */
  getHistory(repoId: string, localPath: string, limit: number = 50): Observable<GitHistoryResponse> {
    return this.get<BaseResponse<GitHistoryResponse>>(`git/repositories/${repoId}/log`, {
      local_path: localPath,
      limit
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get repository diff
   * GET /api/v1/git/repositories/{repo_id}/diff
   */
  getDiff(repoId: string, localPath: string, cached: boolean = false): Observable<GitDiffResponse> {
    return this.get<BaseResponse<GitDiffResponse>>(`git/repositories/${repoId}/diff`, {
      local_path: localPath,
      cached
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Fetch from remote
   * POST /api/v1/git/repositories/{repo_id}/fetch
   */
  fetchRepository(repoId: string, localPath: string): Observable<any> {
    return this.post<BaseResponse<any>>(`git/repositories/${repoId}/fetch`, {}, {
      headers: { 'X-Local-Path': localPath }
    }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Merge branches
   * POST /api/v1/git/repositories/{repo_id}/merge
   */
  mergeBranches(repoId: string, request: GitMergeRequest): Observable<any> {
    return this.post<BaseResponse<any>>(`git/repositories/${repoId}/merge`, request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Create remote repository
   * POST /api/v1/git/repositories/{repo_id}/remote
   */
  createRemoteRepository(repoId: string, request: GitRemoteCreate): Observable<any> {
    return this.post<BaseResponse<any>>(`git/repositories/${repoId}/remote`, request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Resolve conflict using AI
   * POST /api/v1/git/repositories/{repo_id}/resolve
   */
  resolveConflictAI(repoId: string, request: GitConflictResolve): Observable<any> {
    return this.post<BaseResponse<any>>(`git/repositories/${repoId}/resolve`, request, {
      timeout: 60000
    }).pipe(
      map(res => res.data!)
    );
  }
}
