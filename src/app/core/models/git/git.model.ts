/**
 * Git provider
 */
export type GitProvider = 'github' | 'gitlab' | 'bitbucket' | 'azure-devops';

/**
 * Git providers list
 */
export interface GitProvidersResponse {
  providers: GitProviderInfo[];
}

/**
 * Git provider info
 */
export interface GitProviderInfo {
  name: GitProvider;
  display_name: string;
  configured: boolean;
  oauth_enabled: boolean;
  api_url?: string;
}

/**
 * Git configuration
 */
export interface GitConfig {
  provider: GitProvider;
  access_token?: string;
  username?: string;
  email?: string;
  default_branch?: string;
  api_url?: string;
  ssh_key?: string;
}

/**
 * Git configuration response
 */
export interface GitConfigResponse {
  provider: GitProvider;
  configured: boolean;
  username?: string;
  email?: string;
  default_branch: string;
  last_validated?: string;
}

/**
 * Validate credentials request
 */
export interface ValidateCredentialsRequest {
  provider: GitProvider;
  access_token: string;
  api_url?: string;
}

/**
 * Validate credentials response
 */
export interface ValidateCredentialsResponse {
  valid: boolean;
  username?: string;
  scopes?: string[];
  rate_limit?: RateLimit;
  message?: string;
}

/**
 * Rate limit information
 */
export interface RateLimit {
  limit: number;
  remaining: number;
  reset: string;
}

/**
 * Initialize repository request
 */
export interface InitRepositoryRequest {
  name: string;
  description?: string;
  private: boolean;
  provider: GitProvider;
  initialize_with_readme?: boolean;
  gitignore_template?: string;
  license?: string;
}

/**
 * Initialize repository response
 */
export interface InitRepositoryResponse {
  success: boolean;
  repository_url: string;
  clone_url: string;
  ssh_url?: string;
  repository_id: string;
  default_branch: string;
}

/**
 * Repository information
 */
export interface RepositoryInfo {
  id: string;
  name: string;
  full_name: string;
  description?: string;
  private: boolean;
  clone_url: string;
  ssh_url: string;
  html_url: string;
  default_branch: string;
  created_at: string;
  updated_at: string;
  language?: string;
  stars?: number;
  forks?: number;
}

/**
 * Clone repository request
 */
export interface CloneRepositoryRequest {
  repository_url: string;
  workspace_id: string;
  branch?: string;
  depth?: number;
  provider: GitProvider;
}

/**
 * Clone repository response
 */
export interface CloneRepositoryResponse {
  success: boolean;
  workspace_id: string;
  path: string;
  branch: string;
  commit: string;
  message?: string;
}

/**
 * Commit request
 */
export interface CommitRequest {
  workspace_id: string;
  message: string;
  files?: string[];
  author?: {
    name: string;
    email: string;
  };
}

/**
 * Commit response
 */
export interface CommitResponse {
  success: boolean;
  commit_hash: string;
  branch: string;
  files_changed: number;
  message: string;
}

/**
 * Push request
 */
export interface PushRequest {
  workspace_id: string;
  remote?: string;
  branch?: string;
  force?: boolean;
}

/**
 * Push response
 */
export interface PushResponse {
  success: boolean;
  remote: string;
  branch: string;
  commits_pushed: number;
  message?: string;
}

/**
 * Pull request
 */
export interface PullRequest {
  workspace_id: string;
  remote?: string;
  branch?: string;
  rebase?: boolean;
}

/**
 * Pull response
 */
export interface PullResponse {
  success: boolean;
  commits_pulled: number;
  files_changed: number;
  conflicts?: string[];
  message?: string;
}

/**
 * Branch information
 */
export interface BranchInfo {
  name: string;
  commit: string;
  ahead: number;
  behind: number;
  is_current: boolean;
  is_remote: boolean;
}

/**
 * Create branch request
 */
export interface CreateBranchRequest {
  workspace_id: string;
  branch_name: string;
  from_branch?: string;
  checkout?: boolean;
}

/**
 * Merge request
 */
export interface MergeRequest {
  workspace_id: string;
  source_branch: string;
  target_branch: string;
  strategy?: 'merge' | 'squash' | 'rebase';
  message?: string;
}

/**
 * Merge response
 */
export interface MergeResponse {
  success: boolean;
  result_commit: string;
  conflicts?: string[];
  message?: string;
}

/**
 * Git Diff Request
 */
export interface GitDiffRequest {
  workspace_id: string;
  file_path: string;
  base_commit?: string;
  target_commit?: string;
}

/**
 * Git Diff Response
 */
export interface GitDiffResponse {
  file_path: string;
  original_content: string;
  modified_content: string;
  diff_hunk?: string;
}
