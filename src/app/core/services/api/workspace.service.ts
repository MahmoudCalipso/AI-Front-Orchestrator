import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    Workspace,
    CreateWorkspaceRequest,
    UpdateWorkspaceRequest,
    AddMemberRequest,
    WorkspaceListResponse,
    WorkspaceMember
} from '../../models/workspace/workspace.model';
import { ApiResponse } from '../../models/common/api-response.model';

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
     * POST /api/workspace
     */
    createWorkspace(request: CreateWorkspaceRequest): Observable<Workspace> {
        return this.post<Workspace>('/api/workspace', request);
    }

    /**
     * Get workspace by ID
     * GET /api/workspace/{workspace_id}
     */
    getWorkspace(workspaceId: string): Observable<Workspace> {
        return this.get<Workspace>(`/api/workspace/${workspaceId}`);
    }

    /**
     * Update workspace
     * PUT /api/workspace/{workspace_id}
     */
    updateWorkspace(workspaceId: string, request: UpdateWorkspaceRequest): Observable<Workspace> {
        return this.put<Workspace>(`/api/workspace/${workspaceId}`, request);
    }

    /**
     * Delete workspace
     * DELETE /api/workspace/{workspace_id}
     */
    deleteWorkspace(workspaceId: string): Observable<ApiResponse> {
        return this.delete<ApiResponse>(`/api/workspace/${workspaceId}`);
    }

    /**
     * List all workspaces for current user
     * GET /api/workspace
     */
    listWorkspaces(page: number = 1, pageSize: number = 20): Observable<WorkspaceListResponse> {
        return this.get<WorkspaceListResponse>('/api/workspace', { page, page_size: pageSize });
    }

    /**
     * Get workspaces for a specific user
     * GET /api/workspace/user/{user_id}
     */
    getUserWorkspaces(userId: string): Observable<Workspace[]> {
        return this.get<Workspace[]>(`/api/workspace/user/${userId}`);
    }

    /**
     * Get workspace members
     * GET /api/workspace/{workspace_id}/members
     */
    getWorkspaceMembers(workspaceId: string): Observable<WorkspaceMember[]> {
        return this.get<WorkspaceMember[]>(`/api/workspace/${workspaceId}/members`);
    }

    /**
     * Add member to workspace
     * POST /api/workspace/{workspace_id}/members
     */
    addMember(workspaceId: string, request: AddMemberRequest): Observable<ApiResponse> {
        return this.post<ApiResponse>(`/api/workspace/${workspaceId}/members`, request);
    }

    /**
     * Remove member from workspace
     * DELETE /api/workspace/{workspace_id}/members/{user_id}
     */
    removeMember(workspaceId: string, userId: string): Observable<ApiResponse> {
        return this.delete<ApiResponse>(`/api/workspace/${workspaceId}/members/${userId}`);
    }

    /**
     * Update member role
     * PATCH /api/workspace/{workspace_id}/members/{user_id}
     */
    updateMemberRole(workspaceId: string, userId: string, role: string): Observable<ApiResponse> {
        return this.patch<ApiResponse>(`/api/workspace/${workspaceId}/members/${userId}`, { role });
    }
}
