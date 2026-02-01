/**
 * Enterprise Models
 * All Enterprise-related DTOs matching backend Python models
 */

// ==================== Enterprise User ====================
export interface EnterpriseUserResponseDTO {
  id: string;
  email: string;
  role: string;
  full_name?: string | null;
  is_active: boolean;
  created_at: string | null;
}

// ==================== Create Org User Request ====================
export interface CreateOrgUserRequest {
  email: string;
  full_name: string;
  password: string;
  role?: string;
}

// ==================== Project Protection ====================
export interface EnterpriseProjectProtectionRequest {
  enabled: boolean;
  allowed_users?: string[] | null;
}

// ==================== Project Protection Response ====================
export interface ProjectProtectionResponseDTO {
  project_id: string;
  protection_level: string;
  allowed_users: string[];
  allowed_roles: string[];
  require_approval: boolean;
  approval_roles: string[];
  created_at: string;
  updated_at: string;
}

// ==================== Tenant ====================
export interface EnterpriseTenantResponseDTO {
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

// ==================== Tenant List ====================
export interface EnterpriseTenantListResponseDTO {
  tenants: EnterpriseTenantResponseDTO[];
  total: number;
}

// ==================== Tenant Create ====================
export interface TenantCreateRequest {
  name: string;
  slug: string;
  owner_id: string;
  settings?: Record<string, any>;
}

// ==================== Audit Log ====================
export interface AuditLogEntryDTO {
  id: string;
  user_id: string;
  username: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
}

// ==================== Audit Log List ====================
export interface AuditLogListResponseDTO {
  logs: AuditLogEntryDTO[];
  total: number;
  page: number;
  page_size: number;
}

// ==================== Protection Level ====================
export enum ProtectionLevel {
  NONE = 'none',
  READ_ONLY = 'read_only',
  APPROVAL_REQUIRED = 'approval_required',
  RESTRICTED = 'restricted',
  LOCKED = 'locked'
}

// ==================== Enterprise Role ====================
export enum EnterpriseRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
  GUEST = 'guest'
}
