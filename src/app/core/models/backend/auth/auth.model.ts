// Authentication Models

import { UUID, Timestamp, Metadata } from '../types/common.types';

export interface APIKey {
  id: UUID;
  user_id: UUID;
  key_hash: string;
  name?: string;
  last_used?: Timestamp;
  usage_count: number;
  created_at: Timestamp;
  expires_at?: Timestamp;
  is_active: boolean;
  permissions?: APIKeyPermissions;
}

export interface APIKeyPermissions {
  read_projects: boolean;
  write_projects: boolean;
  delete_projects: boolean;
  read_users: boolean;
  write_users: boolean;
  admin_access: boolean;
  ai_inference: boolean;
  file_upload: boolean;
}

export interface RefreshToken {
  id: UUID;
  user_id: UUID;
  token_hash: string;
  expires_at: Timestamp;
  created_at: Timestamp;
  revoked: boolean;
  revoked_at?: Timestamp;
  device_info?: DeviceInfo;
}

export interface DeviceInfo {
  user_agent?: string;
  ip_address?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  location?: string;
}

export interface PasswordResetToken {
  id: UUID;
  user_id: UUID;
  token_hash: string;
  expires_at: Timestamp;
  created_at: Timestamp;
  used: boolean;
  used_at?: Timestamp;
}

export interface LoginAttempt {
  id: UUID;
  email: string;
  ip_address: string;
  user_agent?: string;
  success: boolean;
  attempted_at: Timestamp;
  failure_reason?: string;
}

export interface Session {
  id: UUID;
  user_id: UUID;
  token: string;
  expires_at: Timestamp;
  created_at: Timestamp;
  last_activity: Timestamp;
  device_info?: DeviceInfo;
  is_active: boolean;
}
