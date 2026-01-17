/**
 * Lifecycle automation models
 */

export interface LifecycleExecuteRequest {
    project_path: string;
    workflow: 'build' | 'test' | 'deploy' | 'full-pipeline';
    environment?: 'development' | 'staging' | 'production';
    steps?: LifecycleStep[];
    variables?: { [key: string]: string };
}

export interface LifecycleStep {
    name: string;
    type: 'build' | 'test' | 'deploy' | 'script' | 'approval';
    command?: string;
    script?: string;
    depends_on?: string[];
    timeout?: number;
    retry?: number;
    continue_on_error?: boolean;
}

export interface LifecycleExecuteResponse {
    execution_id: string;
    workflow: string;
    status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
    started_at: string;
    completed_at?: string;
    steps: StepResult[];
    logs: string[];
    artifacts?: string[];
}

export interface StepResult {
    name: string;
    status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
    started_at?: string;
    completed_at?: string;
    duration_seconds?: number;
    output?: string;
    error?: string;
    exit_code?: number;
}

export interface PipelineConfig {
    name: string;
    version: string;
    triggers: PipelineTrigger[];
    stages: PipelineStage[];
    variables?: { [key: string]: string };
    notifications?: NotificationConfig;
}

export interface PipelineTrigger {
    type: 'push' | 'pull_request' | 'schedule' | 'manual';
    branches?: string[];
    schedule?: string;
}

export interface PipelineStage {
    name: string;
    steps: LifecycleStep[];
    environment?: string;
    approval_required?: boolean;
}

export interface NotificationConfig {
    on_success?: string[];
    on_failure?: string[];
    channels: ('email' | 'slack' | 'webhook')[];
}
