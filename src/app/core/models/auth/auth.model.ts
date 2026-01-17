/**
 * User registration request
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  organization?: string;
}

/**
 * User login request
 */
export interface LoginRequest {
  username: string;
  password: string;
  remember_me?: boolean;
}

/**
 * Auth response
 */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: UserInfo;
}

/**
 * User information
 */
export interface UserInfo {
  user_id: string;
  username: string;
  email: string;
  full_name?: string;
  organization?: string;
  roles: string[];
  permissions: string[];
  created_at: string;
  last_login?: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
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
 * Password reset request
 */
export interface ResetPasswordRequest {
  email: string;
}

/**
 * Password reset confirm
 */
export interface ResetPasswordConfirmRequest {
  token: string;
  new_password: string;
}

/**
 * JWT token payload
 */
export interface JWTPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
  jti?: string;
}

/**
 * API key
 */
export interface ApiKey {
  key_id: string;
  key: string;
  name: string;
  scopes: string[];
  created_at: string;
  expires_at?: string;
  last_used?: string;
  is_active: boolean;
}

/**
 * Create API key request
 */
export interface CreateApiKeyRequest {
  name: string;
  scopes: string[];
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
