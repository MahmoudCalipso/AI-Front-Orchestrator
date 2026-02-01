import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';
import {
  UserListResponse,
  AdminProjectListResponse as ProjectListResponse,
  UserRoleUpdateRequest,
  SystemMetrics,
  TenantListResponse,
  TenantProjectListResponse,
  AuditLogResponse,
  AdminUser as User,
  AdminProjectItem as Project,
  AdminTenant as Tenant,
} from '../../models/admin/admin.model';
import { UserRole } from '../../models/common/enums';
import { AuditLog } from '../../models/common/common.types';
import { SystemMetricsResponse } from '../../models/admin/admin.responses';

/**
 * Admin Service
 * Handles administrative operations, user management, and system monitoring
 */
@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseApiService {

  // ==================== User Management ====================

  /**
   * List all users with optional filtering
   * GET /api/v1/admin/users
   */
  listAllUsers(
    params?: {
      search?: string;
      role?: string;
      status?: string;
      page?: number;
      page_size?: number;
    }
  ): Observable<UserListResponse> {
    return this.get<BaseResponse<UserListResponse>>('admin/users', { params }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Alias for listAllUsers to support legacy dashboards
   */
  getUsers(params?: any): Observable<UserListResponse> {
    return this.listAllUsers(params);
  }

  /**
   * Get user details by ID
   * GET /api/v1/admin/users/{user_id}
   */
  getUserDetails(userId: string): Observable<User> {
    return this.get<BaseResponse<User>>(`admin/users/${userId}`).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Update user role
   * PUT /api/v1/admin/users/{user_id}/role
   */
  updateUserRole(userId: string, request: UserRoleUpdateRequest): Observable<void> {
    return this.put<BaseResponse<void>>(`admin/users/${userId}/role`, request).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Delete user
   * DELETE /api/v1/admin/users/{user_id}
   */
  deleteUser(userId: string): Observable<void> {
    return this.delete<BaseResponse<void>>(`admin/users/${userId}`).pipe(
      map(res => res.data!)
    );
  }

  // ==================== Project Management ====================

  /**
   * List all projects with optional filtering
   * GET /api/v1/admin/projects
   */
  listAllProjects(
    params?: {
      search?: string;
      name?: string;
      framework?: string;
      language?: string;
      status?: string;
      page?: number;
      page_size?: number;
    }
  ): Observable<ProjectListResponse> {
    return this.get<BaseResponse<ProjectListResponse>>('admin/projects', { params }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Alias for listAllProjects to support legacy dashboards
   */
  getProjects(params?: any): Observable<ProjectListResponse> {
    return this.listAllProjects(params);
  }

  /**
   * Get project details by ID
   * GET /api/v1/admin/projects/{project_id}
   */
  getProjectDetails(projectId: string): Observable<Project> {
    return this.get<BaseResponse<Project>>(`admin/projects/${projectId}`).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Delete project
   * DELETE /api/v1/admin/projects/{project_id}
   */
  deleteProject(projectId: string): Observable<void> {
    return this.delete<BaseResponse<void>>(`admin/projects/${projectId}`).pipe(
      map(res => res.data!)
    );
  }

  // ==================== System Monitoring ====================

  /**
   * Get system metrics
   * GET /api/v1/admin/metrics
   */
  getSystemMetrics(): Observable<SystemMetricsResponse> {
    return this.get<BaseResponse<SystemMetricsResponse>>('admin/metrics').pipe(
      map(res => res.data!)
    );
  }

  /**
   * Alias for getSystemMetrics to support legacy dashboards
   */
  getPlatformStatistics(): Observable<any> {
    return this.getSystemMetrics();
  }

  /**
   * Get system health
   * GET /api/v1/admin/health
   */
  getSystemHealth(): Observable<any> {
    return this.get<BaseResponse<any>>('admin/health').pipe(
      map(res => res.data!)
    );
  }

  // ==================== Tenant Management ====================

  /**
   * List all tenants
   * GET /api/v1/admin/tenants
   */
  listTenants(
    params?: {
      search?: string;
      status?: string;
      page?: number;
      page_size?: number;
    }
  ): Observable<TenantListResponse> {
    return this.get<BaseResponse<TenantListResponse>>('admin/tenants', { params }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get tenant details
   * GET /api/v1/admin/tenants/{tenant_id}
   */
  getTenantDetails(tenantId: string): Observable<Tenant> {
    return this.get<BaseResponse<Tenant>>(`admin/tenants/${tenantId}`).pipe(
      map(res => res.data!)
    );
  }

  /**
   * List projects for a tenant
   * GET /api/v1/admin/tenants/{tenant_id}/projects
   */
  listTenantProjects(tenantId: string): Observable<TenantProjectListResponse> {
    return this.get<BaseResponse<TenantProjectListResponse>>(`admin/tenants/${tenantId}/projects`).pipe(
      map(res => res.data!)
    );
  }

  // ==================== Audit Logging ====================

  /**
   * Get audit log
   * GET /api/v1/admin/audit-log
   */
  getAuditLog(
    params?: {
      limit?: number;
      action?: string;
      user_id?: string;
      start_date?: string;
      end_date?: string;
    }
  ): Observable<AuditLogResponse> {
    return this.get<BaseResponse<AuditLogResponse>>('admin/audit-log', { params }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get audit log entry details
   * GET /api/v1/admin/audit-log/{entry_id}
   */
  getAuditLogEntry(entryId: string): Observable<AuditLog> {
    return this.get<BaseResponse<AuditLog>>(`admin/audit-log/${entryId}`).pipe(
      map(res => res.data!)
    );
  }

  // ==================== System Configuration ====================

  /**
   * Get system configuration
   * GET /api/v1/admin/config
   */
  getSystemConfig(): Observable<any> {
    return this.get<BaseResponse<any>>('admin/config').pipe(
      map(res => res.data!)
    );
  }

  /**
   * Update system configuration
   * PUT /api/v1/admin/config
   */
  updateSystemConfig(config: any): Observable<void> {
    return this.put<BaseResponse<void>>('admin/config', config).pipe(
      map(res => res.data!)
    );
  }

  // ==================== User Activity ====================

  /**
   * Get user activity statistics
   * GET /api/v1/admin/activity
   */
  getUserActivity(
    params?: {
      user_id?: string;
      start_date?: string;
      end_date?: string;
      page?: number;
      page_size?: number;
    }
  ): Observable<any> {
    return this.get<BaseResponse<any>>('admin/activity', { params }).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Get active sessions
   * GET /api/v1/admin/sessions
   */
  getActiveSessions(): Observable<any> {
    return this.get<BaseResponse<any>>('admin/sessions').pipe(
      map(res => res.data!)
    );
  }

  /**
   * Terminate user session
   * POST /api/v1/admin/sessions/{session_id}/terminate
   */
  terminateSession(sessionId: string): Observable<void> {
    return this.post<BaseResponse<void>>(`admin/sessions/${sessionId}/terminate`, {}).pipe(
      map(res => res.data!)
    );
  }
  /**
   * Suspend user
   * POST /api/v1/admin/users/{user_id}/suspend
   */
  suspendUser(userId: string): Observable<void> {
    return this.post<BaseResponse<void>>(`admin/users/${userId}/suspend`, {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Activate user
   * POST /api/v1/admin/users/{user_id}/activate
   */
  activateUser(userId: string): Observable<void> {
    return this.post<BaseResponse<void>>(`admin/users/${userId}/activate`, {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Run system cleanup
   * POST /api/v1/admin/system/cleanup
   */
  runSystemCleanup(): Observable<void> {
    return this.post<BaseResponse<void>>('admin/system/cleanup', {}).pipe(
      map(res => res.data!)
    );
  }

  /**
   * Create system backup
   * POST /api/v1/admin/system/backup
   */
  createSystemBackup(): Observable<any> {
    return this.post<BaseResponse<any>>('admin/system/backup', {}).pipe(
      map(res => res.data!)
    );
  }
}
