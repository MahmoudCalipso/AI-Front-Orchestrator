import { Timestamp } from '../common/common.types';

export interface MigrationFile {
  path: string;
  originalCode: string;
  migratedCode: string;
  changes: number;
}

export type MigrationStrategy = 'strangler-fig' | 'big-bang' | 'incremental';

export interface StackInfo {
  language: string;
  framework?: string;
}

export interface MigrationWorkflowRequest {
  project_path: string;
  source_stack: StackInfo;
  target_stack: StackInfo;
  include_dependencies?: boolean;
  dry_run?: boolean;
  options?: Record<string, any>;
}

export interface MigrationWorkflowResponse {
  migration_id: string; // Used by component
  workflow_id?: string;
  status: string;
  progress: number;
  current_phase: string;
  migrated_files?: MigrationFile[]; // Use the interface instead of string[]
  stages?: Array<{
    name: string;
    status: string;
    progress: number;
    message?: string;
  }>;
  started_at: Timestamp;
  estimated_completion?: Timestamp;
}

export interface MigrationRequest {
  code: string;
  source_language: string;
  target_language: string;
}

export interface MigrationResponse {
  migrated_code: string;
  explanation?: string;
}

export interface CompatibilityCheckRequest {
  source_stack: StackInfo;
  target_stack: StackInfo;
}

export interface CompatibilityCheckResponse {
  is_compatible: boolean;
  score: number;
  issues: string[];
}
