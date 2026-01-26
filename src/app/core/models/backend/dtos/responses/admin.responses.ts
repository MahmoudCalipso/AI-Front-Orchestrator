import { UUID, Timestamp } from '../../types/common.types';
import { UserRole } from '../../types/enums';

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
 * Admin Users Response
 */
export interface AdminUsersResponse {
  users: AdminUserDTO[];
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

/**
 * System Metrics Response
 */
export interface SystemMetricsResponse {
  total_users: number;
  active_users: number;
  total_projects: number;
  active_projects: number;
  total_storage_gb: number;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
}

/**
 * Update User Role Response
 */
export interface UpdateUserRoleResponse {
  message: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}
