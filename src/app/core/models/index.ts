/**
 * Core Models and Interfaces
 * TypeScript interfaces for all API models
 */

// ==================== User Models ====================

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'admin' | 'superuser';
    organization?: string;
    created_at: string;
    updated_at?: string;
    is_active: boolean;
    hashed_password?: string; // Only for backend
}

export interface UserProfile {
    id: string;
    username: string;
    email: string;
    role: string;
    avatar_url?: string;
    bio?: string;
    preferences?: UserPreferences;
}

export * from './auth/auth.model';

export interface UserPreferences {
    theme: 'dark' | 'light' | 'auto';
    language: string;
    notifications_enabled: boolean;
    email_notifications: boolean;
}

export type {
    Project,
    ProjectResponse,
    ProjectListResponse,
    ProjectCreateRequest,
    CreateProjectRequest,
    ProjectProtectionRequest,
    WorkflowRequest,
    WorkflowResponse
} from './project/project.model';

export interface ProjectMetadata {
    project_id: string;
    languages: string[];
    frameworks: string[];
    dependencies: Record<string, string>;
    scripts?: Record<string, string>;
    environment_variables?: Record<string, string>;
}

// ==================== Build Models ====================

export interface Build {
    id: string;
    project_id: string;
    status: BuildStatus;
    started_at: string;
    completed_at?: string;
    duration_seconds?: number;
    logs?: string[];
    error_message?: string;
}

export type BuildStatus = 'pending' | 'running' | 'success' | 'failed' | 'cancelled';

export interface BuildProgress {
    build_id: string;
    project_id: string;
    status: BuildStatus;
    progress: number; // 0-100
    current_step: string;
    logs: string[];
    started_at: string;
    completed_at?: string;
}

// ==================== Git Models ====================

export interface GitRepository {
    id: string;
    name: string;
    url: string;
    provider: GitProvider;
    branch: string;
    last_commit?: GitCommit;
    created_at: string;
}

export type GitProvider = 'github' | 'gitlab' | 'bitbucket' | 'azure_devops';

export interface GitCommit {
    sha: string;
    message: string;
    author: string;
    timestamp: string;
}

export interface GitCredentials {
    provider: GitProvider;
    token: string;
    username?: string;
}

// ==================== AI Models ====================

export interface AIModel {
    name: string;
    provider: string;
    type: 'chat' | 'code' | 'embedding';
    context_length: number;
    is_loaded: boolean;
    size_gb?: number;
    description?: string;
}

export interface InferenceRequest {
    prompt: string;
    model?: string;
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
}

export interface InferenceResponse {
    output: string;
    model: string;
    tokens_used: number;
    processing_time: number;
}

// ==================== Code Operation Models ====================

export interface CodeAnalysisResult {
    issues: CodeIssue[];
    metrics: CodeMetrics;
    suggestions: string[];
    security_score: number;
    quality_score: number;
}

export interface CodeIssue {
    severity: 'low' | 'medium' | 'high' | 'critical';
    type: 'security' | 'performance' | 'style' | 'bug';
    message: string;
    file?: string;
    line?: number;
    suggestion?: string;
}

export interface CodeMetrics {
    lines_of_code: number;
    complexity: number;
    maintainability_index: number;
    test_coverage?: number;
    dependencies_count: number;
}

// ==================== Storage Models ====================

export interface StorageStats {
    total_projects: number;
    total_size: number; // bytes
    available_space: number; // bytes
    used_percentage: number;
}

export interface FileInfo {
    path: string;
    name: string;
    size: number;
    type: 'file' | 'directory';
    created_at: string;
    modified_at: string;
}

// ==================== Monitoring Models ====================

export interface SystemMetrics {
    cpu_usage: number; // percentage
    memory_usage: number; // percentage
    memory_total: number; // bytes
    memory_available: number; // bytes
    disk_usage: number; // percentage
    disk_total: number; // bytes
    disk_available: number; // bytes
    network_in: number; // bytes/sec
    network_out: number; // bytes/sec
    timestamp: number;
}

export interface AlertNotification {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
    action_url?: string;
}

// ==================== Framework Registry Models ====================

export interface Language {
    name: string;
    version: string;
    frameworks: string[];
    package_manager: string;
    build_tool?: string;
}

export interface Framework {
    name: string;
    language: string;
    version: string;
    latest_version: string;
    description: string;
    architectures?: string[];
    dependencies?: string[];
    templates?: string[];
    best_practices?: string[];
}

// ==================== Workspace Models ====================

export interface Workspace {
    id: string;
    name: string;
    project_id?: string;
    created_at: string;
    last_accessed: string;
    files: FileInfo[];
}

export interface IDESession {
    session_id: string;
    workspace_id: string;
    user_id: string;
    created_at: string;
    active: boolean;
}

// ==================== Kubernetes Models ====================

export interface KubernetesDeployment {
    name: string;
    namespace: string;
    replicas: number;
    ready_replicas: number;
    status: 'running' | 'pending' | 'failed';
    created_at: string;
}

export interface KubernetesPod {
    name: string;
    namespace: string;
    status: 'running' | 'pending' | 'failed' | 'succeeded';
    containers: KubernetesContainer[];
    node: string;
    created_at: string;
}

export interface KubernetesContainer {
    name: string;
    image: string;
    ready: boolean;
    restart_count: number;
}

// ==================== API Response Wrappers ====================

export type ResponseStatus = 'success' | 'error' | 'warning' | 'info' | 'partial_success' | 'accepted' | 'denied';

export interface BaseResponse<T = any> {
    status: ResponseStatus;
    code: string;
    message?: string;
    data: T;
    meta?: Record<string, any>;
    timestamp: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

/**
 * @deprecated Use BaseResponse instead
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: 'success' | 'error';
}

/**
 * @deprecated Use BaseResponse instead
 */
export interface StandardResponse {
    message: string;
    status: 'success' | 'error';
    data?: any;
}

/**
 * @deprecated Use BaseResponse instead
 */
export interface SwarmResponse {
    task_id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: any;
    error?: string;
    progress?: number;
}

// ==================== Request Models ====================

export interface GenerateProjectRequest {
    project_name: string;
    languages: Record<string, string>;
    frameworks?: Record<string, string>;
    description?: string;
    template?: string;
    database?: DatabaseConfig;
    figma_url?: string;
}

export interface DatabaseConfig {
    type: 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';
    host?: string;
    port?: number;
    database?: string;
    use_existing: boolean;
}

export interface MigrateProjectRequest {
    project_id: string;
    source_stack: string;
    target_stack: string;
    preserve_structure: boolean;
}

export interface FixCodeRequest {
    code: string;
    language: string;
    issue?: string;
}

export interface AnalyzeCodeRequest {
    code: string;
    language: string;
    analysis_type: 'security' | 'performance' | 'quality' | 'all';
}

export interface TestCodeRequest {
    code: string;
    language: string;
    test_framework?: string;
}

export interface OptimizeCodeRequest {
    code: string;
    language: string;
    optimization_goal: 'performance' | 'memory' | 'readability';
}

export interface RefactorCodeRequest {
    code: string;
    language: string;
    refactoring_goal: string;
}

export interface ExplainCodeRequest {
    code: string;
    language: string;
    detail_level: 'brief' | 'detailed' | 'expert';
}

export interface DocumentCodeRequest {
    code: string;
    language: string;
    style: 'jsdoc' | 'sphinx' | 'markdown';
}

export interface ReviewCodeRequest {
    code: string;
    language: string;
    focus_areas?: string[];
}
