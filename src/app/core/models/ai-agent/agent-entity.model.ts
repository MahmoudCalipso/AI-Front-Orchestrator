/**
 * Agent Management Models
 * Comprehensive DTOs for agent CRUD operations
 */

/**
 * Agent Type Enumeration
 */
export enum AgentTypeEnum {
    ORCHESTRATOR = 'orchestrator',
    CODE_GENERATOR = 'code_generator',
    CODE_REVIEWER = 'code_reviewer',
    DEBUGGER = 'debugger',
    DOCUMENTATION = 'documentation',
    ANALYZER = 'analyzer',
    SECURITY = 'security',
    OPTIMIZER = 'optimizer',
    CUSTOM = 'custom'
}

/**
 * Agent Status Enumeration
 */
export enum AgentStatusEnum {
    IDLE = 'idle',
    INITIALIZING = 'initializing',
    ACTIVE = 'active',
    PAUSED = 'paused',
    ERROR = 'error',
    TERMINATED = 'terminated',
    ARCHIVED = 'archived'
}

/**
 * Create Agent Request
 */
export interface CreateAgentRequest {
    name: string;
    display_name: string;
    description?: string;
    agent_type: AgentTypeEnum;
    model: string;
    temperature?: number;
    max_tokens?: number;
    tools?: string[];
    metadata?: Record<string, any>;
}

/**
 * Agent Response DTO
    */
export interface AgentResponseDTO {
    id: string;
    name: string;
    display_name: string;
    description?: string;
    agent_type: AgentTypeEnum;
    status: AgentStatusEnum;
    model: string;
    temperature: number;
    max_tokens: number;
    tools: string[];
    created_at: string;
    updated_at: string;
    user_id: string;
    session_count: number;
    total_tokens_used: number;
    last_active_at?: string;
    metadata?: Record<string, any>;
}

/**
 * Agent List Response DTO
 */
export interface AgentListResponseDTO {
    agents: AgentResponseDTO[];
    total: number;
    page: number;
    page_size: number;
}

/**
 * Agent Initialization Response DTO
 */
export interface AgentInitializationResponseDTO extends AgentResponseDTO {
    initialization_status: 'success' | 'pending' | 'failed';
    initialization_message?: string;
}

/**
 * Agent Session Info
 */
export interface AgentSessionInfo {
    session_id: string;
    agent_id: string;
    started_at: string;
    ended_at?: string;
    status: 'active' | 'completed' | 'failed';
    tokens_used: number;
    operations_count: number;
}

/**
 * Agent Statistics
 */
export interface AgentStatistics {
    agent_id: string;
    total_sessions: number;
    total_tokens: number;
    average_session_duration: number;
    success_rate: number;
    most_used_operations: string[];
    last_30_days_usage: {
        date: string;
        sessions: number;
        tokens: number;
    }[];
}
