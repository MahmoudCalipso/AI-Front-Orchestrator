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
    import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponse } from '../../models/index';

/**
 * Enterprise Service
 * Handles multi-tenant enterprise features as defined in OpenAPI
 */
@Injectable({
    providedIn: 'root'
})
export class EnterpriseService extends BaseApiService {

    /**
     * Add Organization User (Add user to the organization)
     * POST /api/v1/enterprise/users
     */
    addOrganizationUser(userData: {
        username?: string;
        email: string;
        role?: string;
        password?: string;
    }): Observable<any> {
        return this.post<BaseResponse<any>>('enterprise/users', userData).pipe(
            map(res => res.data)
        );
    }

    /**
     * List Organization Users
     * GET /api/v1/enterprise/users
     */
    listOrganizationUsers(params?: {
        search?: string;
        page?: number;
        page_size?: number;
    }): Observable<{
        // Adjusting return type to match typical list response if model isn't strictly typed here yet,
        // relying on generic BaseResponse structure
        users: any[];
        total: number;
    } | any> {
        return this.get<BaseResponse<any>>('enterprise/users', params).pipe(
            map(res => res.data)
        );
    }

    /**
     * Remove Organization User
     * DELETE /api/v1/enterprise/users/{user_id}
     */
    removeOrganizationUser(userId: string): Observable<any> {
        return this.delete<BaseResponse<any>>(`enterprise/users/${userId}`).pipe(
            map(res => res.data)
        );
    }

    /**
     * List Organization Projects
     * GET /api/v1/enterprise/projects
     */
    listOrganizationProjects(params?: {
        search?: string;
        page?: number;
        page_size?: number;
    }): Observable<any> {
        return this.get<BaseResponse<any>>('enterprise/projects', params).pipe(
            map(res => res.data)
        );
    }

    /**
     * Set Project Protection
     * POST /api/v1/enterprise/projects/{project_id}/protect
     */
    setProjectProtection(projectId: string, protect: boolean = true): Observable<any> {
        return this.post<BaseResponse<any>>(`enterprise/projects/${projectId}/protect`, { protect }).pipe(
            map(res => res.data)
        );
    }

    /**
     * Force Delete Project
     * DELETE /api/v1/enterprise/projects/{project_id}
     */
    forceDeleteProject(projectId: string): Observable<any> {
        return this.delete<BaseResponse<any>>(`enterprise/projects/${projectId}`).pipe(
            map(res => res.data)
        );
    }

    /**
     * Monitor Active Workbenches
     * GET /api/v1/enterprise/workbenches
     */
    monitorActiveWorkbenches(): Observable<any> {
        return this.get<BaseResponse<any>>('enterprise/workbenches').pipe(
            map(res => res.data)
        );
    }

    /**
     * Update User Permissions
     * PUT /api/v1/enterprise/users/{user_id}/permissions
     */
    updateUserPermissions(userId: string, permissions: any): Observable<any> {
        return this.put<BaseResponse<any>>(`enterprise/users/${userId}/permissions`, permissions).pipe(
            map(res => res.data)
        );
    }
}
