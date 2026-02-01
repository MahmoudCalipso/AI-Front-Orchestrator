import { UUID, Timestamp } from '../common/common.types';

export interface ProjectResponseDTO {
    id: UUID;
    project_name: string;
    description?: string;
    status: string;
    language: string;
    framework: string;
    git_repo_url?: string;
    git_branch: string;
    local_path: string;
    created_at: Timestamp;
    updated_at: Timestamp;
    last_opened_at?: Timestamp;
    build_status?: string;
    run_status?: string;
    extra_metadata: Record<string, any>;
}

export interface ProjectListResponseDTO {
    projects: ProjectResponseDTO[];
    total: number;
    page: number;
    page_size: number;
}

export type ProjectResponseBackend = ProjectResponseDTO;
export type ProjectListResponseBackend = ProjectListResponseDTO;
