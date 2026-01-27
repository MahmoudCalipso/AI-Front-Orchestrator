import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
  AdminUserDTO,
  AdminProjectDTO,
  AdminUsersResponse,
  AdminProjectsResponse,
  SystemMetricsResponse,
  UpdateUserRoleResponse
} from '../../models/backend/dtos/responses/admin.responses';

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
}
