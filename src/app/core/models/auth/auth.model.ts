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
