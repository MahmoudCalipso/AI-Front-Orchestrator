import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';
import {
    AdminUserDTO,
    AdminProjectDTO,
    AdminUsersResponse,
    AdminProjectsResponse,
    SystemMetricsResponse,
    UpdateUserRoleResponse
} from '../../models/backend/dtos/responses/admin.responses';
import {
    UserListResponse,
    ProjectListResponse,
    SystemMetricsDTO,
    TenantListResponse,
    AuditLogResponse,
    PlatformStatistics,
    UpdateUserRoleRequest
} from '../../models/backend/dtos/responses/admin.models';
import { BaseResponse } from '../../models';

/**
 * Admin Service
 * Handles administrative operations for user and system management
 */
@Injectable({
    providedIn: 'root'
})
export class AdminService extends BaseApiService {

    /**
     * Get all users (admin only)
     * GET /api/admin/users
     */
    getUsers(params?: { page?: number; page_size?: number; role?: string }): Observable<AdminUsersResponse> {
        return this.get('/api/admin/users', params);
    }

    /**
     * Get all projects (admin only)
     * GET /api/admin/projects
     */
    getProjects(params?: { page?: number; page_size?: number; user_id?: string }): Observable<AdminProjectsResponse> {
        return this.get('/api/admin/projects', params);
    }

    /**
     * Update user role
     * PUT /api/admin/users/{user_id}/role
     */
    updateUserRole(userId: string, role: 'user' | 'admin' | 'superuser'): Observable<{
        message: string;
        user: {
            id: string;
            username: string;
            role: string;
        };
    }> {
        return this.put(`/api/admin/users/${userId}/role`, { role });
    }

    /**
     * Get system metrics
     * GET /api/admin/system/metrics
     */
    getSystemMetrics(): Observable<SystemMetricsResponse> {
        return this.get('/api/admin/system/metrics');
    }

    /**
     * Delete user (admin only)
     */
    deleteUser(userId: string): Observable<{ message: string }> {
        return this.delete(`/api/admin/users/${userId}`);
    }

    /**
     * Suspend user account
     */
    suspendUser(userId: string): Observable<{ message: string }> {
        return this.post(`/api/admin/users/${userId}/suspend`, {});
    }

    /**
     * Activate user account
     */
    activateUser(userId: string): Observable<{ message: string }> {
        return this.post(`/api/admin/users/${userId}/activate`, {});
    }

    /**
     * Run system cleanup
     */
    runSystemCleanup(): Observable<{ message: string }> {
        return this.post('/api/admin/system/cleanup', {});
    }

    /**
     * Create system backup
     */
    createSystemBackup(): Observable<{ message: string; backup_id: string }> {
        return this.post('/api/admin/system/backup', {});
    }

    /**
     * Delete project (admin only)
     */
    deleteProject(projectId: string): Observable<{ message: string }> {
        return this.delete(`/api/admin/projects/${projectId}`);
    }

    // ==================== Enhanced Admin Operations ====================

    /**
     * List all users with advanced filtering
     * GET /api/v1/admin/users
     */
    listAllUsers(search?: string, page: number = 1, pageSize: number = 20): Observable<UserListResponse> {
        const params: any = { page, page_size: pageSize };
        if (search) params.search = search;
        return this.get<BaseResponse<UserListResponse>>('admin/users', { params }).pipe(
            map(res => res.data)
        );
    }

    /**
     * List all projects with advanced filtering
     * GET /api/v1/admin/projects
     */
    listAllProjects(
        search?: string,
        name?: string,
        framework?: string,
        language?: string,
        page: number = 1,
        pageSize: number = 20
    ): Observable<ProjectListResponse> {
        const params: any = { page, page_size: pageSize };
        if (search) params.search = search;
        if (name) params.name = name;
        if (framework) params.framework = framework;
        if (language) params.language = language;
        return this.get<BaseResponse<ProjectListResponse>>('admin/projects', { params }).pipe(
            map(res => res.data)
        );
    }

    /**
     * Update user role (enhanced)
     * PUT /api/v1/admin/users/{user_id}/role
     */
    updateUserRoleEnhanced(userId: string, request: UpdateUserRoleRequest): Observable<void> {
        return this.put<void>(`admin/users/${userId}/role`, request);
    }

    /**
     * Get detailed system metrics
     * GET /api/v1/admin/system/metrics
     */
    getDetailedSystemMetrics(): Observable<SystemMetricsDTO> {
        return this.get<BaseResponse<SystemMetricsDTO>>('admin/system/metrics').pipe(
            map(res => res.data)
        );
    }

    /**
     * List all tenants
     * GET /api/v1/admin/tenants
     */
    listTenants(search?: string, page: number = 1, pageSize: number = 20): Observable<TenantListResponse> {
        const params: any = { page, page_size: pageSize };
        if (search) params.search = search;
        return this.get<BaseResponse<TenantListResponse>>('admin/tenants', { params }).pipe(
            map(res => res.data)
        );
    }

    /**
     * Get tenant projects
     * GET /api/v1/admin/tenants/{tenant_id}/projects
     */
    listTenantProjects(tenantId: string): Observable<ProjectListResponse> {
        return this.get<BaseResponse<ProjectListResponse>>(`admin/tenants/${tenantId}/projects`).pipe(
            map(res => res.data)
        );
    }

    /**
     * Get audit log
     * GET /api/v1/admin/audit-log
     */
    getAuditLog(limit?: number, action?: string, userId?: string): Observable<AuditLogResponse> {
        const params: any = {};
        if (limit) params.limit = limit;
        if (action) params.action = action;
        if (userId) params.user_id = userId;
        return this.get<BaseResponse<AuditLogResponse>>('admin/audit-log', { params }).pipe(
            map(res => res.data)
        );
    }

    /**
     * Get platform statistics
     * GET /api/v1/admin/statistics
     */
    getPlatformStatistics(): Observable<PlatformStatistics> {
        return this.get<BaseResponse<PlatformStatistics>>('admin/statistics').pipe(
            map(res => res.data)
        );
    }
}
