// Authentication Request DTOs

export interface UserRegisterRequest {
  email: string;
  password: string;
  full_name?: string;
  tenant_name: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}

export interface APIKeyCreateRequest {
  name: string;
  expires_in_days?: number;
  expires_in?: number;
  scopes?: string[];
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface PasswordResetRequest {
  token: string;
  new_password: string;
}

export interface OAuthConnectRequest {
  provider: string;
  code: string;
  redirect_uri: string;
}

export interface UserUpdateRequest {
  full_name?: string;
  email?: string;
  is_active?: boolean;
  role?: string;
}

export interface TenantUpdateRequest {
  name?: string;
  plan?: string;
  storage_quota_gb?: number;
  workbench_quota?: number;
  api_rate_limit?: number;
  max_users?: number;
}
