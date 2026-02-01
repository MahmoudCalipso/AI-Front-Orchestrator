import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { BaseResponseDTO as BaseResponse } from '../../models/common/base-response.model';
import {
    Workspace,
    WorkspaceCreateRequest,
    UpdateWorkspaceRequest,
    WorkspaceInviteRequest, // Updated from AddMemberRequest
    WorkspaceListResponse,
    WorkspaceMember
} from '../../models/workspace/workspace.model';

/**
 * Workspace Service
 * Handles workspace management operations
 */
@Injectable({
    providedIn: 'root'
})
export class WorkspaceService extends BaseApiService {

    /**
     * Create a new workspace
     * POST /api/v1/workspace
     */
    createWorkspace(request: WorkspaceCreateRequest): Observable<Workspace> {
        return this.post<BaseResponse<Workspace>>('workspace', request).pipe(
            map(res => res.data!)
        );
    }

    /**
     * Get workspace by ID
     * GET /api/v1/workspace/{workspace_id}
     */
    getWorkspace(workspaceId: string): Observable<Workspace> {
        return this.get<BaseResponse<Workspace>>(`workspace/${workspaceId}`).pipe(
            map(res => res.data!)
        );
    }

    /**
     * Update workspace
     * PUT /api/v1/workspace/{workspace_id}
     */
    updateWorkspace(workspaceId: string, request: UpdateWorkspaceRequest): Observable<Workspace> {
        return this.put<BaseResponse<Workspace>>(`workspace/${workspaceId}`, request).pipe(
            map(res => res.data!)
        );
    }

    /**
     * Delete workspace
     * DELETE /api/v1/workspace/{workspace_id}
     */
    deleteWorkspace(workspaceId: string): Observable<any> {
        return this.delete<BaseResponse<any>>(`workspace/${workspaceId}`).pipe(
            map(res => res.data)
        );
    }

    /**
     * List all workspaces for current user
     * GET /api/v1/workspace
     */
    listWorkspaces(page: number = 1, pageSize: number = 20): Observable<WorkspaceListResponse> {
        return this.get<BaseResponse<WorkspaceListResponse>>('workspace', { page, page_size: pageSize }).pipe(
            map(res => res.data || { workspaces: [], total: 0 })
        );
    }

    /**
     * Get workspaces for a specific user
     * GET /api/v1/workspace/user/{user_id}
     */
    getUserWorkspaces(userId: string): Observable<Workspace[]> {
        return this.get<BaseResponse<Workspace[]>>(`workspace/user/${userId}`).pipe(
            map(res => res.data || [])
        );
    }

    /**
     * Get workspace members
     * GET /api/v1/workspace/{workspace_id}/members
     */
    getWorkspaceMembers(workspaceId: string): Observable<WorkspaceMember[]> {
        return this.get<BaseResponse<WorkspaceMember[]>>(`workspace/${workspaceId}/members`).pipe(
            map(res => res.data || [])
        );
    }

    /**
     * Add member to workspace
     * POST /api/v1/workspace/{workspace_id}/members
     */
    addMember(workspaceId: string, request: WorkspaceInviteRequest): Observable<any> {
        return this.post<BaseResponse<any>>(`workspace/${workspaceId}/members`, request).pipe(
            map(res => res.data)
        );
    }

    /**
     * Remove member from workspace
     * DELETE /api/v1/workspace/{workspace_id}/members/{user_id}
     */
    removeMember(workspaceId: string, userId: string): Observable<any> {
        return this.delete<BaseResponse<any>>(`workspace/${workspaceId}/members/${userId}`).pipe(
            map(res => res.data)
        );
    }

    /**
     * Update member role
     * PATCH /api/v1/workspace/{workspace_id}/members/{user_id}
     */
    updateMemberRole(workspaceId: string, userId: string, role: string): Observable<any> {
        return this.patch<BaseResponse<any>>(`workspace/${workspaceId}/members/${userId}`, { role }).pipe(
            map(res => res.data)
        );
    }
}
