import { UUID, Timestamp } from '../common/common.types';

/**
 * Auth Models matching OpenAPI definitions
 */

/**
 * User registration request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  tenant_name: string;
}

/**
 * User login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Token response DTO
 */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * User information DTO
 */
export interface UserInfo {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  tenant_id: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

/**
 * Tenant information DTO
 */
export interface TenantInfo {
  id: string;
  name: string;
  plan: string;
  storage_quota_gb: number;
  storage_used_gb: number;
  storage_usage_percent: number;
  workbench_quota: number;
  api_rate_limit: number;
  is_active: boolean;
  created_at: string;
}

/**
 * Me response DTO
 */
export interface MeResponse {
  user: UserInfo;
  tenant: TenantInfo;
  permissions: string[];
  external_accounts: ExternalAccount[];
  // Additional properties used by components
  username?: string;
  email?: string;
  bio?: string;
  organization?: string;
  preferences?: {
    theme?: string;
    language?: string;
    notifications_enabled?: boolean;
    email_notifications?: boolean;
  };
}

/**
 * External account DTO
 */
export interface ExternalAccount {
  id: string;
  provider: string;
  provider_user_id: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  scopes: string[];
  created_at: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refresh_token: string;
}

/**
 * Password change request
 */
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

/**
 * Forgot password request
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  token: string;
  new_password: string;
}

/**
 * API Key DTO
 */
export interface ApiKey {
  id: string;
  name: string;
  created_at: string;
  key?: string; // Only returned once
  expires_at?: string;
  last_used?: string;
  usage_count: number;
  is_active: boolean;
}

/**
 * Create API key request
 */
export interface CreateApiKeyRequest {
  name: string;
  expires_in_days?: number;
}

/**
 * OAuth connect response
 */
export interface OAuthConnectResponse {
  auth_url: string;
  state: string;
}

// ==================== Backend Entities ====================

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
