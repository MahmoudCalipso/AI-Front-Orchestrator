/**
 * Admin Operation Models
 * DTOs for admin and enterprise management
 */

import { AgentResponseDTO } from '../ai-agent/agent-entity.model';

/**
 * User Role Enumeration
 */
export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    USER = 'user',
    VIEWER = 'viewer'
}

/**
 * User Status Enumeration
 */
export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING = 'pending'
}

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

/**
 * Project Summary DTO
 */
export interface ProjectSummaryDTO {
    id: string;
    name: string;
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
}

/**
 * Project List Response
 */
export interface ProjectListResponse {
    projects: ProjectSummaryDTO[];
    total: number;
    page: number;
    page_size: number;
}

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
}

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

/**
 * Platform Statistics
 */
export interface PlatformStatistics {
    total_users: number;
    total_projects: number;
    total_agents: number;
    total_builds: number;
    successful_builds: number;
    failed_builds: number;
    total_storage_used: number;
    total_api_calls_24h: number;
    active_sessions: number;
    uptime_percentage: number;
}
