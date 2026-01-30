/**
 * Workspace management models matching OpenAPI
 */

/**
 * Workspace info
 */
export interface Workspace {
    id: string;
    name: string;
    description?: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
    settings: WorkspaceSettings;
    members?: WorkspaceMember[];
    project_count?: number;
    storage_used?: number;
}

export interface WorkspaceSettings {
    default_language?: string;
    default_framework?: string;
    auto_save?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    editor_settings?: EditorSettings;
}

export interface EditorSettings {
    font_size?: number;
    font_family?: string;
    tab_size?: number;
    word_wrap?: boolean;
    minimap_enabled?: boolean;
    line_numbers?: boolean;
}

export interface WorkspaceMember {
    user_id: string;
    username: string;
    email: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    joined_at: string;
    last_active?: string;
}

/**
 * Workspace Create Request
 */
export interface WorkspaceCreateRequest {
    name: string;
    description?: string;
    settings?: WorkspaceSettings;
    // OpenAPI has owner_id/name sometimes, but usually derived from auth.
}

/**
 * Workspace Invite Request
 */
export interface WorkspaceInviteRequest {
    inviter_id?: string; // Optional if derived from context
    user_id: string;
    role?: 'admin' | 'member' | 'viewer'; // Default developer/member
}

export interface UpdateWorkspaceRequest {
    name?: string;
    description?: string;
    settings?: WorkspaceSettings;
}

export interface WorkspaceListResponse {
    workspaces: Workspace[];
    total: number;
    page: number;
    page_size: number;
}
