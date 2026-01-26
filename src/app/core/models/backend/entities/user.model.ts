// User Entity Models

import { UserRole, ProjectStatus, BuildStatus, RunStatus } from '../types/enums';
import { UUID, Timestamp, Metadata, JSONObject } from '../types/common.types';

export interface User {
  id: UUID;
  tenant_id: UUID;
  email: string;
  hashed_password: string;
  full_name?: string;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  credentials_accepted: boolean;
  last_login?: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
  metadata?: Metadata;
}

export interface UserProject {
  id: UUID;
  user_id: UUID;
  project_name: string;
  description?: string;
  git_repo_url?: string;
  git_branch: string;
  local_path?: string;
  status: ProjectStatus;
  language?: string;
  framework?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  last_opened_at?: Timestamp;
  build_status?: BuildStatus;
  run_status?: RunStatus;
  metadata?: Metadata;
}

export interface ProjectSession {
  id: UUID;
  project_id: UUID;
  user_id: UUID;
  workspace_id?: string;
  session_data?: JSONObject;
  created_at: Timestamp;
  updated_at: Timestamp;
  expires_at?: Timestamp;
}

export interface WorkflowExecution {
  id: UUID;
  project_id: UUID;
  workflow_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: Timestamp;
  completed_at?: Timestamp;
  steps: WorkflowStep[];
  metadata?: Metadata;
}

export interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  started_at?: Timestamp;
  completed_at?: Timestamp;
  output?: JSONObject;
  error?: string;
}

export interface ProjectUpdate {
  id: UUID;
  project_id: UUID;
  user_id: UUID;
  update_type: 'file_change' | 'config_change' | 'dependency_change' | 'build' | 'deployment';
  description: string;
  changes: JSONObject;
  created_at: Timestamp;
  metadata?: Metadata;
}
