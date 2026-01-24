/**
 * Git configuration update request
 */
export interface GitConfigUpdate {
  token?: string;
  ssh_key?: string;
  username?: string;
  email?: string;
}

/**
 * Git repository init request
 */
export interface GitRepoInit {
  path: string;
}

/**
 * Git clone request
 */
export interface GitCloneRequest {
  repo_url: string;
  local_path: string;
  branch?: string;
  credentials?: GitCredentials;
}

/**
 * Git credentials
 */
export interface GitCredentials {
  username?: string;
  password?: string;
  token?: string;
  ssh_key?: string;
}

/**
 * Git commit request
 */
export interface GitCommitRequest {
  local_path: string;
  message: string;
  branch?: string;
}

/**
 * Git branch create request
 */
export interface GitBranchCreate {
  local_path: string;
  branch_name: string;
  base_branch?: string;
}

/**
 * Git merge request
 */
export interface GitMergeRequest {
  local_path: string;
  source_branch: string;
  target_branch: string;
}

/**
 * Git remote create request
 */
export interface GitRemoteCreate {
  provider: GitProvider;
  name: string;
  description?: string;
  private?: boolean;
}

export type GitProvider = 'github' | 'gitlab' | 'bitbucket' | 'azure';

/**
 * Git conflict resolve request
 */
export interface GitConflictResolve {
  local_path: string;
  file_path: string;
}

/**
 * Git status response
 */
export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  staged: GitFileChange[];
  unstaged: GitFileChange[];
  untracked: string[];
  conflicts: string[];
}

/**
 * Git file change
 */
export interface GitFileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed';
  old_path?: string;
}

/**
 * Git branch info
 */
export interface GitBranch {
  name: string;
  current: boolean;
  remote?: boolean;
  last_commit?: string;
}

/**
 * Git branches response
 */
export interface GitBranchesResponse {
  status: string;
  repo_id: string;
  current_branch: string;
  branches: GitBranch[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Git commit info
 */
export interface GitCommit {
  hash: string;
  short_hash: string;
  message: string;
  author: string;
  author_email: string;
  date: string;
  parent_hashes?: string[];
}

/**
 * Git history response
 */
export interface GitHistoryResponse {
  commits: GitCommit[];
  total: number;
}

/**
 * Git diff response
 */
export interface GitDiffResponse {
  files: GitDiffFile[];
  stats: {
    additions: number;
    deletions: number;
    files_changed: number;
  };
}

/**
 * Git diff file
 */
export interface GitDiffFile {
  path: string;
  status: string;
  additions: number;
  deletions: number;
  diff: string;
}

/**
 * Standard response
 */
export interface StandardResponse {
  status: string;
  result?: any;
  message?: string;
}
