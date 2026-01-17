import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import {
    CollaborationSession,
    CreateSessionRequest,
    JoinSessionRequest
} from '../../models/collaboration/collaboration.model';
import { ApiResponse } from '../../models/common/api-response.model';

/**
 * Collaboration Service
 * Handles real-time collaboration session management
 */
@Injectable({
    providedIn: 'root'
})
export class CollaborationService extends BaseApiService {

    /**
     * Create a new collaboration session
     * POST /api/collaboration/session
     */
    createSession(request: CreateSessionRequest): Observable<CollaborationSession> {
        return this.post<CollaborationSession>('/api/collaboration/session', request);
    }

    /**
     * Join an existing collaboration session
     * POST /api/collaboration/session/join
     */
    joinSession(request: JoinSessionRequest): Observable<CollaborationSession> {
        return this.post<CollaborationSession>('/api/collaboration/session/join', request);
    }

    /**
     * Get session details
     * GET /api/collaboration/session/{session_id}
     */
    getSession(sessionId: string): Observable<CollaborationSession> {
        return this.get<CollaborationSession>(`/api/collaboration/session/${sessionId}`);
    }

    /**
     * Leave a collaboration session
     * POST /api/collaboration/session/{session_id}/leave
     */
    leaveSession(sessionId: string): Observable<ApiResponse> {
        return this.post<ApiResponse>(`/api/collaboration/session/${sessionId}/leave`, {});
    }

    /**
     * End a collaboration session
     * DELETE /api/collaboration/session/{session_id}
     */
    endSession(sessionId: string): Observable<ApiResponse> {
        return this.delete<ApiResponse>(`/api/collaboration/session/${sessionId}`);
    }

    /**
     * List active sessions for workspace
     * GET /api/collaboration/workspace/{workspace_id}/sessions
     */
    getWorkspaceSessions(workspaceId: string): Observable<CollaborationSession[]> {
        return this.get<CollaborationSession[]>(`/api/collaboration/workspace/${workspaceId}/sessions`);
    }
}
