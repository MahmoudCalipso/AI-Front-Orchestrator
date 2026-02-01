

export interface ProjectUpdateRequest {
    description?: string;
    status?: string;
    config?: Record<string, any>;
}

export interface ProjectSearchRequest {
    query?: string;
    language?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export interface ProjectAnalyzeRequest {
    project_path: string;
}

export interface ProjectAddFeatureRequest {
    project_path: string;
    feature_description: string;
}
