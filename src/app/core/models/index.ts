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

export interface UserPreferences {
    theme: 'dark' | 'light' | 'auto';
    language: string;
    notifications_enabled: boolean;
    email_notifications: boolean;
}

// ==================== Project Models ====================

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

export interface IDESession {
    session_id: string;
    workspace_id: string;
    user_id: string;
    created_at: string;
    active: boolean;
}

// ==================== Feature Exports ====================

// Common
export * from './common/common.types';
export * from './common/enums';
export * from './common/filter.model';
export * from './common/base-response.model';
export * from './common/solution.model';

// Auth
export * from './auth/auth.model';
export * from './auth/auth.requests';
export * from './auth/auth.responses';
export * from './auth/user.model';
export * from './auth/tenant.model';
export * from './auth/external-account.model';

// AI Agent
export * from './ai-agent/agent.requests';
export * from './ai-agent/agent.responses';
export * from './ai-agent/agent-entity.model';
export * from './ai-agent/ai-agent.model';

// AI
export * from './ai/ai.model';

// Admin
export * from './admin/admin.model';


// Project
export * from './project/project.model';
export * from './project/project.requests';
export * from './project/project.responses';

// Database
export * from './database/database-explorer.model';

// Emulator
export * from './emulator/emulator.model';

// Enterprise
export * from './enterprise/enterprise.model';

// Figma
export * from './figma/figma.model';

// Generation
export * from './generation/generation.model';

// Git
export * from './git/git.model';

// IDE
export * from './ide/ide.model';

// Kubernetes
export * from './kubernetes/kubernetes.model';

// Lifecycle
export * from './lifecycle/lifecycle.model';

// Migration
export * from './migration/migration.model';

// Monitoring
export * from './monitoring/monitoring.model';

// Orchestrate
export * from './orchestrate/orchestrate.dtos';

// Registry
export * from './registry/registry.model';

// Security
export * from './security/security.model';

// System
export * from './system/system.model';

// Workspace
export * from './workspace/workspace.model';

