import { Timestamp } from '../common/common.types';
import { AgentSelectionMode, ExecutionMode, ExecutionStatus } from '../common/enums';

export interface FileContext {
    filename: string;
    language: string;
    content: string;
}

export interface MessageDTO {
    role: string;
    content: string;
    metadata?: Record<string, any>;
}

export interface OrchestrationContext {
    code?: string;
    files?: FileContext[];
    conversation_history?: MessageDTO[];
    external_context?: Record<string, any>;
}

export interface OrchestrationRequest {
    prompt: string;
    context?: OrchestrationContext;
    agent_selection?: AgentSelectionMode;
    specific_agents?: string[];
    execution_mode?: ExecutionMode;
    stream?: boolean;
    max_iterations?: number;
}

export interface OrchestrationResponseDTO {
    execution_id: string;
    status: ExecutionStatus;
    message: string;
    result_url: string;
    websocket_url?: string;
    estimated_duration_ms: number;
    timestamp: Timestamp;
}
