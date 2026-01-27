// Authentication Response DTOs

import { UUID, Timestamp } from '../../types/common.types';
import { UserRole, TenantPlan, SubscriptionStatus } from '../../types/enums';

export interface TokenResponseDTO {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserResponseDTO {
  id: UUID;
  email: string;
  full_name?: string;
  role: UserRole;
  tenant_id: UUID;
  is_active: boolean;
  is_verified: boolean;
  created_at: Timestamp;
}

export interface TenantResponseDTO {
  id: UUID;
  name: string;
  plan: TenantPlan;
  storage_quota_gb: number;
  storage_used_gb: number;
  storage_usage_percent: number;
  workbench_quota: number;
  api_rate_limit: number;
  is_active: boolean;
  created_at: Timestamp;
}

export interface APIKeyResponseDTO {
  id: UUID;
  name: string;
  key?: string; // Only returned on creation
  created_at: Timestamp;
  expires_at?: Timestamp;
  last_used?: Timestamp;
  usage_count: number;
  is_active: boolean;
}

export interface ExternalAccountResponseDTO {
  id: UUID;
  provider: string;
  username?: string;
  email?: string;
  avatar_url?: string;
  connected_at: Timestamp;
  last_used?: Timestamp;
}

export interface MeResponseDTO extends UserResponseDTO {
  tenant: TenantResponseDTO;
  api_keys_count: number;
  projects_count: number;
  last_login?: Timestamp;
}

export interface LoginHistoryDTO {
  id: UUID;
  login_time: Timestamp;
  ip_address: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: string;
}

export interface UserProfileDTO extends UserResponseDTO {
  login_history: LoginHistoryDTO[];
  api_keys: APIKeyResponseDTO[];
  external_accounts: ExternalAccountResponseDTO[];
  preferences: UserPreferencesDTO;
}

export interface UserPreferencesDTO {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  two_factor_enabled: boolean;
}

export interface AuthStatsDTO {
  total_users: number;
  active_users_today: number;
  new_users_this_week: number;
  failed_login_attempts: number;
  active_sessions: number;
}
