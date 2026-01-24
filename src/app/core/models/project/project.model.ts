/**
 * Project model - matches backend project structure
 */
export interface Project {
  id: string;
  user_id: string;
  project_name: string;
  description?: string;
  git_repo_url?: string;
  git_branch?: string;
  local_path?: string;
  language: string;
  framework?: string;
  database?: string;
  status: ProjectStatus;
  protected?: boolean;
  size_bytes?: number;
  file_count?: number;
  created_at: string;
  updated_at?: string;
  last_opened?: string;
}

export type ProjectStatus = 'active' | 'archived' | 'building' | 'running' | 'stopped' | 'error';

/**
 * Create project request
 */
export interface CreateProjectRequest {
  project_name: string;
  description?: string;
  git_repo_url?: string;
  language?: string;
  framework?: string;
}

/**
 * Project list response with pagination
 */
export interface ProjectListResponse {
  projects: Project[];
  pagination: PaginationInfo;
}

/**
 * Pagination info
 */
export interface PaginationInfo {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

/**
 * Open project request
 */
export interface OpenProjectRequest {
  git_credentials?: GitCredentials;
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
 * Open project response
 */
export interface OpenProjectResponse {
  status: string;
  workspace_id: string;
  project: Project;
}

/**
 * AI update request
 */
export interface AIUpdateRequest {
  prompt: string;
  context?: Record<string, any>;
}

/**
 * AI inline update request
 */
export interface AIInlineUpdateRequest {
  prompt: string;
  selection?: {
    start_line: number;
    end_line: number;
    start_column?: number;
    end_column?: number;
  };
}

/**
 * Workflow request
 */
export interface WorkflowRequest {
  steps?: WorkflowStep[];
  config?: Record<string, any>;
}

export type WorkflowStep = 'sync' | 'update' | 'push' | 'build' | 'run';

/**
 * Workflow response
 */
export interface WorkflowResponse {
  status: string;
  workflow_id: string;
  message: string;
}

/**
 * Workflow status
 */
export interface WorkflowStatus {
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  current_step?: string;
  steps_completed: string[];
  steps_remaining: string[];
  error?: string;
  started_at: string;
  completed_at?: string;
}

/**
 * Build request
 */
export interface BuildRequest {
  config?: Record<string, any>;
}

/**
 * Run request
 */
export interface RunRequest {
  port?: number;
  env?: Record<string, string>;
}

/**
 * Project logs response
 */
export interface ProjectLogsResponse {
  status: string;
  project_id: string;
  logs: string[];
}
