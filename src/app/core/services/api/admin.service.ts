import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

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
    getUsers(params?: { page?: number; page_size?: number; role?: string }): Observable<{
        users: Array<{
            id: string;
            username: string;
            email: string;
            role: string;
            created_at: string;
            is_active: boolean;
        }>;
        total: number;
        page: number;
        page_size: number;
    }> {
        return this.get('/api/admin/users', params);
    }

    /**
     * Get all projects (admin only)
     * GET /api/admin/projects
     */
    getProjects(params?: { page?: number; page_size?: number; user_id?: string }): Observable<{
        projects: Array<{
            id: string;
            name: string;
            owner_id: string;
            owner_username: string;
            created_at: string;
            status: string;
            language: string;
        }>;
        total: number;
        page: number;
        page_size: number;
    }> {
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
    getSystemMetrics(): Observable<{
        total_users: number;
        active_users: number;
        total_projects: number;
        active_projects: number;
        total_storage_gb: number;
        cpu_usage: number;
        memory_usage: number;
        disk_usage: number;
    }> {
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
}
