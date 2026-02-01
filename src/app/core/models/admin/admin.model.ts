/**
 * Admin Operation Models
 * DTOs for admin and enterprise management
 * Consolidated from admin.models.ts and admin.responses.ts
 */

import { AgentResponseDTO } from '../ai-agent/agent-entity.model';

import { UserRole } from '../common/enums';

/**
 * User Status Enumeration
 */
export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING = 'pending'
}

// ==================== User Models ====================

/**
 * User DTO
 */
export interface UserDTO {
    id: string;
    email: string;
    username: string;
    full_name?: string;
    role: UserRole;
    status: UserStatus;
    tenant_id?: string;
    created_at: string;
    updated_at: string;
    last_login_at?: string;
    is_verified: boolean;
    metadata?: Record<string, any>;
}

/**
 * Admin User DTO - simplified version for admin operations
 */
export interface AdminUserDTO {
    id: string;
    username: string;
    email: string;
    role: string;
    created_at: string;
    is_active: boolean;
}

/**
 * User List Response
 */
export interface UserListResponse {
    users: UserDTO[];
    total: number;
    page: number;
    page_size: number;
}

/**
 * Update User Role Request
 */
export interface UpdateUserRoleRequest {
    role: UserRole;
}


// ==================== Project Models ====================

/**
 * Project Summary DTO
 */
export interface ProjectSummaryDTO {
    id: string;
    name: string;
    project_name: string;
    description?: string;
    framework: string;
    language: string;
    status: string;
    user_id: string;
    tenant_id?: string;
    created_at: string;
    updated_at: string;
    last_build_at?: string;
    build_status?: 'success' | 'failed' | 'pending' | 'running';
    size_bytes?: number;
    file_count?: number;
    protected?: boolean;
    database?: string;
}

/**
 * Admin Project DTO - simplified version for admin operations
 */
export interface AdminProjectDTO {
    id: string;
    project_name: string;
    user_id: string;
    status: string;
    language: string;
    framework: string;
    created_at: string;
    updated_at: string;
    build_status: string;
    run_status: string;
}

/**
 * Admin Project List Response
 */
export interface AdminProjectListResponse {
    projects: ProjectSummaryDTO[];
    total: number;
    page: number;
    page_size: number;
}

/**
 * Admin Projects Response
 */
export interface AdminProjectsResponse {
    projects: AdminProjectDTO[];
    total: number;
    page: number;
    page_size: number;
}

// ==================== Tenant Models ====================

/**
 * Tenant DTO
 */
export interface TenantDTO {
    id: string;
    name: string;
    slug: string;
    description?: string;
    status: 'active' | 'inactive' | 'suspended';
    created_at: string;
    updated_at: string;
    user_count: number;
    project_count: number;
    storage_used: number;
    storage_limit: number;
    metadata?: Record<string, any>;
}

/**
 * Tenant List Response
 */
export interface TenantListResponse {
    tenants: TenantDTO[];
    total: number;
    page: number;
    page_size: number;
}

/**
 * Tenant Project List Response
 */
export interface TenantProjectListResponse {
    tenant_id: string;
    projects: ProjectSummaryDTO[];
    total: number;
}

// ==================== System Metrics ====================

/**
 * System Metrics DTO
 */
export interface SystemMetricsDTO {
    timestamp: string;
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    active_users: number;
    active_projects: number;
    active_agents: number;
    total_requests_24h: number;
    average_response_time: number;
    error_rate: number;
    active_workbenches?: number;
    recorded_activities?: number;
}

/**
 * System Metrics Response
 */
export interface AdminSystemMetricsResponse {
    total_users: number;
    active_users: number;
    total_projects: number;
    active_projects: number;
    total_storage_gb: number;
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    active_workbenches?: number;
    recorded_activities?: number;
    uptime?: string;
}

/**
 * System Metrics (alias for compatibility)
 */
export type SystemMetrics = SystemMetricsDTO;

// ==================== Audit Log ====================

/**
 * Audit Log Entry
 */
export interface AuditLogEntry {
    id: string;
    timestamp: string;
    user_id: string;
    user_email: string;
    action: string;
    resource_type: string;
    resource_id?: string;
    ip_address?: string;
    user_agent?: string;
    status: 'success' | 'failed';
    details?: Record<string, any>;
}

/**
 * Audit Log Response
 */
export interface AuditLogResponse {
    logs: AuditLogEntry[];
    total: number;
    page: number;
    page_size: number;
}

import { AuditLog } from '../common/common.types';

// ==================== Shorthand Aliases for Service Compatibility ====================
export type AdminUser = UserDTO;
export type AdminProjectItem = ProjectSummaryDTO;
export type AdminTenant = TenantDTO;

export interface UserRoleUpdateRequest {
    role: string;
}


