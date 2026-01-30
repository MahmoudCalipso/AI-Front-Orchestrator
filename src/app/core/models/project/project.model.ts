/**
 * Project Models matching OpenAPI definitions
 */

/**
 * Project Response DTO
 */
export interface ProjectResponse {
  id: string;
  project_name: string;
  description?: string;
  status: string; // active, archived, etc.
  language: string;
  framework: string;
  git_repo_url?: string;
  git_branch?: string;
  local_path?: string;
  created_at: string;
  updated_at: string;
  last_opened_at?: string;
  build_status?: string;
  run_status?: string;
  extra_metadata?: Record<string, any>;
}

/**
 * Project List Response DTO
 */
export interface ProjectListResponse {
  projects: ProjectResponse[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * Project Create Request
 */
export interface ProjectCreateRequest {
  project_name: string;
  description?: string;
  framework?: string;
  language?: string;
  git_repo_url?: string;
}

/**
 * Project Protection Request
 */
export interface ProjectProtectionRequest {
  enabled: boolean;
  allowed_users?: string[];
}

/**
 * Workflow Request (for build/run workflows)
 */
export interface WorkflowRequest {
  steps?: string[]; // 'sync', 'build', 'run'
  config?: Record<string, any>;
}

/**
 * Workflow Response
 */
export interface WorkflowResponse {
  status: string;
  workflow_id: string;
  message: string;
}
