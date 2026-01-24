import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

/**
 * Enterprise Service
 * Handles multi-tenant enterprise features
 */
@Injectable({
    providedIn: 'root'
})
export class EnterpriseService extends BaseApiService {

    /**
     * Create enterprise user
     * POST /api/enterprise/users
     */
    createUser(userData: {
        username: string;
        email: string;
        password: string;
        role?: string;
        organization?: string;
    }): Observable<{
        message: string;
        user: {
            id: string;
            username: string;
            email: string;
            role: string;
        };
    }> {
        return this.post('/api/enterprise/users', userData);
    }

    /**
     * Get enterprise users
     * GET /api/enterprise/users
     */
    getUsers(params?: {
        page?: number;
        page_size?: number;
        organization?: string;
        role?: string;
    }): Observable<{
        users: Array<{
            id: string;
            username: string;
            email: string;
            role: string;
            organization?: string;
            created_at: string;
        }>;
        total: number;
    }> {
        return this.get('/api/enterprise/users', params);
    }

    /**
     * Delete enterprise user
     * DELETE /api/enterprise/users/{user_id}
     */
    deleteUser(userId: string): Observable<{ message: string }> {
        return this.delete(`/api/enterprise/users/${userId}`);
    }

    /**
     * Get enterprise projects
     * GET /api/enterprise/projects
     */
    getProjects(params?: {
        page?: number;
        page_size?: number;
        organization?: string;
    }): Observable<{
        projects: Array<{
            id: string;
            name: string;
            owner_id: string;
            organization?: string;
            created_at: string;
            protected: boolean;
        }>;
        total: number;
    }> {
        return this.get('/api/enterprise/projects', params);
    }

    /**
     * Protect project (prevent deletion)
     * POST /api/enterprise/projects/{project_id}/protect
     */
    protectProject(projectId: string, protect: boolean = true): Observable<{
        message: string;
        project_id: string;
        protected: boolean;
    }> {
        return this.post(`/api/enterprise/projects/${projectId}/protect`, { protect });
    }

    /**
     * Get organization statistics
     */
    getOrganizationStats(organizationId: string): Observable<{
        total_users: number;
        total_projects: number;
        storage_used_gb: number;
        active_workspaces: number;
    }> {
        return this.get(`/api/enterprise/organizations/${organizationId}/stats`);
    }

    /**
     * Assign user to organization
     */
    assignUserToOrganization(userId: string, organizationId: string): Observable<{
        message: string;
    }> {
        return this.post(`/api/enterprise/users/${userId}/organization`, {
            organization_id: organizationId
        });
    }
}
