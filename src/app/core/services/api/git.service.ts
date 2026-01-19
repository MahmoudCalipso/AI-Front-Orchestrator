import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  GitProvidersResponse,
  GitConfig,
  GitConfigResponse,
  ValidateCredentialsRequest,
  ValidateCredentialsResponse,
  InitRepositoryRequest,
  InitRepositoryResponse,
  CloneRepositoryRequest,
  CloneRepositoryResponse,
  CommitRequest,
  CommitResponse,
  PushRequest,
  PushResponse,
  PullRequest,
  PullResponse,
  BranchInfo,
  CreateBranchRequest,
  MergeRequest,
  MergeResponse,
  GitProvider,
  GitDiffRequest,
  GitDiffResponse
} from '../../models/git/git.model';

@Injectable({
  providedIn: 'root'
})
export class GitService extends BaseApiService {

  listProviders(): Observable<GitProvidersResponse> {
    return this.get<GitProvidersResponse>('/git/providers');
  }

  getConfig(): Observable<GitConfigResponse[]> {
    return this.get<GitConfigResponse[]>('/git/config');
  }

  getProviderConfig(provider: GitProvider): Observable<GitConfigResponse> {
    return this.get<GitConfigResponse>(`/git/config/${provider}`);
  }

  setProviderConfig(provider: GitProvider, config: GitConfig): Observable<GitConfigResponse> {
    return this.post<GitConfigResponse>(`/git/config/${provider}`, config);
  }

  deleteProviderConfig(provider: GitProvider): Observable<void> {
    return this.delete<void>(`/git/config/${provider}`);
  }

  validateCredentials(request: ValidateCredentialsRequest): Observable<ValidateCredentialsResponse> {
    return this.post<ValidateCredentialsResponse>(`/git/validate/${request.provider}`, request);
  }

  initRepository(request: InitRepositoryRequest): Observable<InitRepositoryResponse> {
    return this.post<InitRepositoryResponse>('/git/repositories/init', request);
  }

  cloneRepository(request: CloneRepositoryRequest): Observable<CloneRepositoryResponse> {
    return this.post<CloneRepositoryResponse>('/git/repositories/clone', request);
  }

  commit(request: CommitRequest): Observable<CommitResponse> {
    return this.post<CommitResponse>('/git/commit', request);
  }

  push(request: PushRequest): Observable<PushResponse> {
    return this.post<PushResponse>('/git/push', request);
  }

  pull(request: PullRequest): Observable<PullResponse> {
    return this.post<PullResponse>('/git/pull', request);
  }

  listBranches(workspaceId: string): Observable<BranchInfo[]> {
    return this.get<BranchInfo[]>(`/git/branches/${workspaceId}`);
  }

  createBranch(request: CreateBranchRequest): Observable<BranchInfo> {
    return this.post<BranchInfo>('/git/branches', request);
  }

  merge(request: MergeRequest): Observable<MergeResponse> {
    return this.post<MergeResponse>('/git/merge', request);
  }

  getDiff(workspaceId: string, filePath: string): Observable<GitDiffResponse> {
    return this.get<GitDiffResponse>(`/git/diff/${workspaceId}?file_path=${filePath}`);
  }
}
