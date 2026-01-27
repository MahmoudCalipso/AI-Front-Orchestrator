// Workspace Entity Models

import { UserRole, ActivityType } from '../types/enums';
import { UUID, Timestamp, Metadata, JSONObject } from '../types/common.types';

export interface Workspace {
  id: string;
  name: string;
  owner_id: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
  settings: WorkspaceSettings;
  metadata?: Metadata;
}

export interface WorkspaceSettings {
  default_language: string;
  default_framework: string;
  enable_ai_assistance: boolean;
  enable_collaboration: boolean;
  max_storage_gb: number;
  max_projects: number;
  theme?: string;
  timezone?: string;
  notifications_enabled: boolean;
}

export interface WorkspaceMember {
  id: number;
  workspace_id: string;
  user_id: UUID;
  username?: string;
  role: UserRole;
  joined_at: Timestamp;
  permissions?: WorkspacePermissions;
}

export interface WorkspacePermissions {
  can_invite_members: boolean;
  can_remove_members: boolean;
  can_manage_projects: boolean;
  can_manage_settings: boolean;
  can_view_analytics: boolean;
  can_manage_billing: boolean;
}

export interface WorkspaceActivity {
  id: number;
  workspace_id: string;
  user_id?: UUID;
  activity_type: ActivityType;
  message: string;
  timestamp: Timestamp;
  metadata?: JSONObject;
}

export interface WorkspaceProject {
  workspace_id: string;
  project_id: UUID;
  added_by: UUID;
  added_at: Timestamp;
  role: 'owner' | 'editor' | 'viewer';
  permissions?: ProjectPermissions;
}

export interface ProjectPermissions {
  can_edit: boolean;
  can_delete: boolean;
  can_invite: boolean;
  can_manage_settings: boolean;
  can_view_analytics: boolean;
}
