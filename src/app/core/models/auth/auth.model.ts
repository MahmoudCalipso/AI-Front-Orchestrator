/**
 * User registration request - matches backend UserRegister schema
 */
export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  tenant_name: string;
}

/**
 * User login request - matches backend UserLogin schema
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Token response from backend
 */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * Auth response with user info
 */
export interface AuthResponse extends TokenResponse {
  user?: UserInfo;
}

/**
 * User information - matches backend UserResponse
 */
export interface UserInfo {
  id: string;
  tenant_id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  credentials_accepted?: boolean;
}

/**
 * User roles
 */
export type UserRole = 'admin' | 'enterprise' | 'developer';

/**
 * Me response - matches backend MeResponse
 */
export interface MeResponse {
  user: UserInfo;
  tenant: TenantInfo;
  permissions: string[];
  external_accounts: ExternalAccount[];
}

/**
 * Tenant information
 */
export interface TenantInfo {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  storage_quota_gb: number;
  storage_used_gb: number;
  storage_usage_percent: number;
  workbench_quota: number;
  api_rate_limit: number;
  is_active: boolean;
  created_at: string;
}

/**
 * External account (OAuth connections)
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
 * Logout request
 */
export interface LogoutRequest {
  refresh_token?: string;
  all_devices?: boolean;
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
 * API key - matches backend APIKeyResponse
 */
export interface ApiKey {
  id: string;
  name: string;
  key?: string; // Only returned on creation
  created_at: string;
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
 * Session information
 */
export interface SessionInfo {
  session_id: string;
  user_id: string;
  device: string;
  ip_address: string;
  created_at: string;
  last_activity: string;
  is_current: boolean;
}

/**
 * OAuth connect response
 */
export interface OAuthConnectResponse {
  auth_url: string;
  state: string;
}
