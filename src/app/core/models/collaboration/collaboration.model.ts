/**
 * Real-time collaboration models
 */

export interface CollaborationSession {
    session_id: string;
    workspace_id: string;
    file_path?: string;
    participants: Participant[];
    created_at: string;
    expires_at?: string;
}

export interface Participant {
    user_id: string;
    username: string;
    color: string;
    cursor_position?: CursorPosition;
    selection?: TextSelection;
    is_active: boolean;
    joined_at: string;
}

export interface CursorPosition {
    line: number;
    column: number;
}

export interface TextSelection {
    start: CursorPosition;
    end: CursorPosition;
}

export interface CreateSessionRequest {
    workspace_id: string;
    file_path?: string;
    max_participants?: number;
}

export interface JoinSessionRequest {
    session_id: string;
}

export interface CollaborationMessage {
    type: 'cursor' | 'selection' | 'edit' | 'chat' | 'join' | 'leave';
    session_id: string;
    user_id: string;
    timestamp: string;
    data: any;
}

export interface CursorUpdateMessage extends CollaborationMessage {
    type: 'cursor';
    data: {
        position: CursorPosition;
    };
}

export interface EditMessage extends CollaborationMessage {
    type: 'edit';
    data: {
        file_path: string;
        changes: TextChange[];
        version: number;
    };
}

export interface TextChange {
    range: {
        start: CursorPosition;
        end: CursorPosition;
    };
    text: string;
    type: 'insert' | 'delete' | 'replace';
}

export interface ChatMessage extends CollaborationMessage {
    type: 'chat';
    data: {
        message: string;
        username: string;
    };
}
