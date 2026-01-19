/**
 * Storage statistics
 */
export interface StorageStats {
  total_projects: number;
  total_size: number;
  available_space: number;
  used_space: number;
  projects_by_status: {
    active: number;
    archived: number;
    deleted: number;
  };
  storage_by_type: {
    source_code: number;
    documentation: number;
    tests: number;
    config: number;
  };
}

/**
 * Project metadata
 */
export interface ProjectMetadata {
  project_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'archived' | 'deleted';
  size: number;
  file_count: number;
  languages: string[];
  frameworks: string[];
  tags?: string[];
  owner?: string;
}

/**
 * Projects list response
 */
export interface ProjectsListResponse {
  projects: ProjectMetadata[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * Project details
 */
export interface ProjectDetails extends ProjectMetadata {
  files: ProjectFile[];
  structure: any;
  dependencies?: string[];
  build_info?: ProjectBuildSummary;
  deployment_info?: DeploymentInfo;
}

/**
 * Project file
 */
export interface ProjectFile {
  path: string;
  name: string;
  size: number;
  type: string;
  language?: string;
  last_modified: string;
  content_preview?: string;
}

/**
 * Build information summary
 */
export interface ProjectBuildSummary {
  last_build: string;
  build_status: 'success' | 'failed' | 'pending';
  build_duration: number;
  build_logs?: string;
}

/**
 * Deployment information
 */
export interface DeploymentInfo {
  deployed: boolean;
  environment?: string;
  url?: string;
  last_deployment: string;
  deployment_status: 'success' | 'failed' | 'in-progress';
}

/**
 * Archive project request
 */
export interface ArchiveProjectRequest {
  project_id: string;
  reason?: string;
  include_dependencies?: boolean;
}

/**
 * Archive project response
 */
export interface ArchiveProjectResponse {
  success: boolean;
  project_id: string;
  archive_path: string;
  archive_size: number;
  timestamp: string;
}

/**
 * Cleanup request
 */
export interface CleanupRequest {
  older_than_days?: number;
  status?: 'archived' | 'deleted';
  dry_run?: boolean;
  exclude_projects?: string[];
}

/**
 * Cleanup response
 */
export interface CleanupResponse {
  projects_cleaned: number;
  space_freed: number;
  projects_list: string[];
  errors?: string[];
}

/**
 * Backup request
 */
export interface BackupRequest {
  project_id: string;
  include_dependencies?: boolean;
  compression?: 'none' | 'gzip' | 'bzip2';
  destination?: string;
}

/**
 * Backup response
 */
export interface BackupResponse {
  success: boolean;
  backup_id: string;
  backup_path: string;
  backup_size: number;
  checksum: string;
  timestamp: string;
}

/**
 * Restore request
 */
export interface RestoreRequest {
  backup_id: string;
  destination_project_id?: string;
  overwrite?: boolean;
}

/**
 * Restore response
 */
export interface RestoreResponse {
  success: boolean;
  project_id: string;
  files_restored: number;
  timestamp: string;
}
